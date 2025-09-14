"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { TypingMessage } from "./TypingMessage";
import { Conversation, Message, ModelType } from "@/types";

interface ChatMessagesProps {
  currentConversation: Conversation;
  isThinking: boolean;
  typingResponse: string | null;
  selectedModel: ModelType;
}

export const ChatMessages = ({
  currentConversation,
  isThinking,
  typingResponse,
  selectedModel,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isThinking, typingResponse]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {currentConversation.messages.length === 0 &&
        !isThinking &&
        !typingResponse ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Ask me anything!</p>
          </div>
        ) : (
          <>
            {currentConversation.messages.map((message: Message) => (
              <MessageBubble key={message.id} message={message} />
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
    </div>
  );
};
