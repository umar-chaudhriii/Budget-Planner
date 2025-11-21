# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Budget Planner" → Click "Create"

## Step 2: Enable Google+ API

1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

## Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Budget Planner
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue" through all steps

4. Back to Create OAuth client ID:
   - Application type: **Web application**
   - Name: Budget Planner Web Client
   
5. **Authorized JavaScript origins:**
   ```
   http://localhost:3002
   ```

6. **Authorized redirect URIs:**
   ```
   http://localhost:3002/api/auth/callback/google
   ```

7. Click "Create"

## Step 4: Copy Credentials

You'll see a popup with:
- **Client ID** (looks like: 123456789-abc123.apps.googleusercontent.com)
- **Client Secret** (looks like: GOCSPX-abc123...)

**Keep this window open!**

## Step 5: Update .env File

1. Open your `.env` file in the budget-tracker folder
2. Replace these lines:

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

With your actual credentials:

```env
GOOGLE_CLIENT_ID="123456789-abc123.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123..."
```

## Step 6: Restart Dev Server

1. Stop the server (Ctrl + C)
2. Run: `npm run dev`
3. Visit: http://localhost:3002

## Step 7: Test

1. Click "Login"
2. Click "Google" button
3. You should see Google's login screen!

---

## Troubleshooting

**Error: "redirect_uri_mismatch"**
- Make sure the redirect URI is exactly: `http://localhost:3002/api/auth/callback/google`
- Check that you're using port 3002 (not 3000)

**Error: "invalid_client"**
- Double-check your Client ID and Secret in .env
- Make sure there are no extra spaces
- Restart the dev server

---

## For Production Deployment

When deploying to production (e.g., Vercel):

1. Add your production domain to Authorized JavaScript origins:
   ```
   https://yourdomain.com
   ```

2. Add production callback to Authorized redirect URIs:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

3. Update environment variables in your hosting platform
