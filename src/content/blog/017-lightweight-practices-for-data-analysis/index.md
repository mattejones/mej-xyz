
---
title: Lightweight data analysis on a shoestring
description: How to build a reproducible data analysis pipeline from scratch, using only local tools and version control such as SQLite, DuckDB, Python and Git. 
date: May 10 2026
tags:
  - data
  - tech
  - analytics
---

Imagine you are a consultant, dropped into an unfamiliar client workspace. Insights are needed yesterday, your credentials request is stuck in the provisioning queue, and the data you have been handed is in a format you do not recognise. The data team has a backlog three sprints deep.

This is where most people reach for Excel. This post is about why you should reach for something better, and how to build a lightweight but robust analytical stack from tools you can set up in an afternoon.

Looker, Snowflake, Tableau and PowerBI are all excellent platforms when the environment is controlled and a data team is accessible. This stack assumes none of that. It runs locally, version-controls cleanly, and produces findings you can reproduce and defend weeks later.

### Data Sources

Before you write a single line of analysis, know where your data came from. That sounds obvious, but it's the thing most people skip when they're under pressure. In a consulting context especially, data extraction is rarely clean.  You may be working with exports from tools you've never seen, schemas that aren't documented and potentially a blend of timestamps and so forth. Getting rigorous about this upfront will result in a happier, more confident _Future you_. Anything you try to reproduce a few weeks later with fresh data will be far, far easier. 

| Practice | Why? |
|---|---|
| Record your exact extraction process | You need to know precisely where the data came from, what filters you applied and what date range you used. If you need to re-run the analysis against fresh data, this is what makes it repeatable |
| Keep raw exports untouched | Store them as-is in `data-sources/` and treat them as read-only. They are your ground truth. Never transform source files directly |
| Use a consistent file format | CSV or JSON for raw inputs. Pick a convention and stick to it across projects |

### Data warehouse - Database on Disk

When you need something you can reliably work with, and also share to others, a file based database instead of a Google Sheet is a true level-up. Being able to query and transform your data in SQL is such a significant win. 

