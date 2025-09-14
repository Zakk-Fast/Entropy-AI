"use client";

import { ChevronDown } from "lucide-react";
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

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelSelect: (model: ModelType) => void;
  showDropdown: boolean;
  onToggleDropdown: () => void;
  isLoading: boolean;
  variant: "header" | "input";
}

export const ModelSelector = ({
  selectedModel,
  onModelSelect,
  showDropdown,
  onToggleDropdown,
  isLoading,
  variant,
}: ModelSelectorProps) => {
  const isHeaderVariant = variant === "header";
  const isInputVariant = variant === "input";

  // Responsive visibility classes
  const visibilityClass = isHeaderVariant
    ? "lg:hidden" // Show on mobile, hide on desktop
    : "hidden lg:block"; // Hide on mobile, show on desktop

  const containerClass = isHeaderVariant
    ? "relative" // Header: relative positioning
    : "absolute right-3 bottom-3"; // Input: absolute positioning

  const buttonClass = isHeaderVariant
    ? "flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 focus:outline-none" // Header: no border, centered
    : "flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"; // Input: original styling

  const dropdownClass = isHeaderVariant
    ? "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50" // Header: centered dropdown
    : "absolute bottom-full right-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10"; // Input: right-aligned dropdown

  return (
    <div className={`${containerClass} ${visibilityClass}`}>
      <button
        type="button"
        onClick={onToggleDropdown}
        className={buttonClass}
        disabled={isLoading}
      >
        {MODELS[selectedModel].name}
        <ChevronDown className="h-3 w-3" />
      </button>

      {showDropdown && (
        <div className={dropdownClass}>
          {Object.entries(MODELS).map(([key, model]) => (
            <button
              key={key}
              type="button"
              onClick={() => onModelSelect(key as ModelType)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                selectedModel === key
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-900"
              }`}
            >
              <div className="font-medium">{model.name}</div>
              <div className="text-sm text-gray-500">{model.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
