# Database Utilities

This folder contains utility scripts for working with the Supabase database.

## Scripts

### 1. view-database.js
A comprehensive script to view any table in your database with various options.

#### Usage:
```bash
# View all available tables
node changes/utilities/view-database.js

# View a specific table
node changes/utilities/view-database.js tools
node changes/utilities/view-database.js users
node changes/utilities/view-database.js votes

# View with options
node changes/utilities/view-database.js tools --limit=10
node changes/utilities/view-database.js votes --summary-only
node changes/utilities/view-database.js methods --order-by=name
node changes/utilities/view-database.js users --offset=20 --limit=10
```

#### Available Tables:
- `tools` - UX research and analytics tools
- `methods` - Research methods linked to collections
- `collections` - Method categories/collections
- `frameworks` - Design frameworks with voting
- `metrics` - Measurement metrics with metadata
- `users` - User tracking with device info
- `votes` - Universal voting system
- `app_feedback` - User feedback on the app
- `contact_messages` - Contact form submissions
- `tools_leaderboard` - Tool rankings by method
- `tool_pros_and_cons` - Tool evaluations

#### Options:
- `--limit=N` - Limit number of records (default: 50)
- `--offset=N` - Skip N records (default: 0)
- `--order-by=column` - Order by specific column
- `--summary-only` - Show only summary statistics
- `--data-only` - Show only data (no summary)

### 2. download-logos.js
Script for downloading tool logos (existing utility).

## Examples

### View recent votes
```bash
node changes/utilities/view-database.js votes --limit=20
```

### Check user activity
```bash
node changes/utilities/view-database.js users --summary-only
```

### Analyze tool performance
```bash
node changes/utilities/view-database.js tools_leaderboard
```

### View contact messages
```bash
node changes/utilities/view-database.js contact_messages --order-by=created_at
```

## Security Note

These scripts use hardcoded Supabase credentials for development purposes. In production, ensure proper environment variable management and access controls.
