# The rehearsal

Three passes, each testing something the previous one couldn't.

| When | What | Who |
| --- | --- | --- |
| **Fri evening** | Pre-test Prompt 0 cold. Does the foundation work at all? | Track A alone |
| **Sat, any time** | Run your own track cold. Does each prompt stand alone? | Each person, solo |
| **Sun 10:15–11:45** | Full timed run. Does it work as a team, on the clock? | Everyone, in person |
| **Sun 11:45–14:30** | Debrief, freeze the prompts, delete everything | Everyone |
| **Sun 17:00** | Build | — |

**All three rehearsal passes run on Claude Pro.** The $100 of Fable API only arrives at the
event. That caps Sunday morning at one run and means you never rehearse on the model you build
on — both consequences are spelled out in the Sunday section, and the second one shapes what
you're allowed to change at the freeze.

Saturday catches prompt-level problems cheaply and alone, so Sunday's run can spend its ninety
minutes on what only a full team rehearsal can test: the gates, the merge, and whether ninety
minutes is actually enough.

> **The build is 90 minutes, not 180.** The event runs 17:00–20:00, but only an hour and a half
> of that is building; the rest is setup, presentation and judging. Every gate in this document
> was rescaled on 2026-09-18 when that came to light.

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
Prompt 0 is broken, the full rehearsal is ninety wasted minutes.

So the night before, in an empty directory, run Prompt 0 cold and check:

- [ ] `CLAUDE.md` exists at the repo root with the full contract in it
- [ ] `package.json` says `phaser@^3.90.0`, **not** `^4`
- [ ] `npm run dev` serves a page and the button opens a directory picker
- [ ] A Phaser canvas mounts with no console errors
- [ ] `npx tsc --noEmit` passes
- [ ] All four scenes exist and are registered in `game/config.ts`
- [ ] All seven stub files from Step 8 exist
- [ ] `game/gridMovement.ts` is real, not a stub
- [ ] `game/bus.ts` exists and exports on/off/emit
- [ ] `app/page.tsx` mounts `<NoteReader>` and `<CharacterCreator>`, and the bus
      drives the scene switch — the whole point of the foundation is that no track
      has to wire itself in
- [ ] `package.json` lists `@anthropic-ai/sdk`, and `.env.local` exists with
      `ANTHROPIC_API_KEY=`

Fix Prompt 0 until that checklist passes in one shot. Then delete the directory.

**Twelve** minutes on Sunday is the budget for Prompt 0 — the gate moved in when the build
halved. Friday's pretest measured the agent's own work at about four minutes, so the budget is
mostly the manual asset steps, which don't compress. If Friday's number ever creeps past six,
the honest fix is to cut Step 6 or 7 down, not to hope.

---

## Saturday: run your own track, solo

Whenever suits you. In an empty directory, cold session, your track prompt and nothing else.

Track A goes first and pushes a foundation branch that B, C and D start from — agree a time
for that, since everyone else is blocked until it exists.

**Nobody helps anybody.** If you're stuck, stay stuck and write down why. You are testing the
prompt, not the team. The instinct to jump in is exactly what invalidates the result.

**No clock on this pass, but a hard cap.** This is the first rehearsal — let it run past 53
minutes so you find every gap, not just the ones that surface inside the window. Saturday's job
is coverage, not speed.

> **Stop at 2 hours, even mid-task.** You're on Claude Pro, which has a weekly cap as well as a
> rolling one. An uncapped Saturday session can quietly eat the allowance you need for Sunday
> morning's run — and Sunday's is the one that can't be rescheduled. If you're still going at
> two hours, you've already found more findings than you'll have time to act on; write down
> where you got to and stop.

Still write down how long things actually took — it's useful input for the debrief even though
it isn't the constraint.

**Note where you were at the 53-minute mark**, though, even as you keep going past it. That is
the entire parallel build window on Sunday — gate at 0:12, freeze at 1:05 — and it is the
number that decides what gets cut.

### The four questions you're answering

1. **Did it read the existing files, or reinvent them?** The most expensive failure available.
   If Track C wrote its own movement instead of importing `GridMovement`, that's the finding
   of the day.
2. **Did it stay in its lane?** Check `git diff --stat` at the end. Any file outside your
   ownership list is a problem, even a helpful-looking one.
