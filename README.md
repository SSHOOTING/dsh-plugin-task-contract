# dsh-plugin-task-contract

**Turn one vague request into an editable 5-line contract: goal, non-goals, acceptance criteria, budget and risks — before the agent starts.**

This is one of 14 read-only observability plugins for the DSH agent lifecycle (theme: **Task Contract Card**). It reads only metadata from session events — never prompts, tool bodies, or file contents — and makes no network calls.

## Install

```powershell
dsh plugin --profile web add dsh-plugin-task-contract
```

Requires Node `^22.19.0 || >=24` and DSH `>=0.2.0-rc.2 <0.3.0`.

## 30-second demo

1. Use DSH normally for a few turns.
2. In any session, type `/task-contract`.
3. You get a compact, read-only report; use `/task-contract --json` for machine-readable output.

```text
[task-contract] 0% contract signals found in 10 event(s)
  Goal: pass: 3 files written
  Non-goals: none stated — confirm before acting
  Acceptance: no acceptance criteria — add at least one
  Budget: unset — suggest a token/time cap
  Risks: no deadline stated
Edit this contract in chat before the agent proceeds.
```

## What it reads

Session event metadata only: event types, tool names, token counts, and route names. Credential-looking values are redacted before display. No file contents or prompts are read, stored, or transmitted.

## License

MIT — SSHOOTING.
