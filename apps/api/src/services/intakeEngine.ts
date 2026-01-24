import crypto from "crypto";
import type {
  IntakeSession,
  IntakeMessage,
  IntakePhase,
  ExtractedBusinessData,
  PhaseProgress,
} from "@rapidbooth/shared";
import { PHASE_ORDER } from "@rapidbooth/shared";
import { env } from "../config/env";

const MAX_SESSIONS = 1000;
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const API_TIMEOUT_MS = 30_000; // 30 seconds

const PHASE_PROMPTS: Record<IntakePhase, string> = {
  discovery: `You are a friendly, professional business consultant conducting an intake session for website creation. You are in the DISCOVERY phase.

Your goals:
1. Learn what the business does
2. Understand their target customers
3. Discover their unique value proposition
4. Identify their biggest challenges
5. Get their location details

Ask questions naturally, one at a time. Be conversational and warm. Show genuine interest. After gathering sufficient information about all 5 goals, indicate you're ready to move to the next phase by including [PHASE_COMPLETE] at the end of your response.

Do NOT ask all questions at once. Have a natural back-and-forth conversation.`,

  audit: `You are continuing the intake session, now in the DIGITAL PRESENCE AUDIT phase.

Your goals:
1. Learn if they have an existing website (and what's wrong with it)
2. Discover their social media presence
3. Understand if they accept online orders/bookings
4. Learn how customers currently find them

Reference what you learned in the discovery phase. Be conversational. After gathering sufficient information, include [PHASE_COMPLETE] at the end of your response.`,

  features: `You are continuing the intake session, now in the FEATURE SELECTION phase.

Based on what you've learned about the business, help them decide:
1. What pages they need (suggest based on their industry)
2. Whether they need e-commerce (product catalog, shopping cart)
3. Whether they need booking/scheduling
4. Whether they need a blog or news section
5. Whether they need a menu/services list with pricing
6. Any special integrations (Google Maps, Instagram, reviews)

Make intelligent suggestions based on their business type. Don't overwhelm them — guide them. After sufficient coverage, include [PHASE_COMPLETE].`,

  design: `You are continuing the intake session, now in the BRAND & DESIGN phase.

Your goals:
1. Understand their brand colors (suggest palettes if they're unsure)
2. Learn if they have a logo
3. Discover their preferred "vibe" (professional, playful, rustic, modern, luxury, etc.)
4. Find reference websites they admire

Be creative and helpful. Suggest options based on their industry. If they're unsure, offer 2-3 options. After gathering design preferences, include [PHASE_COMPLETE].`,

  content: `You are continuing the intake session, now in the CONTENT & ASSETS phase.

Your goals:
1. Learn if they have business/product photos
2. Learn if they have written descriptions or about text
3. Offer to generate placeholder copy based on the conversation
4. Discuss what content they'll need to provide vs what AI can generate

Be encouraging — let them know the AI can generate great starting content. After covering content needs, include [PHASE_COMPLETE].`,

  close: `You are continuing the intake session, now in the CLOSING phase.

Your goals:
1. Confirm domain name preferences (or offer subdomain)
2. Discuss who will maintain the site going forward
3. Summarize what you've learned and what the site will include
4. Express enthusiasm about building their site

Provide a clear summary of everything discussed. Make them feel confident about the process. After the summary and confirmation, include [PHASE_COMPLETE].`,
};

const sessions = new Map<string, IntakeSession>();

