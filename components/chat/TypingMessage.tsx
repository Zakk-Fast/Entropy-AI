"use client";

import { useState, useEffect } from "react";

interface TypingMessageProps {
  content: string;
}

export const TypingMessage = ({ content }: TypingMessageProps) => {
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
    }, 15);

    return () => clearInterval(timer);
  }, [content]);

  return (
    <div className="max-w-2xl px-4 py-3 rounded-lg bg-gray-100 text-gray-900">
      <div className="whitespace-pre-wrap">{displayedContent}</div>
    </div>
  );
};
