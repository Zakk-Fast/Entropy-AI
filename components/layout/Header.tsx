"use client";

import { Menu } from "lucide-react";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { ModelType } from "@/types";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  selectedModel: ModelType;
  onModelSelect: (model: ModelType) => void;
  showModelDropdown: boolean;
  onToggleModelDropdown: () => void;
  isLoading: boolean;
}

export default function Header({
  onToggleSidebar,
  selectedModel,
  onModelSelect,
  showModelDropdown,
  onToggleModelDropdown,
  isLoading,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          <h1 className="text-xl font-semibold text-gray-900">Entropy AI</h1>
        </div>

        {/* Mobile Model Selector - Centered */}
        <div className="flex-1 flex justify-center">
          <ModelSelector
            selectedModel={selectedModel}
            onModelSelect={onModelSelect}
            showDropdown={showModelDropdown}
            onToggleDropdown={onToggleModelDropdown}
            isLoading={isLoading}
            variant="header"
          />
        </div>

        {/* Spacer for balance */}
        <div className="w-8 lg:hidden"></div>
      </div>
    </header>
  );
}
