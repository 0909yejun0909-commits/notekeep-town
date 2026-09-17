# The rehearsal

**Saturday 19 September.** Three hours in the morning, a debrief in the afternoon.

---

## What you're actually testing

Not "can we build this app." You already know you can.

You're testing **whether a cold session can build it from the prompt alone** — because that's
the only situation that exists on Sunday. Your agent won't have read this repo, won't have sat
through the planning, won't know what the other three people are doing.

Everything below exists to make that test honest.

---

## The cardinal rule: cold sessions only

> **Every session in the rehearsal must start fresh, in an empty directory, with no prior
> conversation about this project.**

If you've spent the week discussing Notekeep Town with your agent and then rehearse in that
same session, you're testing a context you won't have on Sunday. The rehearsal will go
beautifully and Sunday will go badly, and you won't understand why.

Concretely:

- New chat / new session per track. Not a continuation.
- Empty directory. Not this repo.
- Paste the prompt. Nothing else. No "as we discussed", no "remember the plan".
- If you catch yourself explaining background that isn't in the prompt — **stop**. That's a
  finding. Write down what you were about to say; it belongs in `CLAUDE.md`.

That last one is the most valuable signal of the entire day. Every time you reach for context
the prompt doesn't carry, you've found a gap.

---

## Friday night: pre-test Prompt 0 alone

**30 minutes, Track A only.** Everything on Saturday depends on the foundation existing. If
Prompt 0 is broken, the full rehearsal is three wasted hours.

So the night before, in an empty directory, run Prompt 0 cold and check:

- [ ] `CLAUDE.md` exists at the repo root with the full contract in it
- [ ] `package.json` says `phaser@^3.90.0`, **not** `^4`
- [ ] `npm run dev` serves a page and the button opens a directory picker
- [ ] A Phaser canvas mounts with no console errors
- [ ] `npx tsc --noEmit` passes
- [ ] All four scenes exist and are registered in `game/config.ts`
- [ ] All seven stub files from Step 7 exist
- [ ] `game/gridMovement.ts` is real, not a stub

Fix Prompt 0 until that checklist passes in one shot. Then delete the directory.

Twenty minutes on Sunday is a tight budget for Prompt 0 — Friday's run tells you whether
it's realistic, and if it isn't, the honest fix is to cut Step 6 or 7 down, not to hope.

---

## Saturday morning: the run

Same tracks, same prompts, same clock, same gates as Sunday. Somebody owns a timer and calls
the times out loud.

**Nobody helps anybody.** If Track C is stuck, Track C stays stuck and writes down why. You
are testing the prompt, not the team. The instinct to jump in and help is exactly what
invalidates the result.

The two gates still apply:

- **0:20** — foundation pushed, everyone branches
- **1:20** — a character is walking on a tilemap, or Track B starts cutting

---

## The corrections log

One shared doc, open the whole time. Every single time you have to tell your agent something
the prompt didn't, log a row. Don't batch it up for later — you will forget the wording, and
the wording is the valuable part.

| Time | Track | What it got wrong | What I said that fixed it | Goes in |
| --- | --- | --- | --- | --- |
| 0:38 | C | Wrote its own movement instead of using GridMovement | "game/gridMovement.ts already exists and exports GridMovement — read it and use it" | CLAUDE.md |
| 0:51 | B | Guessed frame indices for the terrain sheet | "Frame indices are in docs/ASSETS.md, never estimate them" | Track prompt |
| 1:14 | D | Added a dependency to package.json | "Never edit package.json, rule 3" | Already covered — prompt ignored |

That last category matters as much as the first two. **If a rule was already written and the
agent ignored it anyway, making the rule longer won't help** — move it earlier, make it
blunter, or build the constraint into the file layout instead.

### The two-strike rule

If you correct the same *category* of thing twice, stop and write the fix down immediately.
Don't wait for the debrief. Twice means it'll happen on Sunday too.

---

## Saturday afternoon: the debrief

**90 minutes.** Work through the log row by row and route every correction to exactly one place:

| Where | For what |
| --- | --- |
| **`CLAUDE.md`** | Anything two or more tracks hit. Stack facts, conventions, operating rules, file ownership. |
| **The track prompt** | Anything only that track hits. Build order, specific gotchas. |
| **The recovery-phrase list** | Wording that reliably un-stuck an agent. Add it to the bottom of `PROMPTS.md`. |
| **Accept it** | Cheap to correct live, not worth prompt bloat. Some things are fine to just say on the day. |

Then:

- **Record the real timings.** How long did each track *actually* take? That's Sunday's budget,
  not the estimate in the run of show. If a track ran over, cut its step 4-5 now rather than
  discovering it at 1:50 tomorrow.
- **Rewrite the docs** and push. The versions in this repo should end Saturday matching what
  you'll actually paste.

---

## Rehearse the merge

**45 minutes, and do not skip this.** The merge is where parallel work goes to die, and it's
the part nobody ever practises.

Do it for real: B, then C, then D, one person driving.

- If two tracks fought over a file, **the fix is to move that file into Prompt 0** so it
  exists before anyone branches. Don't fix it with a rule asking people to be careful.
- If the merge took more than 25 minutes, the tracks aren't cleanly separated. Change the
  file ownership table until they are.

---

## Write the demo script

**45 minutes.** Beat by beat, who talks, who drives.

The golden path, which is also the cut-proof core of the whole build:

1. Open the app — "this is a notes app, sort of"
2. **Pick a real Obsidian vault** — the moment that lands
3. The town renders from those folders
4. Walk to a house, step inside
5. Walk to a bookshelf, press Space, read a real note with an image
6. An NPC says something about what you've been writing

Time it. **Know your last sentence** — demos die when nobody knows how to stop.

Also rehearse the two questions you'll definitely get:

- *"Does it read my notes?"* — Only titles leave the machine, and only for NPC dialogue.
  Note content never leaves the browser. Say it before they ask.
- *"What if I have 500 notes?"* — You tested this. Have the answer.

---

## Then delete it

> **Delete the rehearsal repository. Create an empty one for Sunday.**

Sunday's commit history has to show the project was built on the day. Pre-stage only what's
legal to bring:

- [ ] The asset zip, unzipped and ready to copy
- [ ] The demo vault zip, unzipped
- [ ] `docs/PROMPTS.md` open in a tab
- [ ] `docs/ASSETS.md` filled in, ready to paste into Prompt 0
- [ ] An empty Vercel project, linked and ready
- [ ] The corrections log, so Sunday's recovery phrases are one search away

---

## One last thing

Whoever runs a track on Saturday should run **the same track on Sunday**. The muscle memory
of having already argued with an agent about that exact file is worth more than any document
in this repo.
