# NextAuth.js (Auth.js) Setup Guide

## Overview

This project uses **NextAuth.js v5** (Auth.js) for authentication with Google OAuth 2.0 provider.

## File Structure

```
src/
 app/
    api/
        auth/
            [...nextauth]/
                route.ts       # NextAuth API routes
 lib/
    auth.ts                    # NextAuth configuration
 types/
     next-auth.d.ts            # TypeScript declarations
```

## Environment Variables

Add these to your `.env` file:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_key_here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Or in PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 Client ID credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

## Usage in Components

### Server Components

```typescript
import { auth } from "@/lib/auth"

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session) {
    return <div>Not authenticated</div>
  }
  
  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
    </div>
  )
}
```

### Client Components

```typescript
"use client"

import { useSession } from "next-auth/react"

export default function ClientComponent() {
  const { data: session, status } = useSession()
  
  if (status === "loading") {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return <div>Not authenticated</div>
  }
  
  return <div>Hello {session.user.name}</div>
}
```

### Sign In / Sign Out

```typescript
import { signIn, signOut } from "@/lib/auth"

// Sign in button (Server Action)
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <button type="submit">Sign in with Google</button>
    </form>
  )
}

// Sign out button (Server Action)
export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  )
}
```

### Or using redirects:

```typescript
// In a server component or action
import { signIn } from "@/lib/auth"

await signIn("google", { redirectTo: "/dashboard" })
```

## Protecting Routes

### Middleware Protection

Update `src/middleware.ts` to add auth checks:

```typescript
import { auth } from "@/lib/auth"

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/login", req.url))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

### API Route Protection

```typescript
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  return NextResponse.json({ data: "Protected data" })
}
```

## Database Integration (Prisma)

To persist users in the database, update `src/lib/auth.ts`:

```typescript
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // ... rest of config
})
```

Install the adapter:
```bash
npm install @auth/prisma-adapter
```

Update your Prisma schema:
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Available Routes

NextAuth automatically creates these routes:

- `/api/auth/signin` - Sign in page
- `/api/auth/signout` - Sign out page
- `/api/auth/callback/google` - OAuth callback
- `/api/auth/session` - Get session data
- `/api/auth/csrf` - CSRF token
- `/api/auth/providers` - List providers

## Session Data Structure

```typescript
{
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  accessToken?: string
  provider?: string
  expires: string
}
```

## Testing

1. Start dev server:
```bash
npm run dev
```

2. Navigate to `/api/auth/signin`
3. Click "Sign in with Google"
4. Authorize the app
5. Get redirected back with session

## Troubleshooting

### "Configuration error"
- Ensure `NEXTAUTH_SECRET` is set
- Ensure `NEXTAUTH_URL` matches your domain

### "Redirect URI mismatch"
- Check Google Cloud Console authorized redirect URIs
- Must match exactly: `http://localhost:3000/api/auth/callback/google`

### Session not persisting
- Clear browser cookies
- Check that cookies are being set (dev tools > Application > Cookies)
- Ensure `NEXTAUTH_URL` is correct

## References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Auth.js v5 Migration](https://authjs.dev/getting-started/migrating-to-v5)
- [Google OAuth Setup](https://next-auth.js.org/providers/google)
