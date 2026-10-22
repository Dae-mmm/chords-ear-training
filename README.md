# Ear Training Chords

A browser-based ear training app for practicing note recognition, intervals, and chord identification. Built for musicians who want to improve pitch recognition, harmonic awareness, and fast chord recall through interactive training.

## Overview

Ear Training Chords is a lightweight web app designed to help users practice:

- single note recognition
- interval recognition
- chord and arpeggio identification
- rhythmic and cognitive speed training with a star-based scoring system
- multilingual training in English, Italian, French, Spanish, and German

The project is implemented as a static front-end app using HTML, JavaScript, and React loaded via CDN, with optional Supabase-powered authentication and leaderboard features.

## Features

- Note guessing game
- Interval recognition drills
- Chord and arpeggio recognition
- Multiple skill levels:
  - Beginner
  - Intermediate
  - Intermediate+
  - Advanced
  - Advanced+
  - Pro
  - Jazz
- Star-based scoring system with streak tracking
- Replay and answer validation
- Fullscreen support for focused practice
- Mobile-friendly keyboard and touch interactions
- Multi-language UI
- Optional Supabase login/signup
- Leaderboard and player profiles
- Local guest-mode play without account

## Tech Stack

- HTML5
- JavaScript
- React (via CDN)
- Tailwind CSS (via CDN)
- Supabase JS
- Browser Audio API

## Project Structure

```text
.
├── index.html
├── supabase-config.example.js
├── supabase-config.js
├── SUPABASE_SETUP.md
├── supabase/
│   ├── migration_login_only.sql
│   ├── migration_profile.sql
│   └── schema.sql
├── README.md
└── .gitignore
```

## Live Demo

- https://chords-ear-training.vercel.app

## Getting Started

### 1) Open the app directly

You can run the project by opening `index.html` in a browser.

### 2) Or serve it locally

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Supabase Setup

The app supports optional cloud features such as sign-in, profile management, and leaderboard storage.

### Configuration

1. Copy the example config:

```bash
cp supabase-config.example.js supabase-config.js
```

2. Fill in your Supabase project values:

```js
window.SUPABASE_CONFIG = {
  url: 'https://your-project.supabase.co',
  anonKey: 'your-anon-key',
  redirectUrl: 'https://your-domain.com/path/' // optional
};
```

3. Follow the setup guide in `SUPABASE_SETUP.md`.

## Database / Auth Notes

The repo includes SQL scripts under `supabase/` to configure:

- user login and auth
- player profiles
- score leaderboard tables
- limited profile and authentication setup variants

## How to Use

1. Choose a language and difficulty.
2. Start a training session.
3. Listen to the target note, interval, or chord.
4. Submit your answer.
5. Track your streak and star score.
6. Sign in to save and compare results on the leaderboard.

## Notes

- The project is intentionally lightweight and runs entirely in the browser.
- Supabase is optional and only needed for cloud-based leaderboard and account features.
- The app is designed to work well for both desktop and mobile browsers.

## License

This project does not currently specify a license in the repository.
