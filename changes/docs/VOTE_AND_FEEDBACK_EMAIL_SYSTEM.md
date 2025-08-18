# Vote and App Feedback Email Notification System

## Overview

This system automatically sends email notifications to `info@design-validate.com` whenever a new vote or app feedback entry is added to the database. The email system follows the same pattern as the existing new user email notification system, using the Resend API for reliable email delivery.

## How It Works

### 1. **Email Integration**
- **Service**: Resend API (same as contact form and new user emails)
- **Trigger**: When new entries are added to `votes` or `app_feedback` tables
- **Sender**: `Design Validate <noreply@design-validate.com>`
- **Recipient**: `info@design-validate.com`
- **Subjects**: 
  - Votes: `New {vote_type} vote: {sentiment}`
  - App Feedback: `New app feedback: {sentiment} on {collection_name}`

### 2. **Email Content**

#### **Vote Emails Include:**
- Vote ID and type (tool, method, case, metric, article, framework)
- Entity name and ID being voted on
- Sentiment (UPVOTE/DOWNVOTE) with color coding
- Method context (if applicable)
- Device ID, IP address, and user agent
- Timestamp of vote creation

#### **App Feedback Emails Include:**
- Feedback ID and sentiment (LIKE/DISLIKE) with color coding
- Collection name and context name
- Collection slug and context slug
- Device ID, IP address, and user agent
- Timestamp of feedback creation

### 3. **Email Flow**

#### **Votes:**
```
User votes → /api/votes → Insert to votes table → 
sendNewVoteEmail() → Resend API → Email sent to info@design-validate.com
```

#### **App Feedback:**
```
User gives feedback → /api/app-feedback → Insert to app_feedback table → 
sendNewAppFeedbackEmail() → Resend API → Email sent to info@design-validate.com
```

## Implementation Details

### Files Modified

1. **`/src/app/api/votes/route.ts`**
   - Added `import { Resend } from 'resend'`
   - Added `sendNewVoteEmail()` helper function
   - Modified POST handler to return inserted vote data
   - Integrated email sending after successful vote insertion

2. **`/src/app/api/app-feedback/route.ts`**
   - Added `import { Resend } from 'resend'`
   - Added `sendNewAppFeedbackEmail()` helper function
   - Modified POST handler to return inserted feedback data
   - Integrated email sending after successful feedback insertion

### Code Integration

#### **Vote Email Function:**
```typescript
async function sendNewVoteEmail(voteInfo: VoteInfo, deviceData: VoteDeviceData): Promise<boolean>
```
- Fetches entity names (tool, method, framework, case) for context
- Builds comprehensive HTML email with vote details
- Handles all vote types from the scalable voting system

#### **App Feedback Email Function:**
```typescript
async function sendNewAppFeedbackEmail(feedbackInfo: AppFeedbackInfo, deviceData: FeedbackDeviceData): Promise<boolean>
```
- Fetches collection and context names for better readability
- Builds HTML email with feedback details
- Supports all collection types and context slugs

## Error Handling

