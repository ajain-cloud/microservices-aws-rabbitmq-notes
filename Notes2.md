# Microservices Design Patterns

1) Decomposition Patterns
   -Used to break a monolith into microservices.
    1) Decompose by Business Capability
      -Each microservice corresponds to a business capability (e.g., Billing, Inventory).
      -Promotes bounded contexts in Domain-Driven Design (DDD).
    2) Decompose by Subdomain
      -Breaks services based on DDD subdomains: Core, Supporting, Generic.
      -Encourages better modularization and separation of concerns.

2) Integration Patterns
   -For service-to-service communication. 
    1) API Gateway Pattern
       -A single entry point for all clients.
       -Routes requests to appropriate microservices.
       -Adds cross-cutting concerns (auth, rate limiting, etc.)
    2) Aggregator Pattern
       -One service aggregates responses from multiple microservices.
       -Useful in UI composition (e.g., GraphQL or BFF pattern).
    3) Proxy Pattern
       -Like API Gateway, it forwards requests to internal services with added policies (e.g., auth, TLS termination).
    4) Chained or Chain of Responsibility Pattern
       -One service calls another and so on (synchronous).
       -Risk of cascading failures.
    5) Message Broker (Event-Driven Communication)
       -Services communicate asynchronously via queues or pub/sub systems like Kafka, RabbitMQ, or SQS.

3) Database Patterns
   -Handling data consistency across services.
    1) Database per Service
       -Each microservice owns its own database.
       -Avoids shared schema, promotes autonomy.
    2) Shared Database (Anti-pattern, but used sometimes)
       -Multiple services use the same DB.
       -Useful in transition phases but reduces decoupling.   
    3) Saga Pattern
       -Ensures eventual consistency across services.
       -Two types:
       1) Choreography: Events trigger next actions (no central coordinator).
       2) Orchestration: A central service commands each step.  
    4) CQRS (Command Query Responsibility Segregation)
       -Separate read and write models.
       -Useful for high-load systems with different read/write requirements.   
    5) Event Sourcing
       -Persist state as a sequence of events.
       -Rebuild current state by replaying events.

4) Observability Patterns
   -Monitoring and debugging distributed systems.      
    1) Log Aggregation
       -Collect and centralize logs using ELK, Fluentd, etc.
    2) Distributed Tracing
       -Trace requests across service boundaries (e.g., OpenTelemetry, Jaeger, Zipkin).
    3) Metrics Collection
       -Collect system metrics (latency, throughput) using Prometheus, Grafana, etc.

5) Reliability / Resilience Patterns
   -To make systems fault-tolerant.
    1) Circuit Breaker
       -Prevents repeated calls to failing services.
       -E.g., Netflix Hystrix, Opossum.
    2) Bulkhead
       -Isolate service resources to limit failure impact.
       -Prevents one service’s failure from overloading others.
    3) Retry Pattern
       -Retries failed requests with exponential backoff.
    4) Timeout Pattern
       -Sets maximum time a service should wait for a response.    
    5) Fallback Pattern
       -Return a default response or cached data if service fails.   
    6) Rate Limiting / Throttling
       -Limits the number of requests from a client.
       -Protects services from abuse or overload.   

6) Deployment Patterns
   -For managing microservice delivery and operations.
    1) Service Discovery Pattern 
       -Dynamically locate service instances.
       -Can be client-side (e.g., Eureka) or server-side (e.g., AWS ALB).
    2) Sidecar Pattern
       -A helper service runs alongside the main service (e.g., for logging, proxying, etc.).
       -Used in service meshes (like Istio, Linkerd). 
    3) Service Mesh
       -Abstracts service communication into infrastructure (e.g., mTLS, retries, observability).
       -Examples: Istio, Linkerd.
    4) Blue-Green Deployment
       -Two environments: one live (green), one idle (blue).
       -Traffic is switched when ready.
    5) Canary Deployment
       -Gradually roll out changes to a subset of users. 

7) Security Patterns
    1) Access Token / JWT
       -Authenticate users via bearer tokens (OAuth2, JWT).
    2) Token Relay
       -Gateway forwards JWT to downstream services.
    3) Trusted Subsystems
       -Gateway authenticates once, passes secure identity to backend.  

8) Cross-Cutting Patterns          
    1) Strangler Fig Pattern
       -Gradually replace parts of a monolith with microservices.
    2) Backends for Frontends (BFF)
       -Different APIs tailored for web, mobile, etc.     
    3) Anti-Corruption Layer (ACL)
       -Translates and isolates external or legacy system data models.


# Saga Pattern
The Saga pattern is used to manage distributed transactions in a microservices architecture where each service has its own database and operations must remain eventually consistent (not strongly ACID).