3. **What context did you have to supply by hand?** Everything you told it that wasn't in the
   prompt or `CLAUDE.md`.
4. **How far did it get, and how long did it actually take?** No clock today, but log the real
   time, and mark where you stood at 53 minutes — Sunday's build window should come from that
   number, not a guess.

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

**One run, not two.** The $100 of Fable API arrives *at the event* — the morning runs on Claude
Pro subscriptions. That caps the morning at a single pass; see the two constraints below.

| | | |
| --- | --- | --- |
| **10:00** | Set up | Empty directories, cold sessions, assets staged, timer nominated |
| **10:15** | **GUN** | Full timed run with real gates. Treat it as the real thing. |
| **11:45** | **Hard stop** | Whatever state it's in. |
| **11:45** | Lunch + debrief | Eat *and* talk. Findings are freshest now. |
| **13:00** | Edit and freeze | Prompt changes together on one screen. Nothing changes after this. |
| **13:45** | Demo script | Write it, run it twice, time it. |
| **14:15** | Delete and stage | Everything, on every machine, while all four of you watch. |
| **14:30** | **Rest** | Genuinely rest. No tinkering. |
| **16:30** | Travel | Arrive early, find power, test the wifi. |
| **17:00** | Build | — |

---

### Constraint 1 — Pro quota is the reason there's only one run

Pro meters on a rolling ~5-hour window with a weekly cap on top. Runs at 10:15 and 12:30 would
both fall inside one window, and a 90-minute agentic coding session is already near the top of
what Pro gives you in a window. A second run wouldn't finish — it would die somewhere around
13:15 with four people watching a rate-limit message, having burned the morning and taught you
nothing.

**This also puts a cap on Saturday.** The weekly limit means an uncapped Saturday session can
eat the allowance you need on Sunday morning. That changes Saturday's instructions — see the
box in that section.

### Constraint 2 — you are rehearsing on a different model than you build on

This is the more expensive one, and it has no workaround.

Fable is what you get at 17:00. Pro doesn't serve it, so Sunday morning tests your prompts
against a different model. **The rehearsal validates the prompts, the gates and the merge. It
does not validate how Fable behaves.**

The trap is at 13:00. Fable responds *badly* to over-prescription — prompts written tight for a
smaller model tend to reduce its output quality, and your prompts are already very prescriptive
(numbered steps, "build exactly what is listed and nothing more", a commit cadence). If the
morning's failures tempt you to add more rules, you may be making the prompts worse for the
model you'll actually use.

So at the freeze, bias toward **removing ambiguity rather than adding instruction**. A gap the
agent couldn't have known about — a file path, a frame index, a type name — is worth writing
down. A rule telling it to try harder is not.

> **Worth ~$5: run Prompt 0 once on real Fable.** Buy a small amount of API credit and have
> Track A run Prompt 0 alone, on Fable, on Sunday morning. It's four minutes of agent work and
> it's the one place model surprise is most expensive, because all three other tracks are
> blocked behind it. You cannot afford to rehearse the whole build on Fable; you can easily
> afford to rehearse the critical path on it.

---

### The run itself, 90 minutes

Real gates, real clock, same as tonight. Somebody owns the timer and calls the times out loud.

| Clock | Gun time | |
| --- | --- | --- |
| 10:15 | 0:00 | A starts Prompt 0. B/C/D stage assets, confirm the picker. |
| 10:27 | 0:12 | **Gate** — foundation pushed, everyone branches |
| 10:55 | 0:40 | **Gate** — a character is walking, or B cuts now |
| 11:20 | 1:05 | Freeze and push |
| 11:33 | 1:18 | Merge done, B → C → D |
| 11:40 | 1:25 | Smoke test the golden path |
| 11:45 | 1:30 | Hard stop |

The parallel build window is **0:12 to 1:05 — 53 minutes**. That is the number to design scope
around, and it is the single biggest change from the old plan. The 0:40 call now leaves 25
minutes to act on it, so it's a decision, not a warning.

**Run the smoke test inside the 90 this time.** It used to get pushed to the afternoon because
the morning was already three hours long; at ninety minutes it fits, and a merge you never
smoke-tested is a merge you haven't rehearsed.

