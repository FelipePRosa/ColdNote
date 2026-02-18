# ClearWallet

## 1. Executive Summary
ClearWallet is an enterprise split-payment platform for ClearCorrect dentists that orchestrates multi-party collections between patients, dentists, and ClearCorrect. The platform enables dentists to configure treatment payment conditions, publish a patient payment link, and automatically route receivables to each party through a payment gateway.

The business value is direct and measurable:
- Accelerates cash flow for both provider and company through automated split settlement.
- Reduces manual financial reconciliation with status synchronization to SAP.
- Improves user experience through unified SSO access for dentists across Straumann Group ecosystems.
- Increases operational reliability with asynchronous processing and webhook-driven state transitions.

Problems solved:
- Manual and error-prone revenue distribution between company and professional.
- Delayed payment status propagation between payment gateway, internal systems, and ERP.
- Fragmented access and account management for dentists.
- Low visibility into payment lifecycle and operational exceptions.

Strategic impact:
- Positions ClearCorrect with a scalable payment control plane for regional growth.
- Provides a foundation for future payment methods (PIX, wallet, financing).
- Strengthens compliance and auditability in regulated financial workflows.

## 2. Product Vision and Objectives
### Long-Term Vision
Build the canonical financial orchestration layer for ClearCorrect commercial transactions, offering secure, compliant, and near real-time payment experiences across channels and geographies.

### Strategic Goals
- Standardize split-payment lifecycle from case onboarding to settlement confirmation.
- Ensure seamless dentist onboarding and account updates through integrated SSO + profile flows.
- Maintain high reliability for asynchronous payment processing and ERP callbacks.
- Support evolving business rules for fees, installments, and settlement policies.

### Key Differentiators
- Native split logic aligned with ClearCorrect commercial policies.
- Deep integration with SAP for lifecycle governance.
- Multi-system architecture bridging AWS messaging and Azure SQL data stores.
- Dentists-first portal workflow with bank-account and receivables visibility.

## 3. System Overview
ClearWallet is a backend-centric payment orchestration service built with Java/Spring Boot and integrated with:
- AWS Cognito for authentication and SSO token validation.
- Pagar.me for payment order creation, split rules, charge capture, and webhook events.
- SAP endpoints for payment status synchronization and bank-data updates.
- Azure SQL databases for transactional, reference, and notification persistence.
- AWS SQS for asynchronous payment request processing.

Main components:
- REST API endpoints for professional and patient workflows.
- Command-oriented application layer to execute business use cases.
- SQS consumer for decoupled payment generation.
- Webhook endpoint for payment gateway event handling.
- Data access repositories using Rotom connectors across multiple databases.

## 4. Architecture
### 4.1 High-Level Architecture Description
Architecture style:
- Primary style: Modular monolith (single deployable backend service).
- Integration style: Event-driven + API-driven hybrid.
- Runtime topology: Hybrid cloud integration (AWS services + Azure SQL + external SaaS APIs).

Why this style:
- Keeps business logic centralized while enabling asynchronous payment execution.
- Simplifies deployment and governance in enterprise environments.
- Supports progressive decomposition to microservices if scale or domain boundaries require it.

### 4.2 Architecture Diagram (in Mermaid)
```mermaid
flowchart TD
    A[Dentist Portal / Control Platform] -->|SSO Login| B[AWS Cognito]
    A -->|REST Calls| C[ClearWallet API<br/>Spring Boot]
    D[Patient Payment Link] -->|Payment Submission| C

    C -->|Read/Write| E[(Azure SQL: split)]
    C -->|Read| F[(Azure SQL: sap-alteryx)]
    C -->|Write Notifications| G[(Azure SQL: neodent-app)]

    C -->|Send Payment Job| H[AWS SQS: send_payment]
    H --> I[ProcessPaymentConsumer]
    I -->|Create order / split| J[Pagar.me API]

    J -->|Webhook events| K[/webhook/split-payment]
    K --> C

    C -->|Status + bank updates| L[SAP Integration API]
    C -->|Bank metadata| M[BrasilAPI]

    C -->|Errors/alerts| N[Sentry + Teams/Fortress]
```

