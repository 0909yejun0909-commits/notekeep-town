# Sunday, minute by minute — Track A

This is one person's script: whoever runs Track A. The other three tracks paste a prompt and
build; Track A runs the clock, the repo and the gates as well.

Everything here assumes the prep repo is cloned at `~/Projects/Claude Build Day` and the art
packs are unzipped at `~/kenmi-art`.

---

## 16:30 — before you leave

```bash
cd ~/"Projects/Claude Build Day" && git pull
ls ~/kenmi-art                 # the art must actually be there
open docs/PROMPTS.md           # stays open in a tab all night
```

Run of show open on your phone. Demo laptop in the room, charged, and it is **not** yours.

---

## 17:00 — 0:00. One paste, everyone else hands off.

```bash
mkdir ~/notekeep-town && cd ~/notekeep-town
git init
gh repo create notekeep-town --private --source=. --remote=origin
```

Open a **brand new** session in `~/notekeep-town`. No prior conversation, nothing pre-loaded.

Paste, as one message: **Prompt 0**, then the whole of `docs/ASSETS.md` where the prompt says
`[paste the filled-in contents of docs/ASSETS.md here]`.

Then say out loud: *"Prompt 0 is running. Nobody opens a session in the repo until I say."*

While it runs, watch for three things and interrupt for nothing else:

- [ ] `package.json` says `phaser@^3.90.0`, not `^4`
- [ ] `CLAUDE.md` at the repo root, with the asset manifest appended
- [ ] all four scenes registered in `game/config.ts`

---

## ~0:08 — when Prompt 0 says it's done

Friday's pretest measured the agent's actual work at about four minutes. The rest of this
budget is the manual steps below, which don't get faster on a shorter clock.

```bash
cd ~/notekeep-town
npm run dev                    # picker opens, canvas mounts, no console errors
npx tsc --noEmit
```

Then the two steps the agent doesn't know about:

```bash
~/"Projects/Claude Build Day"/scripts/install-assets.sh public/assets
# expect: copied 97 files into public/assets

printf '/public/assets/\n' >> .gitignore
cp ~/"Projects/Claude Build Day"/demo-vault.zip .
```

The gitignore line is the licence — Kenmi's terms forbid redistribution, so the art never gets
committed even to a private repo.

---

## 0:12 — the gate

```bash
git add -A && git commit -m "foundation" && git push -u origin main
git checkout -b track-a
```

Out loud: **"Main is pushed. Pull, branch, open a fresh session in the repo, paste your track
prompt."**

Nobody starts before that sentence. A session opened at 0:05 has no `CLAUDE.md` in context and
stays that way for the whole ninety minutes.

---

## 0:14 — your second job

A **new** session in the repo — not a continuation of the Prompt 0 conversation. Paste the
**Track A — Vault parser** prompt, nothing else.

From here you commit every ten minutes and stay out of everyone else's files.

---

## The times you call out loud

The build is **ninety minutes**, not three hours. Every gate below is roughly half where it
used to be, and the parallel build window — gate to freeze — is only **53 minutes**.

| Gun time | Call |
| --- | --- |
| **0:40** | Is a character walking? Ask every track where they are. This is the only moment you hand out stretch items. |
| **1:05** | Freeze and push. Everyone, whatever state it's in. |
| **1:18** | Merge done, B → C → D. You drive it. |
| **1:25** | Golden path on the demo laptop, start to finish, out loud. |

The 0:40 call changed shape. The prompts are already cut to the demo's six beats, so there is
nothing left for a late track to drop — what's in front of them *is* the floor. That makes 0:40
the opposite gate: the only point in the build where you hand anything **out**. A track that
reports finished gets exactly one item from the appendix in `PROMPTS.md`, named by you, and
only that one. Everybody else you leave alone. If B still isn't walking at 0:40, the fallback is
in B's own prompt — step 1 plus houses with no labels — and you say it out loud rather than
letting them find it.

The merge also gets 13 minutes instead of 25, which only works if the tracks are cleanly
separated. If Sunday morning's merge runs long, fix the file ownership table before the freeze,
not the merge.

---

## Three sentences to have ready

> Close that session and open a new one — it won't have `CLAUDE.md`.

> `game/gridMovement.ts` already exists and exports GridMovement. Read it and use it.

> That file belongs to another track. Revert your changes to it and work around the problem in
> a file you own.
