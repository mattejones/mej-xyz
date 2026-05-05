---
title: Exploring an LLM Judge and human-in-the-loop patterns
description: Building better quality text output with low-cost judges
date: May 05 2026
tags:
  - llm
  - claude
---
Not every quality problem in LLM output needs an LLM to catch it.

Some issues in AI LLM text are deterministic. If you've told your model not to use em dashes — and it does — well you can spot this with a string search. If your sentences run on forever and ever, never seeming to end and lacking a clear direction or purpose until some resounding prose helps the AI turn a specific corner on a long linguistic journey, a readability score can catch that. If your model uses all the trope words in the book, you can spot these in a word list. 

Catching these things with code is fast, cheap and perfectly reliable. 

Other issues require judgment. Does the CV accurately reflect what's in the source library, or did the model confabulate a responsibility that isn't there? Did it address the narrative gap the prompt asked it to address? These questions need a reader — and sometimes that reader can be another LLM call.

For ATAT, my CV generation tool, the evaluation pipeline looks like this:
```
deterministic checks → LLM judge → human review → rebuild
```

The code checks run first and cheaply. This currently includes: Hot words, sentence length and structural rules. The LLM judge runs only on output that passes the structural gate, and it's checking for the things code can't catch: factual grounding and narrative alignment. Human review is the final gate and crucially, it's also data collection. Every correction a human makes is a signal about where the prompt or the source material fell short.

This tiered approach isn't some wild idea I cooked up. It turns out it's pretty common-sense. Also, it's essentially what DSPy does with its [assertion](https://dspy.ai/learn/programming/7-assertions/) and [optimisation](https://dspy.ai/learn/optimization/overview/) approaches. But building it yourself, even a in a POC way, forces you to think clearly about what kind of failure you're trying to catch in your workflow, which is a useful exercise to think about the entire information flow and pipeline. 

My next thought and area to experiment is The feedback loop from human review. Right now, I am capturing review guidance and recording that. But perhaps there's interesting (and automated) ways I can get that feedback either catelogued, or safely absorbed into a parent prompt. Each correction points at one of three things: a gap in the source library, a weakness in the prompt, or a model behaviour that needs a new rule. Over time with the right feedback mechanics in place,  the human-in-loop step should get shorter. 