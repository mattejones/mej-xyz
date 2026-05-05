---
title: Exploring an LLM Judge and human-in-the-loop patterns
description: Building better quality text output with low-cost judges
date: May 02 2026
tags:
  - llm
  - claude
---

Some quality issues in AI LLM text are deterministic (that is, they can be easily evaluated with code). For example, if you want to check if your LLM output contains em dashes -> look for the em dashes in text. Some quality issues are issues with facts being mis-represented (or misinterpreted).

To evaluate content quality, we can mix procedual and generative approaches: 
- Use simple checks: number of words in a sentence (in code)
- hot words that LLMs tend to pick when trying to sound fancy (in code)
- sentence readability. (in code)
- Validate claims made in the text (via LLM)

My basic workflow is as follows: 
```
in code checks -> basic llm check -> human-in-loop check -> rebuild content
```

This workflow would have made sense to me before I considered AI best practices. 


having human-in-the-loop designed to collect feedback at the same time allows for future navel-gazing. Looking at possible origin improvements in both the source facts and prompts. 