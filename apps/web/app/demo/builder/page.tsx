"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { PhaseTracker } from "@/components/intake/PhaseTracker";
import { ChatMessage } from "@/components/intake/ChatMessage";
import { ChatInput } from "@/components/intake/ChatInput";
import { TypingIndicator } from "@/components/intake/TypingIndicator";
import { SiteRenderer } from "@/components/site-preview";
import { useSiteBuilder } from "@/components/live-preview/useSiteBuilder";
import { ThemeCustomizer } from "@/components/live-preview/ThemeCustomizer";
import { ComponentArranger } from "@/components/live-preview/ComponentArranger";
import { PreviewToolbar, type DeviceView } from "@/components/live-preview/PreviewToolbar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  phase: string;
  timestamp: string;
}

interface PhaseProgress {
  status: "pending" | "active" | "completed";
  startedAt?: string;
  completedAt?: string;
}

interface Session {
  id: string;
  status: "active" | "completed" | "abandoned";
  currentPhase: string;
  phaseProgress: Record<string, PhaseProgress>;
  messages: Message[];
  extractedData: Record<string, unknown>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function extractBusinessUpdates(userMessage: string, messageIndex: number): Record<string, unknown> {
  const updates: Record<string, unknown> = {};
  const lower = userMessage.toLowerCase();

  if (messageIndex === 1) {
    // First response usually describes the business
    if (lower.includes("plumb")) updates.businessType = "plumbing";
    else if (lower.includes("restaurant") || lower.includes("food") || lower.includes("cafe")) {
      updates.businessType = "restaurant";
      updates.needsMenu = true;
    }
    else if (lower.includes("dental") || lower.includes("doctor") || lower.includes("law")) updates.businessType = "professional";
    else if (lower.includes("salon") || lower.includes("barber") || lower.includes("beauty")) updates.businessType = "retail";
    else if (lower.includes("landscap") || lower.includes("clean") || lower.includes("hvac") || lower.includes("electric")) updates.businessType = "home-services";

    // Try to extract business name from quotes or capitalized words
    const quoted = userMessage.match(/"([^"]+)"|'([^']+)'/);
    if (quoted) updates.businessName = quoted[1] || quoted[2];
    else {
      const words = userMessage.split(" ").filter((w) => w.length > 2 && w[0] === w[0].toUpperCase() && w !== "I" && w !== "We" && w !== "My" && w !== "The" && w !== "Our");
      if (words.length >= 2) updates.businessName = words.slice(0, 3).join(" ");
    }

    updates.description = userMessage.slice(0, 150);
  }

  if (messageIndex === 2 || messageIndex === 3) {
    updates.targetCustomers = userMessage.slice(0, 100);
    if (lower.includes("unique") || lower.includes("best") || lower.includes("special")) {
      updates.uniqueValue = userMessage.slice(0, 100);
    }
  }

  if (messageIndex === 4) {
    // Location
    const locationPatterns = [/in\s+([A-Z][a-zA-Z\s,]+)/,  /located\s+(?:in|at)\s+([A-Z][a-zA-Z\s,]+)/, /serve\s+([A-Z][a-zA-Z\s,]+)/];
    for (const pattern of locationPatterns) {
      const match = userMessage.match(pattern);
      if (match) { updates.location = match[1].trim(); break; }
    }
    if (!updates.location && userMessage.length < 50) updates.location = userMessage;
  }

  if (messageIndex >= 8 && messageIndex <= 10) {
    if (lower.includes("booking") || lower.includes("appointment") || lower.includes("schedule") || lower.includes("yes")) {
      updates.needsScheduling = true;
    }
  }

  if (messageIndex >= 11) {
    // Design preferences
    const colorMap: Record<string, string> = {
      blue: "#1E40AF", red: "#991B1B", green: "#1B4332", purple: "#7C3AED",
      orange: "#EA580C", teal: "#0D9488", navy: "#1E3A5F", black: "#1C1917",
    };
    for (const [name, hex] of Object.entries(colorMap)) {
      if (lower.includes(name)) {
        updates.brandColors = [hex];
        break;
      }
    }
    if (lower.includes("modern") || lower.includes("sleek")) updates.brandVibe = "modern";
    else if (lower.includes("classic") || lower.includes("elegant")) updates.brandVibe = "classic";
    else if (lower.includes("warm") || lower.includes("cozy") || lower.includes("rustic")) updates.brandVibe = "rustic";
    else if (lower.includes("bold") || lower.includes("playful")) updates.brandVibe = "bold";
  }

