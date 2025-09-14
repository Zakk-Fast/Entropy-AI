"use client";

import { useState } from "react";
import { useEntropyStore } from "@/lib/store";
import { ModelType, Message } from "@/types";
import { LoadingScreen } from "../ui/LoadingScreen";
import { WelcomeScreen } from "./WelcomeScreen";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

interface ChatContainerProps {
  showModelDropdown: boolean;
  onToggleModelDropdown: () => void;
}

export default function ChatContainer({
  showModelDropdown,
  onToggleModelDropdown,
}: ChatContainerProps) {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [typingResponse, setTypingResponse] = useState<string | null>(null);

  const {
    isInitialized,
    conversations,
    currentConversation,
    selectedModel,
    setSelectedModel,
    isLoading,
    setIsLoading,
    addMessage,
    updateConversationTitle,
    createNewConversation,
  } = useEntropyStore();

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  const shouldShowWelcome = () => {
    return (
      !currentConversation ||
      (currentConversation && currentConversation.messages.length === 0)
    );
  };

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

    addMessage(currentConversation.id, userMessage);

    if (currentConversation.messages.length === 0) {
      const title =
        input.trim().slice(0, 50) + (input.trim().length > 50 ? "..." : "");
      updateConversationTitle(currentConversation.id, title);
    }

    const userInput = input;
    setInput("");
    setIsLoading(true);
    setIsThinking(true);

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
      }, data.response.length * 15 + 500);
    } catch (error) {
      console.error("Error:", error);
      setIsThinking(false);
      setTypingResponse(null);
      setIsLoading(false);

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
    onToggleModelDropdown();
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {shouldShowWelcome() ? (
        <WelcomeScreen
          selectedModel={selectedModel}
          onCreateNewConversation={createNewConversation}
          hasConversations={conversations.length > 0}
          isNewChat={
            currentConversation !== null &&
            currentConversation.messages.length === 0
          }
        />
      ) : (
        currentConversation && (
          <ChatMessages
            currentConversation={currentConversation}
            isThinking={isThinking}
            typingResponse={typingResponse}
            selectedModel={selectedModel}
          />
        )
      )}

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        selectedModel={selectedModel}
        onModelSelect={handleModelSelect}
        showModelDropdown={showModelDropdown}
        onToggleModelDropdown={onToggleModelDropdown}
        currentConversation={currentConversation}
        isLoading={isLoading}
      />

      {showModelDropdown && (
        <div className="fixed inset-0 z-0" onClick={onToggleModelDropdown} />
      )}
    </div>
  );
}
