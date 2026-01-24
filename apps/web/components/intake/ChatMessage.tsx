import React from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  phase: string;
  timestamp: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}
    >
      <div className={`flex items-start gap-3 max-w-[85%] sm:max-w-[75%]`}>
        {/* Avatar */}
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-forest-green flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-4 h-4 text-harvest-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-forest-green text-white rounded-br-sm"
              : "bg-white border border-cream-200 text-slate-blue rounded-bl-sm shadow-sm"
          }`}
        >
          <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
            {message.content}
          </div>
          <div
            className={`text-xs mt-2 ${
              isUser ? "text-forest-green-200" : "text-slate-blue-300"
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* User Avatar */}
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-slate-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-4 h-4 text-slate-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
