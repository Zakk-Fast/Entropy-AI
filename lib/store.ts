import { create } from 'zustand';
import { ModelType, Conversation, Message } from '@/types';

interface EntropyStore {
  // Loading state
  isInitialized: boolean;
  setIsInitialized: (initialized: boolean) => void;
  
  // Conversations
  conversations: Conversation[];
  currentConversation: Conversation | null;
  
  // Model and UI state
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
  // Initial state
  isInitialized: false,
  conversations: [],
  currentConversation: null,
  selectedModel: 'entropy-standard',
  isLoading: false,

  setIsInitialized: (initialized) => set({ isInitialized: initialized }),

  setSelectedModel: (model) => set({ selectedModel: model }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),

  createNewConversation: () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
    };
    
    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      currentConversation: newConversation,
    }));
    
    get().saveConversationsToStorage();
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
  },

  addMessage: (conversationId, message) => {
    set((state) => {
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, message],
            updatedAt: new Date(),
          };
        }
        return conv;
      });

      const updatedCurrentConversation = 
        state.currentConversation?.id === conversationId
          ? { 
              ...state.currentConversation, 
              messages: [...state.currentConversation.messages, message],
              updatedAt: new Date(),
            }
          : state.currentConversation;

      return {
        conversations: updatedConversations,
        currentConversation: updatedCurrentConversation,
      };
    });
    
    get().saveConversationsToStorage();
  },

  updateConversationTitle: (conversationId, title) => {
    set((state) => {
      const updatedConversations = state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, title, updatedAt: new Date() } : conv
      );

      const updatedCurrentConversation =
        state.currentConversation?.id === conversationId
          ? { ...state.currentConversation, title, updatedAt: new Date() }
          : state.currentConversation;

      return {
        conversations: updatedConversations,
        currentConversation: updatedCurrentConversation,
      };
    });
    
    get().saveConversationsToStorage();
  },

  loadConversationsFromStorage: () => {
    try {
      const stored = localStorage.getItem('entropy-conversations');
      const storedCurrent = localStorage.getItem('entropy-current-conversation');
      
      if (stored) {
        const conversations = JSON.parse(stored).map((conv: Conversation) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          messages: conv.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        
        let currentConversation = null;
        if (storedCurrent) {
          const currentId = JSON.parse(storedCurrent);
          currentConversation = conversations.find((conv: Conversation) => conv.id === currentId) || null;
        }
        
        set({ 
          conversations, 
          currentConversation,
          isInitialized: true 
        });
      } else {
        // No stored conversations - first time user
        set({ 
          conversations: [], 
          currentConversation: null,
          isInitialized: true 
        });
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      set({ 
        conversations: [], 
        currentConversation: null,
        isInitialized: true 
      });
    }
  },

  saveConversationsToStorage: () => {
    const { conversations, currentConversation } = get();
    try {
      localStorage.setItem('entropy-conversations', JSON.stringify(conversations));
      if (currentConversation) {
        localStorage.setItem('entropy-current-conversation', JSON.stringify(currentConversation.id));
      } else {
        localStorage.removeItem('entropy-current-conversation');
      }
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  },
}));