  return updates;
}

export default function BuilderPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop");
  const [showCustomizer, setShowCustomizer] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userMessageCount = useRef(0);

  const {
    site,
    template,
    updateBusinessData,
    updateTheme,
    updateColors,
    reorderComponents,
    resetTheme,
    resetComponents,
  } = useSiteBuilder();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/intake/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        setSession(data.session);
        setMessages([data.greeting]);
        return;
      }
    } catch { /* fallback */ }

    const mockSession: Session = {
      id: `ses_${Date.now()}`,
      status: "active",
      currentPhase: "discovery",
      phaseProgress: {
        discovery: { status: "active", startedAt: new Date().toISOString() },
        audit: { status: "pending" },
        features: { status: "pending" },
        design: { status: "pending" },
        content: { status: "pending" },
        close: { status: "pending" },
      },
      messages: [],
      extractedData: {},
    };
    const greeting: Message = {
      id: `msg_${Date.now()}`,
      role: "assistant",
      content: "Hi there! I'm your RapidBooth assistant. Let's build your website together — you'll see it take shape in real-time on the right as we talk.\n\nWhat does your business do? Tell me about what you offer.",
      phase: "discovery",
      timestamp: new Date().toISOString(),
    };
    setSession(mockSession);
    setMessages([greeting]);
    setIsLoading(false);
  };

  const sendMessage = async (content: string) => {
    if (!session || isTyping) return;

    userMessageCount.current += 1;
    const msgIndex = userMessageCount.current;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: "user",
      content,
      phase: session.currentPhase,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Extract business data for live preview
    const updates = extractBusinessUpdates(content, msgIndex);
    if (Object.keys(updates).length > 0) {
      updateBusinessData(updates);
    }

    try {
      const res = await fetch(`${API_BASE}/api/intake/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, content }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setSession(data.session);
        if (data.phaseTransition) {
          // Phase transition
        }
        setIsTyping(false);
        return;
      }
    } catch { /* fallback */ }

    // Simulated response
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const simResponses: Record<number, { content: string; nextPhase?: string }> = {
      1: { content: "I can already see this taking shape! Who are your typical customers — local folks, or do you serve a wider area?" },
      2: { content: "Great. What sets you apart from competitors? What's the one thing customers always mention?" },
      3: { content: "That's a strong differentiator! What's the biggest challenge you face right now?" },
      4: { content: "And where are you located? What area do you serve?", nextPhase: "audit" },
      5: { content: "Do you have an existing website? What do you like or dislike about it?" },
      6: { content: "Are you on social media — Instagram, Facebook, Google Business?" },
      7: { content: "How do customers typically find you?", nextPhase: "features" },
      8: { content: "Based on what you've told me, I'd recommend: Home, About, Services, and Contact pages. Want anything else like a gallery or blog?" },
      9: { content: "Would you like online booking so customers can schedule directly through your site?" },
      10: { content: "Should services show pricing, or 'contact for quote'? Any integrations like Google Maps?", nextPhase: "design" },
      11: { content: "Now the fun part — look at the preview updating! Do you have brand colors in mind, or want me to suggest palettes?" },
      12: { content: "What vibe do you want — modern and sleek, warm and inviting, professional and polished?", nextPhase: "content" },
      13: { content: "Do you have professional photos? And any written content like an About Us? I'll generate great copy from our conversation.", nextPhase: "close" },
      14: { content: "Your site is looking great! Check out the preview on the right — you can customize colors and rearrange sections using the controls.\n\nWhen you're happy with it, we can deploy it live in one click." },
    };

    const simResponse = simResponses[msgIndex] || {
      content: "Thanks for that detail! I'm updating the preview. Could you tell me more?",
    };

    const aiMessage: Message = {
      id: `msg_${Date.now()}_ai`,
      role: "assistant",
      content: simResponse.content,
      phase: simResponse.nextPhase || session.currentPhase,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, aiMessage]);

    if (simResponse.nextPhase) {
      setSession((prev) => {
        if (!prev) return prev;
        const newProgress = { ...prev.phaseProgress };
        newProgress[prev.currentPhase] = { status: "completed", completedAt: new Date().toISOString() };
        newProgress[simResponse.nextPhase as string] = { status: "active", startedAt: new Date().toISOString() };
        return { ...prev, currentPhase: simResponse.nextPhase as string, phaseProgress: newProgress };
      });
    }

    setIsTyping(false);
  };

  // Pre-session welcome
  if (!session) {
    return (
      <div className="pt-24 sm:pt-32 min-h-screen bg-gradient-to-b from-cream to-white">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-forest-green/10 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-slate-blue mb-4">
            Watch Your Website Build in Real-Time
          </h1>
          <p className="text-lg text-slate-blue-500 mb-8 max-w-lg mx-auto">
            Answer questions on the left, see your site take shape on the right.
            Customize colors, fonts, and layout as you go.
          </p>
          <button
            onClick={startSession}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-harvest-gold text-forest-green-900 font-semibold text-lg shadow-md hover:shadow-lg hover:bg-harvest-gold-600 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? "Starting..." : "Start Building"}
            {!isLoading && (
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  }

  const deviceWidths: Record<DeviceView, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <div className="pt-16 h-screen flex flex-col bg-gray-50">
      {/* Phase Tracker */}
      <PhaseTracker currentPhase={session.currentPhase} phaseProgress={session.phaseProgress} />

      {/* Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat */}
        <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col border-r border-gray-200 bg-white">
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
          {session.currentPhase === "close" && userMessageCount.current >= 14 && (
            <div className="bg-forest-green/5 border-t border-forest-green/20 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-forest-green">Ready to go live?</p>
                  <p className="text-xs text-gray-500">Deploy your site in one click</p>
                </div>
                <Link
                  href="/demo/deploy"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-forest-green text-white font-semibold text-sm shadow hover:bg-forest-green-800 transition-colors"
                >
                  Deploy Site
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
          <ChatInput
            onSend={sendMessage}
            disabled={isTyping || session.status === "completed"}
            placeholder="Type your response..."
          />
        </div>

        {/* Right: Live Preview */}
        <div className="hidden lg:flex flex-1 flex-col bg-gray-100">
          <PreviewToolbar
            deviceView={deviceView}
            onDeviceChange={setDeviceView}
            template={template}
            status={userMessageCount.current >= 1 ? "ready" : "generating"}
          />

          <div className="flex-1 flex overflow-hidden">
            {/* Preview */}
            <div className="flex-1 flex justify-center items-start overflow-y-auto p-4">
              <div
                className="bg-white shadow-xl overflow-hidden transition-all duration-300"
                style={{
                  width: deviceWidths[deviceView],
                  maxWidth: "100%",
                  borderRadius: deviceView !== "desktop" ? "1rem" : "0.5rem",
                }}
              >
                {deviceView !== "desktop" && (
                  <div className="bg-gray-900 px-4 py-2 flex items-center justify-center">
                    <div className="w-16 h-1 bg-gray-700 rounded-full" />
                  </div>
                )}
                <SiteRenderer site={site} />
              </div>
            </div>

            {/* Customization Panel */}
            {showCustomizer && (
              <div className="w-64 border-l border-gray-200 bg-white overflow-y-auto p-3 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Customize</span>
                  <button
                    onClick={() => setShowCustomizer(false)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ThemeCustomizer
                  theme={site.theme}
                  onUpdateColors={updateColors}
                  onUpdateTheme={updateTheme}
                  onReset={resetTheme}
                />
                <ComponentArranger
                  components={site.components}
                  onReorder={reorderComponents}
                  onReset={resetComponents}
                />
              </div>
            )}
          </div>

          {/* Toggle customizer */}
          {!showCustomizer && (
            <button
              onClick={() => setShowCustomizer(true)}
              className="absolute right-4 top-32 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50"
              title="Show customizer"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
