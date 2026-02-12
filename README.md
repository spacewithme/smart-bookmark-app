# Smart Bookmark App

A full-stack bookmark manager built using Next.js (App Router) and Supabase.

Users can authenticate using Google OAuth, add personal bookmarks, view them in real-time, and manage their own private data securely.

Live URL:
https://smart-bookmark-app-ryf1-gq2qun137.vercel.app/


## Tech Stack

- Next.js 16 (App Router)
- Supabase (Auth, Database, Realtime)
- PostgreSQL
- Tailwind CSS
- Vercel (Deployment)


## Features

Authentication
- Google OAuth only
- Secure session management
- Automatic redirect after login

Bookmarks
- Add bookmark (Title + URL)
- Delete bookmark
- Sorted by newest first

Privacy
- Bookmarks are private to each user
- Implemented using Supabase Row Level Security (RLS)

Realtime Updates
- Uses Supabase Realtime subscriptions
- No page refresh required

Deployment
- Hosted on Vercel
- Environment variables configured securely


## Database Schema

Table: bookmarks

Columns:
- id (uuid, primary key)
- title (text)
- url (text)
- user_id (uuid, foreign key referencing auth.users.id)
- created_at (timestamp)


## Row Level Security (RLS)

RLS is enabled on the bookmarks table.

Policies ensure:
- Users can only SELECT their own bookmarks
- Users can only INSERT their own bookmarks
- Users can only DELETE their own bookmarks

Policy condition:
user_id = auth.uid()


## Environment Variables

The following environment variables are required:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

These must be configured in:
Vercel → Project Settings → Environment Variables


## Local Development

Clone the repository:

git clone https://github.com/your-username/smart-bookmark-app.git
cd smart-bookmark-app

Install dependencies:

npm install

Create a .env.local file:

NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

Run development server:

npm run dev


## Deployment

1. Push project to GitHub
2. Import project into Vercel
3. Add required environment variables
4. Deploy


## Problems Faced and Solutions

1. OAuth redirect loop
Cause: Incorrect session validation logic in dashboard.
Solution: Proper session check using supabase.auth.getSession() and proper redirect handling.

2. Vercel build failure (supabaseKey is required)
Cause: Missing environment variables in Vercel.
Solution: Added NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in project settings.

3. GitHub authentication issue
Cause: Password authentication deprecated.
Solution: Used GitHub Personal Access Token for git push.


## Project Status

Fully functional:
- Google login
- Private bookmarks per user
- Realtime updates
- RLS secured
- Deployed on Vercel