Instead of one big transaction that spans multiple services, a saga breaks it down into a sequence of local transactions. If one fails, compensating actions undo the completed steps.
                    
1) Choreography: "Event-driven, decentralized"
-In choreography, there's no central coordinator. Each service reacts to events and performs its task, then emits another event if needed.

-Flow Example:
 -Let’s say we have a 3-step Order Placement Saga:
 1) Order Service (step 1)
 2) Payment Service (step 2)
 3) Inventory Service (step 3)

 -Here’s how Choreography would work:
 1) Order Service creates an order ➡️ emits OrderCreated event.
 2) Payment Service listens to OrderCreated ➡️ deducts payment ➡️ emits PaymentSuccessful.
 3) Inventory Service listens to PaymentSuccessful ➡️ reserves items ➡️ emits InventoryReserved.
 
 -Each service listens to relevant events and responds. No one tells them what to do next.

-Tools:
 -Kafka, RabbitMQ, AWS SNS/SQS, etc.

-Pros:
 1) Loosely coupled
 2) Scales well
 3) Simple to add new consumers

-Cons:
 1) Hard to track full flow (debugging is harder)
 2) Implicit workflow logic is scattered
 3) Difficult to manage compensating transactions (e.g., refund if step 3 fails)


2) Orchestration: "Command-driven, centralized"
-In orchestration, a central orchestrator is responsible for telling each service what to do and when. Each step reports back success/failure.

-Flow Example:
 -Same Order Placement example, but with Orchestrator Service:
 1) Orchestrator sends a command to Order Service → "Create Order"
 2) Once done, it commands Payment Service → "Charge Payment"
 3) Once successful, it commands Inventory Service → "Reserve Stock"

-If any step fails, the orchestrator initiates compensating transactions (e.g., cancel order, refund payment).

-Tools:
 1) Custom orchestrator service (e.g., written in Node.js, Java, etc.)
 2) Workflow engines like Temporal, Camunda, Netflix Conductor, AWS Step Functions

-Pros:
1) Clear centralized logic
2) Easier to handle compensation
3) Better observability and monitoring 

-Cons:
1) Tighter coupling
2) Single point of failure (if orchestrator goes down)
3) Harder to scale independently

-Real-World Analogy
1) Choreography is like a flash mob — each dancer knows their moves and cues but there’s no central controller.
2) Orchestration is like a conductor in an orchestra — all musicians follow the conductor’s lead.


# Strangler Fig Pattern
Gradually replace a monolith by building new microservices around it and routing traffic to them.

-Flow Example:
1) Original monolith handles everything.
2) New service takes over user login.
3) API Gateway routes login requests to new service; rest go to monolith.
4) Repeat until monolith is gone.

-Pros:
1) Safe, incremental migration
2) No "big bang" rewrite

-Cons:
1) Increased routing complexity
2) Need to maintain both systems temporarily

# Service Discovery Pattern (Registry Service)
Services need to find and communicate with each other dynamically in a changing environment (e.g., when containers restart or scale).

-Types:
1) Client-side discovery: Client fetches service address from registry (e.g., Netflix Eureka).
2) Server-side discovery: Load balancer forwards the request (e.g., AWS ALB).

-Tools:
 -Consul, Eureka, Zookeeper, Kubernetes DNS

-Pros:
1) Supports autoscaling & resilience
2) Decouples services from hardcoded addresses

-Cons:
1) Adds extra infrastructure
2) Requires health checking and TTL handling 

# CQRS (Command Query Responsibility Segregation)
Separate write operations (commands) from read operations (queries) using different models or services.

-Flow Example:
1) POST /order ➡️ Command handler ➡️ Writes to DB
2) GET /order-status ➡️ Query model ➡️ Reads from optimized DB

-Often used with:
1) Event Sourcing
2) Read replicas

-Pros:
1) Optimized read and write paths
2) Supports eventual consistency
3) Scales read-heavy systems easily

-Cons:
1) More complex to maintain
2) Harder consistency guarantees

# Event Sourcing Pattern
Rather than storing just the current state, store all changes as a sequence of events.

-Flow Example:
 -Instead of storing:
 { orderId: 123, status: "SHIPPED" }
 -You store:
  1) OrderCreated
  2) PaymentProcessed
  3) OrderShipped

 -You rebuild state by replaying events.
 
-Tools:
 -Kafka, EventStoreDB, Axon, custom implementation using message queues 

-Pros:
1) Full audit trail
2) Easy to roll back or reprocess
3) Supports CQRS naturally

-Cons:
1) Harder to query current state directly
2) Complex data modeling
3) Event versioning is tricky 