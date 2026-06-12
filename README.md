# Devli's Advocated

Modern QR photo conversion web app with Google-only login, Supabase history storage, and a premium mobile-first UI.

## Stack
- Next.js 16 + TypeScript
- Tailwind CSS
- Framer Motion
- Firebase Authentication (Google only)
- Supabase Postgres + Storage
- Sonner for toasts

## Local setup
1. Copy `.env.example` to `.env.local`
2. Fill Firebase + Supabase values
3. Install dependencies: `npm install`
4. Run dev server: `npm run dev`

## What this app does
- Splash screen on first load
- Google/Gmail-only authentication
- QR-style image processor on the client
- Supabase-backed history
- Settings, language toggle, and legal pages
- Vercel-ready deployment

## Notes
The QR processor is intentionally lightweight and client-side. It preserves the QR structure by using the uploaded QR photo as the base and applying a safe stylization pass derived from the reference image. For complex visual transformations, this module can be replaced later with a serverless or GPU-backed pipeline.
