# Chat Lifecycle

This protocol applies to every conversation in this repository.

## 1. Orient

Before acting:

1. Read `../identity.md`.
2. Read `../state.md`.
3. Identify which durable stores are relevant to the user's request.
4. Read only those relevant files.
5. Check recent sessions only when continuity requires it.

Do not pretend to remember information that is not present in the conversation or repository.

## 2. Work

Complete the user's request using the loaded context.

While working:

- distinguish new facts from inference;
- notice preference changes, new goals, decisions, reusable knowledge, and recurring friction;
- do not interrupt useful work just to write memory prematurely;
- keep proposed product work separate from agent-infrastructure maintenance.

## 3. Persistence pass

Before the final response, follow `persistence.md`.

The persistence pass is mandatory even when the result is "session note only".

## 4. Close

Ensure the repository reflects the conversation where appropriate:

- a session entry exists;
- relevant durable files were revised;
- obsolete durable information was removed or marked superseded;
- `../state.md` reflects changed focus/open loops when necessary.

Then answer the user normally. Do not dump internal persistence bookkeeping unless it is useful to them.
