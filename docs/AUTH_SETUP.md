# Google OAuth Setup Guide

## Prerequisites

- A Google Cloud Platform account
- Your application running locally or deployed

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter your project name (e.g., "Udyoga Access")
5. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (or "Internal" if using Google Workspace)
3. Click "Create"
4. Fill in the required fields:
   - App name: `Udyoga Access`
   - User support email: Your email
   - Developer contact information: Your email
5. Click "Save and Continue"
6. On Scopes page, click "Add or Remove Scopes"
7. Add these scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
8. Click "Save and Continue"
9. Add test users if in testing mode
10. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application"
4. Name: `Udyoga Access Web Client`
5. Add Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Click "Create"
8. **Copy the Client ID and Client Secret** - you'll need these!

## Step 5: Configure Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### Generate NEXTAUTH_SECRET

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**On macOS/Linux:**
```bash
openssl rand -base64 32
```

## Step 6: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000/login`
3. Click the "Continue with Google" button
4. You should be redirected to Google's OAuth consent screen
5. Sign in with your Google account
6. After authorization, you'll be redirected back to your app

## Troubleshooting

### Error: "Redirect URI mismatch"
- Ensure the redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- Check for trailing slashes - they matter!

### Error: "Invalid client"
- Verify your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Make sure there are no extra spaces or quotes in your `.env.local` file

### Session not persisting
- Make sure `NEXTAUTH_SECRET` is set
- Clear your browser cookies and try again
- Check browser console for errors

### "Configuration error"
- Ensure all required environment variables are set
- Restart your development server after changing `.env.local`

## Production Deployment

When deploying to production:

1. Add your production domain to Google Cloud Console:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

2. Update environment variables on your hosting platform:
   - `NEXTAUTH_URL=https://yourdomain.com`
   - `NEXTAUTH_SECRET=<your-secret>`
   - `GOOGLE_CLIENT_ID=<your-client-id>`
   - `GOOGLE_CLIENT_SECRET=<your-client-secret>`

3. If using Vercel, add these in: Project Settings > Environment Variables

## Security Best Practices

1. **Never commit** `.env.local` or `.env` files to version control
2. Use different OAuth clients for development and production
3. Regularly rotate your `NEXTAUTH_SECRET`
4. Enable 2FA on your Google Cloud Platform account
5. Review OAuth consent screen regularly
6. Monitor your API usage in Google Cloud Console

## Need Help?

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- Check the `docs/NEXTAUTH_SETUP.md` for code examples
