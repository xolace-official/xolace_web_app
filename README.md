<a href="https://www.xolace.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://www.xolace.app/opengraph-image.jpg">
</a>

# 🌌 XOLACE

**Welcome to the official repo of Xolace — a safe space to express your thoughts, explore your emotions, and connect authentically.**

---

## ✨ What is Xolace?

Xolace is a modern, mental-health-conscious social platform where users can post freely (anonymously or not), interact in real time, and stay in control of their privacy. It blends **Twitter-like expressiveness** with **Reddit-level anonymity**, backed by **powerful moderation tools** and **AI-assisted content creation**.

---

## 👥 Who is it for?

- Users seeking a space to express emotions and thoughts safely.
- Moderators ("Blue Team") ensuring a healthy community.
- Help Professionals providing mental wellness support.
- Anonymous users who want to interact lightly without a full profile.

---


## ⚙️ Tech Stack

| Layer           | Stack                       |
|----------------|-----------------------------|
| Frontend       | Next.js, Tailwind CSS, Shadcn UI       |
| Backend        | Next.js (Hono), Supabase (PostgreSQL, Auth) , OpenAPI spec |
| Database       | Supabase (PostgreSQL) |
| Auth           | Supabase Auth (Email + Anonymous) |
| Real-time      | Supabase Realtime, Listeners, Broadcast |
| AI Integrations| OpenAI(moderator), AssemblyAI(text processing), ElevenLabs(text to speech, voice agents) |
| DevOps(deployment)         | Vercel, GitHub Actions (CI/CD) |
| DevOps(development)         | Bun (package manager), Biome (code formatter) |

---
### Technologies

This repo core foundations(links):

- [Next.js](https://nextjs.org/) - React Native development environment
- [Supabase](https://supabase.com/) - Authentication and database management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI Components](https://ui.shadcn.com/) -
  Reusable React components
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Biome](https://biomejs.dev/) - Linting and code formatting
- [Husky](https://typicode.github.io/husky/#/) - Git hooks
- [Lint-staged](https://github.com/okonet/lint-staged) - Linting and code formatting

---

## 🧠 Core Features

- 📝 Post creation with mood tagging, 24hr expiration, and anonymous option.
- 💬 Real-time upvotes and downvotes, comments, and anonymous replies.
- 🛡️ Robust user roles: Verified, Moderator (Blue Team), Help Professional.
- 🔍 Tag system and post tagging with frequency tracking.
- 📄 Activity logging with trigger-based auto-logging.
- 📋 Reporting system to maintain safe content.
- 🔐 Full privacy settings and user preferences.
- 🧙‍♂️ AI-powered flux comment on posts.
- 🏥 Health Tips articles 
- 📹 Glimpse - videos of mental health professionals/mentors sharing advice.
- 🎨 Theming - Only dark and light mode (for now).
- 🌍 Multi-language support (coming soon).
- 📊 Analytics (coming soon)
- 🤖 AI voice companions (coming soon)
- Online sessions with mental health professionals and mentors (coming soon)

---
## Preview

### Coming soon!

## Requirements

- Node.js 18.x
- bun
- Docker (for Supabase) or  connect to your remote Supabase

## Getting Started

Below are the steps to get started

### Installation

1. Clone the repository

```bash
git clone https://github.com/xolace-official/xolace_web_app.git <your-project-name>
```

2. Install dependencies (always run installation from the root)

```bash
cd <your-project-name>
bun install
```

3. Create .env file

Using the env.template file as a template, create a .env file in the root directory

First:
```bash
cd <your-project-name>
cp env.template .env
```

4. Start the development server

```bash
pnpm dev
```

5. Start Supabase (if you connected to remote you can skipp the following steps)

Run the following command to start Supabase:

```
pnpm run supabase:start
```

6. Stop Supabase

Run the following command to stop Supabase:

```
pnpm run supabase:stop
```


## Project Structure

The below is the Next.js app structure:

```
- backend   # Hono api
- src
-- __tests__      # tests
-- actions        # Server actions
-- app
--- (protected)      # protected routes
--- (auth-pages)        # auth pages
--- api         # Nextjs api routes
-- components   # global components
--- app         # app container (much more bigger components like wrappers and stuff)
--- animate-ui   # animated components that use the shadcn registry (that means it somehow just extend shadcn ui components)
--- builders   # components that extend the base ui components
--- molecule-ai  # components that use the shadcn registry (that means it somehow just extend shadcn ui) 
--- routes      # containers that affect routes (like loading and errors)
--- spectrumui  # components that use the spectrumui registry (that means it somehow just extend spectrumui ui)
--- shared      # shared components (like modals and stuff)
--- ui        # Shadcn UI components
-- lib       # api calls, helpers, utils
-- hooks     # houses all hooks 
-- supabase     # supabase root
-- store        #zustand store
-- providers     # Providers
-- validation     # all zod related schemas
```

