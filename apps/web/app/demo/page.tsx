"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { PhaseTracker } from "@/components/intake/PhaseTracker";
import { ChatMessage } from "@/components/intake/ChatMessage";
import { ChatInput } from "@/components/intake/ChatInput";
import { TypingIndicator } from "@/components/intake/TypingIndicator";

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

export default function DemoPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startSession = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/intake/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error("Failed to start session");
      }

      const data = await res.json();
      setSession(data.session);
      setMessages([data.greeting]);
    } catch (err) {
      // Fallback: simulate session start if API is unavailable
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
        content:
          "Hi there! I'm your RapidBooth assistant, and I'm excited to help build your website today. This whole process takes about 30 minutes, and by the end, you'll have a professional site ready to go.\n\nLet's start with the basics — what does your business do? Tell me a bit about what you offer and what gets you excited about your work.",
        phase: "discovery",
        timestamp: new Date().toISOString(),
      };
      setSession(mockSession);
      setMessages([greeting]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!session || isTyping) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: "user",
      content,
      phase: session.currentPhase,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/intake/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          content,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      setSession(data.session);

      if (data.phaseTransition) {
        // Phase transition happened
      }
    } catch (err) {
      // Fallback simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const messageCount = messages.filter((m) => m.role === "user").length + 1;
      const simResponses: Record<number, { content: string; nextPhase?: string }> = {
        1: { content: "That sounds like a fantastic business! I'd love to learn more. Who are your typical customers? Are they mostly local, or do you serve a wider area?" },
        2: { content: "Great, that gives me a good picture of your customer base. What would you say sets you apart from your competitors? What's the one thing customers always mention about your business?" },
        3: { content: "That's a really compelling differentiator! Now, what's the biggest challenge you're facing right now with your business? Is it getting new customers, managing existing ones, or something else?" },
        4: { content: "I understand those challenges completely. And where are you located? Do you serve a specific area or neighborhood?", nextPhase: "audit" },
        5: { content: "Perfect, let's talk about your current online presence. Do you have an existing website? If so, what do you like or dislike about it?" },
        6: { content: "Got it. Are you active on any social media platforms? Things like Instagram, Facebook, or Google Business Profile?" },
        7: { content: "And how do most customers currently find you — is it word of mouth, Google searches, social media, or something else?", nextPhase: "features" },
        8: { content: "Now let's figure out what your website needs. Based on what you've told me, I'd suggest starting with: Home, About, Services, and Contact pages. Would you want anything else, like a gallery or blog?" },
        9: { content: "Do you need any kind of online booking or scheduling where customers can book appointments directly through your website?" },
        10: { content: "Would you want to display your services with pricing, or keep prices as 'contact for quote'? And any integrations like Google Maps or reviews?", nextPhase: "design" },
        11: { content: "Let's talk about the look and feel. Do you have specific brand colors in mind? I can also suggest some palettes that work well for your industry." },
        12: { content: "Do you have a logo? And what vibe do you want — professional and polished, warm and inviting, modern and sleek, or something else?", nextPhase: "content" },
        13: { content: "For content — do you have professional photos of your business or work? And any written descriptions ready, like an About Us? I can generate great starting content based on our conversation." , nextPhase: "close" },
        14: { content: "Excellent! Here's a summary of what your new website will include:\n\n Based on everything you've told me, I'll build you a professional, mobile-responsive website that perfectly represents your business. It'll include all the pages and features we discussed, styled to match your brand.\n\nFor the domain, you'll get a free subdomain like yourbusiness.rapidbooth.com, and you can connect a custom domain anytime.\n\nReady to see your site come to life?" },
      };

      const simResponse = simResponses[messageCount] || {
        content: "Thank you for sharing that! Let me note that down. Could you tell me a bit more about that?",
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
          newProgress[prev.currentPhase] = {
            status: "completed",
            completedAt: new Date().toISOString(),
          };
          newProgress[simResponse.nextPhase as string] = {
            status: "active",
            startedAt: new Date().toISOString(),
          };
          return {
            ...prev,
            currentPhase: simResponse.nextPhase as string,
            phaseProgress: newProgress,
          };
        });
      }
    } finally {
      setIsTyping(false);
    }
  };

  // Welcome screen before session starts
  if (!session) {
    return (
      <div className="pt-24 sm:pt-32 min-h-screen bg-gradient-to-b from-cream to-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-forest-green/10 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-slate-blue mb-4">
            Build Your Website in 30 Minutes
          </h1>
          <p className="text-lg text-slate-blue-500 mb-8 max-w-lg mx-auto">
            Have a conversation with our AI assistant about your business.
            By the end, you will have a professional website ready to launch.
          </p>
          <div className="space-y-4">
            <Link
              href="/demo/builder"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-harvest-gold text-forest-green-900 font-semibold text-lg shadow-md hover:shadow-lg hover:bg-harvest-gold-600 transition-all duration-200"
            >
              Start Building (Live Preview)
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <div>
              <button
                onClick={startSession}
                disabled={isLoading}
                className="text-sm text-forest-green font-medium hover:underline disabled:opacity-50"
              >
                {isLoading ? "Starting..." : "Or use chat-only mode"}
              </button>
            </div>
            <p className="text-sm text-slate-blue-400">
              No account needed. Takes approximately 30 minutes.
            </p>
            <Link
              href="/demo/preview"
              className="inline-block mt-2 text-sm text-forest-green font-medium hover:underline"
            >
              View sample generated sites →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-cream flex flex-col pb-16 md:pb-0">
      {/* Phase Tracker */}
      <PhaseTracker
        currentPhase={session.currentPhase}
        phaseProgress={session.phaseProgress}
      />

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Site Generation CTA */}
      {session.currentPhase === "close" && messages.filter((m) => m.role === "user").length >= 14 && (
        <div className="bg-forest-green/5 border-t border-forest-green/20 px-4 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-forest-green">Intake complete!</p>
              <p className="text-xs text-slate-blue-500">Your website is ready to preview</p>
            </div>
            <Link
              href="/demo/preview"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-harvest-gold text-forest-green-900 font-semibold text-sm shadow hover:shadow-md hover:bg-harvest-gold-600 transition-all"
            >
              View Your Site
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Input Area */}
      <ChatInput
        onSend={sendMessage}
        disabled={isTyping || session.status === "completed"}
        placeholder={
          session.status === "completed"
            ? "Session complete! Your website is being generated..."
            : "Type your response..."
        }
      />

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
}
