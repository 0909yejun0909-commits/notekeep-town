# The rehearsal

Two passes. **Saturday is async and solo** — each person hands the repo to their own agent and
watches what comes out. **Sunday midday is in person**, and it exists to rehearse the things
that need four people in a room.

| When | What | Who |
| --- | --- | --- |
| **Fri evening** | Pre-test Prompt 0 cold | Track A alone |
| **Sat, any time** | Run your own track cold. Log everything. | Each person, solo |
| **Sun 12:00–15:00** | Debrief, freeze the prompts, rehearse the merge and the demo | Everyone, in person |
| **Sun 17:00** | Build | — |

**You are not rebuilding the app on Sunday morning.** Saturday's branches are the merge input.
You don't need to rebuild something to practise merging it, and arriving at a 5pm build having
already done a 3-hour one is worse than arriving rested.

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

## Saturday: run your own track, solo

Whenever suits you. In an empty directory, cold session, your track prompt and nothing else.

Track A goes first and pushes a foundation branch that B, C and D start from — agree a time
for that, since everyone else is blocked until it exists.

**Nobody helps anybody.** If you're stuck, stay stuck and write down why. You are testing the
prompt, not the team. The instinct to jump in is exactly what invalidates the result.

Give it roughly the time your track gets on Sunday — about 85 minutes — and **stop when the
time is up even if you're mid-flow.** What you're measuring is how far the prompt gets in the
window, not whether you can finish eventually.

### The four questions you're answering

1. **Did it read the existing files, or reinvent them?** The most expensive failure available.
   If Track C wrote its own movement instead of importing `GridMovement`, that's the finding
   of the day.
2. **Did it stay in its lane?** Check `git diff --stat` at the end. Any file outside your
   ownership list is a problem, even a helpful-looking one.
3. **What context did you have to supply by hand?** Everything you told it that wasn't in the
   prompt or `CLAUDE.md`.
4. **How far did it actually get in the time?** Be honest. This is Sunday's real budget.

**Push your branch at the end**, however finished it is. Sunday's merge rehearsal needs it.

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

## Sunday midday, in person

Five hours between meeting and the 5pm start. Spend three on this and two recovering.

| | | |
| --- | --- | --- |
| **12:00** | Debrief | What did each agent get wrong, what fixed it, where does it go |
| **12:30** | Edit and freeze | Make the changes together on one screen. Nothing changes after this. |
| **13:00** | Merge rehearsal | On Saturday's branches. B → C → D, one driver. |
| **14:00** | Demo script | Write it, run it twice, time it. |
| **14:45** | Delete and stage | Empty repo, assets, vault, Vercel project ready. |
| **15:00** | **Stop** | Eat properly. A 5-to-8pm build on no dinner is its own failure mode. |

---

### 12:00 — Debrief

Work through everyone's log row by row and route every correction to exactly one place:

| Where | For what |
| --- | --- |
| **`CLAUDE.md`** | Anything two or more tracks hit. Stack facts, conventions, operating rules, file ownership. |
| **The track prompt** | Anything only that track hits. Build order, specific gotchas. |
| **The recovery-phrase list** | Wording that reliably un-stuck an agent. Add it to the bottom of `PROMPTS.md`. |
| **Accept it** | Cheap to correct live, not worth prompt bloat. Some things are fine to just say on the day. |

Also settle the **real timings**. How far did each track actually get in 85 minutes? That's
tonight's budget, not the estimate in the run of show. If a track fell short, cut its steps 4–5
now rather than discovering it at 1:50 tonight.

---

### 12:30 — Edit and freeze

Make every agreed change to `CLAUDE.md` and the track prompts **together, on one screen**, so
all four of you have seen the final wording. Push.

> **After this, the prompts are frozen.** If something is wrong at 6pm tonight, you correct it
> in the chat with your agent — you do not stop to edit a file.

---

### 13:00 — Merge rehearsal

**The reason you're in a room together.** The merge is where parallel work goes to die, and
it's the part nobody ever practises.

You already have the inputs: everyone's Saturday branch. **Don't rebuild anything** — merge
what you've got, for real. B, then C, then D, one person driving, the other three watching and
calling things out.

- If two tracks fought over a file, **the fix is to move that file into Prompt 0** so it exists
  before anyone branches. Don't fix it with a rule asking people to be careful.
- If it took more than 25 minutes, the tracks aren't cleanly separated. Change the file
  ownership table in `CLAUDE.md` until they are.
- Whatever you learn here, fold into Prompt 0 *now* — this is the last moment it can change.

---

### 14:00 — Demo script

Beat by beat, who talks, who drives.

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

### 14:45 — Delete it, then stage

> **Delete every rehearsal branch and repository, on every machine.** Create the empty one for
> tonight.

Tonight's commit history has to show the project was built at the event. Do this **while
you're together**, so all four of you watch it happen and nobody has a stray copy.

> **Decide this now, not at 16:50.** Saturday's output is diagnostic only. If it happens to
> work well, deleting it gets psychologically *harder*, not easier — tired people with working
> code in front of them rationalise. Agree while it's easy that it never opens tonight.

Then pre-stage only what's legal to bring:

- [ ] The asset zip, unzipped and ready to copy
- [ ] The demo vault zip, unzipped
- [ ] `docs/PROMPTS.md` open in a tab
- [ ] `docs/ASSETS.md` filled in, ready to paste into Prompt 0
- [ ] An empty Vercel project, linked and ready
- [ ] The corrections log, so tonight's recovery phrases are one search away

---

### 15:00 — Stop

Two hours before the gun. Eat, travel, arrive early enough to find power and test the wifi.

Do not keep tinkering. The prompts are frozen, and the value of another hour of fiddling is
lower than the value of starting a three-hour evening build with energy.

---

## Two last things

**Whoever runs a track on Saturday runs the same track tonight.** The muscle memory of having
already argued with an agent about that exact file is worth more than any document in this repo.

**What you give up with this plan** is practice at the *simultaneous* feel of four people
building at once — Saturday is solo, so nobody rehearses the interruptions and the "is A done
yet" coordination. That's a deliberate trade. The gates are simple enough to run cold (push at
0:20, walkable at 1:20), and the real coordination risk is the merge, which you're rehearsing
head-on.
