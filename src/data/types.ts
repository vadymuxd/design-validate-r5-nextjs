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
}
