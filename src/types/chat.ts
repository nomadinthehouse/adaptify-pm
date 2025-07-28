
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  frameworks?: string[];
  expertQuote?: {
    expert: string;
    quote: string;
    source?: string;
  };
  helpful?: boolean;
  feedback?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: Date;
  updated_at: Date;
}

export interface ExpertQuote {
  expert: string;
  quote: string;
  source?: string;
}

export interface PMFramework {
  name: string;
  description: string;
  whenToUse: string;
  expertQuotes: ExpertQuote[];
}
