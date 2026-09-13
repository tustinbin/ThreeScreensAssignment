# Step 7 — Written description (AI draft)

> Final pass should be human. Edit this in your voice, then copy the finished version into `README.md` for the repo/submission if that’s what Canvas expects.
>
> **Links to fill/confirm:**
> - Live prototype: https://tustinbin.github.io/ThreeScreensAssignment/
> - Repo: https://github.com/tustinbin/ThreeScreensAssignment
> - Initial AI commit: https://github.com/tustinbin/ThreeScreensAssignment/commit/27597b2
> - Revision commit (bottom nav / grouping): https://github.com/tustinbin/ThreeScreensAssignment/commit/f182af8

---

## 1. Need, persona, capability, and value

**Need:** The person wants to be informed and able to talk about interesting subjects, but they don’t want “informed” to mean only current events. What they do now (news sites, suggested articles, social feeds) costs them time, leaves them with fleeting updates, and often feels draining instead of lasting understanding.

**Persona:** A maturing adult seeking knowledge; uses a phone frequently; actively tries to use phone time in more self-edifying ways (gaps in the day, between tasks—not “whenever”).

**Primary capability:** Learn something clear about an interesting person, place, or event (past or present) in one short sitting.

**Fundamental value:** Edification. Afterward they feel proud of the knowledge they gained *and* that they used their phone wisely.

**Affordance sentence (landing):** Edify yourself, one fact at a time.

---

## 2. Three screens

| Screen | Name | Single job | Why it earned a slot | Design question it examines |
| --- | --- | --- | --- | --- |
| 1 | Landing | Signal edification and the one-fact capability | First contact has to communicate value and the main action before anything else | Does the landing communicate value and capability at a glance? |
| 2 | Fact | Deliver one Wikipedia-sourced fact and let them go deeper or get another | Best proof the product works—capability in action, not decoration | Is one deliberate fact enough to feel edifying without inviting scroll addiction? |
| 3 | Interests | Let them choose topics that shape what they learn next | Makes “variety of people, places, events” concrete without becoming a settings page | Do topic choices feel like control over learning, not configuration busywork? |

---

## 3. Design question plan (from Step 6)

Questions worded for the persona, with predictions tied to the prototype. (Questions and predictions only—no real interview findings yet.)

### Need
**Q:** How do you use your phone to edify yourself now, and what is annoying about it?

**Prediction:** They’ll name news / suggested articles / Reddit-style feeds. They’ll say scrolling feels trapping, hard news doesn’t uplift them, and distraction-heavy apps waste time even when they meant to learn.  
**Rests on:** Landing copy that contrasts “one deliberate fact” with a feed/news cycle; Fact screen that has no infinite scroll—only Next fact.

### Value
**Q:** What kind of app would you want to use to avoid these frustrations you feel when you are trying to stay informed?

**Prediction:** They’ll want something interesting that doesn’t steal time—no dopamine scroll loop—and broader education than current events so they leave more optimistic. One or two words might land near “edification,” “calm,” or “control.”  
**Rests on:** Affordance sentence + single primary “Learn something new”; discrete fact actions instead of a feed.

### Persona
**Q:** Do you know anyone else that struggles with these same frustrations?

**Prediction:** They’ll say many people feel phone dissatisfaction, but only some are actively looking for replacement apps; some friends don’t care about scroll time. That supports a first-adopter who already wants wiser phone use.  
**Rests on:** Positioning as intentional, low-chrome learning—not a mass entertainment product.

### Capability
**Q:** Explore this app and tell me what you think this app does and how it can help you?

**Prediction:** They’ll say it gives a random Wikipedia fact, with light control over topics, and that it could help them learn more than social/news apps—but may feel like it still needs more depth to feel fully valuable.  
**Rests on:** Fact screen (excerpt + Read more + Next) and Interests chips; bottom nav making Learn / Interests / Home obvious.

---

## 4. Design justification and first read

Opened the live URL as if I’d never seen the product.

### First read
- **Signaling at a glance:** Before reading every word, the large affordance line and the single “Learn something new” button already point to *one fact* and *edification*. Brand (“One Fact”) reinforces that. Value and capability show up without hunting.
- **Does everything earn its place?** On the revised landing, mostly yes: brand, affordance, short support line, one primary action. Screen-changing controls live in the bottom bar so Customize no longer competes with Learn on the hero. That was the main signaling fix.
- **Gestalt grouping:**
  - **Proximity:** Landing copy (headline + support) sits as one message block; fact title/body/source sit together; Read more + Next fact sit together under the fact.
  - **Common region:** Topic chips share one boxed region on Interests; all screen navigation shares the bottom bar.
  - **Similarity:** Topic chips look like one choice set; nav items look like one navigation set.
- **Screens 2 & 3 on mission / return home:** Fact stays on delivering one fact; Interests stays on choosing topics then learning. Home is available from the bottom nav on every screen (assignment requirement). Learn ↔ Interests is the path that actually matters in use; Home is the quiet reset.
- **What AI got wrong initially / what changed:** The first AI build put **Learn something new** and **Customize my interests** as peer buttons on the landing, and mixed **Customize** into the Fact screen’s action stack with Read more / Next fact. That weakened primary-capability signaling and mixed *screen navigation* with *fact actions* (poor grouping). The revision moved screen changes into a bottom bar (**Home · Learn · Interests**), left one primary CTA on landing, and grouped fact-only actions under the excerpt.

### Concrete before-and-after
| | Before (initial AI commit) | After (branch revision) |
| --- | --- | --- |
| Problem (course vocabulary) | Landing gave **competing signals**: two CTAs of similar weight, so Customize competed with the primary capability. Fact screen **failed proximity**—nav and fact actions were in one pile. | Landing **signals** one job: learn a fact. **Proximity / common region** separate “what to do with this fact” from “which screen am I on.” |
| Evidence | Commit `27597b2` — dual buttons on landing; Customize on the fact action list | Commit `f182af8` / merged PR #1 — bottom nav; single Learn CTA on landing |

Compare: https://github.com/tustinbin/ThreeScreensAssignment/commit/27597b2 vs https://github.com/tustinbin/ThreeScreensAssignment/commit/f182af8

**Why this change mattered:** It answered the landing design question (value/capability at a glance) and the grouping question (related controls live together) without adding a fourth screen or turning Interests into settings theater.