### 4.3 Core Layers
**Presentation Layer**
- REST endpoints exposed with `@RestPoint` and `@Endpoint` conventions.
- Key modules: `payment`, `professional`, `populate`, `webhook`, `installment`, `balance`, `config`.
- Supports both interactive user flows and machine-to-machine callbacks/jobs.

**Application Layer**
- Command-based orchestration (`*Command` classes) with clear use-case boundaries.
- Coordinates validations, repository updates, gateway calls, and notifications.
- Examples: `GenerateSplitPaymentCommand`, `HandleWebhookCommand`, `ExpirePaymentsCommand`.

**Domain Layer**
- Core payment states and business rules:
  - `RELEASED_FOR_PROFESSIONAL`
  - `RELEASED_FOR_PATIENT`
  - `PAYMENT_PROCESSING`
  - `PAYMENT_REFUSED`
  - `PAYMENT_SUCCESSFUL`
  - `EXPIRED`
- Split amount calculations and professional cost handling.
- Rules for bank update cooldown (7-day restriction).

**Infrastructure Layer**
- AWS SQS consumer for asynchronous processing.
- API providers for Cognito, Pagar.me, SAP, Firebase, S3, BrasilAPI.
- Environment-aware configuration via `application-*.yml`.

**Data Layer**
- Multi-database model:
  - `split`: payments, professionals, webhooks, installments, fees, terms.
  - `sap-alteryx`: professional/client mapping enrichment.
  - `neodent-app`: notification records.
- Rotom connectors provide typed persistence access.

**AI/ML Layer (if applicable)**
- No dedicated AI/ML inference components currently implemented.
- Future-ready areas include fraud scoring and payment retry intelligence.

### 4.4 Integration Points
External services:
- Pagar.me Core API (`/core/v5`) for payment lifecycle and split settlement.
- AWS Cognito for auth and user profile claims.
- SAP REST adapters for payment status and bank information synchronization.
- BrasilAPI for bank metadata resolution.
- Firebase provider support (configured in codebase).

APIs:
- Public/partner REST endpoints for payment flow control.
- Internal/system endpoints for jobs and webhooks.

Message queues:
- `aws-sqs.queues.send_payment`: async payment generation trigger.
- `aws-sqs.queues.webhook_payment`: configured for webhook-related processing expansion.

Webhooks:
- `/webhook/split-payment` receives Pagar.me events:
  - `charge.pending`
  - `charge.paid`
  - `charge.payment_failed`

## 5. Technology Stack
| Layer | Technology | Purpose |
|---|---|---|
| Backend | Java 17, Spring Boot 3.1.2 | Core API and business orchestration |
| Framework Extensions | Arceus/Mocca/Rotom (internal libraries) | Endpoint model, command pattern, data connectors |
| Async Messaging | Spring Cloud AWS SQS | Decoupled payment processing |
| Payment Gateway | Pagar.me | Order, split, charges, payables, webhooks |
| Identity | AWS Cognito | SSO-aligned auth and token validation |
| ERP Integration | SAP REST Adapters | Payment and bank-data status propagation |
| Database | Azure SQL (3 logical DBs) | Transactional + reference + notification storage |
| Web Server | Undertow | High-concurrency request handling |
| DevOps CI | Azure Pipelines + AWS CodeBuild | Source mirroring and build automation |
| Deployment | AWS CodeDeploy on EC2 + scripts | Service rollout and runtime configuration |
| Observability | Sentry, Fortress/Teams alerts, application logs | Error tracking and operational alerting |
| Frontend | External portal (out of this repository) | Dentist control interface |
| Mobile | Not present in this repository | N/A |
| AI/ML | Not implemented | N/A |

## 6. Data Architecture
### Data Sources
- Dentist/case payloads from SAP (`/populate/new-entry`).
- Patient payment selections from portal-driven API calls.
- Webhook events from Pagar.me.
- Professional profile and bank update requests.

### Data Flows
1. SAP sends new case data -> ClearWallet stores/updates `payment` and `professional` entities.
2. Dentist configures total amount/installments -> status moves to patient-ready.
3. Patient submits payment method(s) -> async message published to SQS.
4. Consumer creates split orders in Pagar.me -> webhook records inserted.
5. Webhook events update payment status -> SAP is notified.
6. Notifications are persisted to `neodent-app.user_notification`.

