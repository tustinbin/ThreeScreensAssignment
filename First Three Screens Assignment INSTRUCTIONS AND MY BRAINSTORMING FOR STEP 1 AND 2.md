# First Three Screens Assignment

# FULL INSTRUCTIONS

# Assignment: First Three Screens

- **Due** Saturday by 11:59pm
- **Points** 100
- **Submitting** a text entry box

## Purpose

Take an idea and hypothesize its core value. Turn that hypothesis into something real that other people can open in a browser. Direct an AI coding agent to build it, publish the code to GitHub, and put it on a live URL. Prepare questions for later user feedback; you are not collecting feedback yet.

This is a deliberately small build. You are building **three screens**, not a full product. The point is to communicate the core value through an interactive mock-up in a focused manner, and to get through the pipeline once - a focused idea, a working app, a live link - so you are ready to show it to your target users later. Later on you will do this again as a team, with more research behind it.

## Learning Objectives

- Turn an initial idea into carefully defined concepts and value propositions
- Create an interactive mock-up using an AI coding agent
- Iterate until your mock-up effectively groups, signals, and communicates the value propositions
- Use Git/GitHub and hosting to publish and version the result
- Prepare targeted questions about the need, value, rapid comprehension, signaling, and grouping for a later evaluation

## Step 1: Define the need, persona, capability, and value

Before you write anything for the AI, spend 10 to 15 minutes "on paper" on these four items. Keep them distinct and iterate to boil it down one sentence max for each.

1. **Need - why the person is looking.** Their situation, what gets in the way, what they do now, and what that workaround costs them. Do not name your product or its features.
2. **Persona - who is most likely to jump on board first.** Boil it down to 2-3 characteristics and 1-2 situations. "Studies on campus 2-3 times per week" beats "BYU students"; "in the gaps between classes" beats "whenever they need to study."
3. **Capability - the key observable action the product lets them complete.** "Find an available study spot" is a capability; "save time" and "feel confident" are values. Ask why this person would do this instead of nothing, or instead of what they already use.
4. **Value - what is materially or emotionally better afterward.** Words such as "faster," "certainty," "privacy," "control," "learning," or "connection" beat vague terms such as "streamlined" or "easier." One or two words, then say why that payoff matters.

For example:

> **Need:** Between classes, students have limited time and do not know which campus study spots are available and quiet until they walk there or ask around.
> 
> 
> **Persona:** Studies on campus 2-3 times per week, carries a laptop, has 45-90 minute gaps between classes, and needs quiet to get anything done.
> 
> **Capability:** Find a suitable study spot that is available now.
> 
> **Fundamental Value:** Momentum. The student is able to preserve working momentum between classes rather than interrupting the workflow.
> 

The value is the payoff the landing screen especially has to communicate. A fully formed design for the entire app is not required yet.

## Step 2: Choose your three screens

Create a mock-up that will be ready for a later evaluation with your target persona. It consists of 3 screens only.

- **Screen 1 is the landing screen.** Its primary job is to signal the core value and the primary capability. Supporting content and secondary capabilities may appear only when they help that job; nothing should compete with it.
- **Screens 2 and 3 demonstrate the primary capability and value in action.** Pick the two screens that best show what the product actually does for the person in Step 1.

Write down a description of the three screens, their main job, and one sentence on why each earned a slot. Also note which design question each screen helps you answer. Choosing something that looks like a settings page or a login page over a screen that shows the product working is the most common way this goes wrong.

Three screens is a cap, not a target. Do not add a fourth.

## Step 3: Write a brief and hand it to an agent

Turn your concept into a concise brief for your AI agent. About one page is enough; use bullets or a small table for the question plan rather than forcing everything into a paragraph:

- **The product description.** What is it, what does it do.
- **Your four answers from Step 1**, carried over as written. Lead with the value.
- **Your three screens from Step 2**, named, with the one job each does and the design question each addresses.
- **Any preferences you already have** on tone, color, or content.

Then hand it to your preferred AI coding agent. If you don't know where to start, any of these work:

| Tool | Best for |
| --- | --- |
| **Claude Design with Claude Code** | Most control and the best output; needs some terminal comfort |
| **bolt or v0** (bolt.new or v0.app) | Fast, good for full-stack simply |
| **Cursor with Codex** | Requires tying in Codex or another AI; best if you want to edit the code directly |

Paste the brief as your first prompt and tell the agent that the affordance sentence is the dominant thing a first-time user must encounter. Then keep going. You are the director, not the typist, and one prompt is never the answer.

