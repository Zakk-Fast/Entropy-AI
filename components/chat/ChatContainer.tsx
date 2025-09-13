"use client";

import { useState, useEffect, useRef } from "react";
import { Send, ChevronDown } from "lucide-react";
import { useEntropyStore } from "@/lib/store";
import { ModelType, Message } from "@/types";

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

// Typing effect component
const TypingMessage = ({ content }: { content: string }) => {
  const [displayedContent, setDisplayedContent] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent(content.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 15); // Faster typing speed

    return () => clearInterval(timer);
  }, [content]);

  return (
    <div className="max-w-2xl px-4 py-3 rounded-lg bg-gray-100 text-gray-900">
      <div className="whitespace-pre-wrap">{displayedContent}</div>
    </div>
  );
};

// Thinking indicator component
const ThinkingIndicator = ({ model }: { model: ModelType }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const thinkingMessages = {
    "entropy-haiku": "Composing haiku",
    "entropy-standard": "Generating response",
    "entropy-turbo": "Processing at maximum speed", // Ironic
  };

  return (
    <div className="max-w-2xl px-4 py-3 rounded-lg bg-gray-100 text-gray-900">
      <div className="flex items-center gap-2 text-gray-500">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
        <span className="text-sm">
          {thinkingMessages[model]}
          {dots}
        </span>
      </div>
    </div>
  );
};

export default function ChatContainer() {
  const [input, setInput] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [typingResponse, setTypingResponse] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    currentConversation,
    selectedModel,
    setSelectedModel,
    isLoading,
    setIsLoading,
    addMessage,
    updateConversationTitle,
    createNewConversation,
  } = useEntropyStore();

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isThinking, typingResponse]);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 120; // Max height in pixels (about 5 lines)
      textarea.style.height = Math.min(scrollHeight, maxHeight) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currentConversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      model: selectedModel,
    };

    // Add user message
    addMessage(currentConversation.id, userMessage);

    // Update conversation title if it's the first message
    if (currentConversation.messages.length === 0) {
      const title =
        input.trim().slice(0, 50) + (input.trim().length > 50 ? "..." : "");
      updateConversationTitle(currentConversation.id, title);
    }

    const userInput = input;
    setInput("");
    setIsLoading(true);
    setIsThinking(true);

    // Refocus textarea after state updates
    setTimeout(() => {
      if (textareaRef.current && !isLoading) {
        textareaRef.current.focus();
      }
    }, 100);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          model: selectedModel,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      setIsThinking(false);
      setTypingResponse(data.response);

      // After typing animation completes, add the message
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          model: selectedModel,
        };

        addMessage(currentConversation.id, assistantMessage);
        setTypingResponse(null);
        setIsLoading(false);
      }, data.response.length * 15 + 500); // Account for faster typing speed
    } catch (error) {
      console.error("Error:", error);
      setIsThinking(false);
      setTypingResponse(null);
      setIsLoading(false);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Something went wrong. Even I can't mess up this badly. Try again.",
        timestamp: new Date(),
        model: selectedModel,
      };
      addMessage(currentConversation.id, errorMessage);
    }
  };

  const handleModelSelect = (model: ModelType) => {
    setSelectedModel(model);
    setShowModelDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
              <p className="text-sm text-gray-500 mb-4">
                Start a new conversation to begin receiving spectacularly
                unhelpful advice.
              </p>
              <button
                onClick={createNewConversation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Start New Chat
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {currentConversation.messages.length === 0 &&
            !isThinking &&
            !typingResponse ? (
              <div className="text-center text-gray-500 py-8">
                <p>No messages yet. Ask me anything!</p>
              </div>
            ) : (
              <>
                {currentConversation.messages.map((message) => (
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
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Thinking indicator */}
                {isThinking && (
                  <div className="flex justify-start">
                    <ThinkingIndicator model={selectedModel} />
                  </div>
                )}

                {/* Typing response */}
                {typingResponse && !isThinking && (
                  <div className="flex justify-start">
                    <TypingMessage content={typingResponse} />
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex gap-3 items-end">
            {/* Textarea with Model Selector Inside */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  currentConversation
                    ? "Message Entropy AI..."
                    : "Start a new chat to begin"
                }
                disabled={!currentConversation || isLoading}
                rows={1}
                className="w-full pl-4 pr-44 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none overflow-hidden"
              />

              {/* Model Selector Inside Input */}
              <div className="absolute right-3 bottom-3">
                <button
                  type="button"
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={isLoading}
                >
                  {MODELS[selectedModel].name}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {/* Model Selector Dropdown */}
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
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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