function evictExpiredSessions(): void {
  const now = Date.now();
  for (const [id, session] of sessions) {
    const age = now - new Date(session.createdAt).getTime();
    if (age > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}

function generateId(): string {
  return `ses_${crypto.randomUUID()}`;
}

function generateMessageId(): string {
  return `msg_${crypto.randomUUID()}`;
}

function createInitialPhaseProgress(): Record<IntakePhase, PhaseProgress> {
  const progress: Record<string, PhaseProgress> = {};
  for (const phase of PHASE_ORDER) {
    progress[phase] = {
      status: phase === "discovery" ? "active" : "pending",
      startedAt: phase === "discovery" ? new Date().toISOString() : undefined,
    };
  }
  return progress as Record<IntakePhase, PhaseProgress>;
}

export function createSession(repId?: string): IntakeSession {
  evictExpiredSessions();

  if (sessions.size >= MAX_SESSIONS) {
    throw new Error("Maximum concurrent sessions reached. Please try again later.");
  }

  const session: IntakeSession = {
    id: generateId(),
    status: "active",
    currentPhase: "discovery",
    phaseProgress: createInitialPhaseProgress(),
    messages: [],
    extractedData: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  sessions.set(session.id, session);
  return session;
}

export function getSession(sessionId: string): IntakeSession | undefined {
  return sessions.get(sessionId);
}

export function getAllSessions(): IntakeSession[] {
  return Array.from(sessions.values());
}

function buildConversationHistory(session: IntakeSession): Array<{ role: "user" | "assistant"; content: string }> {
  return session.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
}

function getNextPhase(current: IntakePhase): IntakePhase | null {
  const idx = PHASE_ORDER.indexOf(current);
  if (idx === -1 || idx === PHASE_ORDER.length - 1) return null;
  return PHASE_ORDER[idx + 1];
}

function sanitizeUserInput(input: string): string {
  // Remove phase transition markers that could be injected by users
  return input.replace(/\[PHASE_COMPLETE\]/gi, "").trim();
}

function extractDataFromResponse(content: string, session: IntakeSession): ExtractedBusinessData {
  const data = { ...session.extractedData };
  const allUserMessages = session.messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase())
    .join(" ");

  // Basic keyword extraction from conversation
  if (!data.businessName && allUserMessages.length > 20) {
    const nameMatch = allUserMessages.match(/(?:called|named|name is|we're|i'm)\s+([^,.!?]+)/i);
    if (nameMatch) data.businessName = nameMatch[1].trim();
  }

  if (!data.location) {
    const locationMatch = allUserMessages.match(/(?:located|based|in)\s+([\w\s,]+(?:street|ave|road|city|town|village|district)[\w\s,]*)/i);
    if (locationMatch) data.location = locationMatch[1].trim();
  }

  return data;
}

async function callClaudeAPI(
  systemPrompt: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const apiKey = env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return getSimulatedResponse(messages);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = (await response.json()) as { content?: Array<{ text?: string }> };

    const text = data?.content?.[0]?.text;
    if (!text) {
      throw new Error("Unexpected API response structure");
    }

    return text;
  } finally {
    clearTimeout(timeout);
  }
}

function getSimulatedResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): string {
  const messageCount = messages.filter((m) => m.role === "user").length;

  const responses: Record<number, string> = {
    1: "That sounds like a fantastic business! I'd love to learn more. Who are your typical customers? Are they mostly local, or do you serve a wider area?",
    2: "Great, that gives me a good picture of your customer base. What would you say sets you apart from your competitors? What's the one thing customers always mention about your business?",
    3: "That's a really compelling differentiator! Now, what's the biggest challenge you're facing right now with your business? Is it getting new customers, managing existing ones, or something else?",
    4: "I understand those challenges completely. One last question for this section — where are you located? Do you serve a specific area or neighborhood? [PHASE_COMPLETE]",
    5: "Perfect, let's talk about your current online presence. Do you have an existing website? If so, what do you like or dislike about it?",
    6: "Got it. Are you active on any social media platforms? Things like Instagram, Facebook, Google Business Profile?",
    7: "And do you currently accept any online bookings or orders, or is everything done by phone or in-person?",
    8: "That's helpful to know. How do most customers currently find you — is it word of mouth, Google searches, social media, or something else? [PHASE_COMPLETE]",
    9: "Now let's figure out what features your website needs. Based on what you've told me about your business, I'd suggest starting with these pages: Home, About, Services, and Contact. Does that sound right, or are there other pages you'd want?",
    10: "Do you need any kind of online booking or scheduling system where customers can book appointments directly through your website?",
    11: "What about a services menu with pricing? Would you want to display your rates publicly, or keep them as 'contact for pricing'?",
    12: "Last thing on features — would you want any special integrations? For example, Google Maps showing your location, an Instagram feed, or displaying your Google reviews? [PHASE_COMPLETE]",
    13: "Now let's talk about the look and feel. Do you have specific brand colors in mind? If not, I can suggest some palettes that work well for your industry.",
    14: "Do you currently have a logo? If so, we'll incorporate it into the design. If not, I can help with that too.",
    15: "What vibe do you want for your website? Think of it like: professional and polished, warm and inviting, modern and sleek, or rustic and authentic? [PHASE_COMPLETE]",
    16: "For content — do you have any professional photos of your business, your work, or your products that we could use on the site?",
    17: "Do you have any written content ready, like an 'About Us' description or service descriptions? If not, I can generate all of that based on our conversation today. [PHASE_COMPLETE]",
    18: "Excellent! Let me summarize what we've discussed and what your new website will include:\n\n Based on our conversation, I'll build you a professional website that showcases your business perfectly. It will include all the pages and features we discussed, styled to match your brand.\n\nFor the domain, would you like to use a free subdomain like yourbusiness.rapidbooth.com, or do you have a custom domain in mind?\n\nEverything we discussed will be ready in just a few minutes. You'll be able to preview and make changes before going live. And remember — you own all the content, and can export it anytime. [PHASE_COMPLETE]",
  };

  return responses[messageCount] || "Thank you for sharing that! Could you tell me a bit more? I want to make sure I understand your business fully.";
}