## Step 4: Put it on GitHub, revise it and then merge

You will be building a prototype in the class as a group. This means you need to be able to manage a shared code base, including making versions and merging changes into the main code base. The industry standard for this is Git and Github. If you haven't used these before, you will need to install Git and create a free account at Github.com. Have your AI walk you through the 3 steps below.

1. Create a **public** repository for the project on Github.
2. Push the AI's output as your first commit, before you change anything. This matters: the history has to show what the machine handed you initially.
3. Review the output. Make edits on a branch, prompting your AI until all of these are true:
    - The landing screen makes the primary capability and fundamental value clear at first glance. Supporting content and secondary capabilities may appear only when they support that primary job; nothing competes with it.
    - All three screens have obvious navigation back to the landing screen.
    - Things that belong together appear visually grouped using the Gestalt principles covered in class, and the three screens look like the same product.
    - You made at least one meaningful revision after reviewing the AI's first output. The revision improves communication, signaling, grouping, or comprehension; it is not merely a preferred color change.
4. Open a Pull Request and merge it into `main`.

**You are not being asked for a full complex design system.** Do not spend prompts on color tokens, component libraries, beautiful graphics, or reusable variables. That comes later in the course. Consistent enough to look like one product is the bar.

Note: If you are less familiar with Git or Github, the agent you are already using will walk you through it if you ask. Git is a version control system, not a programming language. Have your AI define the top 10 key git-related terms and ask you questions for comprehension.

Your commit history should show the initial AI output and the changes you decided on.

## Step 5: Deploy to a public URL

Put it somewhere anyone can open on any device with no login:

- **Vercel** (vercel.com) - connect the repo, redeploys on every push. Recommended for ease. Integrates with v0 well.
- **GitHub Pages** - free and built in, best for a static site.
- **Netlify** - same idea as Vercel.
- **Cloudflare Pages** - another free hosting option.

Here again, if you are unfamiliar with hosting, have AI walk you through it. AI can simply do it for you, but it is in your interest to understand what it is doing.

## Step 6: Write feedback questions

Pick at least four questions below - at least one from each group - and rewrite them in the words you would actually say to your persona. Beside each, write what you predict they will answer and which part of the prototype that prediction rests on. You are writing the questions, not asking them yet.

**Need**

- Tell me about the last time you were in this situation. What did you end up doing?
- What do you use for this now, and what is annoying about it?
- What makes you give up and not bother?

**Value**

- If this problem were solved for you, what is one or two words that describe the value you see? Why?
- What would have to be true for you to use a different solution instead of what you do now?

**Persona**

- How often does this come up for you, and what are you usually doing when it does?
- Who else do you know who deals with this?
- What have you already tried for it?

**Capability**

- I am going to show you this screen for five seconds. (Hide it.) What does this product do?
- Click around on this and tell me what you think it is for.
- What would you click/tap first, and what do you expect would happen?

## Step 7: Write the description

With AI's help (the final pass should be human), write about one page in a `README.md` file, submitted as part of your GitHub repo and linked in your submission. Use headings, bullets, or a small table so the writing stays concise. Present the main design decisions briefly in class. Show the work behind the prototype, not just the finished screens.

**1. Your answers to questions 1-4.** State the need, persona, primary capability, and fundamental value. Keep the need, capability, and value distinct.

**2. Your three screens.** Name each one, give its single job, explain why it earned a slot, and identify the design question it helps you examine.

**3. Your design question plan.** The questions and predictions from Step 6.

**4. Your design justification and first read.** Open your own live URL as if you have never seen it. Briefly answer: - Does the landing screen signal the primary capability and fundamental value at first glance, before reading? - Does every element on the landing screen earn its place, or does anything compete with the primary job? - What information and actions belong together on each screen, and which Gestalt grouping principle communicates that? - Do screens 2 and 3 stay on mission, and can you return to the landing screen from everywhere? - What did the AI initially get wrong, skip, or oversimplify, and what did you change? - Which design question or grouping/signaling decision motivated each important change?

Include one concrete before-and-after comparison, such as screenshots or a link to the initial commit alongside the revised screen. "It looks generic" is not a useful answer. "The hero section gave equal weight to sign-up and browse, so nothing signaled the primary capability" is. Name the problem using the course vocabulary you have learned so far.

## Deliverables

