# Memecode - An app that motivates you to do your daily leetcode before you start gooning off

## Features

- Google OAuth authentication with Supabase
- Integration with LeetCode API to generate questions that the user has not solved before
- Unlocks the ability to view daily memes upon completion of the generated question
- Difficulty filter to target questions towards user ability
- Modern UI with Tailwind CSS

### Future features
- Integration with video APIs (TikTok, YouTube) to allow users to watch videos after solving questions
- Filter questions by topic or company
- Integrated IDE to allow solving of questions from the web interface instead of redirecting users to LeetCode

## Setup Instructions

### 1. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. In your Supabase dashboard, go to **Authentication > Providers**
3. Enable **Google** provider and configure it:
   - Add your Google OAuth credentials
   - Set the redirect URL to: `http://localhost:3000/auth/callback` (for development)
4. Go to **Settings > API** and copy your:
   - Project URL
   - Anon public key

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** and create OAuth 2.0 Client IDs
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
6. Copy the Client ID and Client Secret to your Supabase Google provider settings

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts          # OAuth callback handler
│   │   └── auth-code-error/
│   │       └── page.tsx          # Auth error page
│   ├── dashboard/
│   │   └── page.tsx              # Protected dashboard page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   └── AuthButton.tsx            # Authentication component
├── lib/
│   ├── supabase.ts               # Basic Supabase client
│   ├── supabase-client.ts        # Browser Supabase client
│   └── supabase-server.ts        # Server Supabase client
└── middleware.ts                 # Authentication middleware
```

## Deployment

1. Set up your production Supabase project
2. Update environment variables with production URLs
3. Configure Google OAuth with production redirect URLs
4. Deploy to your preferred platform (Vercel, Netlify, etc.)

## Technologies Used

- **Next.js 15** - React framework with App Router
- **Supabase** - Backend-as-a-Service for authentication
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Google OAuth** - Authentication provider
