# Memory

This directory stores durable context about the user and their choices.

Memory is not a transcript. Session history belongs in `../sessions/`.

## Files

- `profile.md` — stable facts and context about the user.
- `preferences.md` — durable working and communication preferences.
- `goals.md` — active and long-term outcomes the user is pursuing.
- `decisions.md` — decisions that should constrain or guide future work.

## Entry guidance

Prefer small, editable bullets. Add source/confidence only when it improves clarity.

Example:

```md
- Prefers X over Y for this workspace. `(source: user-stated)`
```

When a fact changes, revise the existing entry rather than leaving contradictory active entries.
