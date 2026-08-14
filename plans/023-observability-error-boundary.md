# Plan 023 — Observability, Correlation & Safe Error Boundary

Status: complete; OTLP lifecycle, request correlation, nested spans, and sanitized error paths accepted.

Branch: plan/023-observability-error-boundary

Depends on: Plan 022 accepted and integrated into updated main.

## Goal

Make browser -> Nitro -> database/Situm failures traceable end-to-end while keeping internal/critical details out of client responses.

## Mandatory Phase 0 discovery

### Stacked execution progress

- [x] Phase 1 — add application OTLP exporter/lifecycle using the existing collector.
- [x] Phase 2 — add request correlation/trace propagation and meaningful DB/Situm nested spans.
- [x] Phase 3 — implement safe structured errors and client reference IDs.
- [x] Phase 4 — prove application trace/error paths and complete acceptance.

Before adding observability dependencies or containers:
- inspect docker ps locally;
- inspect relevant runtime/repository configuration;
- identify the already-running logging/metrics/tracing stack;
- identify supported ingestion/propagation protocols and collector endpoints;
- reuse existing infrastructure;
- do not provision duplicates by assumption.

Persist discovered evidence without secret values.

If the stack is unavailable/inaccessible or requires endpoint/auth/network config that cannot be inferred safely, stop acceptance and report the exact operator prerequisite.

## Frontend correlation header

Frontend app HTTP requests must carry explicit correlation/trace context. Prefer W3C traceparent when the discovered stack supports it. A small x-request-id/reference id may coexist for support lookup.

Do not invent a parallel tracing protocol when the stack already supports a standard. Do not put user emails, credentials, tokens, workspace secrets, or sensitive payloads in headers/baggage.

## Server telemetry

Instrument meaningful boundaries only:
- incoming Nitro requests;
- authenticated user/workspace resolution;
- PostgreSQL/ClickHouse operations where useful;
- outbound Situm operations;
- normalized upstream failures.

Use structured logging/redaction. Prefer stable internal user/workspace IDs over email addresses. Avoid raw request/response bodies by default.

## Safe client error contract

Normalize expected validation, unauthenticated, forbidden, not-found, conflict, upstream, and internal failures.

Client responses expose safe semantics plus a correlation/reference id when useful. Stack traces, DB details, SDK internals, raw upstream bodies, secrets, and critical diagnostics remain server-side.

Browser console output must not become an alternate leakage path for internal server exceptions.

## Acceptance

- browser request traceable through Nitro and at least one downstream boundary in existing observability;
- frontend correlation headers received/propagated correctly;
- stable correlation context;
- expected 4xx vs unexpected 5xx distinguishable;
- client errors sanitized;
- server telemetry actionable;
- no duplicate observability stack;
- critical/internal details absent from client JSON/toasts/browser console.

Run baseline checks plus production-preview failure-path smoke.

See plans/021-025-prerequisites.md.
