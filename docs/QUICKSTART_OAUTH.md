# 🚀 Quick Start: Google OAuth with Auth.js

## Setup in 5 Minutes

### 1. Generate Your Secret

```bash
npm run generate-secret
```

Copy the generated secret.

### 2. Configure Environment Variables

Open `.env.local` and fill in:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<paste-generated-secret-here>
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
```

### 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

### 4. Start Development Server

```bash
npm run dev
```

### 5. Test Authentication

1. Open `http://localhost:3000/login`
2. Click "Continue with Google"
3. Sign in with your Google account
4. Get redirected back to your app ✨

## 📁 What Was Created

```
src/
├── app/api/auth/[...nextauth]/route.ts  # Auth API routes
├── lib/auth.ts                           # Auth configuration
├── components/auth/
│   ├── GoogleSignInButton.tsx           # Sign in component
│   └── SignOutButton.tsx                # Sign out component
├── middleware.ts                         # Updated with auth protection
└── types/next-auth.d.ts                 # TypeScript types

.env.local                                # Your local environment
.env.example                              # Template for production
scripts/generate-secret.js                # Secret generator
```

## 🔐 Using Authentication

### In Server Components

```tsx
import { auth } from "@/lib/auth"

export default async function Page() {
  const session = await auth()
  
  if (!session) {
    return <div>Not signed in</div>
  }
  
  return <div>Hello {session.user.name}!</div>
}
```

### In Client Components

First, wrap your app with SessionProvider in `layout.tsx`:

```tsx
import { SessionProvider } from "next-auth/react"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
```

Then use the session:

```tsx
"use client"
import { useSession } from "next-auth/react"

export default function Component() {
  const { data: session, status } = useSession()
  
  if (status === "loading") return <div>Loading...</div>
  if (!session) return <div>Not signed in</div>
  
  return <div>Hello {session.user.name}!</div>
}
```

### Sign In/Out Buttons

```tsx
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { SignOutButton } from "@/components/auth/SignOutButton"

// Use anywhere in your app
<GoogleSignInButton />
<SignOutButton />
```

### Protect API Routes

```tsx
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Your protected API logic here
  return NextResponse.json({ data: "secret data" })
}
```

## 🛡️ Protected Routes

The middleware automatically protects:
- `/admin/*` - Admin pages
- `/candidate/*` - Candidate pages
- `/api/admin/*` - Admin API routes
- `/api/candidate/*` - Candidate API routes

Unauthenticated users are redirected to `/login`.

## 📖 Full Documentation

- [AUTH_SETUP.md](./AUTH_SETUP.md) - Complete Google OAuth setup
- [NEXTAUTH_SETUP.md](./NEXTAUTH_SETUP.md) - NextAuth.js usage guide

## ⚠️ Troubleshooting

**"Redirect URI mismatch"**
- Make sure the redirect URI in Google Console is exactly: `http://localhost:3000/api/auth/callback/google`

**"Configuration error"**
- Check all environment variables are set in `.env.local`
- Restart your dev server after changing env vars

**Session not working**
- Make sure `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

## 🚀 Production Deployment

1. Add your production domain to Google Console redirect URIs
2. Set environment variables in your hosting platform:
   - `NEXTAUTH_URL=https://yourdomain.com`
   - `NEXTAUTH_SECRET=<your-secret>`
   - `GOOGLE_CLIENT_ID=<your-client-id>`
   - `GOOGLE_CLIENT_SECRET=<your-client-secret>`

That's it! You're ready to go! 🎉
