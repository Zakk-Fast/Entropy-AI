"use client";

import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { ModelSelector } from "./ModelSelector";
import { Conversation, ModelType } from "@/types";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedModel: ModelType;
  onModelSelect: (model: ModelType) => void;
  showModelDropdown: boolean;
  onToggleModelDropdown: () => void;
  currentConversation: Conversation | null;
  isLoading: boolean;
}

export const ChatInput = ({
  input,
  setInput,
  onSubmit,
  selectedModel,
  onModelSelect,
  showModelDropdown,
  onToggleModelDropdown,
  currentConversation,
  isLoading,
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 120;
      textarea.style.height = Math.min(scrollHeight, maxHeight) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="border-t border-gray-200 p-4">
      <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex gap-3 items-end">
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
              className={`
                w-full py-3 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                disabled:bg-gray-100 disabled:cursor-not-allowed resize-none overflow-hidden
                pl-4 pr-4 lg:pr-44
              `}
            />

            <ModelSelector
              selectedModel={selectedModel}
              onModelSelect={onModelSelect}
              showDropdown={showModelDropdown}
              onToggleDropdown={onToggleModelDropdown}
              isLoading={isLoading}
              variant="input"
            />
          </div>

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
  );
};
