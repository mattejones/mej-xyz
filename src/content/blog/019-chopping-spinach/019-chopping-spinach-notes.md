---
title: I Simulated My Chopping
description: Exploring and simulating chopping
date: May 13 2026
tags:
  - python
---
I'm not a very good cook.

I've learnt to produce a handful of family meals, which revolve around deterministic cook times and require limited judgement. Pasta. A roast. A stir-fry if I'm feeling ambitious. Basically, I can follow a procedure, but I can't create art.

Something I did notice though was that I can generally produce a uniform pile of chopped herbs or spinach without really thinking about it. I do this by taking a knife to the ingredients and hunting down the largest chunk, making a chop over the pile, then repeating until it looks alright.

What I didn't clock was that I had actually _developed a strategy_. An algorithm, even.

This thought lodged in my brain while I was halfway through a bag of baby spinach. Why does that approach work? And could I model it?

---

## Building a Chopping Board in Python

The first step was to represent a leaf. To keep things simple, I settled on a 2D plane, which could represent my chopping board and a circle, to start, approximating some niche baby spinach variety. Each "cut" is a random line across the board; any circle (leave) the line intersects gets split into two children. Below you can see two parts of an unequal chop.

![[early-chopper-output.png|464]]

After a cut, the pieces get scraped back into a central pile, kindof the way you'd sweep them together with the flat of a knife and then the process repeats.

Some immediate design decisions came up that I hadn't expected:

**Definition of done:** A piece is "done" when it's small enough to not bother cutting further. For a rough chop, that's maybe 35% of the original leaf size. For a fine chop, much smaller. I ended up calling this the _done threshold fraction_.

**What is the cut targeting?** My main behaviour in the kitchen, and probably yours as well? is to go for an area in the pile that will include the largest chunks. My other approach is to sort of hop across the board holding the top edge of the knife and push down.

**What does the pile look like between passes?** Real chopping isn't a perfectly scattered distribution of pieces. You scrape everything into a central heap. The heap compresses as pieces get smaller. A pile of finely chopped spinach occupies less space than the same mass in rough chunks. I modelled this with a dynamic packing density that tightens over time. 

![[full_board.png]]

I did start with a plan that used the full board, but noticed that this is probably not how people chop. A side-quest here is exploring how knife size and board shape influence the outcomes.

The simulation tracks every piece: its area, its generation (how many cuts old it is), its z-order in the pile, and its parent. Area is conserved perfectly throughout — the shoelace formula on the polygon vertices always gives the same total. That conservation check became the first sanity signal that the geometry was correct.

Here's what a few passes look like on 150 baby spinach leaves — roughly a 200g bag — on a standard 40×30cm board:

![[chopper_1sides_150leaves_20260513_111520.gif]]

Colour is lighter to darker green. The done pieces settle as a grey underlayer (and are no longer being chopped)

---

## Chopping in Numbers

Once the simulation was running I started logging statistics. 

- Total area of all the leaves, which was obviously conserved, but just there for bug checking, across every run. 
- Active piece count per pass (how many chunks are still big enough to chop). 
- The area of the largest surviving piece.

Plotting maximum piece area on a log scale, the decay looked suspiciously linear. Which means it's exponential. Every pass, the largest piece shrinks by a roughly constant _fraction_ — not a constant amount.

![[chopper_1sides_150leaves_20260513_111520_summary.png]]


This happens because the strategy is _target_largest_: every cut is guaranteed to hit the current biggest piece. If a uniform random cut splits a piece, the expected size of the larger child is three-quarters of the parent. 

Each cut lands somewhere random across the piece. The _split ratio_ — call it S is the fraction of area that ends up on one side. S can be anything between 0 (a vanishingly thin sliver of a leaf) and 1 (the entire piece, if the cut just grazed the edge). Assuming cuts are equally likely to land anywhere, S is uniformly distributed across that range, in other words, all cuts are possible.

The piece that survives to be cut next is the _larger_ of the two: max(S, 1−S). It's always at least half the original (see the first image, the NEXT cut would target the green side), and at most the whole thing.

On average, how large is that larger piece? Well it's the mid-point over half the range, then doubling to account for the symmetric lower half:

$$
E[max(S, 1−S)] = 2 × ∫_{½}^{1} s ds = 2 × (½ − ⅛) = ¾
$$


Three quarters. Every cut on the largest piece reduces it to, on average, 75% of what it was. After k cuts in a row: max ≈ A × (¾)^k.


To get from the original leaf area down to some threshold f, you need:

$$k = \left\lceil \frac{\ln(1/f)}{\ln(4/3)} \right\rceil$$


For a rough chop (f = 0.35): four cuts. For a fine chop (f = 0.05): twelve. The logarithm means going finer isn't as expensive as you'd expect — each additional level of fineness only adds one more cut, not doubles the work.

...but only up to a point.

---

## The Crossover Nobody Told Me About

As I explained, each cut on the largest piece produces two children: a larger one (expected 3/4 of the parent) and a smaller one (expected 1/4). For rough chop, that smaller child (e.g. 1/4 of the leaf) is immediately below threshold (since f = 0.35 > 0.25). It retires to the done pile right away.

