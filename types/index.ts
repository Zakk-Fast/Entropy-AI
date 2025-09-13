export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export type ModelType = 'entropy-haiku' | 'entropy-standard' | 'entropy-turbo';

export interface ModelConfig {
  name: string;
  description: string;
  delay: number;
  personality: string;
}