### ETL / Pipelines
- Near-real-time operational pipeline (API + queue + webhook).
- No batch ETL framework in this service; transformations are command-level.
- Installment and balance operation jobs provide periodic synchronization behavior.

### Storage Strategy
- Relational persistence on Azure SQL with domain-specific separation.
- Main tables include: `payment`, `professional`, `webhook`, `installment`, `professional_cost`, `pagarme_fee`, `terms_link`.
- Auditable timestamps (`created_date`, `last_updated`, `release_date`) embedded in entities.

### Governance and Security
- Role-scoped endpoint access levels (`level` flags in endpoint definitions).
- Cross-system identifiers (`documentNumber`, `caseId`, `sapNumber`) for traceability.
- Data consistency controlled through state transitions and repository updates.

## 7. Core Features
### 1) Case Ingestion from SAP
- Description: Ingests and upserts new case/payment baseline data.
- User value: Eliminates manual case setup for dentists.
- Technical approach: `POST /populate/new-entry` -> `HandleInputFromSapCommand` -> `payment` + `professional` repositories.
- Dependencies: SAP producer systems, Azure SQL.

### 2) Professional Payment Configuration
- Description: Dentist defines total amount and installment constraints.
- User value: Flexible payment strategy while preserving company receivable.
- Technical approach: `POST /payment/update-for-professional`, recipient creation/update on Pagar.me, status sync to SAP.
- Dependencies: Pagar.me recipient APIs, SAP status API, client mapping DB.

### 3) Patient Split Payment Execution
- Description: Patient pays via configured methods (credit card implemented, PIX reserved).
- User value: Frictionless patient checkout with proper split distribution.
- Technical approach: request -> set status processing -> enqueue SQS -> consumer executes split creation.
- Dependencies: AWS SQS, Pagar.me order APIs.

### 4) Webhook-Driven Payment Finalization
- Description: Processes gateway events and converges final status.
- User value: Near real-time payment visibility and reliable settlement completion.
- Technical approach: webhook handlers update charge records, capture pending charges, finalize payment success/failure, trigger SAP sync.
- Dependencies: Pagar.me webhooks, repositories, SAP endpoint.

### 5) Professional Account Management
- Description: Dentist can query and update bank account data.
- User value: Faster payout configuration and reduced support friction.
- Technical approach: update in SAP, Pagar.me, and local DB with anti-abuse 7-day update rule.
- Dependencies: Cognito auth principal, SAP bank API, Pagar.me recipient API.

### 6) Notification Generation
- Description: Emits business notifications for new cases, payments, and expired links.
- User value: Better awareness and operational follow-up by dentists.
- Technical approach: writes to `neodent-app.user_notification`.
- Dependencies: notification repository and DB.

### 7) Scheduled/Operational Maintenance Endpoints
- Description: Expire stale links, update installments, sync balance operations.
- User value: Financial data hygiene and reconciliation support.
- Technical approach: operational endpoints triggering command jobs.
- Dependencies: payment repository, Pagar.me operations API.

## 8. Security and Compliance
### Authentication/Authorization
- Supports `Bearer` token validation via AWS Cognito.
- Supports `Basic` auth flow for credential-based login scenarios.
- Principal context (`ClearWalletUser`) propagates SAP number, name, and email for scoped operations.

### Data Protection
- Uses HTTPS-based external integrations.
- Sensitive operations (bank updates, payment status transitions) are server-side validated.
- Payment card handling delegated to Pagar.me API objects and tokenized gateway processing model.

### LGPD/GDPR Considerations
- Processes personal data: dentist identifiers, patient name, CPF/document data, bank details.
- Recommended controls:
  - Data minimization on response payloads.
  - Retention and deletion policy per legal basis.
  - Explicit processing records for cross-system transfers (SAP, gateway).
  - DPO/legal validation for lawful basis and subject rights workflows.

### Secrets Management
- Expected best practice: store all credentials in managed secrets services (AWS Secrets Manager / Azure Key Vault / CI secret variables).
- Mandatory hardening recommendation: rotate any exposed credentials and remove plaintext secrets from repository-managed config files.

