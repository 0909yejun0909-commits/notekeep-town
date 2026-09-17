# The rehearsal

Three passes, each testing something the previous one couldn't.

| When | What | Who |
| --- | --- | --- |
| **Fri evening** | Pre-test Prompt 0 cold. Does the foundation work at all? | Track A alone |
| **Sat, any time** | Run your own track cold. Does each prompt stand alone? | Each person, solo |
| **Sun 10:15–13:15** | Full timed run. Does it work as a team, on the clock? | Everyone, in person |
| **Sun 13:15–16:00** | Debrief, freeze the prompts, delete everything | Everyone |
| **Sun 17:00** | Build | — |

Saturday catches prompt-level problems cheaply and alone, so Sunday's run can spend its three
hours on what only a full team rehearsal can test: the gates, the merge, and whether three
hours is actually enough.

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

## Sunday — the full run

Meet at 10:00. Seven hours until the gun.

| | | |
| --- | --- | --- |
| **10:00** | Set up | Empty directories, cold sessions, assets staged, timer nominated |
| **10:15** | **GUN** | Full timed run with real gates. Treat it as the real thing. |
| **13:15** | **Hard stop** | Whatever state it's in. The debrief is worth more than another 20 minutes of building. |
| **13:15** | Lunch + debrief | Eat *and* talk. Findings are freshest now. |
| **14:15** | Edit and freeze | Prompt changes together on one screen. Nothing changes after this. |
| **15:00** | Demo script | Write it, run it twice, time it. |
| **15:30** | Delete and stage | Everything, on every machine, while all four of you watch. |
| **15:45** | **Rest** | Genuinely rest. No tinkering. |
| **16:30** | Travel | Arrive early, find power, test the wifi. |
| **17:00** | Build | — |

### The run itself, 10:15–13:15

Real gates, real clock, same as tonight. Somebody owns the timer and calls the times out loud.

| Clock | Gun time | |
| --- | --- | --- |
| 10:15 | 0:00 | A starts Prompt 0. B/C/D stage assets, confirm the picker. |
| 10:35 | 0:20 | **Gate** — foundation pushed, everyone branches |
| 11:35 | 1:20 | **Gate** — a character is walking, or B starts cutting |
| 12:05 | 1:50 | Freeze and push |
| 12:30 | 2:15 | Merge, B → C → D |
| 12:55 | 2:40 | Smoke test the golden path |

**You can stop at 12:55.** The last twenty minutes tonight are demo rehearsal, which isn't
time-pressured — do it in the afternoon block instead and save the morning energy for the parts
that only break under a clock.

**Nobody helps anybody during the run.** If Track C is stuck, Track C stays stuck and writes
down why. You are testing the prompts, not the team, and the instinct to jump in is exactly
what invalidates the result. Help is what the afternoon is for.

> ### Hard stop at 13:15 means hard stop
>
> The run will feel *so close* to working at 13:10. It always does. Stop anyway — the value of
> this morning is the debrief, and a rehearsal you never fold learnings back into was just an
> expensive way to get tired.

---

### 13:15 — Lunch and debrief

Eat and talk at the same time. Everything is freshest right now, and you have a three-hour
build this evening — a morning rehearsal plus no lunch is how the 7pm slump arrives early.

Work through everyone's log, Saturday's and this morning's, and route every correction to
exactly one place:

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

### 14:15 — Edit and freeze

Make every agreed change to `CLAUDE.md` and the track prompts **together, on one screen**, so
all four of you have seen the final wording. Push.

**Give the merge its own pass.** It's the part nobody ever practises, and this morning was
probably the first time you've done it. Specifically:

- If two tracks fought over a file, **move that file into Prompt 0** so it exists before anyone
  branches. Don't fix it with a rule asking people to be careful — that rule will be ignored at
  7pm.
- If the merge took more than 25 minutes, the tracks aren't cleanly separated. Change the file
  ownership table in `CLAUDE.md` until they are.
- If a track's work didn't fit the world model, that's a type-contract bug. Fix the contract in
  Prompt 0, not the track that tripped on it.

> **After this, the prompts are frozen.** If something is wrong at 6pm tonight, you correct it
> in the chat with your agent — you do not stop to edit a file.

---

### 15:00 — Demo script

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

### 15:30 — Delete it, then stage

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

### 15:45 — Stop

Two hours before the gun. Eat, travel, arrive early enough to find power and test the wifi.

Do not keep tinkering. The prompts are frozen, and the value of another hour of fiddling is
lower than the value of starting a three-hour evening build with energy.

---

## Two last things

**Same person, same track, all three passes.** Whoever runs Track B on Saturday runs it in the
morning and runs it tonight. The muscle memory of having already argued with an agent about
that exact file is worth more than any document in this repo.

**Watch the energy, not just the clock.** You're doing two three-hour builds in one day, and
the second one is the one that counts. That's what the 15:45 stop is protecting — it is not
padding, and the temptation to spend it on "just one more fix" is exactly the thing that makes
you flat at 19:00. The morning run is practice. Treat the afternoon like the warm-up before a
match, not extra training.
