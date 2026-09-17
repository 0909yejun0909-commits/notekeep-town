@AGENTS.md

# Notekeep Town — agent context

Read `README.md` before acting on anything in this repo. The short version:

## This repo is preparation only

We are preparing for a 3-hour build event on **Sunday 20 September 2026**, where the project
must be built live from an empty repository. Event rule: prompts may be prepared in advance,
finished or unfinished code may not be brought on-site.

**Do not build the application in this repo.** If someone asks you to implement a feature of
Notekeep Town here, stop and tell them it belongs in Sunday's fresh repo. What belongs here
is planning material: prompts, the asset manifest, the demo vault, and docs.

The existing `app/`, `components/`, `lib/supabase/`, `lib/game/` and `supabase/migrations/`
directories are an **abandoned scaffold** from a previous Supabase-based architecture. That
plan is dead. Do not extend it, do not copy from it, and do not use it as a reference for
how the current project should be structured.

## What we're building on Sunday

A Phaser overworld generated from the user's real Obsidian vault, read from disk in the
browser via the File System Access API (`showDirectoryPicker`). Folder depth 1 → region,
depth 2 → house, depth 3+ → room, `.md` file → a piece of furniture you walk up to and read.

**Locked stack — never substitute:**

- Next.js (App Router) + TypeScript + Tailwind
- **`phaser@^3.90.0`** — `npm install phaser` gives you v4, which breaks every v3 scene API
  we use. If you ever see `^4` in package.json, that is a bug, fix it first.
- **No database, no auth, no backend** for the core loop. Everything is client-side. The only
  server code in the entire project is one API route for NPC dialogue.

**Required Phaser config:** `pixelArt: true`, `roundPixels: true`, `antialias: false`,
integer zoom only (3). Tiles are 16×16. Fractional scaling turns pixel art to mush.

**Phaser must be dynamically imported with `ssr: false`** — it touches `window` at import
time and will crash during server rendering.

## The type contract

`docs/PROMPTS.md` contains the shared context block with the full `WorldModel` type
definitions. Four people build four parts of this app in parallel against those types. They
are frozen after Friday 18 September. If a change seems necessary, raise it with the team —
do not silently add or rename a field.

## House style

- Phaser scenes in `game/scenes/`. Shared game helpers in `game/`. React UI in `components/`.
- All user-facing UI is React overlaid on the canvas. Never build UI inside Phaser.
- No README files, no tests, no explanatory comments, no documentation unless asked. The
  build window is three hours.
- Never edit a file that belongs to another track. Tracks and file ownership are in `README.md`.
