# RelayX 🚀(Work in Progress!!!)
### Reliable Webhook Delivery Infrastructure

**RelayX is an in-progress webhook delivery platform designed to help applications deliver events to external services reliably, asynchronously, and at scale.**

Webhooks are a common way for applications to notify other systems when something happens. However, delivering webhooks reliably introduces challenges such as network failures, timeouts, duplicate requests, retry policies, rate limits, and monitoring delivery outcomes.

RelayX aims to solve these problems by providing a centralized infrastructure for accepting events, persisting them, scheduling webhook deliveries, retrying failures, and tracking delivery attempts.

> **Project Status:** 🚧 In Development  
> The initial API foundation and PostgreSQL event persistence are implemented. Asynchronous delivery, retries, security, observability, and the dashboard are planned milestones.

---

## 📌 Table of Contents

- [The Problem](#-the-problem)
- [Project Goals](#-project-goals)
- [Planned Features](#-planned-features)
- [Current Implementation](#-current-implementation)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Database Design](#-database-design)
- [Reliability and Delivery Guarantees](#-reliability-and-delivery-guarantees)
- [Development Roadmap](#-development-roadmap)
- [Engineering Challenges](#-engineering-challenges)
- [Testing and Performance](#-testing-and-performance)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 The Problem

Applications frequently need to notify external services when important events occur.

Examples include:

- A payment succeeds.
- A user creates an account.
- An order is shipped.
- An appointment is booked.
- A subscription is renewed.

A basic implementation might send an HTTP request directly to a destination whenever an event occurs.

However, this approach introduces several problems:

- **Network failures:** The destination might be temporarily unavailable.
- **Timeouts:** A destination might take too long to respond.
- **Lost events:** An application may crash before successfully processing an event.
- **Duplicate deliveries:** Retrying a request may cause the destination to process the same event more than once.
- **Traffic spikes:** A large number of events may overwhelm a destination.
- **Limited visibility:** Developers may not know whether a webhook succeeded or why it failed.
- **Operational complexity:** Implementing retries, delivery tracking, and recovery independently in every application is expensive.

RelayX is being built to centralize these responsibilities behind a reliable event ingestion and delivery system.

## 💡 Project Goals

The goal is to build more than a basic CRUD application.

RelayX is intended to explore practical backend engineering concepts, including:

1. Durable event persistence.
2. Asynchronous job processing.
3. Retry policies and exponential backoff.
4. Database transactions and transactional outbox patterns.
5. Idempotency and duplicate-delivery handling.
6. Concurrency control and rate limiting.
7. Secure webhook delivery.
8. Multi-tenant architecture.
9. Observability and operational monitoring.
10. Load testing and performance optimization.
11. Containerization and deployment.
12. Distributed systems failure handling.

The project will evolve incrementally, with reliability and correctness prioritized before introducing additional infrastructure.

---

## ✨ Planned Features

### 1. Event Ingestion
- REST API for accepting events.
- Request validation using Zod.
- Unique event identifiers.
- Durable storage using PostgreSQL.
- Consistent API error responses.

### 2. Asynchronous Delivery
- Background job processing with Redis and BullMQ.
- Configurable webhook destinations.
- HTTP delivery workers.
- Request timeouts.
- Controlled delivery concurrency.

### 3. Retry and Failure Management
- Automatic retries for eligible failures.
- Exponential backoff with jitter.
- Configurable retry policies.
- Delivery attempt history.
- Dead-letter handling for exhausted retries.
- Manual replay of failed events.

### 4. Reliability
- PostgreSQL as the durable source of truth.
- Transactional outbox for coordinating database persistence and job scheduling.
- Recovery of interrupted or abandoned work.
- Protection against duplicate processing.
- Explicit handling of partial failures.

### 5. Security
- API key authentication.
- Tenant isolation.
- HMAC-based webhook signatures.
- Timestamp validation to help prevent replay attacks.
- Destination URL validation and SSRF protection.
- Secure handling of secrets.

### 6. Rate Limiting and Fairness
- API request rate limits.
- Per-destination delivery limits.
- Concurrency controls.
- Protection against overloaded endpoints.
- Fair scheduling across tenants.

### 7. Dashboard
A React-based dashboard is planned to provide:

- Event and delivery statistics.
- Delivery status tracking.
- Request and response details.
- Retry history.
- Failed-event inspection.
- Manual replay controls.
- Endpoint configuration.

### 8. Observability
- Structured logging.
- Application metrics.
- Delivery success and failure rates.
- Queue depth and processing latency.
- Worker health monitoring.
- Prometheus and Grafana integration.

### 9. Deployment and Performance
- Docker-based development environment.
- Automated testing and CI/CD.
- Production-oriented deployment configuration.
- Load testing and bottleneck analysis.
- Performance benchmarks and documented trade-offs.

---

## 🛠 Current Implementation

RelayX is under active development.

### Completed

- [x] Node.js and TypeScript project setup.
- [x] Express application and server.
- [x] TypeScript build configuration.
- [x] Environment variable configuration.
- [x] Git and GitHub repository setup.
- [x] Health-check endpoint.
- [x] Event payload validation using Zod.
- [x] PostgreSQL running through Docker.
- [x] Initial PostgreSQL `events` table.
- [x] PostgreSQL connection pool using `pg`.
- [x] Event ingestion endpoint.
- [x] UUID generation for events.
- [x] Persistent event storage in PostgreSQL.
- [x] Database-aware API responses and basic error handling.

### In Progress

- [ ] Event retrieval by ID.
- [ ] Improved request and identifier validation.
- [ ] Centralized error handling.
- [ ] Automated API and database integration tests.

### Planned

- [ ] Event destination management.
- [ ] Redis and BullMQ integration.
- [ ] Asynchronous webhook delivery workers.
- [ ] Retry policies and delivery attempt tracking.
- [ ] Transactional outbox.
- [ ] API authentication and multi-tenancy.
- [ ] Webhook signatures and SSRF protection.
- [ ] Rate limiting and fair scheduling.
- [ ] Delivery dashboard.
- [ ] Observability and production deployment.

The checklist will be updated as each milestone is implemented and tested.

---

## 🏗 Architecture

### Current Architecture

The implemented ingestion flow is:

```text
                  Client Application
                          |
                          v
                    HTTP Request
                          |
                          v
                  Express REST API
                          |
                          v
                   Zod Validation
                          |
                 +--------+--------+
                 |                 |
              Invalid            Valid
                 |                 |
                 v                 v
             HTTP 400        PostgreSQL INSERT
                                   |
                          +--------+--------+
                          |                 |
                       Success            Failure
                          |                 |
                          v                 v
                    HTTP 202             HTTP 500
```

The current API validates an incoming event, inserts it into PostgreSQL, and responds only after the insert succeeds.

The delivery pipeline has not yet been implemented.

### Target Architecture

The planned architecture introduces asynchronous processing:

```text
                    Client Application
                            |
                            v
                      RelayX API
                            |
                            v
                     Request Validation
                            |
                            v
                        PostgreSQL
                      Event Persistence
                            |
                            v
                    Transactional Outbox
                            |
                            v
                     Outbox Publisher
                            |
                            v
                       Redis + BullMQ
                            |
                            v
                     Delivery Workers
                            |
                            v
                     Destination APIs
                            |
                   +--------+--------+
                   |                 |
                Success             Failure
                   |                 |
                   v                 v
              Mark Delivered    Retry Policy
                                     |
                              +------+------+
                              |             |
                           Retryable     Exhausted
                              |             |
                              v             v
                         Reschedule    Dead Letter
```

This diagram represents the intended design, not the current implementation.

PostgreSQL will remain the source of truth for event and delivery state. Redis and BullMQ will support asynchronous scheduling and processing.

The transactional outbox will help prevent events from being persisted in PostgreSQL without eventually being published for delivery.

---

## 💻 Technology Stack

| Technology | Purpose | Status |
|---|---|---|
| Node.js | JavaScript runtime | Implemented |
| TypeScript | Type safety and maintainability | Implemented |
| Express | REST API framework | Implemented |
| Zod | Request validation | Implemented |
| PostgreSQL | Durable event storage | Implemented |
| Docker | Database containerization | Implemented |
| `pg` | PostgreSQL client and connection pooling | Implemented |
| Redis | Background-processing infrastructure | Planned |
| BullMQ | Job queues and retry scheduling | Planned |
| React | Web dashboard | Planned |
| Prometheus | Metrics collection | Planned |
| Grafana | Metrics visualization | Planned |
| GitHub Actions | CI/CD automation | Planned |
| Nginx | Reverse proxy and deployment configuration | Planned |

The stack will expand only when a component solves a concrete architectural problem.

Kafka may be explored later if the project develops a genuine requirement for event streaming, replayable streams, or independent downstream consumers.

---

## 🚀 Getting Started

### Prerequisites

Install the following:

- Node.js and npm.
- Docker Desktop.
- Git.

You do not need to install PostgreSQL directly on Windows when running it through Docker.

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd RelayX
```

Replace the placeholder with the actual GitHub repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Start PostgreSQL

The following command creates a PostgreSQL 17 container with a persistent Docker volume:

```bash
docker run --name relayx-postgres \
  -e POSTGRES_USER=relayx_user \
  -e POSTGRES_PASSWORD=relayx_dev_password \
  -e POSTGRES_DB=relayx \
  -p 5432:5432 \
  -v relayx_pgdata:/var/lib/postgresql \
  -d postgres:17
```

Wait until PostgreSQL is ready:

```bash
docker exec relayx-postgres pg_isready -U relayx_user -d relayx
```

If you already have a container named `relayx-postgres`, start that container instead:

```bash
docker start relayx-postgres
```

Ensure it has port `5432` published to the host before continuing.

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://relayx_user:relayx_dev_password@127.0.0.1:5432/relayx
PORT=3000
```

These are development credentials. Replace them with appropriately managed secrets in any deployed environment.

**Never commit `.env` or real credentials to GitHub.**

### 5. Create the database table

Connect to PostgreSQL:

```bash
docker exec -it relayx-postgres psql -U relayx_user -d relayx
```

Execute:

```sql
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY,
    event_type VARCHAR(200) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'accepted',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Exit the PostgreSQL shell:

```sql
\q
```

### 6. Build and run

Compile TypeScript:

```bash
npm run build
```

Start the development server:

```bash
npm run dev
```

The API should now be available at:

```text
http://localhost:3000
```

### 7. Verify the server

Request:

```http
GET /health
```

Full URL:

```text
http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "RelayX"
}
```

---

## 📡 API Reference

### Health Check

**Endpoint:** `GET /health`

Returns the current application health response.

Example:

```json
{
  "status": "ok",
  "service": "RelayX"
}
```

### Submit an Event

**Endpoint:** `POST /v1/events`

Accepts an event, validates its payload, and persists it in PostgreSQL.

Request header:

```http
Content-Type: application/json
```

Request body:

```json
{
  "event": "payment.success",
  "data": {
    "paymentId": "pay_123",
    "amount": 1500,
    "currency": "INR"
  }
}
```

Successful response: `202 Accepted`

```json
{
  "message": "Event accepted.",
  "event": {
    "id": "generated-uuid",
    "event_type": "payment.success",
    "status": "accepted",
    "created_at": "database-generated-timestamp"
  }
}
```

The UUID and timestamp are generated at runtime.

Invalid payloads return `400 Bad Request`. Database persistence failures return `500 Internal Server Error`.

**Important:** The current implementation accepts and persists events, but does not yet deliver webhooks to destination endpoints. That capability is part of the planned asynchronous delivery milestone.

### Retrieve an Event

**Planned endpoint:** `GET /v1/events/:id`

The retrieval endpoint is the next API milestone. Once implemented, it will return a persisted event by its UUID.

Expected future behavior:

- `200 OK` when the event exists.
- `400 Bad Request` when the supplied identifier is invalid.
- `404 Not Found` when no matching event exists.
- `500 Internal Server Error` when retrieval fails due to an unexpected server or database error.

This endpoint is not marked as implemented until it has been added and tested.

---

## 🗄 Database Design

The initial `events` table stores incoming events.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Unique event identifier |
| `event_type` | VARCHAR(200) | Name of the event |
| `payload` | JSONB | Event data |
| `status` | VARCHAR(30) | Current event status |
| `created_at` | TIMESTAMPTZ | Event creation timestamp |

### Why PostgreSQL?

PostgreSQL provides durable storage, transactions, constraints, indexing, and JSONB support.

JSONB allows different event types to contain different payload structures without requiring a separate table for every event.

The initial schema is intentionally small. Future migrations will introduce additional entities for destinations, delivery attempts, tenants, idempotency, and the transactional outbox.

Schema changes will be managed deliberately as the architecture evolves.

---

## 🔒 Reliability and Delivery Guarantees

Reliability is a central design goal of RelayX.

### Durable Acceptance

The API returns `202 Accepted` only after the event has been successfully inserted into PostgreSQL.

This protects against acknowledging an event before its database write succeeds.

### At-Least-Once Delivery

The intended delivery model is **at-least-once delivery**.

A webhook may be delivered more than once when a destination processes a request but its response is lost, or when RelayX cannot determine whether the destination completed the operation.

RelayX will use stable event identifiers, delivery tracking, retry policies, and webhook signatures to support reliable integrations.

Destinations should use idempotency mechanisms where duplicate processing would cause unwanted side effects.

Exactly-once processing across arbitrary external HTTP endpoints cannot be guaranteed by RelayX alone.

### Retry Strategy

The planned retry system will support:

- Exponential backoff.
- Randomized jitter.
- Configurable maximum attempts.
- Request timeouts.
- Retry classification.
- Dead-letter handling.
- Manual replay.

### Transactional Outbox

A database transaction and a Redis enqueue operation cannot automatically form one atomic transaction.

The planned transactional outbox will persist an event and its publication record together in PostgreSQL. A separate publisher will process pending outbox records and enqueue delivery jobs.

This approach helps prevent events from becoming permanently stranded between database persistence and queue publication.

---

## 🗺 Development Roadmap

RelayX will be built incrementally, with each phase introducing a new engineering concept.

### Phase 1 — API Foundation and Event Ingestion
- [x] Initialize Node.js and TypeScript.
- [x] Configure Express.
- [x] Add a health endpoint.
- [x] Validate event payloads.
- [x] Configure PostgreSQL.
- [x] Persist events in the database.
- [ ] Complete and test event retrieval.
- [ ] Add automated tests.

### Phase 2 — Event and Destination Management
- [ ] Introduce webhook destination records.
- [ ] Associate events with appropriate destinations.
- [ ] Define delivery state transitions.
- [ ] Add delivery-attempt data structures.
- [ ] Implement database migrations.

### Phase 3 — Asynchronous Processing
- [ ] Integrate Redis.
- [ ] Integrate BullMQ.
- [ ] Implement background delivery workers.
- [ ] Deliver events to destination URLs.
- [ ] Add request timeouts and concurrency controls.

### Phase 4 — Retries and Failure Recovery
- [ ] Implement exponential backoff with jitter.
- [ ] Classify retryable and permanent failures.
- [ ] Track delivery attempts.
- [ ] Implement dead-letter handling.
- [ ] Add manual event replay.
- [ ] Handle worker interruptions and recovery.

### Phase 5 — Reliability Engineering
- [ ] Implement a transactional outbox.
- [ ] Build an outbox publisher.
- [ ] Handle duplicate job processing.
- [ ] Define delivery state transitions and invariants.
- [ ] Test database and queue failure scenarios.

### Phase 6 — Security and Multi-Tenancy
- [ ] Introduce API key authentication.
- [ ] Add tenant isolation.
- [ ] Sign webhook requests using HMAC.
- [ ] Validate destination URLs.
- [ ] Mitigate SSRF risks.
- [ ] Protect credentials and secrets.
- [ ] Implement request rate limits.

### Phase 7 — Rate Limiting and Fair Scheduling
- [ ] Add per-tenant and per-destination limits.
- [ ] Control concurrent deliveries.
- [ ] Prevent one destination from monopolizing workers.
- [ ] Evaluate queue backpressure strategies.

### Phase 8 — Dashboard
- [ ] Build a React dashboard.
- [ ] Display event and delivery status.
- [ ] Show delivery attempt history.
- [ ] Inspect failed deliveries.
- [ ] Add manual replay controls.
- [ ] Provide basic operational statistics.

### Phase 9 — Observability
- [ ] Add structured logging.
- [ ] Export application metrics.
- [ ] Measure delivery latency and success rates.
- [ ] Track queue depth and worker health.
- [ ] Integrate Prometheus and Grafana.

### Phase 10 — Performance and Scale
- [ ] Establish load-testing scenarios.
- [ ] Measure ingestion throughput.
- [ ] Measure delivery throughput and latency.
- [ ] Test concurrent traffic and destination failures.
- [ ] Identify database and worker bottlenecks.
- [ ] Tune connection pools and concurrency.
- [ ] Document measured performance and trade-offs.

### Phase 11 — Deployment and Production Readiness
- [ ] Containerize the application.
- [ ] Define a reproducible development environment.
- [ ] Add automated CI checks.
- [ ] Configure production secrets.
- [ ] Set up HTTPS and reverse proxying.
- [ ] Implement health and readiness checks.
- [ ] Document deployment and recovery procedures.

### Phase 12 — Advanced Distributed Systems
- [ ] Evaluate the need for Kafka.
- [ ] Explore event-streaming and independent consumers if justified.
- [ ] Document scaling and partitioning strategies.
- [ ] Investigate multi-instance deployment.
- [ ] Evaluate disaster recovery and operational trade-offs.

The order may evolve as implementation and testing reveal new requirements.

---

## 🧪 Testing and Performance

Testing will cover both functional correctness and operational behavior.

Planned test categories include:

- Unit tests for validation and retry logic.
- Integration tests against PostgreSQL.
- API tests for success and error responses.
- Delivery-worker tests.
- Duplicate-delivery scenarios.
- Database and Redis failure scenarios.
- Retry and recovery tests.
- Load tests for concurrent event ingestion.
- Security tests for destination URL validation and tenant isolation.

Performance claims will be documented only after measurements have been collected under specified test conditions.

The objective is not merely to demonstrate a high request count, but to understand throughput, latency, resource utilization, and failure behavior.

---

## 🔭 Future Improvements

Potential future enhancements include:

- Event filtering and routing rules.
- Scheduled webhook delivery.
- Destination-specific retry policies.
- Event expiration and retention policies.
- Payload size limits.
- Tenant usage quotas.
- Delivery analytics.
- Advanced scheduling and fairness mechanisms.
- Event streaming with Kafka, if justified by actual requirements.
- Horizontal scaling of API and worker instances.

These features will be evaluated against real requirements rather than added simply to increase the number of technologies in the stack.

---

## 🤝 Contributing

RelayX is currently a personal learning and engineering project.

The development process emphasizes incremental implementation, meaningful Git commits, testing, and documenting important architectural decisions.

Potential contributors should open an issue to discuss significant changes before submitting a pull request.



## 👨‍💻 Project Philosophy

RelayX is being developed to explore the engineering challenges behind reliable backend infrastructure.

The focus is on understanding not only how to build a feature, but also how it behaves when dependencies fail, traffic increases, requests are duplicated, and processes restart unexpectedly.

The long-term goal is to build a working, testable, and well-documented system that demonstrates practical knowledge of backend development, distributed systems, reliability engineering, and system design.

**Status: Work in Progress — Building one reliable component at a time.** 🚀
