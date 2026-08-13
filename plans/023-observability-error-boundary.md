# Plan 023 — Observability, Correlation & Safe Error Boundary

Status: **queued after Plan 022 integration**

Branch: `plan/023-observability-error-boundary`

## Goal

Make browser -> Nitro -> database/Situm failures traceable end-to-end while keeping internal/critical details out of client responses.

## Mandatory Phase 0 discovery

Before adding any observability dependency or container:

- inspect `docker ps` locally;
- inspect relevant container/runtime/repository configuration;
- identify the user's already-running logging/metrics/tracing stack;
- reuse the existing stack and supported protocols;
- do not provision duplicate observability services by assumption.

Persist exact discovered evidence in the session/plan closeout.

## Correlation/tracing

Standardize request correlation from frontend to Nitro and downstream work. If the existing stack supports W3C Trace Context/OpenTelemetry, propagate that standard correctly. A small request/reference id may coexist for support lookup.

Do not put sensitive values into trace headers, baggage, structured logs, or spans.

## Server telemetry

Instrument meaningful boundaries only:

- incoming Nitro requests;
- authenticated user/workspace resolution;
- PostgreSQL/ClickHouse operations where useful;
- outbound Situm operations;
- normalized upstream failures.

Use structured logging and redaction. Avoid logging raw request/response bodies by default.

## Safe client error contract

Normalize expected error classes such as validation, unauthenticated, forbidden, not found, conflict, upstream failure, and internal failure.

Client responses expose safe product semantics plus a correlation/reference id when useful. Stack traces, database details, SDK internals, raw upstream bodies, and critical diagnostics remain server-side in observability.

## Acceptance

- a browser request can be followed through Nitro and at least one downstream boundary in the existing observability stack;
- correlation context remains stable through the request path;
- expected 4xx and unexpected 5xx are distinguishable;
- client errors are sanitized;
- server observability retains actionable context;
- no duplicate observability stack is introduced.

Run baseline diff/lint/typecheck/build plus production-preview failure-path smoke.
