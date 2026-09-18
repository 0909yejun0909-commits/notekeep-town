# Notekeep Town

Point the app at your real Obsidian vault and your folders become a walkable pixel town.
Regions, houses, rooms — and every note is a piece of furniture you walk up to and read.

**Build Day is Sunday 20 September 2026. Four people, four parallel Fable sessions.**

The event runs 17:00–20:00, but **only 90 minutes of that is building** — the rest is setup,
presentation and judging. Every gate in these docs is built around a 90-minute clock with a
53-minute parallel window. Each participant gets $100 of Fable API credit on the day.

---

## Read this part first

> ### This repo is PREP ONLY. Nothing in it gets built on Sunday.
>
> The event rule: *"You can prepare the prompts you wish to use in advance, but unfinished
> products will not be allowed on-site. We will verify the project reports of the first-place
> winners."*
>
> So on Sunday we start from a **brand new, empty repository**. The commit history has to show
> the whole thing was built on the day.
>
> Exactly three things travel from this repo to Sunday's repo:
>
> 1. The **prompts** (`docs/PROMPTS.md`)
> 2. The **asset manifest** (`docs/ASSETS.md`)
> 3. The **demo vault** (`demo-vault/`, zipped as `demo-vault.zip`)
>
> Nothing else. Not the scaffold, not a single file of code.

### About the code that's already here

`app/`, `components/`, `lib/supabase/`, `lib/game/`, and `supabase/migrations/` are a scaffold
from an earlier version of this project that used Supabase and a database. **That architecture
is dead.** The current plan has no database, no auth, and no backend for the core loop — the
vault is read straight off your disk in the browser.

Treat that code as a museum piece. Do not build on it, do not copy from it on Sunday.

---

## What we're actually building

You click "Open your vault", Chrome asks you to pick a folder, and you hand it your real
Obsidian vault. The app walks the folder tree and generates a town from it:

| Your vault | Becomes |
| --- | --- |
| Top-level folder | A **region** with its own biome |
| Second-level folder | A **house** you can walk into |
| Third-level folder | A **room** inside that house |
| A `.md` note | A piece of **furniture** you walk up to and open |

Any number of folders, any depth. Nothing hardcoded. Walk up to a bookshelf, press Space,
and read the actual note — markdown, checkboxes, embedded images and video.

**Stack:** Next.js + TypeScript + Phaser 3 + the File System Access API. No database.
No auth. No backend, except one small API route for NPC dialogue.

**Art:** [Kenmi's Cute Fantasy](https://kenmi-art.itch.io/) 16×16 top-down packs.

---

## Your three days

| Day | What happens | Where |
| --- | --- | --- |
| **Friday 18** | Buy art, write the asset manifest, ratify the type contract. Demo vault already built (`demo-vault/`). **Then pre-test Prompt 0.** | [`docs/SETUP.md`](docs/SETUP.md) |
| **Saturday 19** | Run your own track solo and cold, no clock. Log every gap. | [`docs/REHEARSAL.md`](docs/REHEARSAL.md) |
| **Sunday 20** | One timed rehearsal run in the morning, then build it live in 90 minutes | [`docs/PROMPTS.md`](docs/PROMPTS.md) |

**Track A also has [`docs/DAY-OF.md`](docs/DAY-OF.md)** — the minute-by-minute script for the
person who runs the repo, the gates and the clock. The other three tracks don't need it.

📋 **[The full run of show is here](https://claude.ai/artifact/MLycCDD6BJNFkoCyaH1HFH)** — minute-by-minute
Sunday timeline, gates, cut order, and every prompt with a copy button.

---

## The four tracks

Split so no two people ever edit the same file.

| Track | Owner | What you build | Your files |
| --- | --- | --- | --- |
| **A** | *TBD* | Foundation, shared types, vault parser | `lib/types.ts`, `lib/vault/*`, `game/gridMovement.ts` |
| **B** | *TBD* | Overworld, walking, tilemaps, biomes | `game/scenes/OverworldScene.ts`, `game/tilemap.ts` |
| **C** | *TBD* | House interiors + the note reader | `game/scenes/InteriorScene.ts`, `components/NoteReader.tsx` |
| **D** | *TBD* | Demo machine, character colour, NPCs | `components/CharacterCreator.tsx`, `game/npc.ts`, `app/api/npc/route.ts` |

**Track A is the critical path.** Everyone is blocked until A pushes the foundation at 0:12.

Put your name in that table on Friday.

---

## How the prompts work

Your agent starts Sunday with **no context at all** — it hasn't read this repo or sat through
any of the planning. So the context doesn't live in the prompts. It lives in the repo:

**Prompt 0's first job is to write `CLAUDE.md` into the new repository.** Every session opened
in that repo afterwards auto-loads it — the locked stack, the type contract, file ownership,
and the rules for working as one of four parallel agents. Tracks B, C and D then paste only
their own short track prompt.

That's why you must not open a session in Sunday's repo before 0:12. There's nothing to
load yet.

---

## Before you do anything else

1. Read [`docs/SETUP.md`](docs/SETUP.md) and get your machine ready. **Do this before Saturday**,
   not on Sunday morning.
2. Read your own track's prompt in [`docs/PROMPTS.md`](docs/PROMPTS.md), end to end.
3. Read the `CLAUDE.md` block inside Prompt 0. It's the contract that makes four people's code
   fit together. If you disagree with anything in it, say so **Friday** — it freezes at 13:00
   on Sunday, after the morning's rehearsal runs.
4. Read [`docs/REHEARSAL.md`](docs/REHEARSAL.md) before Saturday, especially the cold-sessions
   rule. Rehearsing in a session that already knows the plan tests nothing.

---

## Two things that will bite you

**Phaser 4 breaks everything.** `npm install phaser` installs v4, which breaks every v3 scene
API we use. It must be `phaser@^3.90.0`. This is in the prompts, but check it at 0:12 anyway.

**The art licence forbids redistribution.** Kenmi's premium licence allows commercial use and
modification but not redistribution, even modified. So keep Sunday's repo **private**, or
gitignore the assets folder. Note the asset source in the project report.
