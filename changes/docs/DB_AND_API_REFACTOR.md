# Database and API Refactor Plan

This document outlines the plan to refactor the database schema and corresponding API endpoints to support per-category voting for tools and introduce a more scalable site structure.

## 1. The Core Problem

The original database schema stored vote counts directly on the `tools` table. This created a situation where a tool's vote count was global. If the same tool appeared in multiple categories (e.g., "Session Replays" and "Event Tracking"), it would incorrectly show the same vote count in both places. The goal of this refactor is to allow a tool to have a separate and unique vote count within each category it belongs to.

## 2. Key Architectural Concepts

To solve this, we are introducing a more normalized and scalable architecture based on the following concepts:

- **Collections**: These are the highest-level groupings on the site (e.g., "Tools", "Methods", "Frameworks"). This allows us to easily add new major sections to the website in the future.
- **Categories**: These are the specific lists within a collection (e.g., "Usability Testing" or "A/B Testing" within the "Tools" collection). A single, unified `categories` table will house all categories for all collections.
- **Slugs**: A "slug" is a URL-friendly version of a name (e.g., the name "A/B Testing" becomes the slug `ab-testing`). Using slugs for URLs and API lookups provides two key advantages:
    1.  **Clean URLs**: They are readable and better for SEO.
    2.  **Stable Links**: The display `name` of a category can be changed at any time without breaking existing URLs, as the `slug` remains the same.
- **Separation of Votes and App Feedback**: We identified two distinct types of user feedback:
    1.  **Votes**: A direct `UPVOTE` or `DOWNVOTE` on a specific item (like a tool). This is a structured action.
    2.  **App Feedback**: General sentiment (`LIKE`/`DISLIKE`) about a page, a category, or a site feature. This is qualitative feedback.
    
    These are now stored in two separate tables (`votes` and `app_feedback`) and handled by two separate API endpoints, which makes the system much cleaner.

## 3. The New Database Schema

The following SQL defines the final, definitive schema that will be implemented.

### `vote_type` (New Enum)
A specific type for voting actions.
```sql
CREATE TYPE public.vote_type AS ENUM ('UPVOTE', 'DOWNVOTE');
```

### `collections` (New Table)
Stores the high-level site areas.
```sql
CREATE TABLE public.collections (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE
);
```

### `categories` (New Table)
A single, unified table for all categories, linked to a collection.
```sql
CREATE TABLE public.categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  collection_id bigint NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  UNIQUE(collection_id, slug)
);
```

### `tools` (Modified Table)
This table is simplified to contain only tool-specific metadata. The `pill` and all vote-related columns are removed.
```sql
-- This represents the final state after modification.
CREATE TABLE public.tools (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  name text NOT NULL UNIQUE,
  description text,
  logo_url text,
  website_url text
);
```

### `tool_category_leaderboard` (New Table)
This join table connects tools and categories and stores the aggregated vote counts for each specific pair.
```sql
CREATE TABLE public.tool_category_leaderboard (
  tool_id uuid NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  category_id bigint NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  initial_upvotes integer DEFAULT 0,
  initial_downvotes integer DEFAULT 0,
  current_upvotes integer DEFAULT 0,
  current_downvotes integer DEFAULT 0,
  PRIMARY KEY (tool_id, category_id)
);
```

### `votes` (New Table)
This table replaces the old `feedback` table for the purpose of voting. It records every single `UPVOTE` or `DOWNVOTE` action from a user.
```sql
CREATE TABLE public.votes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  sentiment vote_type NOT NULL, -- Uses the new 'UPVOTE'/'DOWNVOTE' enum
  tool_id uuid NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  category_id bigint NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  device_id text,
  ip_address text,
  UNIQUE(tool_id, category_id, device_id) -- Prevents duplicate votes
);
```

### `app_feedback` (New Table)
This new table is dedicated to storing general site feedback.
```sql
CREATE TABLE public.app_feedback (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  sentiment sentiment_type NOT NULL, -- Uses the existing 'LIKE'/'DISLIKE' enum
  collection_slug text,
  category_slug text,
  device_id text,
  ip_address text
);
```

## 4. API Endpoint Refactor

The single `/api/feedback` endpoint is now deprecated and will be replaced by two new, specific endpoints.

### `/api/app-feedback` (New)
- **Purpose**: To handle general feedback from the `Feedback` component.
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "sentiment": "LIKE" | "DISLIKE",
    "collection_slug": "tools",
    "category_slug": "usability-testing"
  }
  ```
- **Action**: Inserts a new record into the `app_feedback` table.

### `/api/votes` (New)
- **Purpose**: To handle upvotes and downvotes from the `Voter` component.
- **Method**: `POST`
- **Body**:
  ```json
  {
    "sentiment": "UPVOTE" | "DOWNVOTE",
    "tool_id": "...",
    "category_id": "..."
  }
  ```
- **Action**: Inserts or updates a record in the `votes` table and prevents duplicate votes.

---

## Appendix: Original Schema for Rollback Reference

This section contains the SQL structure of the tables that are being modified or replaced. This can be used as a reference to manually reconstruct the old schema if needed. Data will not be preserved.

### `sentiment_type` (Original Enum)
```sql
CREATE TYPE public.sentiment_type AS ENUM ('LIKE', 'DISLIKE');
```

### `feedback` (Original Table)
```sql
CREATE TABLE public.feedback (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  sentiment public.sentiment_type NOT NULL,
  ip_address text,
  device_id text,
  category text,
  component text,
  updated_at timestamp with time zone
);
```

### `tools` (Original Table)
```sql
CREATE TABLE public.tools (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  name text NOT NULL UNIQUE,
  initial_upvotes integer DEFAULT 0,
  initial_downvotes integer DEFAULT 0,
  current_upvotes_total integer DEFAULT 0,
  current_downvotes_total integer DEFAULT 0,
  pill text,
  CONSTRAINT tools_pkey PRIMARY KEY (id)
);
```

*(The `users` table is not affected by this refactor and remains unchanged.)* 