| # | Deliverable | Notes |
| --- | --- | --- |
| 1 | **GitHub repository link** | Public, or zero points. History shows the initial AI output plus at least one later change merged via a Pull Request. |
| 2 | **Live prototype URL** | Public, or zero points. |
| 3 | **Written description** | Your answers to Q1-4, the three screens and why, your feedback questions with predictions, and your design justification and first read. In the repo and linked in your submission. |

## What you are not graded on

- Code quality, or whether you wrote any code yourself
- How polished the UI looks, unless it inhibits the purpose of the mock-up
- Having a design system, tokens, or reusable components

## Rubric

**First Three Screens**

| Criteria | Ratings | Pts |
| --- | --- | --- |
| This criterion is linked to a Learning OutcomeConcepts and screen choicesNeed, persona, capability, and value stated and kept distinct - no capability written as a value, no product named inside the need. A defensible reason each screen earned its slot. |  | 15 pts |
| This criterion is linked to a Learning OutcomeThe three screensThe landing screen signals the core value fast. Screens 2 and 3 demonstrate it rather than decorating around it. Related things are visually grouped using Gestalt principles from class, the three screens look like one product, and navigation back to home works everywhere. |  | 25 pts |
| This criterion is linked to a Learning OutcomeFeedback questionsAt least four, at least one per group, worded as you would say them to your persona rather than to yourself. A prediction beside each, tied to a specific part of the prototype. Questions and predictions only - no findings. |  | 10 pts |
| This criterion is linked to a Learning OutcomeWritten description and first readA real affordance sentence. A first read that names specific problems in course vocabulary instead of general impressions, plus one concrete before-and-after showing a revision you made for a design reason. |  | 20 pts |
| This criterion is linked to a Learning OutcomeLive URLsLoads for anyone, on any device, without a login. All three screens reachable. |  | 10 pts |
| This criterion is linked to a Learning OutcomeFollowed instructionsAll instructions were followed as specified in the assignment. |  | 20 pts |

Total Points: 100

# MY WORK

## STEP 1

Before you write anything for the AI, spend 10 to 15 minutes "on paper" on these four items. Keep them distinct and iterate to boil it down one sentence max for each.

1. **Need - why the person is looking.** Their situation, what gets in the way, what they do now, and what that workaround costs them. Do not name your product or its features.
2. **Persona - who is most likely to jump on board first.** Boil it down to 2-3 characteristics and 1-2 situations. "Studies on campus 2-3 times per week" beats "BYU students"; "in the gaps between classes" beats "whenever they need to study."
3. **Capability - the key observable action the product lets them complete.** "Find an available study spot" is a capability; "save time" and "feel confident" are values. Ask why this person would do this instead of nothing, or instead of what they already use.
4. **Value - what is materially or emotionally better afterward.** Words such as "faster," "certainty," "privacy," "control," "learning," or "connection" beat vague terms such as "streamlined" or "easier." One or two words, then say why that payoff matters.

# Wikipedia API App for quick and easy but also in-depth knowledge and general learning

1. The persona wants to be informed and talk to people about interesting subjects, but they don’t want to just know current events. 
2. Persona is a maturing adult, seeking knowledge. Uses phone frequently. Strives to use phone in more self-edifying ways.
3. A quick and easy way to learn about a variety of interesting people, places, and events, past or present.
4. Edification. The persona is able to feel both proud of the knowledge they have gained as well as that they used their phone in a wise way.

## STEP 2

Create a mock-up that will be ready for a later evaluation with your target persona. It consists of 3 screens only.

- **Screen 1 is the landing screen.** Its primary job is to signal the core value and the primary capability. Supporting content and secondary capabilities may appear only when they help that job; nothing should compete with it.
- **Screens 2 and 3 demonstrate the primary capability and value in action.** Pick the two screens that best show what the product actually does for the person in Step 1.

Write down a description of the three screens, their main job, and one sentence on why each earned a slot. Also note which design question each screen helps you answer. Choosing something that looks like a settings page or a login page over a screen that shows the product working is the most common way this goes wrong.

### Screen 1 (landing screen)

- Text: Use your phone to edify yourself, one fact at a time.
- Button 1: Learn something new! (colored/highlighted, preferred pick)
- Button 2: Customize my interests (non-preferred pick)

### Screen 2 (fact screen)

- Text Body: A random excerpt from wikipedia
- Floating button: Read More!
- Floating Button: Next fact!
- Floating Button: Customize my interests

### Screen 3 (Customize my interests)

- Text: Select topics that interest you
- Buttons of various subjects that can be selected
- Button: Learn something new!