### Audit and Logging
- Business events are persisted with timestamps and status transitions.
- Error alerts emitted via Teams/Fortress and Sentry integration.
- Recommendation: add structured correlation IDs across API, queue, and webhook paths.

## 9. Scalability and Performance
### Scaling Strategy
- Stateless API service suitable for horizontal scaling on EC2 instances.
- Asynchronous workload isolation through SQS consumer decouples user API latency from payment gateway calls.

### Load Handling
- Undertow configured with high worker thread capacity.
- Queue-based backpressure controls bursty payment workloads.

### Performance Optimizations
- Command-level decomposition keeps use cases focused and maintainable.
- Direct repository queries for aggregate and listing endpoints.
- Avoids synchronous blocking in user-facing payment creation by queueing execution.

### Caching
- No dedicated caching layer currently implemented.
- Candidate areas: fee tables, terms link, bank metadata lookups, static config.

### Concurrency
- SQS listener concurrency configured (`5-50`) for parallel payment processing.
- Acknowledgment model ensures explicit message consumption on successful execution.

## 10. DevOps and Deployment
### CI/CD Pipeline
- Azure Pipeline mirrors repository to AWS CodeCommit.
- AWS CodeBuild executes build (`./gradlew build`) and packaging.
- AWS CodeDeploy uses `appspec.yml` hooks and deployment scripts to stop/start services and refresh runtime artifacts.

### Environments
- `local`, `hom` (homologation), `prod`, `ec2` profile overlays.
- Environment-specific configuration for queues, SAP endpoints, Cognito pool, and databases.

### Infrastructure as Code
- Current repository includes scripted deployment automation (`awsDeployScripts`), not full declarative IaC templates.
- Recommendation: evolve to Terraform/CDK for reproducible infra lifecycle.

### Release Strategy
- Current strategy is in-place rolling service replacement via CodeDeploy scripts.
- Recommended evolution:
  - Blue/green deployments for risk isolation.
  - Canary for payment-flow-sensitive releases.

## 11. Observability and Monitoring
### Logging
- Runtime logging integrated via service templates (`logback.xml`) and console handlers.
- Business-relevant state changes persisted in DB for traceability.

### Metrics
- No explicit metrics backend in repository (e.g., Prometheus exporters) detected.
- Recommendation: add endpoint latency, queue lag, webhook success rate, and SAP callback success metrics.

### Alerting
- Teams/Fortress alerts on SAP and payment cancellation failures.
- Sentry DSN configured for exception tracking.

### Tracing
- No distributed tracing implementation observed.
- Recommendation: OpenTelemetry instrumentation for API -> SQS -> consumer -> gateway -> webhook chains.

## 12. AI/Intelligence Layer (if applicable)
Current status: Not implemented.

Potential roadmap:
- Models used: payment risk and anomaly scoring models.
- Inference flow: pre-charge risk check before payment order creation.
- Prompt orchestration: N/A currently.
- Agents: N/A currently.
- RAG: N/A currently.
- Data enrichment: customer behavior, chargeback signals, and settlement reliability features.

## 13. API Design
### API Style
- RESTful HTTP API with JSON payloads.
- Endpoint grouping by domain (`/payment`, `/professional`, `/populate`, `/webhook`, `/installment`, `/balance`, `/config`).

### Versioning
- Versioning is environment/framework-driven via context path (`/${arceus.jar-version}` in EC2 profile).
- Example base path pattern:
  - `/{version}/payment/...`

### Authentication
- `Bearer <JWT>` for authenticated user operations.
- `Basic <base64>` flow supported for login/auth scenarios.
- Some system endpoints configured with lower auth level for integration/job execution.

