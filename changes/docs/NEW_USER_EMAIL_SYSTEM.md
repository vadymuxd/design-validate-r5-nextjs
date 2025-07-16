# New User Email Notification System

## Overview

This system automatically sends email notifications to `info@design-validate.com` whenever a new user is detected and added to the users table. The email includes comprehensive information about the user's device, location, and browser details.

## How It Works

### 1. **Email Integration**
- **Service**: Resend API (same as contact form)
- **Trigger**: When `is_new_user` returns `true` from the `upsert_user` database function
- **Sender**: `Design Validate <noreply@design-validate.com>`
- **Recipient**: `info@design-validate.com`
- **Subject**: `New user detected`

### 2. **Email Content**
The email includes a comprehensive table with all user information:

- **User ID**: Database ID of the new user
- **Device ID**: Generated device fingerprint
- **Device Type**: mobile, desktop, or tablet
- **Operating System**: macOS, Windows, iOS, Android, Linux
- **Browser**: Chrome, Firefox, Safari, Edge, Opera, Brave
- **City**: Detected from IP geolocation
- **Region**: State/Province from IP geolocation
- **Country**: Country from IP geolocation
- **IP Address**: User's IP address
- **User Agent**: Full browser user agent string
- **Timestamp**: When the user was detected

### 3. **Email Flow**
```
User visits page → UserTracking component → /api/user-tracking → 
upsert_user() function → is_new_user = true → sendNewUserEmail() → 
Resend API → Email sent to info@design-validate.com
```

## Implementation Details

### Files Modified

1. **`/src/app/api/user-tracking/route.ts`**
   - Added `import { Resend } from 'resend'`
   - Added `sendNewUserEmail()` helper function
   - Integrated email sending into POST handler

2. **Email Function: `sendNewUserEmail()`**
   - Takes user info and device data as parameters
   - Formats HTML email with user details table
   - Handles API key validation
   - Includes error handling and logging

### Code Integration

The email is triggered in the user tracking POST handler:

```typescript
// After successful user creation
if (userInfo.is_new_user) {
  console.log('New user created:', { userId: userInfo.user_id, ... });

  // Send email notification for new user
  try {
    const deviceData = { deviceId, deviceType, os, browser, city, region, country, ipAddress, userAgent };
    const emailSent = await sendNewUserEmail(userInfo, deviceData);
    
    if (emailSent) {
      console.log('New user email notification sent successfully');
    } else {
      console.log('New user email notification failed or was skipped');
    }
  } catch (emailError) {
    console.error('Error sending new user email:', emailError);
    // Don't fail the request if email fails
  }
}
```

## Error Handling

- **API Key Missing**: Logs warning and skips email (doesn't fail request)
- **Email Send Error**: Logs error and continues (doesn't fail user tracking)
- **Network Issues**: Caught and logged, request continues normally
- **Non-blocking**: Email failures don't affect user tracking functionality

## Environment Configuration

The system uses the same environment variable as the contact form:
```bash
RESEND_API_KEY=re_EcNoftUE_N9LhNzK6WWjhnRs1dPdrKG1v
```

## Testing

### Manual Testing
1. Visit any page on the site (triggers user tracking)
2. Check browser console for "New user created" log
3. Check email at `info@design-validate.com`
4. Verify email contains all user information

### Test Script
Run the test script to verify email functionality:
```bash
node test-new-user-email.js
```

### Local vs Production
- **Local**: Limited location data (IP is localhost)
- **Production**: Full location data (real IP geolocation)

## Email Sample

```
Subject: New user detected

🎉 New User Detected on Design Validate

A new user has been added to the users table:

User Information:
┌─────────────────┬─────────────────────────────────────────┐
│ User ID         │ 12345                                   │
│ Device ID       │ TW96aWxsYS81LjAgKE1hY2ludG9zaA...       │
│ Device Type     │ desktop                                 │
│ Operating System│ macOS                                   │
│ Browser         │ Chrome                                  │
│ City            │ San Francisco                           │
│ Region          │ California                              │
│ Country         │ United States                           │
│ IP Address      │ 203.0.113.1                            │
│ User Agent      │ Mozilla/5.0 (Macintosh; Intel Mac...)  │
└─────────────────┴─────────────────────────────────────────┘

This email was automatically generated when a new user was detected on Design Validate.
Timestamp: 2025-07-16T15:30:45.123Z

Visit the Admin Dashboard to view detailed analytics.
```

## Benefits

1. **Real-time Notifications**: Get instant alerts when new users visit
2. **Comprehensive Data**: See all user information in one place
3. **Geographic Insights**: Know where users are coming from
4. **Device Intelligence**: Understand user's technical setup
5. **Audit Trail**: Email record of all new user detections
6. **Non-intrusive**: Doesn't affect user experience or site performance

## Privacy & Compliance

- **No Personal Data**: Only technical device and location information
- **IP Logging**: For analytics and security (standard practice)
- **Automated Processing**: No manual intervention required
- **Data Minimization**: Only essential information included
- **Secure Transport**: Uses encrypted email delivery

## Maintenance

- **Monitoring**: Check email delivery success in console logs
- **Rate Limiting**: Consider implementing if high traffic expected
- **Email Storage**: Emails are delivered, not stored in database
- **API Limits**: Monitor Resend API usage and limits

This system provides valuable insights into user acquisition while maintaining privacy and reliability.
