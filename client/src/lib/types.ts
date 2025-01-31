export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  thinking?: string;
  isCode?: boolean;
}

export interface ChatContext {
  files: {
    name: string;
    content: string;
  }[];
}

export interface ChatState {
  messages: Message[];
  context: ChatContext;
}
