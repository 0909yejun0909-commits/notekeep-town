# Asset manifest

> **Status: EMPTY — to be filled in on Friday 18 September, once the packs are bought.**

This file gets pasted at the end of the shared context block in every Sunday prompt.

**Why it matters more than it looks like it should:** four Fable sessions will each write code
that slices the same spritesheets. If they each guess a different frame layout, the characters
walk sideways, furniture renders as fence posts, and you lose an hour at 1:40 to something
nobody can debug under pressure. Every number in here is a bug that can't happen.

**Rule for Sunday: never let Fable guess a frame index. If a number isn't in this file, stop
and add it.**

---

## How to fill this in

Kenmi's packs include `.aseprite` sources (worth the $2.99). Open them and **read** the frame
layout rather than eyeballing the PNG — Aseprite shows you exact tags, frame counts and cel
positions.

For each sheet you need: filename, pixel dimensions, tile/frame size, columns × rows, and what
each row means.

---

## Folder layout

Agree this Friday and don't deviate — the prompts reference these paths.

```
public/assets/
  terrain/        tilesets: grass, path, water, cliff, sand, snow
  buildings/      house exteriors
  interior/       floors, walls
  furniture/      desks, shelves, beds, chests, plants, paintings, lamps, rugs
  character/      player base + hair/clothes/accessory layers
  npc/            NPC sheets
  ui/             panels, buttons, dialogue frames
```

---

## Global

```text
TILE SIZE: 16x16
GAME ZOOM: 3 (integer only)
PLAYER SIZE: 16x32 (2 tiles tall)
```

---

## Terrain

```text
FILE: public/assets/terrain/<filename>.png
  dimensions:  <W>x<H>
  tile size:   16x16
  grid:        <cols> x <rows>

  Tile indices — fill in from Aseprite:
    grass (plain):      <n>
    grass variants:     <n>, <n>, <n>
    path:               <n>
    water:              <n>
    cliff:              <n>

  Autotile edge sets (index of the top-left tile of each 3x3 block):
    grass → path:       <n>
    grass → water:      <n>
    cliff edges:        <n>

  Decoration (non-colliding props to scatter):
    flowers:            <n>, <n>
    rocks:              <n>, <n>
    foliage:            <n>, <n>
```

---

## Character

The most error-prone sheet. Get the row order exactly right.

```text
FILE: public/assets/character/<filename>.png
  dimensions:  <W>x<H>
  frame size:  <W>x<H>
  grid:        <cols> x <rows>

  Row order (0-indexed) — CONFIRM, do not assume:
    row 0: idle down      frames <a>-<b>
    row 1: idle up        frames <a>-<b>
    row 2: idle left      frames <a>-<b>
    row 3: idle right     frames <a>-<b>
    row 4: walk down      frames <a>-<b>
    row 5: walk up        frames <a>-<b>
    row 6: walk left      frames <a>-<b>
    row 7: walk right     frames <a>-<b>

  Walk frame rate: <n> fps
  Is "left" a real row, or is it "right" flipped horizontally?  <yes/no>

LAYERS (for the character customiser — same frame order as the base):
  hair:        <file>, <n> options
  clothes:     <file>, <n> options
  accessory:   <file>, <n> options
```

---

## Buildings

```text
FILE: public/assets/buildings/<filename>.png
  dimensions:  <W>x<H>

  Building variants (0-4) — pixel rect of each, x,y,w,h:
    variant 0:  <x>,<y>,<w>,<h>
    variant 1:  <x>,<y>,<w>,<h>
    variant 2:  <x>,<y>,<w>,<h>
    variant 3:  <x>,<y>,<w>,<h>
    variant 4:  <x>,<y>,<w>,<h>

  Door tile offset within each building (tiles from its top-left):
    variant 0:  <dx>,<dy>
    ...
```

---

## Interior & furniture

```text
FILE: public/assets/interior/<filename>.png
  floor tiles:     <n>, <n>, <n>
  wall (top):      <n>
  wall (side):     <n>
  wall corners:    <n>, <n>
  doorway:         <n>

FILE: public/assets/furniture/<filename>.png
  Each of the 8 FurnitureId values → tile index and footprint in tiles:
    desk:       index <n>, <w>x<h>
    shelf:      index <n>, <w>x<h>
    bed:        index <n>, <w>x<h>
    chest:      index <n>, <w>x<h>
    plant:      index <n>, <w>x<h>
    painting:   index <n>, <w>x<h>
    lamp:       index <n>, <w>x<h>
    rug:        index <n>, <w>x<h>
```

---

## UI

```text
FILE: public/assets/ui/<filename>.png
  9-slice panel:    x,y,w,h = <...>   border insets = <n>px
  button (normal):  <...>
  button (hover):   <...>
  dialogue frame:   <...>
```

---

## Master palette

Used by the palette-swap shader (Track B) to generate every biome from one tileset.

```text
BASE (meadow) — source colours to remap:
  <#hex>, <#hex>, <#hex>, <#hex>, <#hex>

TARGETS, in the same order:
  forest:   <#hex>, <#hex>, <#hex>, <#hex>, <#hex>
  desert:   <#hex>, <#hex>, <#hex>, <#hex>, <#hex>
  volcano:  <#hex>, <#hex>, <#hex>, <#hex>, <#hex>
  snow:     <#hex>, <#hex>, <#hex>, <#hex>, <#hex>
```

Pull the base colours with a colour picker on the actual tileset — don't eyeball them. They
have to match the PNG exactly or the shader won't find them to swap.
