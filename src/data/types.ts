// This file now defines the shape of data returned from the API, not the initial seed data.

export interface ApiTool {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  method_id: number;
  upvotes: number;
  downvotes: number;
  net_score: number; // upvotes - downvotes (for ranking)
  pro_text: string | null;
  con_text: string | null;
  // The 'pros' and 'cons' are no longer part of the main tool object from the API.
  // This data could be moved to a separate table in the future if needed.
}

export interface ApiMethod {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  collection_id: number;
  net_score: number;
  current_upvotes: number;
  current_downvotes: number;
  initial_score: number;
  metadata?: {
    research_type?: 'qualitative' | 'mixed' | 'quantitative';
    design_timing?: 'before' | 'during' | 'after';
    user_awareness?: 'explicit' | 'implicit';
    cognitive_stage?: 'feel' | 'think' | 'act';
  };
}

export interface ApiFramework {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  link: string | null;
  picture: string | null;
  initial_upvotes: number;
  initial_downvotes: number;
  current_upvotes: number;
  current_downvotes: number;
  upvotes: number; // total upvotes (initial + current)
  downvotes: number; // total downvotes (initial + current)
  net_score: number; // upvotes - downvotes (for ranking)
  created_at?: string;
  updated_at?: string;
}

export interface ApiMetric {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: 'Time' | 'Ratio' | 'Count' | 'Scale' | 'Composite' | 'Money';
  metadata?: {
    user_data?: string[];
    design_goal?: string[];
    business_goal?: string[];
    user_journey_stage?: string[];
    measurement_timing?: string[];
  };
  created_at?: string;
  updated_at?: string;
}

export interface ApiCase {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  url: string | null;
  picture: string | null;
  release_date: string;
  methods: string[];
  initial_upvotes: number;
  initial_downvotes: number;
  current_upvotes: number;
  current_downvotes: number;
  totalUpvotes: number; // initial + current upvotes
  totalDownvotes: number; // initial + current downvotes
  netScore: number; // totalUpvotes - totalDownvotes
  metadata?: {
    methods?: string[];
  };
  created_at?: string;
  updated_at?: string;
}
