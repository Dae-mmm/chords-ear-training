# Supabase setup

## 1. Create project

You already have a Supabase account. Create a project (or use an existing one).

## 2. Run the database schema

1. Open **SQL Editor** in the Supabase dashboard
2. Paste and run the contents of [`supabase/schema.sql`](supabase/schema.sql)

## 3. Configure authentication

### Email provider

In **Authentication → Providers → Email**:

- Enable Email provider
- For quick testing you can disable **Confirm email** (optional)

### Redirect URLs (important!)

In **Authentication → URL Configuration**:

1. **Site URL** — set to your live app URL, e.g.  
   `https://dae-mmm.github.io/chords-ear-training/`  
   (not `http://localhost:3000`)

2. **Redirect URLs** — add every URL where the app can be opened, e.g.:
   ```
   https://dae-mmm.github.io/chords-ear-training/
   https://dae-mmm.github.io/chords-ear-training/index.html
   http://localhost:3000
   http://127.0.0.1:5500
   ```

The confirmation email will redirect to `redirectUrl` in `supabase-config.js`, or automatically to the current page URL if omitted.

## 4. Add credentials to the app

1. Copy `supabase-config.example.js` to `supabase-config.js` (if not already present)
2. In **Project Settings → API**, copy:
   - **Project URL** → `url`
   - **anon public** key → `anonKey`
3. Paste them into `supabase-config.js`

```js
window.SUPABASE_CONFIG = {
  url: 'https://xxxx.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  redirectUrl: 'https://your-domain.com/path/', // optional, for email confirmation
};
```

## 5. Deploy

Make sure `supabase-config.js` is deployed alongside `index.html` (same folder).

## Features

- **Sign up / Sign in** with email and password
- **Leaderboard** per difficulty (best star streak)
- Scores sync automatically when you beat your personal best while logged in
- Guest play still works without an account (local stats only)

## Security

- Row Level Security is enabled
- Anyone can read leaderboards and profiles
- Users can only write their own scores
- Never commit your real `anonKey` to a public repo if the repo is public (use env-specific config in production)