**Nobody helps anybody during the run.** If Track C is stuck, Track C stays stuck and writes
down why. You are testing the prompts, not the team, and the instinct to jump in is exactly
what invalidates the result. Help is what the afternoon is for.

> ### Hard stop at 11:45 means hard stop
>
> The run will feel *so close* to working at 11:40. It always does. Stop anyway — the value of
> this morning is the debrief, and a rehearsal you never fold learnings back into was just an
> expensive way to get tired.

---

### 11:45 — Lunch and debrief

Eat and talk at the same time. Everything is freshest right now, and you have the real build
tonight — skipping lunch is how the 7pm slump arrives early.

This is the full debrief, and it's the only one you get. Work through everyone's log,
Saturday's and this morning's, while the morning is still vivid.

Work through everyone's log, Saturday's and this morning's, and route every correction to
exactly one place:

| Where | For what |
| --- | --- |
| **`CLAUDE.md`** | Anything two or more tracks hit. Stack facts, conventions, operating rules, file ownership. |
| **The track prompt** | Anything only that track hits. Build order, specific gotchas. |
| **The recovery-phrase list** | Wording that reliably un-stuck an agent. Add it to the bottom of `PROMPTS.md`. |
| **Accept it** | Cheap to correct live, not worth prompt bloat. Some things are fine to just say on the day. |

Also settle the **real timings**. How far did each track actually get in the 53-minute build
window? That's tonight's budget, not the estimate in the run of show.

If a track fell short, the honest move is no longer "cut its last steps" — the prompts were cut
to the six demo beats on the 19th and there is no fat left in them. What's cuttable now is
exactly this, and nothing else:

| Track | The only thing left to drop |
| --- | --- |
| A | nothing — it is the critical path |
| B | house name labels |
| C | step 4, the panel styling |
| D | step 2, the shirt colours |

**Never cut D's steps 3–4.** The NPC line is beat 6, the last thing the judges see.

---

### 13:00 — Edit and freeze

Make every agreed change to `CLAUDE.md` and the track prompts **together, on one screen**, so
all four of you have seen the final wording. Push.

**Give the merge its own pass.** It's the part nobody ever practises, and this morning was
probably the first time you've done it. Specifically:

- If two tracks fought over a file, **move that file into Prompt 0** so it exists before anyone
  branches. Don't fix it with a rule asking people to be careful — that rule will be ignored at
  7pm.
- If the merge took more than **13 minutes**, the tracks aren't cleanly separated. Change the
  file ownership table in `CLAUDE.md` until they are. This threshold halved with the build —
  a merge that used to be comfortable at 20 minutes now overruns the whole window.
- If a track's work didn't fit the world model, that's a type-contract bug. Fix the contract in
  Prompt 0, not the track that tripped on it.

> **After this, the prompts are frozen.** If something is wrong at 6pm tonight, you correct it
> in the chat with your agent — you do not stop to edit a file.

---

### 13:45 — Demo script

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
- *"What if I have 500 notes?"* — **Do not say you tested it; you didn't.** That handling was
  cut from Track A to protect the critical path. The honest answer is the architecture: notes
  load lazily through `readNote()`, so the town builds from the folder tree and nothing is read
  until you walk up to it. Say what the design does, not what you measured.

---

### 14:15 — Delete it, then stage

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
- [ ] The demo laptop nominated, charged, and confirmed to run `npm run dev`
- [ ] The corrections log, so tonight's recovery phrases are one search away

---

### 14:30 — Stop

An hour and a half before the gun. Eat, travel, arrive early enough to find power and test the
wifi.

Do not keep tinkering. The prompts are frozen, and the value of another hour of fiddling is
lower than the value of starting the evening build with energy.

---

## Two last things

**Same person, same track, all three passes.** Whoever runs Track B on Saturday runs it in the
morning and runs it tonight. The muscle memory of having already argued with an agent about
that exact file is worth more than any document in this repo.

**Watch the energy, not just the clock.** You're doing three ninety-minute builds in one day,
and the last one is the one that counts. That's what the 14:30 stop is protecting — it is not
padding, and the temptation to spend it on "just one more fix" is exactly the thing that makes
you flat at 19:00. The morning run is practice. Treat the afternoon like the warm-up before a
match, not extra training.