### Main Endpoints (example format)
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/populate/new-entry` | Ingest case/payment baseline from SAP |
| `GET` | `/payment/find-for-professional?documentNumber=&caseId=` | Fetch professional-facing payment details |
| `POST` | `/payment/update-for-professional` | Dentist defines own amount/installments |
| `GET` | `/payment/find-for-patient?documentNumber=&caseId=` | Fetch patient-facing payment details |
| `POST` | `/payment/update-for-patient` | Submit patient payment options |
| `POST` | `/webhook/split-payment` | Receive payment gateway events |
| `GET` | `/professional/find-for-user` | List dentist payments |
| `POST` | `/professional/update-account` | Update dentist bank account |
| `GET` | `/installment/job` | Run installment sync job |
| `GET` | `/balance/operation` | Sync balance operations |

## 14. Project Structure
```text
be_clearWallet/
|-- awsDeployScripts/
|   |-- templates/
|   |-- 0a_updateVariables.sh
|   |-- 0b_handleProject.sh
|   |-- 1a_handleServiceStop.sh
|   |-- 1b_handleJarFolder.sh
|   |-- 2a_handleJar.sh
|   |-- 2b_handleServiceFiles.sh
|   |-- 2c_handleHaproxy.sh
|   `-- 3_handleServiceStart.sh
|-- gradle/
|   `-- wrapper/
|-- src/
|   |-- main/
|   |   |-- java/project/clearWallet/
|   |   |   |-- auth/
|   |   |   |-- resources/
|   |   |   `-- structure/
|   |   |       |-- commands/
|   |   |       |-- consumers/
|   |   |       |-- database/
|   |   |       `-- endpoints/
|   |   `-- resources/
|   `-- test/
|-- appspec.yml
|-- azure-pipelines.yml
|-- build.gradle
|-- buildspec.yml
`-- README.md
```

Folder responsibilities:
- `src/main/java/project/clearWallet/auth`: authentication filters and user context mapping.
- `src/main/java/project/clearWallet/resources`: provider wiring for external systems and DB connectors.
- `src/main/java/project/clearWallet/structure/endpoints`: API contracts and route exposure.
- `src/main/java/project/clearWallet/structure/commands`: business use-case orchestration.
- `src/main/java/project/clearWallet/structure/consumers`: asynchronous queue consumers.
- `src/main/java/project/clearWallet/structure/database`: entities, repositories, and query logic.
- `src/main/resources`: environment configurations.
- `awsDeployScripts`: deployment lifecycle automation for EC2/CodeDeploy.

## 15. Getting Started
### Requirements
- Java 17+
- Gradle wrapper (`./gradlew`)
- Network access to configured dependencies/services (for full integration scenarios)
- Access to environment-specific credentials (Cognito, Pagar.me, SAP, DB, AWS)

### Installation Steps
1. Clone repository.
2. Ensure Java 17 is active.
3. Build project:
   ```bash
   ./gradlew clean build
   ```

### Environment Variables / Configuration
Profiles are defined in:
- `src/main/resources/application.yml`
- `src/main/resources/application-local.yml`
- `src/main/resources/application-hom.yml`
- `src/main/resources/application-prod.yml`
- `src/main/resources/application-ec2.yml`

Key config domains:
- `aws-sqs.*`
- `pagarme.*`
- `sap.*`
- `databases.sql.*`
- `cognito.*`
- `firebase.*`

Recommended practice:
- Externalize all secrets and override via secure environment injection in each environment.

### Local Run Instructions
```bash
./gradlew bootRun --args='--spring.profiles.active=local'
```

Optional test execution:
```bash
./gradlew test
```

## 16. Usage Examples
### API Call Example 1: Ingest New Case from SAP
```bash
curl -X POST "http://localhost:2101/populate/new-entry" \
  -H "Content-Type: application/json" \
  -d '{
    "documentNumber": "12345678901",
    "caseID": "CASE-001",
    "totalAmount": 8500.00,
    "caseType": "One",
    "paymentCondition": "A_VISTA",
    "orderDate": "20260110123045",
    "dentistSAPCode": "SAP123",
    "dentistDocument": "12345678901",
    "dentistName": "Dr. Jane Doe",
    "dentistEmail": "jane@example.com",
    "dentistPhone": "11999999999",
    "bankCode": "341",
    "agencyCode": "1234",
    "accountCode": "123456-7",
    "patientName": "Patient A"
  }'
```

### API Call Example 2: Professional Configures Payment
```bash
curl -X POST "http://localhost:2101/payment/update-for-professional" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "documentNumber": "12345678901",
    "caseId": "CASE-001",
    "totalAmount": 9900.00,
    "maxInstallments": 12
  }'
```

