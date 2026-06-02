# LeadFlow — Real Estate Lead Management System

A simple, mobile-friendly lead management system built for real estate agencies in Amman, Jordan. Ensures no lead ever falls through the cracks with systematic follow-up reminders and an instant pipeline dashboard.

## Features

- **Dashboard** — 4 stat cards (Total leads, New this week, Overdue follow-ups, Won)
- **Lead Management** — Add, edit, and track leads with status, budget, area, and property type
- **Follow-up System** — Automatic +3 day follow-up scheduling with urgency colors (red = overdue, amber = today)
- **Status Tracking** — New → Follow-up due → Viewing scheduled → Cold / Won / Lost
- **Agent Auth** — Email/password login via Supabase Auth; agents see only their own leads, admins see all
- **Search & Filter** — Filter by status, search by name or phone
- **RTL Arabic UI** — Built with IBM Plex Sans Arabic font for Arabic-first experience
- **Mobile Responsive** — Works on phones and tablets
- **Vercel Ready** — One-click deploy configuration included

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS v4
- **Backend:** Supabase (Postgres + Auth + RLS)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account (free tier works)
- A Vercel account (for deployment)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/realtales3-spec/cto.git leadflow
   cd leadflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note your project URL and anon key from Settings → API

4. **Set environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your Supabase URL and anon key.

5. **Run database migrations**
   - Go to your Supabase project → SQL Editor
   - Open and run `supabase/migrations/001_create_leads.sql`
   - Then run `supabase/migrations/002_create_email_digest_function.sql`

6. **Enable Auth**
   - In Supabase → Authentication → Providers
   - Ensure Email/Password is enabled

7. **Start the dev server**
   ```bash
   npm run dev
   ```

8. **Create an admin user**
   - Sign up via your app's login page
   - In Supabase SQL Editor, run:
     ```sql
     UPDATE auth.users SET raw_user_meta_data = '{"role": "admin"}' WHERE email = 'your-email@example.com';
     ```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/realtales3-spec/cto)

Add the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel's project settings.

## Project Structure

```
src/
  components/   — LeadTable, LeadModal, StatCard, StatusBadge, FilterBar
  pages/        — Dashboard, Login
  lib/          — supabaseClient.js
  hooks/        — useLeads.js, useAuth.js
supabase/
  migrations/   — SQL schema and functions
```

## License

MIT