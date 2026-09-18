# Get your machine ready

**Do all of this before Saturday morning.** Every minute spent installing something on Sunday
is a minute not spent building.

---

## 1. Tools

| What | Check | Notes |
| --- | --- | --- |
| Node 20+ | `node -v` | |
| git | `git -v` | |
| **Google Chrome** | — | Required. The app depends on an API Safari and Firefox don't have. |
| Obsidian | — | Only needed to make/edit the demo vault. The app itself doesn't need it installed. |
| Fable access | — | **Log in and send one test prompt.** Don't discover a broken seat at 0:00. |

---

## 2. Verify the directory picker

The entire app rests on one browser API. Confirm it works in *your* Chrome before Saturday.

Open Chrome → DevTools console on any `https://` page (or `localhost`) and run:

```js
typeof window.showDirectoryPicker
```

You want `"function"`. If you get `"undefined"`:

- You're not in Chrome or Edge → switch browsers
- You're on an `http://` page that isn't localhost → the API needs a secure context
- You're in an iframe → won't work, open the page directly

Then check it actually opens:

```js
await window.showDirectoryPicker()
```

A folder chooser should appear. **It only works from a real user gesture** (a click), so if
you call it from a `setTimeout` or on page load it'll throw — that's expected, not a bug.

---

## 3. Clone this repo

```bash
git clone https://github.com/0909yejun0909-commits/notekeep-town.git
cd notekeep-town
```

Don't run `npm install` — you don't need to. **This repo's code is a dead scaffold**, see the
README. You're only here for the docs.

---

## 4. Art assets

Jason buys these Friday and shares the zip. Once you have it:

```
/public/assets/          ← this is where it goes on Sunday
```

Unzip it somewhere you can find fast, because at 0:00 on Sunday you'll be copying it into a
brand new project directory while the clock runs.

**Licence:** Kenmi's premium licence permits commercial use and modification but **forbids
redistribution, even modified**. Keep Sunday's repo private, or gitignore `/public/assets/`.
Don't commit the art to anything public.

---

## 5. The demo vault

Already built — it's `demo-vault/` in this repo (also zipped as `demo-vault.zip`), a real
Obsidian-shaped vault, deliberately kept to the demo's baseline scope: **1 region (1 biome),
2 houses, 1 room each, 6 notes total.** It travels to Sunday's repo (see the README) as
`demo-vault.zip`.

Why so small: the code (vault parser, tilemap, interiors) must still handle any number of
regions/houses/rooms — that's in the type contract and isn't cut. But the demo vault only
needs to exercise the golden path, and a bigger vault just means more building and more
tokens spent on scenery nobody's testing against. Multi-biome tilesets and multi-room houses
are stretch goals per the track prompts, not things the demo vault needs to prove out.

Unzip it somewhere you can find fast — you'll point the app at it constantly during
Saturday's rehearsal, and it's the fallback when your own vault isn't handy for a demo.

Folder names became place names in the game (Riverside Hollow), so they're chosen to look
good on a projector, not to be realistic. No embedded images — keeping it plain text keeps
the vault parser simple to test against.

---

## 6. One environment variable

Only **Track D** needs this, for NPC dialogue:

```
AI_GATEWAY_API_KEY=...
```

Track D: have this ready before Sunday. Everyone else needs nothing — there's no database, no
auth, no Supabase, no `.env` file at all.

---

## Before you close the laptop Friday night

- [ ] Fable responds to a test prompt
- [ ] `typeof window.showDirectoryPicker === "function"` in your Chrome
- [ ] Asset zip downloaded and unzipped
- [ ] Demo vault downloaded and unzipped
- [ ] You've read [`PROMPTS.md`](PROMPTS.md) — the shared context block **and** your own track
- [ ] Your name is in the track table in the [README](../README.md)
- [ ] You've read the [run of show](https://claude.ai/artifact/MLycCDD6BJNFkoCyaH1HFH) so
      Sunday's gates and cut order aren't a surprise
