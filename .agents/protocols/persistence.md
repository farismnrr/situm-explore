# Persistence Protocol

Run this protocol before finishing every conversation.

## Step 1 — Always write the session trace

Append a concise entry to `../sessions/YYYY-MM-DD.md`.

A session entry should contain:

- a time or sequence heading;
- what the user wanted;
- important actions/decisions;
- durable changes written elsewhere;
- unresolved next step, if any.

Keep it concise. Do not store a verbatim transcript.

## Step 2 — Classify new information

For each meaningful new item, choose at most one primary durable destination:

| Information | Destination |
| --- | --- |
| Stable user fact | `../memory/profile.md` |
| User preference | `../memory/preferences.md` |
| User goal/outcome | `../memory/goals.md` |
| Explicit or architectural decision | `../memory/decisions.md` |
| Reusable concept/reference/framework | `../knowledge/index.md` or a dedicated knowledge file later |
| Reusable lesson about agent behavior/process | `../reflections/lessons.md` |
| Current focus/open loop/next action | `../state.md` |

Not every category needs an update every chat.

## Step 3 — Apply the durability test

Persist an item outside the session log only if at least one is true:

- it is likely to matter in a future conversation;
- the user explicitly wants it remembered;
- it changes an existing preference, goal, decision, or current state;
- it is reusable knowledge rather than one-off context;
- it captures a lesson that should change future agent behavior.

Otherwise, leave it only in the session note.

## Step 4 — Preserve provenance

When useful, annotate entries with one of:

- `source: user-stated`
- `source: observed`
- `source: inferred`

Inference must never be phrased as an explicit user fact.

## Step 5 — Deduplicate and revise

Before adding a durable entry:

1. Search for an existing equivalent entry.
2. Update the existing entry if the new information supersedes it.
3. Avoid contradictory duplicates.
4. Remove stale wording when a newer user statement replaces it.

## Step 6 — Privacy filter

Never persist:

- passwords;
- API keys or access tokens;
- authentication secrets;
- private keys;
- credentials;
- sensitive data that is unnecessary for the agent's future usefulness.

If sensitive context is necessary for the current task, use it transiently and do not copy it into `.agents/`.
