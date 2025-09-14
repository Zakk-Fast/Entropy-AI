"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ChatContainer from "@/components/chat/ChatContainer";
import { useEntropyStore } from "@/lib/store";
import { ModelType } from "@/types";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const { selectedModel, setSelectedModel, isLoading } = useEntropyStore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleModelDropdown = () => {
    setShowModelDropdown(!showModelDropdown);
  };

  const handleModelSelect = (model: ModelType) => {
    setSelectedModel(model);
    setShowModelDropdown(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showModelDropdown) {
        setShowModelDropdown(false);
      }
    };

    if (showModelDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showModelDropdown]);

  return (
    <div className="h-screen flex flex-col">
      <Header
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        selectedModel={selectedModel}
        onModelSelect={handleModelSelect}
        showModelDropdown={showModelDropdown}
        onToggleModelDropdown={toggleModelDropdown}
        isLoading={isLoading}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <ChatContainer
          showModelDropdown={showModelDropdown}
          onToggleModelDropdown={toggleModelDropdown}
        />
      </div>
    </div>
  );
}
