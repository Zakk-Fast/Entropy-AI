"use client";

import { useState, useEffect } from "react";
import { ModelType } from "@/types";

interface ThinkingIndicatorProps {
  model: ModelType;
}

export const ThinkingIndicator = ({ model }: ThinkingIndicatorProps) => {
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
    "entropy-turbo": "Processing at maximum speed",
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