So when we are "rough chopping" we have the parent in one generation, and two children in the next generation, like a little binary tree. But when rough chopping, the smaller part won't go on for further generations. 

For fine chop (f < 0.25), the smaller side will live another generation. Both children survive. Every cut now creates _two_ active pieces instead of one. The fragmentation isn't a chain anymore it's a spanning binary tree. And the total work is proportional to the number of nodes in that tree, not just its depth.

The tree grows roughly as (1/f)^1, while the chain grows as ln(1/f). For fine chop at f = 0.01: the chain predicts ~16 cuts, the tree demands ~100.

The crossover is at **f = 1/4 = 0.25**, determined entirely by the expected split ratio. Below that line, the strategy of targeting the largest piece becomes increasingly inefficient as a flood of surviving side branches accumulates faster than you can clear them.

The practical implication for cooking: rough chop, target the largest. For Fine chop: use a methodical sweep over the whole pile. The rocking knife motion that chefs use for instance.

---

## It Goes Deeper Than That

Once I started pulling on this thread, I found there were entire fields of mathematics that had been thinking about this problem. 

**Fragmentation theory** is the formal study of exactly this: how objects break into pieces, and what the resulting size distribution looks like over time. Jean Bertoin wrote the definitive treatment in 2006. Our simulation is a _conservative_ (area-preserving) _mass-dependent_ fragmentation — the cutting rate depends on the size of the piece, because we always target the largest.

**Kolmogorov's comminution theory** (1941) proved that repeated random subdivision drives fragment sizes toward a log-normal distribution regardless of the starting shape. That was the prediction I was testing with the distribution charts — does the histogram of log(area) look bell-shaped over time?

**Galton-Watson branching processes** describe the tree structure of the fragmentation exactly. Each piece produces exactly two offspring. The tree of all cuts is a binary Galton-Watson tree with a continuous type space (the piece area). The theory gives you tools to reason about when this tree explodes — which is precisely the f < 0.25 regime described above.

**Stochastic geometry** and the **Crofton formula** underpin the pile coverage model — how many pieces does a random line through a circular pile hit? The answer, derived from geometric probability, is √(N×d), where N is the piece count and d is the packing density.

**Extreme value theory** governs the maximum survivor — the piece that refuses to get small. The slow decay we observed (shifting from exponential to approximately 1/k) is characteristic of the Fréchet class of extreme distributions.

And then there's the connection to **algorithm design**. The "target the largest, sweep for fine" finding has well-known analogues:

- **Matching Pursuit vs FFT**: Matching Pursuit greedily picks the dominant frequency component, ideal for sparse approximation. The FFT sweeps all frequencies simultaneously, necessary for complete reconstruction.
- **SGD vs batch gradient descent**: Stochastic gradient descent (sequential, greedy) reaches a rough minimum quickly. Full batch descent (sweeps all data) converges precisely. Mini-batch is the crossover.
- **QuickSelect vs radix sort**: QuickSelect is optimal for finding a single order statistic. For full sorting at fine granularity, radix sort's uniform sweep wins.
- **Greedy best-first search vs Dijkstra's**: Go greedily toward the goal for rough paths; sweep systematically for exact shortest paths.

The pattern is the same in every case: greedy sequential strategies are optimal for rough targets but lose badly to parallel sweep strategies for fine ones. The crossover is determined by the problem's branching ratio — the equivalent of our f = 1/4.

---

## A Prediction Formula

Combining the per-leaf cut count with the pile coverage geometry, you can write a closed-form prediction for how many passes it takes to finish a pile:

$$P̂ = ⌈ ln(1/f) / ln(4/3) ⌉ × √(N / d_eff) / c$$

Where:

- **f** is the done threshold fraction (how small a piece needs to be before you stop cutting it)
- **N** is the number of leaves
- **c** is cuts per pass
- **d_eff** is the effective average packing density over the simulation (≈ 0.55 for a typical pile)

For a 200g bag of baby spinach (150 leaves) at rough chop (f = 0.35) with 4 cuts per pass, this predicts about 17 passes. Which means roughly 17 passes of a knife across a 40×30cm board. That seems about right, honestly.

---

## What Started As a Distraction

I started this because I was genuinely puzzled by my own mediocre kitchen competence. How was I producing reasonable results with no real skill?

The answer, it turns out, is that hunting the largest piece is a well-studied greedy algorithm with provable optimality properties for a specific range of targets. My kitchen instinct is, accidentally, mathematically correct — within its regime.

What I didn't anticipate was finding Galton-Watson branching processes, Kolmogorov's 1941 grinding theorem, and a connection to how neural networks are trained — all from chopping spinach.

The simulation is written in Python, runs in a few seconds for a realistic bag of leaves, and produces a GIF of the pile being progressively demolished. The code is on my GitHub if you want to explore it.

And if you're cooking: rough chop, go for the big pieces. Fine chop, sweep the whole board every time.

---

_Topics if you want to go further: fragmentation theory, Kolmogorov comminution theory, stochastic geometry, Galton-Watson branching processes, extreme value theory, greedy algorithms and scheduling theory, Smoluchowski coagulation-fragmentation equations, Gibrat's Law._