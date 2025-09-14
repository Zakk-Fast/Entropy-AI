"use client";

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

interface WelcomeScreenProps {
  selectedModel: ModelType;
  onCreateNewConversation: () => void;
  hasConversations: boolean;
  isNewChat: boolean;
}

export const WelcomeScreen = ({
  selectedModel,
  onCreateNewConversation,
  hasConversations,
  isNewChat,
}: WelcomeScreenProps) => {
  const getWelcomeMessage = () => {
    if (!hasConversations) {
      // First time user
      return {
        title: "Welcome to Entropy AI",
        subtitle: "Your most unreliable AI assistant.",
        description:
          "Start a new conversation to begin receiving spectacularly unhelpful advice.",
        buttonText: "Start New Chat",
      };
    } else if (isNewChat) {
      return {
        title: "New Chat Started",
        subtitle: `Ready to provide terrible advice with ${MODELS[selectedModel].name}.`,
        description:
          "Ask me anything and prepare to be spectacularly underwhelmed.",
        buttonText: "Ask Something",
      };
    } else {
      return {
        title: "Welcome Back",
        subtitle: "Ready to continue being unhelpful.",
        description:
          "Select a conversation from the sidebar or start a new one.",
        buttonText: "Start New Chat",
      };
    }
  };

  const message = getWelcomeMessage();

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {message.title}
        </h2>
        <p className="text-gray-600 mb-6">{message.subtitle}</p>
        <p className="text-sm text-gray-500 mb-4">{message.description}</p>
        {/* Only show button if user needs to create a new conversation */}
        {(!hasConversations || !isNewChat) && (
          <button
            onClick={onCreateNewConversation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {message.buttonText}
          </button>
        )}
      </div>
    </div>
  );
};