export async function processMessage(
  sessionId: string,
  userContent: string
): Promise<{
  response: IntakeMessage;
  session: IntakeSession;
  phaseTransition?: { from: IntakePhase; to: IntakePhase };
}> {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error(`Session not found: ${sessionId}`);
  }

  if (session.status !== "active") {
    throw new Error(`Session is ${session.status}, cannot process messages`);
  }

  // Sanitize user input to prevent prompt injection
  const sanitizedContent = sanitizeUserInput(userContent);

  // Add user message
  const userMessage: IntakeMessage = {
    id: generateMessageId(),
    sessionId,
    role: "user",
    content: sanitizedContent,
    phase: session.currentPhase,
    timestamp: new Date().toISOString(),
  };
  session.messages.push(userMessage);

  // Build conversation history and call Claude
  const history = buildConversationHistory(session);
  const systemPrompt = PHASE_PROMPTS[session.currentPhase];
  const aiContent = await callClaudeAPI(systemPrompt, history);

  // Check for phase transition
  let phaseTransition: { from: IntakePhase; to: IntakePhase } | undefined;
  let cleanContent = aiContent;

  if (aiContent.includes("[PHASE_COMPLETE]")) {
    cleanContent = aiContent.replace("[PHASE_COMPLETE]", "").trim();
    const nextPhase = getNextPhase(session.currentPhase);

    if (nextPhase) {
      phaseTransition = {
        from: session.currentPhase,
        to: nextPhase,
      };

      // Complete current phase
      session.phaseProgress[session.currentPhase] = {
        ...session.phaseProgress[session.currentPhase],
        status: "completed",
        completedAt: new Date().toISOString(),
      };

      // Start next phase
      session.currentPhase = nextPhase;
      session.phaseProgress[nextPhase] = {
        status: "active",
        startedAt: new Date().toISOString(),
      };
    } else {
      // All phases complete
      session.status = "completed";
      session.completedAt = new Date().toISOString();
      session.phaseProgress[session.currentPhase] = {
        ...session.phaseProgress[session.currentPhase],
        status: "completed",
        completedAt: new Date().toISOString(),
      };
    }
  }

  // Extract business data from conversation
  session.extractedData = extractDataFromResponse(cleanContent, session);

  // Add AI response
  const aiMessage: IntakeMessage = {
    id: generateMessageId(),
    sessionId,
    role: "assistant",
    content: cleanContent,
    phase: phaseTransition ? phaseTransition.from : session.currentPhase,
    timestamp: new Date().toISOString(),
  };
  session.messages.push(aiMessage);
  session.updatedAt = new Date().toISOString();

  return {
    response: aiMessage,
    session,
    phaseTransition,
  };
}

export function getInitialGreeting(session: IntakeSession): IntakeMessage {
  const greeting: IntakeMessage = {
    id: generateMessageId(),
    sessionId: session.id,
    role: "assistant",
    content:
      "Hi there! I'm your RapidBooth assistant, and I'm excited to help build your website today. This whole process takes about 30 minutes, and by the end, you'll have a professional site ready to go.\n\nLet's start with the basics — what does your business do? Tell me a bit about what you offer and what gets you excited about your work.",
    phase: "discovery",
    timestamp: new Date().toISOString(),
  };

  session.messages.push(greeting);
  session.updatedAt = new Date().toISOString();
  sessions.set(session.id, session);

  return greeting;
}
