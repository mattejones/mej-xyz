---
title: "Structured output and the thinking budget trade-off"
description: "Why you can't always have structured output and extended thinking at the same time, and what to do about it."
date: "May 02 2026"
tags:
  - llm
  - claude
  - python
---

I've been building a job application tool that uses an LLM to generate tailored CVs from a structured library of experience and skills. Getting the output right matters beyond just quality because the CV feeds directly into a PDF rendering pipeline. This means the structure needs to be consistent and predictable every time.

## The parsing problem

Early on I wanted to show both the model's reasoning (so I could read and tune the prompts and input data) and the final CV, which immediately creates a parsing problem: how do you reliably separate the two?

My first attempts used a sentinel string in the prompt (`---BEGIN_CV---`) to mark where the CV starts. It worked until it didn't,  the model would occasionally ignore it, or include reasoning inline, and the whole pipeline would break.

## Structured output via tool use

The cleaner solution is [structured output](https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/increase-consistency). On Claude, the mechanism is [tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview): define a schema, force the model to call a tool with its output, and you get a typed dict back instead of raw text. No parsing, no fragile string splitting.

The catch is that tool use is incompatible with [extended thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking), and extended thinking turns out to be genuinely valuable for CV generation. I'm happy to accept a syntax failure, at the cost of better overall output.

Writing a CV isn't just retrieval olf a list of experiences Toi build a clear response to a JD requires real reasoning: which persona fits this role, what narrative gap exists between the experience on hand and what the job is looking for, and what to suppress. The quality difference when running with the thinking budget enabled was substantial.

## The pragmatic middle ground

The current approach is a deliberate compromise: JSON output via prompt instruction rather than enforced tool use, with extended thinking preserved.

The model is instructed to output a single JSON object. The pipeline validates and parses it, and failures raise immediately rather than silently producing broken output. It's less robust than schema-enforced tool use, but it preserves the reasoning quality that makes the output actually good.

## A better architecture

One avenue worth exploring properly: a two-step pipeline where responsibilities are cleanly separated.

```
Step 1: Reasoning (unconstrained, full thinking budget)
  → Which experiences are relevant?
  → What narrative fits this role?
  → What to emphasise, what to suppress?

Step 2: Formatting (fast, cheap, tool-enforced structured output)
  → Take Step 1's output
  → Format it against the schema
  → Return a typed, validated structure
```

Content and structure as separate concerns, each with the right constraints for the job. The first call can think freely; the second call doesn't need to think at all.

You can see some of the experimentation around this in the [atat repository](https://github.com/mattejones/atat/commit/fbf2ee483d42d493012a97fb81f19d40e2be8783#diff-3d6b6e760e8316b5d79efed486a0cb8371035f74b8112d995bb0a8bc152fdead).