SQLite is the simplest possible entry point to a file-based database. It's a single `.db` file, requires no server, no configuration, and is supported by virtually every language and tool you'll encounter. If your dataset is modest in size and your queries are straightforward: joins, aggregations, filters, then SQLite is entirely sufficient. Think of it as the honest workhorse: not glamorous, but it will never let you down, and you can open it with [DB Browser for SQLite](https://sqlitebrowser.org/) if you want a GUI without ceremony.

[DuckDB](https://duckdb.org) is an evolution to this. (This isn't a [SQLlite vs. DuckDB post](https://marginalia-search.com/search?query=duckdb+vs+sqlite)!!) Like SQLite it is embedded and serverless, just a single file, but it is purpose-built for analytical workloads rather than transactional ones. It handles aggregations across millions of rows, complex joins and window functions without complaint, and is noticeably faster than SQLite on the kind of queries analysts actually run.

A quick comparison to help you decide which to reach for:

| | [SQLite](https://sqlite.org) | [DuckDB](https://duckdb.org) |
|---|---|---|
| Best suited for | Modest datasets, simple queries | Large datasets, analytical queries |
| Direct file querying | No | Yes — CSV, JSON, Parquet |
| GUI option | [DB Browser for SQLite](https://sqlitebrowser.org) | [Harlequin](https://harlequin.sh) |
| When to reach for it | Quick, contained analysis | When performance or file querying matters |

The feature that earns its place in this stack is direct file querying. You can point DuckDB at a CSV or Parquet file and query it with SQL without importing anything:

```sql
SELECT event_name, AVG(event_duration_seconds)
FROM 'exports/events.csv'
GROUP BY event_name
ORDER BY 2 DESC
```

The file *is* the table. No ETL ceremony, no schema declaration upfront. For exploratory work against unfamiliar data, this is a material quality-of-life improvement.

### Pipeline - Python scripts

The gap between raw source data and something analytically useful is almost always wider than it looks. In a recent engagement I was handed telephony exports in a format I hadn't encountered before. The column names were all abbreviations, timestamps in epoch milliseconds, call outcome codes with no data dictionary. The data was real and complete; it just wasn't interpretable without work.

This is where Python earns its place. The pipeline layer is responsible for the transformation from raw to structured. Renaming columns to something human-readable, parsing timestamps into proper datetime types, decoding reference values into meaningful labels, and joining across multiple export files into a single coherent dataset. Each of those steps is a discrete Python script, not a monolith. Small, single-purpose scripts are easier to debug, easier to re-run in isolation, and easier to explain to someone else or to yourself when you come back to them cold.

A simple but effective pattern: each script reads from `data-sources/`, writes to `db/`, and logs what it did. Your pipeline folder becomes a readable history of every transformation decision you made.

### File-System layout

```
project/
├── data-sources/     # raw exports, untouched — CSV, JSON, whatever arrived
├── schema/           # column definitions, data dictionaries, notes on source format
├── queries/          # reusable SQL — exploratory and analytical
├── pipeline/         # Python scripts: one per transformation step
├── db/               # your DuckDB or SQLite file lives here
├── reports/          # rendered Markdown or HTML outputs
└── analysis/         # notebooks or ad-hoc scripts that don't belong in pipeline
```

The rule worth observing: nothing in `data-sources/` ever gets modified. It's read-only by convention. If a transformation is wrong, you fix the pipeline script — you don't quietly edit the source file and wonder later why the numbers changed.

### Version control

Git isn't just for code. In this stack, it's your audit trail.

Commit your raw data exports alongside your scripts. Commit your DuckDB schema alongside your pipeline. When you produce a finding and a stakeholder questions it three weeks later, you can check out the exact state of the repository at the time of the analysis and reproduce it completely. You can share results with stakeholders and still answer follow-up questions weeks later, based on the exact data snapshot used, even if the underlying data has since changed.

A few practical habits worth building:
- Commit raw source files the moment you receive them, before touching anything
- Use meaningful commit messages: `add call exports week of 2026-04-14` is more useful than `update data`
- Tag significant milestones: `git tag v1.0-initial-findings` before you share anything with a stakeholder
- Keep your `db/` file in `.gitignore` if it's large — it's reproducible from the pipeline anyway
- Consider using [gitmoji.dev](https://gitmoji.dev/) to give yourself visual hints when scrolling back through changes. 



### AI Support

Within your project, you can and should absolutely leverage AI tools to help you get a head start. Here are some suggestions :

Writing a [CLAUDE.md](https://docs.anthropic.com/en/docs/claude-code/memory) (or similar) love letter to your LLM, explaining all the ins and outs of your project repository and how you would like it to function. 

**Schema interpretation.** When you're handed an export with opaque column names and no documentation, AI is remarkably good at making educated guesses, but these ARE guesses. I think the experience is better when it's a widely known platform (e.g. Salesforce data vs. some closed-sourced infrastructure tool). Paste a sample of the raw data and ask what each column likely represents. You'll still need to validate the interpretation with a human-in-the-loop review (this is important!!!), but it's a faster starting point than reverse-engineering from scratch.

**First-draft SQL.** Describe what you're trying to find in plain language and ask for the query. Treat the output as a starting point, not a final answer, but for window functions or complex aggregations you don't write every day, it saves meaningful time.

**Anomaly explanation.** When a number looks wrong, AI is useful as a sounding board. Describe the anomaly and the shape of your data. This can help pick out if it's an input, process, output or uhh... _cognition issue_ with the data. AI can often surface the class of problem (timezone offset, double-counting from a join, unexpected null handling) faster than you'd get there alone.

**Narrative drafting.** Once your analysis is complete, AI can turn a set of findings into a first-draft summary for a non-technical audience. The analyst's job becomes editing rather than blank-page writing.

### Taking it further

This stack intentionally keeps complexity low. If it clicks for you, these are the natural next steps worth exploring.

| Tool | What it adds |
|---|---|
| [dbt-core](https://docs.getdbt.com/docs/core/connect-data-platform/duckdb-setup) | Versioned, testable SQL transformations with auto-generated documentation. Runs entirely locally with the DuckDB adapter |
| [Quarto](https://quarto.org) | Literate programming for analysts. Code, SQL and prose live in the same document and render to HTML, PDF or Markdown. Numbers and narrative update together |
| [Marimo](https://marimo.io) | A notebook experience that stores files as plain `.py` files, making them properly git-diffable unlike Jupyter |
| [Polars](https://pola.rs) | A faster, more memory-efficient alternative to [pandas](https://pandas.pydata.org) for the pipeline layer, with a cleaner transformation API |
| [Evidence](https://evidence.dev) | SQL and Markdown combine into shareable data apps and reports, without needing a BI tool |

### Wrapping up

The tools in this stack are not the point. The point is the discipline underneath them: treat your analysis like software. Version it, structure it, make it reproducible.

The number of times an analyst has been caught out by a finding they cannot reproduce, a source file they quietly overwrote, or a transformation they cannot explain three weeks later is not small. This stack gives you a defensible trail from raw data to finished finding, without needing a warehouse, a data team, or a cloud subscription. For a solo analyst or a small consulting engagement, that is often exactly enough.

