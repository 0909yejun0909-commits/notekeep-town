# The prompts

**How to use this file on Sunday:** paste the [shared context block](#shared-context-block)
first, then your own track's prompt underneath it, as **one single message** to Fable.

The [run of show](https://claude.ai/artifact/MLycCDD6BJNFkoCyaH1HFH) has the same prompts with
copy buttons that join the two parts for you — that's easier on the day than copying twice.

> **Frozen after Friday 18 September.** Anything below can change during Friday's review and
> Saturday's rehearsal. After that, nobody edits these mid-build — if a prompt is wrong on
> Sunday, correct it in the chat with Fable, don't rewrite the file.

---

## Order of operations

| Time | Who | Prompt |
| --- | --- | --- |
| 0:00 | Track A **alone** | [Prompt 0 — Foundation](#prompt-0--foundation) |
| 0:20 | — | A pushes to `main`. Everyone else pulls and branches. |
| 0:25 | Track A | [Vault parser](#track-a--vault-parser) |
| 0:25 | Track B | [Overworld](#track-b--overworld) |
| 0:25 | Track C | [Interiors & note reader](#track-c--interiors--note-reader) |
| 0:25 | Track D | [Character, NPCs & ship](#track-d--character-npcs--ship) |

While A runs Prompt 0, **B/C/D are not idle** — unzip assets, open the manifest, confirm the
directory picker works in your Chrome, get your prompt on the clipboard. Don't write code yet.

---

## Shared context block

Prepend this to **every** prompt below. Paste the asset manifest from
[`ASSETS.md`](ASSETS.md) at the end of it.

```text
PROJECT: Notekeep Town — a Stardew/Pokemon-style pixel overworld generated from the
user's real Obsidian vault. Folders become regions, houses and rooms. Notes become
furniture you walk up to and open.

STACK — locked, do not substitute:
- Next.js (App Router) + TypeScript + Tailwind
- Phaser 3, pinned at phaser@^3.90.0. NEVER install phaser v4 — it breaks every
  v3 scene API we use. If package.json says ^4, stop and fix it first.
- NO database, NO auth, NO backend for the core loop. The vault is read from the
  user's own disk with the File System Access API (showDirectoryPicker).
  Everything is client-side.

BEFORE WRITING NEXT.JS CODE: this repo uses a Next.js version with breaking changes
from what you may have memorised. Read the relevant guide in node_modules/next/dist/docs/
before generating routing, layout or data-fetching code.

ART: Kenmi "Cute Fantasy" 16x16 top-down packs, already in /public/assets/.
The asset manifest is pasted at the end of this prompt. NEVER guess a frame index
or a sheet dimension — every number you need is in the manifest.

PHASER CONFIG — required, non-negotiable:
  pixelArt: true, roundPixels: true, antialias: false
  Integer zoom only (use 3). Never a fractional scale — it turns pixel art to mush.
  Tiles are 16x16. The player is 2 tiles tall.

THE WORLD MODEL — the shared contract. Every track imports these from lib/types.ts.
Nobody redefines them, nobody adds fields without telling the others.

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

  // Content is loaded lazily — never read every file up front.
  export type VaultHandle = {
    world: WorldModel;
    readNote: (id: string) => Promise<string>;         // raw markdown
    readBinary: (path: string) => Promise<Blob>;       // embedded images/video
  };

FOLDER → WORLD MAPPING:
  depth 1 folder    → Region
  depth 2 folder    → House
  depth 3+ folder   → Room   (anything deeper flattens into its nearest room)
  loose .md at depth 2 → goes into a default room named "Main"
  .md file          → NoteRef
  Any number of folders at any depth must work. Nothing is hardcoded, no fixed
  counts, no assumptions about how many regions or houses exist.

DERIVED VALUES — deterministic, so the same vault always builds the same town:
  biome    = BIOMES[hash(region.name) % BIOMES.length]
  variant  = hash(house.name) % 5
  furniture= FURNITURE[hash(note.id) % FURNITURE.length]
  Use a simple stable string hash (djb2 is fine). Never Math.random() for
  anything that should persist between reloads.

CONVENTIONS:
- Phaser scenes in game/scenes/. Shared game helpers in game/. React UI in components/.
- All user-facing UI is React overlaid on the canvas. Never build UI inside Phaser.
- Do NOT write a README, tests, comments explaining what code does, or documentation.
  We have three hours.
- Do NOT refactor or touch files outside the ones this prompt names.
```

---

## Prompt 0 — Foundation

**Track A runs this alone, at 0:00.** Everyone else is blocked until it's pushed.

```text
TASK — FOUNDATION. You have 20 minutes. Three other people are blocked until this
is pushed, so build exactly this and nothing more.

1. Scaffold a Next.js + TypeScript + Tailwind app in the current empty directory.
   Install phaser@^3.90.0 explicitly. Also install every dependency the whole
   project will need, so nobody has to touch package.json after this commit:
   react-markdown, remark-gfm.

2. Create lib/types.ts containing the world model types from the context block
   above, verbatim, plus the djb2 hash helper and the BIOMES / FURNITURE arrays.

3. Create app/page.tsx: a full-viewport dark page with a centred "Open your vault"
   button. Clicking it calls showDirectoryPicker() and logs the handle. Mount the
   Phaser game in a client component that dynamically imports Phaser with
   ssr: false (Phaser touches window and will crash during SSR otherwise).

4. Create game/config.ts with the required Phaser config, and REGISTER ALL FOUR
   SCENES NOW as empty stubs so nobody has to edit this file again:
     game/scenes/BootScene.ts       — loads assets per the manifest, then starts Overworld
     game/scenes/OverworldScene.ts  — empty stub, class extends Phaser.Scene
     game/scenes/InteriorScene.ts   — empty stub
     game/scenes/TitleScene.ts      — empty stub

5. Create game/gridMovement.ts — a shared, reusable grid movement helper that both
   the overworld and interior scenes will import:
     - 16px grid, arrow keys and WASD
     - the sprite tweens smoothly between tile centres, one tile per press,
       input locked until the tween finishes (this is how Pokemon Gen 3 moves —
       never free pixel movement)
     - takes a collision predicate (gx, gy) => boolean so each scene supplies
       its own walkability rules
     - drives a 4-direction walk animation and an idle frame on stop
   Export it as a class that a scene constructs with a sprite and a collision fn.

6. Create empty placeholder files so the other tracks never create them:
     game/tilemap.ts, game/paletteSwap.ts, game/npc.ts,
     components/NoteReader.tsx, components/CharacterCreator.tsx,
     lib/vault/parse.ts, lib/vault/open.ts
   Each exports one stub function with the right signature and a TODO body.

DEFINITION OF DONE: `npm run dev` serves a page, the button opens a directory
picker, a Phaser canvas mounts with no console errors, and `npx tsc --noEmit`
passes. Commit and push to main immediately — do not polish anything.
```

> **Why the stub files matter.** Every scene is registered and every dependency installed
> before anyone branches, so B/C/D only ever fill in the body of a file that already exists.
> Nobody touches `package.json` or the scene registry after 0:20 — which is where the merge
> conflicts would otherwise all happen.

---

## Track A — Vault parser

```text
TASK — VAULT PARSER. You own lib/vault/* and lib/types.ts. Do not touch any
scene file or component — other people are working in those right now.

1. lib/vault/open.ts — openVault(): Promise<VaultHandle>
   - calls showDirectoryPicker({ mode: 'read' })
   - recursively walks the directory handle, skipping any folder starting with "."
     (.obsidian, .trash) and any non-.md file except images and video
   - builds the WorldModel using the FOLDER → WORLD MAPPING and the DERIVED VALUES
     rules from the context block
   - returns readNote(id) and readBinary(path) that resolve file handles lazily
     and cache them in a Map — never read all files up front, a real vault can
     have thousands

2. Grid placement, and get this right because it drives everything visual:
   - Houses are laid out inside a region on a loose grid with jitter, minimum
     3 tiles apart so they never overlap, positions derived from the name hash
     so they are stable across reloads
   - Furniture is placed against room walls first, then the interior, again
     minimum 2 tiles apart and never on the door tile at the room's bottom centre
   - A region with 1 house and a region with 30 houses must both look deliberate.
     Scale the region's tile dimensions to the house count.

3. preview: strip markdown syntax, frontmatter and image embeds, then take the
   first 200 characters of plain prose.

4. Handle the failure cases quietly and usefully: an empty vault, a vault with
   no subfolders at all (put everything in one region, one house, one room), a
   folder with 500 notes, and a browser with no showDirectoryPicker (Safari and
   Firefox) — in that case show a one-line message offering the bundled demo
   vault instead of crashing.

5. Expose a React hook useVault() that holds the VaultHandle in context so the
   scenes and the note reader can both reach it.

DEFINITION OF DONE: pick the demo vault, and console.log(world) prints the correct
nested structure with every region, house, room and note in the right place, with
stable positions across two reloads. Push to main.
```

---

## Track B — Overworld

```text
TASK — OVERWORLD SCENE. You own game/scenes/OverworldScene.ts, game/tilemap.ts
and game/paletteSwap.ts. These files already exist as stubs — fill them in. Do
NOT edit game/config.ts, package.json, or anything in lib/ or components/.

Build in this order and commit after each step, because step 1 is the demo and
steps 4-5 are expendable.

1. WALKING FIRST. Render a hardcoded 30x20 grass tilemap from the terrain sheet
   and drop the player on it using the existing GridMovement helper from
   game/gridMovement.ts. Camera follows the player, clamped to the map bounds,
   with roundPixels so it never shows a half tile. Nothing else matters until
   this feels good — tune the tween duration until walking feels like Pokemon,
   roughly 150-180ms per tile.

2. Autotiling for terrain edges: grass meeting path meeting water needs corner
   and edge tiles, not hard squares. Use the manifest's edge tile indices. Sprinkle
   deterministic decoration — flowers, rocks, foliage — using the region name hash
   so the same region always looks the same.

3. Render houses from region.houses. Each house is a building sprite chosen by
   its variant, with a name label above it, a door tile at its bottom centre, and
   solid collision everywhere except the door. Stepping onto the door tile emits
   an event: this.events.emit('enter-house', house.id). Someone else handles what
   happens next — you just emit it.

4. Palette swap shader — this is the biome system. Write a Phaser pipeline that
   takes the one terrain tileset and remaps specific source colours to target
   colours at render time, so meadow / forest / desert / volcano / snow all come
   from the same PNG. Palette definitions go in game/paletteSwap.ts as plain
   hex arrays. Region biome comes from region.biome.

5. Season overlay: a tint plus a particle layer — snow, falling leaves, rain,
   fireflies. Particles are cheap and read instantly on a projector.

CUT ORDER IF YOU RUN LATE: drop 5, then 4 (ship meadow only), then 2. Never
compromise 1 or 3.

DEFINITION OF DONE: you can walk around a region, movement is grid-locked and
feels good, houses are visible with labels, and stepping on a door fires the
event. Push to track-b.
```

---

## Track C — Interiors & note reader

```text
TASK — INTERIORS AND NOTE READER. You own game/scenes/InteriorScene.ts and
components/NoteReader.tsx. Both exist as stubs. Do NOT edit OverworldScene,
game/config.ts, package.json or lib/.

This track contains the single most important moment in the demo: walking up to
a piece of furniture and reading a real note. Everything else is scenery.

1. InteriorScene receives a houseId, looks up the House in the world model, and
   renders its first room: a floor-and-wall tilemap sized to the note count, with
   a door tile at the bottom centre that returns to the overworld. Reuse the
   GridMovement helper from game/gridMovement.ts — do not write your own movement.

2. Render one furniture sprite per note at its gx/gy, using its furniture type.
   Walking onto the tile in front of a piece of furniture shows a small floating
   indicator above it. Pressing Space or Enter while it is showing opens that note.

3. If the house has more than one room, put doorways along the top wall, one per
   additional room, labelled with the room name. Walking through switches rooms
   within the same scene — do not create a scene per room.

4. components/NoteReader.tsx — a React overlay, NOT drawn in Phaser. It sits above
   the canvas, takes a NoteRef, calls readNote(id) from useVault(), and renders:
   - the markdown with react-markdown + remark-gfm: headings, lists, task
     checkboxes, code blocks, tables, blockquotes
   - Obsidian image embeds ![[image.png]] — resolve them through readBinary()
     and render as object URLs. Revoke the URLs on unmount.
   - embedded video the same way, in a <video controls> element
   - Escape closes it, and closing returns keyboard control to Phaser (remember
     to re-enable the scene's input — this is easy to forget and looks broken)

5. Style the overlay to match the pixel art: the Kenmi UI pack's 9-slice panel
   frame, image-rendering: pixelated, and a readable modern font for the note body
   itself. Do not use a pixel font for body text — long prose in a pixel font is
   unreadable on a projector, and this panel is what judges will actually read.

DEFINITION OF DONE: from inside a house you can walk to furniture, press Space,
and read a real note from the vault with its images rendering. Push to track-c.
```

---

## Track D — Character, NPCs & ship

```text
TASK — CHARACTER, NPCs, UI AND DEPLOY. You own components/CharacterCreator.tsx,
game/npc.ts, game/scenes/TitleScene.ts and app/api/npc/route.ts. Do NOT edit
OverworldScene, InteriorScene, NoteReader, or lib/.

You are also the person who makes sure this thing is actually deployed, so do
step 1 before anything else and re-deploy after every merge.

1. DEPLOY IMMEDIATELY. Get the current state of main onto Vercel in the first ten
   minutes, before it does anything interesting. A broken deploy discovered at
   2:50 ends the demo. Then bundle the demo vault as static JSON in /public so
   there is a "Try the demo town" path that works even if the directory picker
   fails on the demo machine.

2. Character customiser — layered sprites. The base character sheet plus hair,
   clothes and accessory layers drawn in the same frame order, composited in a
   Phaser container so they animate together. Six or so options per layer, plus a
   palette tint per layer. Persist the choice in localStorage wrapped in try/catch.
   Render it as a React panel on the title screen with a live animated preview.

3. NPCs — game/npc.ts. NPCs wander on the grid with a simple random walk that
   respects the same collision predicate. Walking up to one and pressing Space
   opens a dialogue box.

4. app/api/npc/route.ts — the dialogue. POST it up to 12 note titles and the
   region name; it returns one or two short lines of in-world village dialogue
   that reference what the person has actually been writing about. Think a
   villager gossiping: "Heard you've been buried in API redesigns again." Keep it
   under 30 words, warm, never sycophantic. Use the AI SDK with a fast model.
   Send only titles — never note bodies — and say so in the demo, because "does
   it read my notes" is the first question anyone will ask.
   If the API call fails, fall back to a canned line. Never show an error.

5. Title screen and UI skin: the Kenmi UI pack's panels and buttons applied to
   the dialogue box, the vault picker and the character creator, so the whole
   thing looks like one game rather than a web app with a canvas in it.

CUT ORDER IF YOU RUN LATE: drop 5, then 2. Keep 1 and 3-4 — the NPC line is the
cheapest "wow" in the whole build.

DEFINITION OF DONE: deployed URL works, a character you customised walks around,
and an NPC says something that is recognisably about your own notes. Push to track-d.
```

---

## If a prompt goes sideways

Don't re-explain the goal — that rarely helps. **Name the exact file and the exact existing
function it should be using.** Most Fable derailments on Sunday will be it reinventing
something another track already built, and the fix is one sentence pointing at the real thing.

Log every correction you have to make during Saturday's rehearsal, with the wording that
fixed it. If you had to say the same thing twice, it belongs in the shared context block.
