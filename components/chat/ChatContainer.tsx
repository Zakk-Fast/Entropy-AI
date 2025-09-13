"use client";

import { useState } from "react";
import { Send, ChevronDown } from "lucide-react";
import { useEntropyStore } from "@/lib/store";
import { ModelType } from "@/types";

const MODELS = {
  "entropy-haiku": {
    name: "Entropy-Haiku",
    description: "Minimalist wisdom in 5-7-5 format",
  },
  "entropy-standard": {
    name: "Entropy-Standard",
    description: "Reliable everyday assistance",
  },
  "entropy-turbo": {
    name: "Entropy-Turbo",
    description: "Our fastest model yet",
  },
} as const;

export default function ChatContainer() {
  const [input, setInput] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const { currentConversation, selectedModel, setSelectedModel, isLoading } =
    useEntropyStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    console.log("Sending message:", input);
    setInput("");
  };

  const handleModelSelect = (model: ModelType) => {
    setSelectedModel(model);
    setShowModelDropdown(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {!currentConversation ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome to Entropy AI
              </h2>
              <p className="text-gray-600 mb-6">
                Your most unreliable AI assistant. Currently running{" "}
                <span className="font-medium">
                  {MODELS[selectedModel].name}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Start a new conversation to begin receiving spectacularly
                unhelpful advice.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {currentConversation.messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No messages yet. Ask me anything!</p>
              </div>
            ) : (
              currentConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-2xl px-4 py-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex gap-3">
            {/* Input Field with Model Selector Inside */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  currentConversation
                    ? "Message Entropy AI..."
                    : "Start a new chat to begin"
                }
                disabled={!currentConversation || isLoading}
                className="w-full pl-4 pr-32 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              {/* Model Selector Inside Input */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {MODELS[selectedModel].name}
                  <ChevronDown className="h-3 w-3" />
                </button>

                {showModelDropdown && (
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {Object.entries(MODELS).map(([key, model]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleModelSelect(key as ModelType)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          selectedModel === key
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-900"
                        }`}
                      >
                        <div className="font-medium">{model.name}</div>
                        <div className="text-sm text-gray-500">
                          {model.description}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || !currentConversation || isLoading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Click outside to close dropdown */}
      {showModelDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowModelDropdown(false)}
        />
      )}
    </div>
  );
}