### API Call Example 3: Patient Submits Split Payment
```bash
curl -X POST "http://localhost:2101/payment/update-for-patient" \
  -H "Content-Type: application/json" \
  -d '{
    "documentNumber": "12345678901",
    "caseId": "CASE-001",
    "totalAmount": 9900.00,
    "paymentMethod": [
      {
        "paymentMethod": "credit_card",
        "paymentValue": 9900.00,
        "installments": 10,
        "name": "Patient A",
        "email": "patient@example.com",
        "phoneCountry": "55",
        "phoneArea": "11",
        "phoneNumber": "988887777",
        "cpf": "12345678901",
        "cardNumber": "5555555555554444",
        "cardPrintedName": "PATIENT A",
        "cardExpiringMonth": "12",
        "cardExpiringYear": "2030",
        "cardCvv": "123",
        "cardBrand": "mastercard",
        "country": "BR",
        "cep": "01001000",
        "state": "SP",
        "city": "Sao Paulo",
        "street": "Av Paulista",
        "streetNumber": "1000",
        "streetComplement": "Room 10"
      }
    ]
  }'
```

### CLI Usage
- Build: `./gradlew build`
- Test: `./gradlew test`
- Run profile: `./gradlew bootRun --args='--spring.profiles.active=hom'`

## 17. Roadmap
### Short Term (0-3 months)
- Remove plaintext secrets from configs and enforce managed secret stores.
- Add robust validation/error contracts for external integrations.
- Introduce structured metrics dashboard and SLO definitions.

### Mid Term (3-9 months)
- Implement PIX flow in `GenerateSplitPaymentCommand`.
- Add idempotency keys and replay protection for critical endpoints/webhooks.
- Introduce distributed tracing and correlation IDs.
- Formalize blue/green deployment strategy.

### Long Term (9-18+ months)
- Decompose heavy domains into independently scalable services if needed.
- Add intelligent risk/retry orchestration for payment failures.
- Extend platform for multi-country payment and compliance variations.

## 18. Contribution Guidelines
### Branching Strategy
- `main`: production-ready branch.
- `develop`: integration branch (recommended).
- `feature/<name>`: new capabilities.
- `hotfix/<name>`: urgent production fixes.

### Commit Pattern
Use Conventional Commits:
- `feat: add webhook idempotency validation`
- `fix: prevent duplicate status propagation to SAP`
- `chore: update build pipeline scripts`
- `docs: improve payment flow sequence documentation`

### Code Standards
- Follow Java 17 and Spring Boot best practices.
- Keep command classes single-purpose and composable.
- Add/maintain tests for business-critical state transitions.
- Do not hardcode credentials or sensitive tokens.
- Prefer explicit error handling and observability hooks for external calls.

## 19. License
Proprietary - Straumann Group / ClearCorrect Internal Use.

If open-source publication is planned, replace this section with the approved SPDX license identifier and full license text reference.

## 20. Appendix
### Glossary
- **Split Payment**: A payment where the collected amount is distributed between two or more recipients.
- **Professional**: Dentist customer using ClearWallet.
- **Case**: Commercial treatment/order reference tied to a payment journey.
- **Recipient**: Payment gateway account eligible to receive split funds.
- **Webhook**: Event callback sent by an external service to notify state changes.

### Acronyms
- **API**: Application Programming Interface
- **AWS**: Amazon Web Services
- **SQS**: Simple Queue Service
- **SAP**: Systems, Applications, and Products (ERP)
- **SSO**: Single Sign-On
- **LGPD**: Lei Geral de Protecao de Dados (Brazil)
- **GDPR**: General Data Protection Regulation (EU)
- **PII**: Personally Identifiable Information
- **CI/CD**: Continuous Integration / Continuous Deployment

### References
- Spring Boot: https://spring.io/projects/spring-boot
- AWS SQS: https://docs.aws.amazon.com/sqs/
- AWS Cognito: https://docs.aws.amazon.com/cognito/
- Pagar.me Docs: https://docs.pagar.me/
- Mermaid: https://mermaid.js.org/
- LGPD (Brazil): https://www.gov.br/esporte/pt-br/acesso-a-informacao/lgpd
- GDPR (EU): https://gdpr.eu/
