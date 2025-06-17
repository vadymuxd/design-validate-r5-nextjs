export type SentimentType = 'LIKE' | 'DISLIKE';

export interface User {
  id: number;
  created_at: string;
  email: string;
  name?: string | null;
  ip_address?: string | null;
  device_id?: string | null;
}

export interface Feedback {
  id: number;
  created_at: string;
  sentiment: SentimentType;
  ip_address?: string | null;
  device_id?: string | null;
  category?: string | null;
  component?: string | null;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      feedback: {
        Row: Feedback;
        Insert: Omit<Feedback, 'id' | 'created_at'>;
        Update: Partial<Omit<Feedback, 'id' | 'created_at'>>;
      };
    };
    Enums: {
      sentiment_type: SentimentType;
    };
  };
} 