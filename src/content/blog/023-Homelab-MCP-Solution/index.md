---
title: Buidling a custom MCP for my Homelab
description: Exploiring ideas around automated system controls with AI
date: July 7 2026
tags:
  - AI
  - Homelab
---

I've been using Claude and Minstrel to help manage my homelab more frequently. The workflows typically consist of me wanting to create or troubleshoot a creation on a remote machine.

What's common for me in these processes is a bit of this is swivel-chair work, where I (the human-in-the-loop) vet the recommended command sequence that's being presented to me, and execute this on the command line.

Whilst there is a lot of examples of AI going off the rails and deleting everything on a server, I decided to ignore those warnings and bring AI closer to my homelab (it IS a homelab - for learning and experimenting after all), and vibe-coded an MCP that allows Minstrel and Claude to talk directly to servers on my network, over an SSH connection.

There are a few things I am exploring here with this idea of an MCP:

**Fatigue of approval** 
What's the best way to avoid fatigue of just approving commands. After a bunch of very boring commands, what happens when the LLM slips in something "dangerous"?

Maybe there is some design choices I can put in place, allowing approval of specific commands that are clearly safe - a live whitelist per server, so that similar commands aren't bugging the Human?

Perhaps we could flag dangerous commands with a supervisor - having a numeric risk level so the human is more aware of the potential to get is wrong. Potentially moving the button for more risky commands, or making the human type what the command does as approval: "delete everything on disk"

**Swivel-chair at a different desk** 
Obviously a copy and paste process isn't difficult for the typical user doing this work. So why just move the approval process into a web app? Isn't the copy-and-paste also solving the approval process?

My thoughts here are that this is nuanced. Just wanting to smash out an idea super quickly in a test environment with an AI agent isn't critical work. For me this is creative expression. Similar to building junk in the workshop, painting warhammer with the kids. In the limited windows of time a dad-of-two has, accelerating this means more ideas can become tangible.

**Knowledge Collection** 
Moving tools often means a bit of a re-education, and this is really the same swivel-chair problem just at a different desk. I know Claude is diligently collecting all my thoughts and chats and remembering how much I hate hearing "here's where I need to push-back". Claude tends to remember it's working with OpenBSD and not linux. Then, I move tools and have to remind another one how I like to work. Uggh. But with vigil, I have a record of everything I have ran in the past. 

Vigil-scc is very basic right now, but the vision is a customised UI for reviewing, collecting, and building chains of commands - so the payback on the swivel-chair is ALSO generating value in the longer term. Ideally a UI could bring up annotated previous tasks, take records across different environments, build replays, and just accelerate the process. If you're moving between different tools (Claude Chat, Minstral Vibe, Agents etc) having an upstream tool that can educate these services quickly would mean more correctness, and a streamlined experience - solved once, upstream, rather than re-litigated per tool every time I switch.

Right now, I do have some safety measures in place - specifically I have an option to approve every command before it's ran (or run in YOLO mode without the HIL steps). This gives me the options I personally need for both my prod environments and my throw-away experimental systems, a chance to play with my ideas.

The basic implementation as it stands looks like this: 

Overview diagram:

![Simple Diagram of Vigil-SCC](/images/blog-023-vigil_scc_architecture.svg)

Happy path Sequence diagram:
![Happish path sequence diagram](/images/blog-023-vigil_scc_sequence_wide.svg)



Some improvements I have in mind, which honestly all keep circling back to the same gap - nothing persists between sessions:

- Task and Session Management - being able to identify the beginning of a new task/session so I can review these, and potentially automatically generate scripts/Terraform solutions to those processes.
- Better UI elements - maybe a builtin command-line editor so that when the HIL is seeing a possible improvement, being able to edit the command, rather than reject it, or give feedback back to the caller to help it get the correct command.
- Better connection establishment - Help the LLM understand WHAT it has connected to at the beginning, such as OS type, permissions, etc.

You're welcome to take a look at what it is, maybe build your own ideas on top, or give me a PR on something that could be mega! I'd love to see your suggestions!
