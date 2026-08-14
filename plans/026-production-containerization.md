# Plan 026 — Production Containerization

Branch: `plan/026-production-containerization`  
Base: `origin/main` at phase start  
Status: active

## Objective

Provide a local-only, production-grade Docker release workflow for GHCR with linux/amd64 and linux/arm64 images, pull-only staging Compose, Makefile operations, external runtime secrets, and reproducible update/rollback behavior suitable for a 64-bit ARM Orange Pi.

## Rules

- No CI, PR, merge, force-push, or implementation on `main`.
- Makefile is the canonical routine interface.
- Docker build context is a filtered local tar/filesystem context; repository root `.` is never used.
- Compose is registry-image-only and contains neither `build:` nor `context:`.
- Reuse external PostgreSQL, ClickHouse, and observability infrastructure.
- Never persist or print secrets.

## Phase checklist

- [x] Phase 0 — Pre-flight, authority, local Docker/GHCR inspection, branch/bootstrap.
- [x] Phase 1 — Production Dockerfile and minimal non-dot build context.
- [x] Phase 2 — Canonical Makefile operations interface.
- [x] Phase 3 — Multi-platform Buildx build and GHCR publication.
- [x] Phase 4 — Pull-only Compose and ignored staging runtime environment.
- [x] Phase 5 — Final image security and runtime-hardening audit.
- [ ] Phase 6 — GHCR push, pull-back, and registry-only staging proof.
- [ ] Phase 7 — Full local staging runtime acceptance.
- [ ] Phase 8 — Pull/recreate staging update simulation and rollback evidence.
- [ ] Phase 9 — Explicit database migration operation.
- [ ] Phase 10 — Documentation and durable agent-rule reconciliation.
- [ ] Phase 11 — Final clean-room Makefile-only acceptance.

## Acceptance evidence

Record immutable SHA tag, staging tag, remote multi-architecture manifest/digest, pulled RepoDigest, image size, non-root UID, health/HTTP/auth/workspace/Viewer/realtime smoke, PostgreSQL/ClickHouse/OTEL reachability, secret audits, restart/update behavior, and all validation results in the session evidence and final summary.
