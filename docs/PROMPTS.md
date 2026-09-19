# The prompts

**How this works on Sunday:**

1. Track A pastes **Prompt 0**. Its first job is to write `CLAUDE.md` into the new repo.
2. From then on, every agent session opened in that repo **auto-loads `CLAUDE.md`** — the
   stack, the type contract, and the rules for working as one of four parallel agents.
3. So B, C and D paste **only their own track prompt**. Short. No context block to copy.

That's the whole design. The context lives in the repo, not in four people's clipboards.

> **Belt and braces:** every track prompt still opens with *"Read CLAUDE.md and docs/ASSETS.md
> first."* If auto-loading doesn't happen in whatever interface we're using on the day, the
> instruction covers it. Don't remove that line.

> **Frozen after Saturday's rehearsal.** If a prompt is wrong on Sunday, correct it in the
> chat — don't stop to edit this file.

---

## Order of operations

**The build is 90 minutes.** Gate at 0:12, freeze at 1:05 — a 53-minute parallel window.

**Every track prompt below is already cut to the bone.** What each agent can see is what
the demo needs and nothing else — no stretch goals, no defensive edge cases, no polish
passes. That is deliberate: an agent builds what is in front of it, and "cut it if you're
late" does not work when *late* is discovered at 0:40 with 25 minutes left. What came out
is in the [appendix](#appendix--the-stretch-list), and it gets handed out one item at a
time, by Track A, only to a track that has already finished.

| Time | Who | Paste |
| --- | --- | --- |
| 0:00 | Track A **alone** | [Prompt 0](#prompt-0--foundation) (includes the CLAUDE.md content + the asset manifest) |
| 0:12 | — | A pushes `main`. Everyone pulls, branches, and **opens a fresh session in the repo**. |
| 0:14 | Track A | [Vault parser](#track-a--vault-parser) |
| 0:14 | Track B | [Overworld](#track-b--overworld) |
| 0:14 | Track C | [Interiors & note reader](#track-c--interiors--note-reader) |
| 0:14 | Track D | [Character, NPCs & the demo machine](#track-d--character-npcs--the-demo-machine) |

While A runs Prompt 0, B/C/D unzip assets, confirm the directory picker works, and get their
prompt ready. **Don't open a session in the repo before 0:12** — there's nothing to load yet.

---

## Prompt 0 — Foundation

**Track A, alone, at 0:00.** Paste this, then paste the filled-in contents of
[`ASSETS.md`](ASSETS.md) where the prompt says to.

```text
You are bootstrapping a 90-minute, 4-person parallel build. Three other people are
blocked until this is pushed, and they lose a minute for every minute you take.
Build exactly what is listed and nothing more.

STEP 1 — FIRST, before any code, write this file to the repo root as CLAUDE.md,
verbatim, then append the asset manifest I paste at the end of this message under
a "## Asset manifest" heading:

---------------------------- BEGIN CLAUDE.md ----------------------------
# Notekeep Town

A Stardew/Pokemon-style pixel overworld generated from the user's real Obsidian
vault. Folders become regions, houses and rooms. Notes become furniture you walk
up to and open. Built live in 90 minutes by four agents working in parallel.

## Locked stack — never substitute

- Next.js (App Router) + TypeScript + Tailwind
- Phaser 3, pinned at phaser@^3.90.0. `npm install phaser` gives you v4, which
  breaks every v3 scene API in this project. If package.json ever says ^4, that
  is a bug — fix it before doing anything else.
- NO database, NO auth, NO backend, except one API route for NPC dialogue.
  The vault is read from the user's own disk with the File System Access API
  (showDirectoryPicker). Everything else is client-side.
- Phaser must be dynamically imported with ssr: false. It touches `window` at
  import time and crashes during server rendering.

Before writing Next.js code, read the relevant guide in node_modules/next/dist/docs/
— this Next.js version has breaking changes from what you may have memorised.

## Required Phaser config

pixelArt: true, roundPixels: true, antialias: false, integer zoom only (3).
Tiles are 16x16. The player is 2 tiles tall. Fractional scaling turns pixel art
to mush — never use it.

## The type contract

These live in lib/types.ts. Every track imports them from there. Nobody
redefines them and nobody adds or renames a field without telling the team.

  export type BiomeId = 'meadow' | 'forest' | 'desert' | 'volcano' | 'snow';
  export type FurnitureId =
    'desk' | 'shelf' | 'bed' | 'chest' | 'plant' | 'painting' | 'lamp' | 'rug';

  export type NoteRef = {
    id: string;        // path relative to vault root, e.g. "Work/Ideas/api.md"
    title: string;     // filename without extension
    furniture: FurnitureId;
    gx: number; gy: number;   // grid position inside its room
    preview: string;   // first 200 chars, plain text, no markdown syntax
  };

  export type Room  = { id: string; name: string; notes: NoteRef[] };

  export type House = {
    id: string; name: string;
    gx: number; gy: number;   // grid position inside its region
    variant: number;          // which building sprite, 0-4
    rooms: Room[];
  };

  export type Region = {
    id: string; name: string;
    biome: BiomeId;
    houses: House[];
  };

  export type WorldModel = { name: string; regions: Region[] };

  // Content loads lazily — never read every file up front.
  export type VaultHandle = {
    world: WorldModel;
    readNote: (id: string) => Promise<string>;
    readBinary: (path: string) => Promise<Blob>;
  };

## Folder to world mapping

  depth 1 folder       -> Region
  depth 2 folder       -> House
  depth 3+ folder      -> Room (anything deeper flattens into its nearest room)
  loose .md at depth 2 -> a default room named "Main"
  .md file             -> NoteRef

Any number of folders at any depth must work. Nothing hardcoded, no fixed counts,
no assumptions about how many regions or houses exist.

## Derived values — deterministic, so a vault always builds the same town

  biome     = BIOMES[hash(region.name) % BIOMES.length]
  variant   = hash(house.name) % 5
  furniture = FURNITURE[hash(note.id) % FURNITURE.length]

Use a stable string hash (djb2). Never Math.random() for anything that should
survive a reload.

## File ownership — four agents are working in this repo right now

  Track A  lib/types.ts, lib/vault/*, game/gridMovement.ts
  Track B  game/scenes/OverworldScene.ts, game/tilemap.ts
  Track C  game/scenes/InteriorScene.ts, components/NoteReader.tsx
  Track D  components/CharacterCreator.tsx, game/npc.ts,
           game/scenes/TitleScene.ts

  NOBODY   package.json, game/config.ts, game/bus.ts, app/page.tsx,
           app/layout.tsx, components/PhaserCanvas.tsx
           These six are written by the foundation commit and are FROZEN.
           They already import and mount every component and wire every
           event. If you think you need to edit one, you have misread your
           prompt — the hook you want is already there.

## How the pieces talk to each other

Phaser cannot render React and React cannot reach into a scene, so everything
crosses through game/bus.ts, a tiny typed emitter that exists before anyone
branches. You never edit it. You emit on it and you listen to it.

  bus.emit('enter-house', { houseId })   Overworld -> Interior   (Track B emits)
  bus.emit('exit-house')                 Interior  -> Overworld  (Track C emits)
  bus.emit('open-note',  { note })       Interior  -> React      (Track C emits)
  bus.emit('close-note')                 React     -> Interior   (NoteReader emits)
  bus.emit('talk-npc',   { npcId, line })   Overworld -> React   (Track D emits)

app/page.tsx already subscribes to open-note and talk-npc and already renders
<NoteReader> and <CharacterCreator>. The scene switch on enter-house / exit-house
is already wired. Fill in your component or your scene; the plumbing is done.

Never use this.events or this.scene.start() to cross a boundary. A scene-local
emitter is invisible to React and to the other three tracks.

## Operating rules

1. READ BEFORE YOU WRITE. Before implementing anything, read the files your
   prompt names and any file you are about to import from. Another agent has
   very likely already built the helper you are about to write. Reinventing
   something that already exists is the single most expensive mistake available
   to you today.

2. STAY IN YOUR LANE. Your prompt names the files you own. Do not create, edit,
   rename or refactor anything else — not to tidy up, not to fix a type error in
   someone else's file, not to improve an import. If a file you need is broken,
   say so and work around it.

3. NEVER EDIT THE FROZEN FILES listed above. Every dependency is installed,
   every scene registered, every component mounted and every event wired by the
   foundation commit. If you think you need a new dependency, you almost
   certainly do not — check package.json first, it is already there.

4. IF SOMETHING YOU NEED DOES NOT EXIST YET, STUB IT LOCALLY AND MOVE ON. Do not
   build it properly — another agent owns it and is building it right now.

5. COMMIT EVERY 10 MINUTES with a one-line message. Small diffs merge; large
   ones fight.

6. NO SCOPE CREEP. No tests, no README, no documentation, no comments explaining
   what code does, no error handling for cases that cannot happen, no
   abstractions for a second use case that does not exist. Ninety minutes.

7. WHEN BLOCKED, STOP AND SAY SO. Never silently invent an alternative
   architecture.

## Conventions

Phaser scenes in game/scenes/. Shared game helpers in game/. React UI in
components/. All user-facing UI is React overlaid on the canvas — never build UI
inside Phaser.

## Asset manifest

Never guess a frame index or a sheet dimension. Every number is below. If a
number you need is missing, stop and ask — do not estimate.
----------------------------- END CLAUDE.md -----------------------------

STEP 2 — Scaffold a Next.js + TypeScript + Tailwind app in this empty directory.
Install phaser@^3.90.0 explicitly, plus every dependency the whole project will
need so nobody touches package.json again:
  phaser@^3.90.0
  react-markdown
  remark-gfm
Confirm .env* is in .gitignore. There is no API key and no server route today
— NPC dialogue is a hardcoded line, not a model call. See Track D.

STEP 3 — Create lib/types.ts with the type contract above verbatim, plus the
djb2 hash helper and the BIOMES / FURNITURE arrays.

STEP 4 — Create game/bus.ts, the typed emitter described in CLAUDE.md above.
Roughly twenty lines: a module-level emitter, an on/off/emit trio, and an event
map covering enter-house, exit-house, open-note, close-note and talk-npc. No
dependency — a Map of Sets of callbacks is enough. Everything else in this file
list depends on it, so write it before them.

STEP 5 — Create app/page.tsx. This is the file that makes four people's work
appear on one screen, and nobody may edit it after you, so wire ALL of it now
even though every component is still a stub:
  - everything wrapped in <VaultProvider> imported from lib/vault/open.ts, so
    Track A's useVault() hook has a provider without editing this file
  - a full-viewport dark page with a centred "Open your vault" button that calls
    openVault() from lib/vault/open.ts, plus a "Try the demo town" button
  - the Phaser canvas in components/PhaserCanvas.tsx (a new frozen file — add
    it to the NOBODY list in CLAUDE.md alongside the other five), dynamically
    imported into page.tsx with ssr: false
  - <CharacterCreator visible={!vault} /> rendered over the canvas — visible is
    the only prop it takes, true until the vault opens, then false
  - <NoteReader note={openNote} /> rendered over the canvas, mounted when a
    bus 'open-note' arrives and unmounted on 'close-note'
  - a bus listener for 'talk-npc' that renders a dialogue <div> showing the
    `line` field straight off the event payload — plain markup is fine, Track D
    supplies the text by emitting it, not by you looking anything up
It must compile and run with every component still a TODO stub. A stub that
renders null is correct at this stage.

STEP 6 — Create game/config.ts with the required Phaser config, REGISTER ALL
FOUR SCENES NOW as stubs so nobody edits this file again, and wire the scene
switch on the bus: 'enter-house' starts InteriorScene with { houseId },
'exit-house' returns to OverworldScene. Do this here, not in a scene — no track
owns both sides of that transition.
  game/scenes/BootScene.ts       loads assets per the manifest, starts Overworld
  game/scenes/OverworldScene.ts  stub extending Phaser.Scene
  game/scenes/InteriorScene.ts   stub
  game/scenes/TitleScene.ts      stub

STEP 7 — Create game/gridMovement.ts, the shared movement helper both the
overworld and interior scenes will import:
  - 16px grid, arrow keys and WASD
  - tweens between tile centres, one tile per press, input locked until the
    tween finishes (Pokemon Gen 3 movement — never free pixel movement)
  - takes a collision predicate (gx, gy) => boolean so each scene supplies its
    own walkability rules
  - drives a 4-direction walk animation and an idle frame on stop
Export it as a class constructed with a sprite and a collision function.

STEP 8 — Create stub files so no other track ever has to create them:
  game/tilemap.ts, game/npc.ts,
  components/NoteReader.tsx, components/CharacterCreator.tsx,
  lib/vault/parse.ts, lib/vault/open.ts
Each exports one function with the correct signature and a TODO body. Two of
these matter more than the rest:
  - the two components must render null without throwing, because app/page.tsx
    already mounts them
  - lib/vault/open.ts must export VaultProvider and useVault as well as
    openVault, because app/page.tsx already wraps the tree in the provider
  - game/npc.ts must export spawnNpcs(scene, region) as a no-op, because
    OverworldScene will call it and Track D may not edit that file

STEP 9 — Write docs/ASSETS.md containing the manifest I pasted, so other tracks
can read it from disk.

DEFINITION OF DONE: `npm run dev` serves the page, the button opens a directory
picker, a Phaser canvas mounts with no console errors, `npx tsc --noEmit` passes,
and CLAUDE.md exists at the repo root. Commit and push to main immediately.
Do not polish anything.

THE ASSET MANIFEST FOLLOWS — append it to CLAUDE.md and write it to docs/ASSETS.md:

[paste docs/ASSETS.md here, DOWN TO THE "END OF PASTE" LINE AND NO FURTHER —
everything below that line documents features that were cut]
```

---

## Track A — Vault parser

```text
Read CLAUDE.md and docs/ASSETS.md first. You are Track A.

Build lib/vault/*. Do not touch any scene file or component — other agents are
working in those right now.

1. lib/vault/open.ts — openVault(): Promise<VaultHandle>
   - calls showDirectoryPicker({ mode: 'read' })
   - recursively walks the handle, skipping folders starting with "." (.obsidian,
     .trash) and non-.md files except images and video
   - builds the WorldModel using the folder mapping and derived values in CLAUDE.md
   - readNote(id) and readBinary(path) resolve file handles lazily and cache them
     in a Map. Never read every file up front — a real vault has thousands.

2. Grid placement. This drives everything visual, so get it right:
   - Houses sit on a loose grid with jitter inside their region, minimum 3 tiles
     apart so they never overlap, positions derived from the name hash so they
     are stable across reloads.
   - Furniture goes against room walls first, then the interior, minimum 2 tiles
     apart, never on the door tile at the room's bottom centre.
   - A region with 1 house and a region with 30 houses must both look deliberate.
     Scale region dimensions to house count.

3. preview: strip frontmatter, markdown syntax and image embeds, then take the
   first 200 characters of plain prose.

4. One try/catch around openVault, falling back to the bundled demo vault. That
   is the whole of this track's defensive work. We present on one laptop, in
   Chrome, with a vault we chose — do not write handling for empty vaults, for
   vaults with no subfolders, or for a folder with 500 notes. Those break
   off-camera or not at all, and you are the critical path.

5. Fill in VaultProvider and useVault() in lib/vault/open.ts — both already exist
   as stubs and app/page.tsx already wraps the tree in the provider, so do not
   touch app/. The provider holds the VaultHandle in context; scenes and the note
   reader both read it through the hook. Getting this right unblocks Tracks B and
   C, so do it before step 3 or 4 if you are running behind.

DONE WHEN: you pick the demo vault and console.log(world) shows the correct
nested structure, with positions identical across two reloads. Push to main.
```

---

## Track B — Overworld

```text
Read CLAUDE.md and docs/ASSETS.md first. You are Track B.

Fill in game/scenes/OverworldScene.ts and game/tilemap.ts. They already exist
as stubs. game/gridMovement.ts already exists too — read it and use it. Do not
write your own movement code.

These two steps are the entire track. The demo vault has one biome (meadow) and
simple houses — there is nothing else you need to build. Commit after each.

1. WALKING FIRST. Render a hardcoded 30x20 grass tilemap from the terrain sheet
   and put the player on it using the existing GridMovement class. Camera follows,
   clamped to map bounds. Nothing else matters until this feels right — tune the
   tween until walking feels like Pokemon, roughly 150-180ms per tile.

2. Houses from region.houses. Each is a building sprite chosen by its variant,
   a name label above it, a door tile at its bottom centre, solid collision
   everywhere except the door. Stepping on the door calls
   bus.emit('enter-house', { houseId: house.id }) — import the bus from
   game/bus.ts. The scene switch is already wired in game/config.ts; you only
   emit. Do NOT use this.events and do NOT call this.scene.start() yourself.
   The demo vault only has two houses, but region.houses can be any length —
   don't hardcode a count.

   One extra line at the end of create(): call spawnNpcs(this, region) from
   game/npc.ts. It is a stub that does nothing until Track D fills it in, and it
   is the only way NPCs can reach your scene — Track D is not allowed to edit
   OverworldScene. Write the call, don't write the function.

There is no step 3. Do not add autotiling, extra biomes, weather, particles or
decoration passes. If both steps are solid and you still have time, say so and
wait to be handed more — do not invent it.

CUT ORDER IF LATE: there is nothing left to cut. If you are behind at 0:40, ship
step 1 and give the houses plain collision boxes without labels.

DONE WHEN: you can walk a region, movement is grid-locked and feels good, houses
show with labels, and a door fires the event. Push to track-b.
```

---

## Track C — Interiors & note reader

```text
Read CLAUDE.md and docs/ASSETS.md first. You are Track C.

Fill in game/scenes/InteriorScene.ts and components/NoteReader.tsx. Both exist as
stubs. game/gridMovement.ts already exists — read it and use it, do not write
your own movement. Do not touch OverworldScene or anything in lib/.

This track holds the single most important moment in the demo: walking up to a
piece of furniture and reading a real note. Everything else is scenery.

Every house in the demo vault has exactly one room. Render the first room and
stop — no multi-room doorways, no room switching. If a house has more rooms,
they are not reachable today and that is fine.

1. InteriorScene reads houseId from its scene data (game/config.ts passes it in
   on the bus 'enter-house' event — you do not wire that), looks up the House,
   and renders its first room: a floor-and-wall tilemap sized to the note count,
   with a door at bottom centre. Stepping on the door calls bus.emit('exit-house')
   — never this.scene.start().

2. One furniture sprite per note at its gx/gy, by furniture type. Standing on the
   tile in front of it shows a small floating indicator. Space or Enter calls
   bus.emit('open-note', { note }). app/page.tsx is already listening and will
   mount your NoteReader — you do not render React from inside Phaser.

3. components/NoteReader.tsx — a React overlay ABOVE the canvas, never drawn in
   Phaser. It is ALREADY MOUNTED by app/page.tsx; you are filling in the stub,
   not wiring it up. Takes a NoteRef, calls readNote(id) from useVault(), renders:
   - markdown via react-markdown + remark-gfm: headings, lists, task checkboxes,
     code blocks, tables, blockquotes
   - Obsidian embeds ![[image.png]] resolved through readBinary() as object URLs,
     revoked on unmount
   - video the same way, in <video controls>
   - Escape closes it via bus.emit('close-note'), and closing RE-ENABLES Phaser
     keyboard input. Forgetting this is the most common way this feature looks
     broken.

4. Style it to match the art: the UI pack's 9-slice panel frame,
   image-rendering: pixelated. But use a readable modern font for the note body —
   prose in a pixel font is unreadable on a projector, and this panel is what
   judges actually read. You own the only skinned panel in the build — Track D
   is not styling anything, so do not wait for a shared component.

CUT ORDER IF LATE: drop 4. Never compromise 1, 2 or 3.

DONE WHEN: from inside a house you walk to furniture, press Space, and read a
real vault note with its images rendering. Push to track-c.
```

---

## Track D — Character, NPCs & the demo machine

```text
Read CLAUDE.md and docs/ASSETS.md first. You are Track D.

Fill in components/CharacterCreator.tsx, game/npc.ts and game/scenes/TitleScene.ts.
Do not touch OverworldScene, InteriorScene, NoteReader or lib/.

You also own the demo working on the day, so do step 1 before anything else and
re-check it after every merge.

1. THE DEMO MACHINE FIRST. We present by screen-sharing one laptop running it
   locally — there is no deploy. In the first five minutes, confirm `npm run dev`
   serves main on that laptop with no console errors, and re-confirm after every
   merge. A build that only works on someone else's machine, found at 1:25, ends
   the demo. Then bundle the demo vault as static JSON in /public so there is a
   "Try the demo town" path that works even if the directory picker fails.

2. Character — ONE fixed outfit, nothing the user picks. base.png is an
   unclothed body, so you do need a Phaser container compositing base + shoes +
   pants + shirt + hair. Every layer shares the base's grid and frame indices,
   so they animate together for free — set them all to the same frame.
   HARDCODE shoes, pants, shirt and hair to one look you choose — there is no
   colour picker and no swatch UI at all. CharacterCreator.tsx is ALREADY
   MOUNTED by app/page.tsx as <CharacterCreator visible={...} /> — visible is
   the only prop it takes, true until the vault opens. Fill in the stub against
   that signature: a live animated preview of the fixed outfit and nothing to
   interact with beyond however the user proceeds past it. Do not wire it up
   and do not edit app/page.tsx.

   Do NOT build a customiser of any kind — no shirt colour, no hair style, no
   shoe or trouser options, no palette tinting. The manifest lists 15,360
   combinations; you are shipping one. This feature appears in none of the six
   demo beats.

3. NPCs in game/npc.ts. Export spawnNpcs(scene, region) — OverworldScene already
   calls it and you may not edit that file, so everything you do happens inside
   this one function. Spawn EXACTLY TWO NPCs that wander the grid with a
   random walk respecting the same collision predicate. Give each NPC a fixed
   id (e.g. 'farmer_bob'). Walk up to one, press Space, and call
   bus.emit('talk-npc', { npcId, line }) — app/page.tsx already listens and
   renders the dialogue box using `line` directly. Never render UI inside
   Phaser.

4. Dialogue is a HARDCODED LINE, not a model call — there is no AI here and no
   API route. Keep a small id -> string map inside game/npc.ts, at least one
   line per NPC, in-world village flavour, e.g. "Heard you've been buried in
   your notes again." Look the line up by npcId and put it straight in the
   emit above. No network call, no key, nothing that can fail on venue wifi.

There is no step 5. Do not skin the title screen, the dialogue box or the vault
picker with the UI pack — Track C owns the one panel that gets styled today.
Plain, legible HTML is the correct finish for everything you own.

CUT ORDER IF LATE: there is nothing left to cut in 2 — it's one texture, not a
picker. If you are behind at 0:40, ship 1 and 2 and drop to one NPC in 3, with 4
covering just that one.

DONE WHEN: main runs on the demo laptop, your character walks around in its
fixed outfit, and both NPCs each say their own hardcoded line when you talk to
them. Push to track-d.
```

---

## Appendix — the stretch list

**Nobody pastes this at 0:14.** It is here so the work is written down, not so it gets
built. Track A hands a single item to a single track, by name, only if that track reports
its own prompt finished before **0:40**. One item at a time. A track that receives one and
then misses the freeze has cost the demo more than the item was worth.

Everything below was cut because it appears in none of the six golden-path beats
(`REHEARSAL.md`) and the parallel window is 53 minutes.

**B — autotiling.** Grass meeting path meeting water needs edge and corner tiles, not hard
squares. Use the manifest's edge indices. Scatter deterministic decoration — flowers, rocks,
foliage — from the region name hash.

**B — the other four biomes.** Load the five hand-drawn terrain tilesets (one per BiomeId)
per the per-biome descriptor in `ASSETS.md` and pick by `region.biome`. Each sheet has its
own size and edge-index origin, so use a per-biome descriptor rather than one shared index
table. No shader, just five images. The demo vault only ever exercises meadow.

**B — season overlay.** A tint plus a particle layer (snow, leaves, rain, fireflies). Cheap,
and reads instantly on a projector.

**C — multi-room houses.** Labelled doorways along the top wall, one per additional room,
walking through switches rooms *within the same scene* — never a scene per room.

**D — the real character customiser.** Per-layer pickers over all of it: 6 hair styles x 5
hair colours x 8 shoes x 8 pants x 8 shirts, the full 15,360 in `ASSETS.md`. The shipped
build hardcodes all of it to one fixed outfit — not even a shirt colour. This is the
largest single item on the list; treat it as unreachable on the day.

**D — full UI skin.** The UI pack's panels and buttons on the dialogue box, vault picker and
title screen, so it reads as one game rather than a web app with a canvas in it.

**D — AI-generated NPC dialogue.** Cut on the 19th as too much live-demo risk for beat 6: an
`app/api/npc/route.ts` calling `@anthropic-ai/sdk` (`claude-haiku-4-5-20251001`, max_tokens 100)
with up to 12 real note titles plus the region name, returning a line that references what the
person has actually been writing about, with a canned-line fallback on any failure. Needs
`@anthropic-ai/sdk` added to package.json (not installed by Prompt 0 today) and an API key
pasted into `.env.local` on the demo laptop. Treat as unreachable unless handed out very early —
it needs a working route, a key, and live wifi, none of which get tested before the merge.

---

## When a prompt goes sideways

Don't re-explain the goal — that almost never works. **Name the exact file and the exact
existing function it should be using.** Nearly every derailment is an agent reinventing
something another track already built, and one sentence pointing at the real file fixes it.

Recovery phrases that work, collected during rehearsal:

> `game/gridMovement.ts` already exists and exports the GridMovement class. Read it and use
> it instead of writing movement code.

> That file belongs to another track. Revert your changes to it and work around the problem
> in a file you own.

> Stop. Check CLAUDE.md — the type you want is already defined in lib/types.ts.

Add to this list on Saturday.
