import { create } from 'zustand';
import { Conversation, ModelType, Message } from '@/types';

interface EntropyStore {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  selectedModel: ModelType;
  isLoading: boolean;
  
  // Actions
  setSelectedModel: (model: ModelType) => void;
  setIsLoading: (loading: boolean) => void;
  createNewConversation: () => void;
  setCurrentConversation: (conversation: Conversation) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  loadConversationsFromStorage: () => void;
  saveConversationsToStorage: () => void;
}

export const useEntropyStore = create<EntropyStore>((set, get) => ({
  conversations: [],
  currentConversation: null,
  selectedModel: 'entropy-standard',
  isLoading: false,

  setSelectedModel: (model) => set({ selectedModel: model }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  createNewConversation: () => {
    const newConvo: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
    };
    set((state) => ({
      conversations: [newConvo, ...state.conversations],
      currentConversation: newConvo,
    }));
    get().saveConversationsToStorage();
  },

  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),

  addMessage: (conversationId, message) => {
    set((state) => {
      const updatedConversations = state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      );
      
      const currentConv = updatedConversations.find(c => c.id === conversationId);
      
      return {
        conversations: updatedConversations,
        currentConversation: state.currentConversation?.id === conversationId 
          ? currentConv || state.currentConversation 
          : state.currentConversation,
      };
    });
    get().saveConversationsToStorage();
  },

  updateConversationTitle: (conversationId, title) => {
    set((state) => {
      const updatedConversations = state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, title } : conv
      );
      
      return {
        conversations: updatedConversations,
        currentConversation: state.currentConversation?.id === conversationId
          ? { ...state.currentConversation, title }
          : state.currentConversation,
      };
    });
    get().saveConversationsToStorage();
  },

  loadConversationsFromStorage: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('entropy-conversations');
      if (stored) {
        const conversations = JSON.parse(stored);
        set({ 
          conversations,
          currentConversation: conversations[0] || null 
        });
      }
    }
  },

  saveConversationsToStorage: () => {
    if (typeof window !== 'undefined') {
      const { conversations } = get();
      localStorage.setItem('entropy-conversations', JSON.stringify(conversations));
    }
  },
}));