- **API Key Missing**: Logs warning and skips email (doesn't fail request)
- **Email Send Error**: Logs error and continues (doesn't fail vote/feedback insertion)
- **Entity Name Lookup Failures**: Continues with ID/slug if name lookup fails
- **Network Issues**: Caught and logged, request continues normally
- **Non-blocking**: Email failures don't affect core functionality

## Environment Configuration

The system uses the same environment variable as other email features:
```bash
RESEND_API_KEY=re_EcNoftUE_N9LhNzK6WWjhnRs1dPdrKG1v
```

## Email Samples

### Vote Email Sample
```
Subject: New tool vote: UPVOTE

🗳️ New Vote Detected on Design Validate

A new vote has been added to the votes table:

Vote Information:
┌─────────────────┬─────────────────────────────────────────┐
│ Vote ID         │ 12345                                   │
│ Vote Type       │ TOOL                                    │
│ Entity Name     │ Hotjar (in Usability Testing method)   │
│ Entity ID       │ hotjar-uuid-123                         │
│ Sentiment       │ 👍 UPVOTE                              │
│ Method Context  │ Usability Testing (ID: 5)              │
│ Device ID       │ TW96aWxsYS81LjAgKE1hY2ludG9zaA...       │
│ IP Address      │ 203.0.113.1                            │
│ User Agent      │ Mozilla/5.0 (Macintosh; Intel Mac...)  │
│ Created At      │ 8/18/2025, 3:30:45 PM                  │
└─────────────────┴─────────────────────────────────────────┘

This email was automatically generated when a new vote was detected on Design Validate.
Timestamp: 2025-08-18T15:30:45.123Z

Visit the Admin Dashboard to view detailed analytics.
```

### App Feedback Email Sample
```
Subject: New app feedback: LIKE on Tools

💬 New App Feedback Detected on Design Validate

A new app feedback entry has been added to the app_feedback table:

Feedback Information:
┌─────────────────┬─────────────────────────────────────────┐
│ Feedback ID     │ 67890                                   │
│ Sentiment       │ 👍 LIKE                                │
│ Collection      │ Tools                                   │
│ Context         │ Usability Testing (method)             │
│ Collection Slug │ tools                                   │
│ Context Slug    │ usability-testing                       │
│ Device ID       │ TW96aWxsYS81LjAgKE1hY2ludG9zaA...       │
│ IP Address      │ 203.0.113.1                            │
│ User Agent      │ Mozilla/5.0 (Macintosh; Intel Mac...)  │
│ Created At      │ 8/18/2025, 3:30:45 PM                  │
└─────────────────┴─────────────────────────────────────────┘

This email was automatically generated when new app feedback was detected on Design Validate.
Timestamp: 2025-08-18T15:30:45.123Z

Visit the Admin Dashboard to view detailed analytics.
```

## Benefits

1. **Real-time Notifications**: Get instant alerts when users vote or give feedback
2. **Comprehensive Data**: See all vote and feedback information in one place
3. **Entity Context**: Know exactly what users are voting on or giving feedback about
4. **Device Intelligence**: Understand user's technical setup and location
5. **Audit Trail**: Email record of all user interactions
6. **Non-intrusive**: Doesn't affect user experience or site performance
7. **Unified System**: Uses same email infrastructure as new user notifications

## Supported Vote Types

The email system supports all vote types from the scalable voting architecture:
- **Tools**: Votes on tools within specific methods
- **Methods**: Direct votes on methods
- **Frameworks**: Votes on frameworks
- **Cases**: Votes on case studies
- **Metrics**: Votes on metrics (future)
- **Articles**: Votes on articles (future)

## Supported Feedback Types

The email system supports all app feedback types:
- **Collection-based**: Feedback on tools, methods, community pages
- **Context-based**: Feedback with specific method/category context
- **General**: Feedback without specific context

## Testing

### Manual Testing
1. Cast a vote on any tool, method, or framework
2. Give feedback (like/dislike) on any page
3. Check email at `info@design-validate.com`
4. Verify email contains all relevant information

### Local vs Production
- **Local**: Uses localhost IP addresses
- **Production**: Real IP addresses and geolocation data
- **Both**: Full entity name resolution and context information

## Privacy & Compliance

- **No Personal Data**: Only technical device information and public vote/feedback data
- **IP Logging**: For analytics and security (standard practice)
- **Automated Processing**: No manual intervention required
- **Data Minimization**: Only essential information included
- **Secure Transport**: Uses encrypted email delivery

## Maintenance

- **Monitoring**: Check email delivery success in console logs
- **Rate Limiting**: Consider implementing if high vote/feedback volume expected
- **Email Storage**: Emails are delivered, not stored in database
- **API Limits**: Monitor Resend API usage and limits
- **Entity Name Resolution**: Monitor database queries for performance

This system provides valuable insights into user engagement and sentiment while maintaining privacy and reliability, complementing the existing new user notification system.
