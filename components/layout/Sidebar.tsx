"use client";

import { Plus, MessageSquare } from "lucide-react";
import { useEntropyStore } from "@/lib/store";
import { useEffect } from "react";

export default function Sidebar() {
  const {
    conversations,
    currentConversation,
    createNewConversation,
    setCurrentConversation,
    loadConversationsFromStorage,
  } = useEntropyStore();

  useEffect(() => {
    loadConversationsFromStorage();
  }, [loadConversationsFromStorage]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours =
      (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return "Today";
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={createNewConversation}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No conversations yet
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setCurrentConversation(conversation)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                  currentConversation?.id === conversation.id
                    ? "bg-blue-100 text-blue-900 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {conversation.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(conversation.createdAt)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
