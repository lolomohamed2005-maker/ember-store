# EMBER

Animated specialty coffee store (EMBER) built with React, Vite, TypeScript, Tailwind CSS, Motion and Supabase.

## Setup

1. Create a Supabase project.
2. In the SQL Editor run `supabase/schema.sql`, then `supabase/seed.sql`.
3. In Authentication, Providers, Email turn off "Confirm email".
4. Copy `.env.example` to `.env` and fill in the project URL and the publishable key.
5. `npm install` then `npm run dev`.

## Admin

Open `/admin/login`, choose "Create admin account", enter a phone number and password, then run the SQL shown on screen once in the SQL Editor. Sign in again to manage homepage images, products and orders.

## Deploy

Push to GitHub, import the repo in Vercel and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables.
