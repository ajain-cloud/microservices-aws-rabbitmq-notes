### Monolithic Architecture
-Enterprise Applications are often built in three main parts:
 1) a client-side user interface (consisting of HTML pages and javascript running in a browser on the user's machine)
 2) a database (consisting of many tables inserted into a common, and usually relational, database management system)
 3) a server-side application
-The server-side application will handle HTTP requests, execute domain logic, retrieve and update data from the database, and select and populate HTML views to be sent to the browser. This server-side application is a monolith- a single logical executable.
-Any changes to the system involve building and deploying a new version of the server-side application.
-You can horizontally scale the monolith by running many instances behind a load-balancer.

### Challenges with Monolithic Architecture
-Change cycles are tied together - a change made to a small part of the application, requires the entire monolith to be rebuilt and deployed.
-Over time it's often hard to keep a good modular structure, making it harder to keep changes that ought to only affect one module within that module. 
-Scaling requires scaling of the entire application rather than parts of it that require greater resource.    

*** Principles drive how you build, Characteristics describe what you get.

*** Modular means:
    -Breaking something big into smaller, independent, and reusable parts — called modules.
    -Modular = small, focused, reusable building blocks that work together to form a bigger system.

*** Load Balancer:
A load balancer is a system or device that distributes incoming network or application traffic across multiple servers to ensure no single server becomes overwhelmed. This helps improve the performance, reliability, and availability of services.    

*** gRPC
gRPC (short for google Remote Procedure Call) is an open-source, high-performance RPC framework developed by Google. It allows services to communicate with each other as if they were calling local functions, even though they're running on different machines.

*** Bottlenecks
A bottleneck in software or systems is a point of congestion or limitation that slows down the overall performance of an application, system, or process. It restricts throughput or response time because it cannot handle as much work as the other parts of the system.

### Coarse-Grained v/s Fine-Grained (Granular)
1) Coarse-Grained
   -Definition: A component (like a service or API) that handles larger, broader tasks.
   -Characteristics:
   1) Fewer, bigger responsibilities
   2) Simpler communication (fewer calls)
   3) Can include unrelated logic
   -Example:
   1) UserService → handles user creation, authentication, profile updates, and settings in one place.
   -Analogy: A Swiss Army knife – one tool does many things.

2) Fine-Grained (Granular)
   -Definition: A component that handles very specific and focused tasks.
   -Characteristics:
   1) Smaller, narrower scope
   2) Often more flexible and reusable
   3) Requires more inter-component communication
   -Example:
   1) AuthService → Only handles login/signup.
   2) ProfileService → Only handles profile data.
   3) SettingsService → Only manages user settings.
   -Analogy: A toolbox with separate tools for each job (hammer, screwdriver, wrench).
 

### What Are Microservices?
-Microservices is an architectural style that structures an application as a collection of loosely coupled, independently deployable services. Each service implements a specific business capability and communicates with others over a network, typically using HTTP/REST, gRPC, or message brokers like Kafka or RabbitMQ.

-Loosely coupled refers to a design principle where components or services have minimal dependencies on each other. It means that changes in one module or service have little to no impact on others. Some of its benefits in terms of microservices includes:
1) Flexibility - Easy to update or replace individual services
2) Scalability - You can scale only the services that need it
3) Resilience - One service crashing won’t bring the whole system down
4) Faster Development -	Teams can work on different services in parallel

-Think of microservices like different departments in a company:
1) The HR team, Sales team, and Engineering team all do different jobs.
2) They talk to each other, but each can operate independently.
3) If Sales gets a new CRM tool, Engineering doesn’t need to change anything.


### Core Principles of Microservices
-These are foundational beliefs or rules that guide how microservices should be designed and built. Think of them as the philosophy behind microservices.

1) Single Responsibility Principle (SRP)
   -Each microservice should focus on one business capability. It should do one thing and do it well.
   -Example: In an e-commerce application:
    1) ProductService handles product catalog.
    2) OrderService manages order placement.
    3) UserService handles authentication and user management.

2) Decentralized Data Management
   -Each microservice owns its own database. There should be no direct data sharing between services at the database level.
   -Example:
    1) UserService has its own users table in a PostgreSQL DB.
    2) OrderService uses a MongoDB collection for orders.

3) Autonomy
   -Microservices are independently deployable and scalable. One service can be upgraded, restarted, or scaled without affecting others.
   -Example:
    1) During a Black Friday sale, only CheckoutService might need horizontal scaling, not UserProfileService.

4) Decentralized Governance
   -Teams are free to choose the best tech stack and development practices for their service, encouraging innovation.
   -Example:
    1) NotificationService is built using Node.js + RabbitMQ.
    2) InventoryService is built using Java + Kafka.
   -Local ownership of service contracts/APIs, without centralized enforcement 

5) Fault Isolation
   -Failure in one service should not cascade to others. Services should fail gracefully and employ circuit breakers, retries, timeouts, etc.
   -Example:
    1) If PaymentService is down, the OrderService can still accept orders and mark them as “Pending Payment”.

6) Continuous Delivery and Deployment
   -Microservices should support CI/CD pipelines and rapid deployments without downtime.
   -Example:
    1) A small bug fix in EmailService can be tested and deployed independently within minutes.

7) Domain-Driven Design (DDD)
   -Services should be aligned with bounded contexts of the business domain. Each service should represent a business subdomain.
   -Example: 
   -In a ride-hailing app:
   1) DriverService, PassengerService, TripService, and BillingService align with distinct domains.

8) API Contracts and Loose Coupling
   -Communication between microservices is done via well-defined APIs. Services should not be tightly coupled or share internal logic.
   -Example:
   1) OrderService consumes ProductService via REST or gRPC API, not by importing its code.

9) Observability (Logging, Monitoring, Tracing)
   -Each service should be observable for effective debugging, monitoring, and alerting.
   -Tools: ELK Stack, Prometheus + Grafana, Jaeger, OpenTelemetry.
   -Microservice applications put a lot of emphasis on real-time monitoring of the application, checking both architectural elements (how many requests per second is the database getting) and business relevant metrics (such as how many orders per minute are received). 
   -Semantic monitoring can provide an early warning system of something going wrong that triggers development teams to follow up and investigate.
   -Microservice teams would expect to see sophisticated monitoring and logging setups for each individual service such as dashboards showing up/down status and a variety of operational and business relevant metrics. 
   -Details on circuit breaker status, current throughput and latency are other examples we often encounter in the wild.

10) Security
    -Ensure API security, data encryption, authentication (OAuth2, JWT), and authorization are implemented at the service level.
    -Example:
    1) Use API Gateway to enforce security policies.
    2) Implement service-to-service authentication using mTLS.

### Characteristics of a Microservice Architecture
-These are the observable features or traits that a microservice system tends to have when the above principles are applied. Think of them as the outcomes or implementation style.

1) Componentization via Services
   -A software component is a unit of software that is independently replaceable and upgradeable.
   -We define libraries as components that are linked into a program and called using in-memory function calls. In Node.js, libraries are commonly brought into a program using require (CommonJS) or import (ES Modules), allowing developers to use the library’s functions directly in memory.
   -While services are out-of-process components who communicate with a mechanism such as a web service request, or remote procedure call.
   -Key Differences:
    FEATURE	               LIBRARY (In-process)	                               SERVICE (Out-of-process)
    Location	         Inside your app’s process	                           Outside your app’s process
    Communication	          Function calls	                                HTTP/Web request or RPC
    Speed	                Faster (in-memory)	                                Slower (network involved)
    Example	                require('lodash')                                Calling a REST API or microservice

    -One main reason for using services as components (rather than libraries) in microservices is that services are independently deployable which typically means:
    1) If you have an application that consists of a multiple libraries in a single process, a change to any single component results in having to redeploy the entire application.
    2) But if that application is decomposed into multiple services, you can expect many single service changes to only require that service to be redeployed.
    3) Another consequence of using services as components is a more explicit component interface. Most languages do not have a good mechanism for defining an explicit Published Interface. Often it's only documentation and discipline that prevents clients breaking a component's encapsulation while using libraries, leading to overly-tight coupling between components. Services make it easier to avoid this by using explicit remote call mechanisms. (Refer LLM's if you don't remember this point)

    -Some of the challenges with using services as components rather than libraries may include:
    1) Remote calls are more expensive than in-process calls, and thus remote APIs need to be coarser-grained, which is often more awkward to use.
    2) If you need to change the allocation of responsibilities between components, such movements of behavior are harder to do when you're crossing process boundaries.

2) Loosely Coupled
   -Services are independent and communicate over well-defined APIs.

3) Independently Scalable
   -You can scale one service (e.g., Search) without scaling the whole system.

4) Autonomous Development Teams
   -Each team owns and manages a service end-to-end.

5) Technology Diversity
   -Services can use different tech stacks (e.g., Node.js, Go, Python).

6) Continuous Delivery
   -Small, frequent, independent deployments.

7) Resilience and Isolation
   -Failure in one service shouldn't bring down the whole system.


*** The microservice community favours an approach called: smart endpoints and dumb pipes.
1) Smart Endpoints
   -Microservices themselves contain the business logic, data handling, validations, etc. They are intelligent and autonomous.

2) Dumb Pipes
   -The communication mechanism (often messaging systems or HTTP APIs) should be lightweight, simple, and just transport messages — not interpret or manipulate them.       

*** If you find yourself repeatedly changing two services together, that's a sign that they should be merged.

*** Microservices provide benefits…
1) Strong Module Boundaries: Microservices reinforce modular structure, which is particularly important for larger teams.
2) Independent Deployment: Simple services are easier to deploy, and since they are autonomous, are less likely to cause system failures when they go wrong.
3) Technology Diversity: With microservices you can mix multiple languages, development frameworks and data-storage technologies.

*** …but come with costs
1) Distribution: One of the main challenges of microservices is that they form a distributed system. Remote calls between services are significantly slower than in-process calls, which can degrade performance. Additionally, these remote calls are more prone to network failures, making the system less reliable and harder to debug and maintain.
2) Eventual Consistency: In a distributed system, it's hard to keep all services perfectly in sync at all times. So, instead of strong consistency, microservices often use eventual consistency — meaning data might not be updated everywhere immediately, but it will become consistent over time. This can lead to issues like stale data or delays in updates.
3) Operational Complexity: Managing many microservices is hard. Each service has its own lifecycle, dependencies, and deployments. This requires a skilled DevOps or operations team to handle monitoring, logging, deployment pipelines, and failures.

*** You should only consider using microservices when your application's complexity has grown beyond what a monolithic architecture can efficiently manage or scale.

*** Starting with Microservices from Scratch — When It's Okay:
    -You can start with microservices if all of the following are true:
   1) Your team is experienced in distributed systems, DevOps, monitoring, and inter-service communication.
   2) You already know your domain boundaries (bounded contexts) — e.g., in mature business cases like e-commerce (cart, payments, orders, etc.).
   3) You have the infrastructure and automation in place (CI/CD, container orchestration like Kubernetes, observability, etc.).
   4) You expect the system to scale rapidly and require independent deployments from day one.

*** Why Most Projects Still Start as Monoliths:
   1) Simplicity: It’s faster and easier to build, test, and deploy.
   2) Avoid Premature Optimization: Microservices add complexity (network, data consistency, eventual consistency, distributed tracing, etc.) that isn't always needed early.
   3) Unknown Boundaries: In the early stages of development, you usually don’t have clear-cut domain boundaries, so splitting too early can lead to awkward service communication and coupling.
   4) Higher Cost: Running microservices often means more services, more cloud bills, more logs, more metrics, and more things to maintain.

*** Design your codebase in modular layers or separate domains (DDD style). This way, if the system grows, you can extract services cleanly into microservices. This approach is called a modular monolith — and it’s the sweet spot for most startups and even many mid-sized systems.

### Different kind of microservices approach
1) Monolith First, Peel Microservices Gradually (Very Relevant)
   -Idea: Start with a monolith → extract microservices only when needed, typically at integration or scaling points.
   -Why: Lets you move fast early, avoid premature complexity.
   -Result: A “hybrid” system — stable monolith core + evolving microservices.
   -When to use: Ideal for startups or new products where domain boundaries aren't yet clear.
   -This is the most recommended approach today.

2) Sacrificial Monolith (Still Relevant)
   -Idea: Build a quick, disposable monolith to reach market fast — knowing you'll throw it away and replace it later.
   -Why: Fast time-to-market > long-term architecture in early stages.
   -Result: A fully rebuilt microservices system eventually replaces the monolith.
   -When to use: Early-stage products/startups validating ideas fast.
   -Best if you're okay with later rewriting — and know it's temporary.

3) Start with Coarse-Grained Services (Useful in Some Cases)
   -Idea: Begin with 2–3 large services (e.g., UserService, OrderService), then refine boundaries over time.
   -Why: Eases team into service-based thinking without overwhelming complexity.
   -Result: Evolving microservice system, where boundaries sharpen over time.
   -When to use: For teams familiar with microservices but unsure of exact domain splits yet.
   -Good stepping-stone between monolith and fine-grained microservices. 

### Operational Readiness for Microservices (Microservice Prerequisites)
-The section highlights key capabilities you must develop before or during a shift to microservices. Here's a simplified summary of each concept:

1) Rapid Provisioning
   -What it means: You should be able to set up new servers or environments in hours, not days.
   -How: Use cloud services (like AWS, Azure) or automation tools (like Terraform, Ansible).
   -Why it matters: As your number of services grows, you’ll need environments ready quickly to support testing, scaling, or isolating new features.

2) Basic Monitoring
   -What it means: You need tools to track errors, downtime, and business metrics (like drop in orders).
   -How: Use tools like Prometheus, Grafana, ELK Stack, or AWS CloudWatch.
   -Why it matters: Microservices fail in subtle ways. Without good monitoring, you won’t know what broke or where.

3) Rapid Application Deployment
   -What it means: You must be able to deploy any service to testing or production quickly and repeatedly.
   -How: Build a Deployment Pipeline (e.g., with Jenkins, GitHub Actions, AWS CodePipeline).
   -Why it matters: With many small services, manual deployment becomes a bottleneck. You need fast rollback, testing, and release. 


### Hidden Complexity in Microservices
-Small microservices are easier to understand individually, but they make the system as a whole more complex — because now everything depends on how these services talk to each other.       

-Microservices are small and clear but:
1) The connections between them become messy — When something goes wrong, it’s hard to figure out where the problem is because it’s not obvious how services are linked.
2) Refactoring is hard — In a monolith, you can change one function and see the effects. In microservices, that same change might affect several remote services, making updates harder and riskier.
3) Asynchronous communication (like using queues) sounds great because it reduces tight links between services.
But… it adds delay, retry logic, and debugging complexity — so it's not always simpler.


*** Timeouts
    -Timeout is a defined period of time within which an operation must complete. If the operation does not finish within this specified time, it is automatically aborted or considered failed.
    -A timeout acts like a deadline for a task. If something takes too long, the system gives up and moves on.
    - Why Timeouts Are Important:
   1) Prevent systems from hanging indefinitely.
   2) Free up resources for other tasks.
   3) Help detect issues like network failures or slow services.

### Circuit Breaker
-https://www.youtube.com/watch?v=ADHcBxEXvFA (Refer to this video for proper understanding)
-In microservices architecture, circuit breakers are a resilience pattern used to prevent cascading failures when a service is unavailable, slow, or failing repeatedly.
-Software often needs to call other services that run in different processes or even on different machines over a network. Unlike in-memory calls, these remote calls can fail or get stuck waiting for a response. If too many parts of the system keep calling an unresponsive service, it can use up important resources like threads or memory. This can cause other parts of the system to fail too, leading to a chain reaction of failures across multiple systems.
-A circuit breaker is like a safety switch for function calls. You wrap the call in a circuit breaker that watches for failures. If too many failures happen, the circuit breaker 'trips'—and instead of making the call again, it immediately returns an error. This helps prevent overloading a failing service. 

-It works like an electrical circuit breaker: 
 1) It breaks the flow of requests when failure rates are too high.
 2) If failures exceed a threshold, the circuit trips (opens), and further calls are prevented for a time.
 3) After a cooldown, the system tries again (half-open).
 4) If successful, it closes again and resumes normal operation.

-Why is it Needed?
 -In distributed systems:
 1) A failing service can slow down or crash other dependent services.
 2) Without a breaker, retry storms and resource exhaustion can happen.
 3) To avoid cascading failures and give the failing service time to recover, a circuit breaker is used.
 -How this helps 
 1) Avoid overloading a struggling service.
 2) Fail fast instead of waiting on timeouts.
 3) Improve system reliability and responsiveness.

-States of a Circuit Breaker
 -There are 3 states in the circuit breaker lifecycle:
1) Closed - All requests go through. Failures are counted.
2) Open	- Requests are blocked immediately. The system does not call the service.
3) Half-Open - A limited number of test requests are allowed to check if the service has recovered.

-State Transitions (How It Works)
 -Let’s see how it transitions between states:
 1) Closed State:
   -Normal operation.
   -The system tracks failure count and failure rate.
   -If failures exceed a threshold (e.g., 5 out of 10 requests i.e. 50%), it trips to Open state.
 2) Open State:
   -The circuit is “broken”.
   -All requests are rejected immediately (fallback can be used to respond to client with errors or any default return value for eg.).
   -A cooldown timer is started (e.g., wait 30 seconds).
   -After timeout, it moves to Half-Open.
 3) Half-Open State:
   -System sends limited test requests (e.g., 1 out of 10).
   -If they succeed → circuit goes to Closed.
   -If they fail → back to Open.

-Timeout, Retry & Threshold Logic
 -Key parameters in circuit breaker config:
  1) timeout: 3000,                 - If the function takes >3s, consider it a failure
  2) errorThresholdPercentage: 50,  - Open the circuit if 50% of recent requests failed
  3) resetTimeout: 5000,            - After 5s in OPEN state, try one request in HALF-OPEN
  4) rollingCountTimeout: 10000,    - Count errors over a 10s window
  5) rollingCountBuckets: 10        - Divide that 10s into 10 buckets (1s each)

# Throttling
-Throttling is a mechanism that limits the number of requests or operations you can perform within a specific time period to prevent overuse or abuse of resources.
-Think of it like: "Slowing you down if you're sending too much too fast."
-Why Throttling Happens?
 -Cloud services (e.g., AWS Lambda, S3, SQS, API Gateway, DynamoDB) throttle your requests when:
 1) You exceed a service limit (e.g., requests per second).
 2) To protect backend systems from overload.
 3) To ensure fair usage among multiple users.
-In short:
 -Rate limiting = the rule
 -Throttling = the consequence when the rule is broken 
-Analogy:
 -Rate limiting is like: “Each person can only take 2 cookies per minute.”
 -Throttling is what happens if: Someone tries to take 5 cookies — you stop them, delay them, or reject the extra cookies. 

### Rate Limiting
-What is Rate Limiting?
 -Rate Limiting is a technique used to control the number of requests a client can make to a server in a defined period of time.
 -The HTTP 429 Too Many Requests client error response status code indicates the client has sent too many requests in a given amount of time. This mechanism of asking the client to slow down the rate of requests is commonly called "rate limiting".
 -A Retry-After header may be included to this response to indicate how long a client should wait before making the request again.

-Purpose of Rate Limiting
1) Prevent abuse	- Stops bots, spammers, or DoS attacks.
2) Ensure fair use - Prevents one user from consuming all system resources.
3) Protect backend services - Prevents overloading downstream databases/APIs.
4) Cost management - Limits expensive operations (e.g., 3rd-party API calls).
5) Comply with policies	E.g., APIs like GitHub limit requests per hour per user. 

-How Rate Limiting Works
 -Key Concepts:
 1) Limit -	Number of allowed requests
 2) Window - Time frame in which requests are counted
 3) Key - Identifier (usually IP, user ID, or API key)
 4) Action - What to do when the limit is exceeded (block, delay, etc.)

-Popular Rate Limiting Algorithms
 -Fixed Window
 1) E.g., 100 requests per 60 seconds.
 2) Easy to implement, but bursty at boundaries.

 -Sliding Window Log
 1) Keeps timestamps of each request.
 2) More precise, but memory-intensive.

 -Sliding Window Counter
 1) Mix between fixed and log.
 2) Uses partial counters from overlapping windows.

 -Token Bucket
 1) Tokens are added at a fixed rate.
 2) Requests consume tokens. If none left → block.
 3) Allows short bursts.

 -Leaky Bucket
 1) Like a funnel. Constant outflow of requests.
 2) Smooths traffic over time.

-Best Practices
 1) Show proper HTTP status code: Use 429 Too Many Requests.
 2) Add Retry-After headers.
 3) Use Redis or a central store in microservices.
 4) Apply soft limits + logging in dev to monitor behavior.
 5) Combine with authentication & IP blocking for stronger security. 

# Difference Between Throttling and Rate Limiting
-Rate Limiting	                              
1) Definition - A rule or policy that defines the maximum allowed rate of requests.	
2) Who sets it? - Set proactively by developers, system architects, or cloud services.
3) Purpose - Prevent abuse and control load before it happens.
4) Example - “Allow max 100 API calls per user per minute.”

-Throttling
1) Definition - The action taken when a client exceeds the rate limit.
2) Who sets it? - Enforced by the system in response to violations of the limit.
3) Purpose - Protect resources when abuse or high load is happening.
4) Example - If user sends 120 calls, 20 get throttled (delayed or blocked).

### Bulkhead Pattern
-https://www.youtube.com/watch?v=R2FT5edyKOg (Refer this video for Proper understanding)
-In microservices, the Bulkhead pattern ensures isolation between resources so that failure in one part of the system does not bring down everything else.
-It is a critical resiliency pattern for microservices, just like Circuit Breakers
-The term comes from ships: compartments are divided by bulkheads so flooding in one doesn’t sink the whole ship.
-It limits concurrency (number of simultaneous calls) per function or resource.
 -This means:
 1) If Service A becomes slow or stuck, it doesn't block Service B from operating.
 2) You partition resources (like threads, pools, API calls) per task.

-Why Use It?
 1) Without bulkheads: Too many slow or failed calls to one service can exhaust your thread pool or memory, affecting the whole app.
 2) With bulkheads: You allocate a limited number of concurrent calls per resource, isolating failures.

-Bulkhead Component	  Purpose
 1) maxConcurrent	 - Limits the number of parallel executions
 2) minTime	       - Adds small delays between calls (optional)
 3) schedule(fn)   - Queues or rejects tasks based on load 


### Difference between Circuit Breaker and Bulkhead
-Both Circuit Breaker and Bulkhead are resilience patterns used to prevent cascading failures and protect system stability.
-But they achieve this in different ways:  
Feature	                🛑 Circuit Breaker	                            🧱 Bulkhead
Primary Purpose	     Detect and break failing calls	             Isolate resources to prevent overload spillover
Inspired by	           Electrical circuit breaker (open/close)	     Ship bulkhead compartments (isolation)
What it protects	     The system from repeated failing calls	     One service/component from overloading others
Key Mechanism	        Opens after a threshold of failures	        Limits concurrent access to a service/pool
Prevents	              Wasting time/resources on failing services	  Contention or starvation from noisy neighbors
When activated	        On continuous failure of a dependency	     When concurrent request limit is reached
Response when active	  Fast failure / fallback response	           Reject or queue excess calls
Stateful?	           Yes (Closed, Open, Half-Open)	              No, purely concurrency-based
Best used for	        Flaky or failing remote services	          Protecting limited resource pools (e.g.DB pool)
Library Example	     opossum in Node.js	                          bottleneck, bulkhead-js

-Circuit Breakers prevents wasting resources on services that are already known to be failing
-In Bulkhead if service A is under high load, it won’t consume all the thread or connection pool and impact service B.

-Example in Microservices
 -Imagine 3 microservices: API Gateway → Order Service → Payment Service
   -Circuit Breaker Example
   1) Payment service starts timing out
   2) Circuit breaker "opens" to stop calling it
   3) API Gateway returns a fast fallback like: "Payment service is currently unavailable"

   -Bulkhead Example
   1) Limit: Only 10 threads can hit Payment Service concurrently
   2) If 10 are active, 11th gets rejected immediately or queued
   3) Prevents overload from blocking everything else


### Transient Failures & Non-Transient Failures
1) Transient Failures
   -A transient failure is a temporary issue that is likely to resolve itself without any manual intervention. These failures are intermittent and often succeed upon retrying.
   -Examples:
   1) Temporary network congestion
   2) DNS resolution hiccups
   3) Timeout due to momentary high latency
   4) Short-lived service unavailability (e.g., during deployment or autoscaling)
   5) Database connection limit temporarily exceeded
   -How to handle:
   1) Implement retry logic (with exponential backoff + jitter)
   2) Use timeouts and circuit breakers to avoid overwhelming services
   3) Retry only idempotent operations to avoid side effects

2) Non-Transient Failures
   -A non-transient failure is a permanent or persistent issue that is unlikely to succeed upon retry. These usually require manual intervention, code fix, or configuration change.
   -Examples:
   1) Incorrect credentials or expired token
   2) Service not implemented (e.g., 501 Not Implemented)
   3) Misconfigured environment (e.g., wrong URL or missing dependency)
   4) Database schema mismatch or missing table
   5) Hard disk full / memory leaks
   6) Code bugs causing crashes   
   -How to handle:
   1) Do not retry (it will waste resources and may make things worse)
   2) Log the error, alert the dev/ops team, or trigger fallback mechanisms
   3) Fail fast and give user-friendly error messages

### Retry Logic   
-Retry logic is a resilience strategy used in microservices to handle transient failures—temporary issues that can often be resolved by simply trying the failed operation again after some time. It is essential for improving system reliability and user experience in distributed systems.
-Retry logic means automatically reattempting a failed request or operation after it fails, with the assumption that the failure is temporary (e.g., network glitch, timeout, service momentarily down).
-Example:
 -Imagine a microservice making an API call to another service. If the call times out or returns a 503 Service Unavailable, instead of failing immediately, the system waits for a short period and retries the call.
-Typical Retry Pattern Includes:
 1) Max retry attempts – how many times to retry.
 2) Backoff strategy – how long to wait before retrying:
   -Fixed backoff – same delay each time.
   -Exponential backoff – increasing wait time between retries.
   -Exponential backoff with jitter – adds randomness to reduce contention.
-Retry Logic: Good Practices
1) Use retry only for transient errors (timeouts, 5xx errors, etc.)
2) Implement exponential backoff + jitter
3) Set a timeout for each retry attempt
4) Ensure idempotency to prevent harmful duplicates
5) Use with circuit breakers to avoid retrying when service is definitely down
6) Log all retry attempts for monitoring and debugging

### - Main Topic
##  - Sub Topic
#   - Contents inside Sub Topic

### RabbitMQ
-RabbitMQ is a message broker: it accepts and forwards messages. 
-You can think about it as a post office: when you put the mail that you want posting in a post box, you can be sure that the letter carrier will eventually deliver the mail to your recipient. In this analogy, RabbitMQ is a post box, a post office, and a letter carrier.
-The major difference between RabbitMQ and the post office is that it doesn't deal with paper, instead it accepts, stores, and forwards binary blobs of data ‒ messages.
-RabbitMQ, and messaging in general, uses some jargon:
1) Producing means nothing more than sending. A program that sends messages is a producer.
2) A queue is the name for the post box in RabbitMQ. Although messages flow through RabbitMQ and your applications, they can only be stored inside a queue. A queue is only bound by the host's memory & disk limits, it's essentially a large message buffer.
3) Consuming has a similar meaning to receiving. A consumer is a program that mostly waits to receive messages.
-Note that the producer, consumer, and broker do not have to reside on the same host; indeed in most applications they don't. An application can be both a producer and consumer, too.
-Declaring a queue is idempotent - it will only be created if it doesn't exist already. The message content is a byte array, so you can encode whatever you like there.

## Work Queues
-A Worker Queue, also called a Task Queue, is a messaging pattern where tasks (messages) are sent to a queue and then consumed by one or more workers (consumers) that process them independently.
-The main idea behind Work Queues (aka: Task Queues) is to avoid doing a resource-intensive task immediately and having to wait for it to complete. Instead we schedule the task to be done later. 
-We encapsulate a task as a message and send it to a queue.
-A worker process running in the background will pop the tasks and eventually execute the job. 
-When you run many workers the tasks will be shared between them.
-One of the advantages of using a Task Queue is the ability to easily parallelise work. If we are building up a backlog of work, we can just add more workers and that way, scale easily.
-This concept is especially useful in web applications where it's impossible to handle a complex task during a short HTTP request window.

# Round-robin dispatching:
 -Round-Robin Dispatching is RabbitMQ’s default message distribution mechanism where messages are sent to consumers in a rotating order.
 -How it works:
1) When multiple consumers are connected to the same queue, RabbitMQ alternates messages between them, one-by-one.
2) This helps balance the load equally (but not intelligently).
 -Limitations:
1) Doesn’t account for how long each task takes.
2) One worker may get slow, yet still receive messages unless prefetch is set.
 -By default, RabbitMQ will send each message to the next consumer, in sequence. On average every consumer will get the same number of messages. This way of distributing messages is called round-robin. (Refer to rabbitMQ docs and example in Work_Queues folder to understand this point)

# Message acknowledgment (Ack/Nack): 
 -Message Acknowledgment is a mechanism in RabbitMQ where a consumer tells the broker whether it has successfully processed a message or not.
 -A timeout (30 minutes by default) is enforced on consumer delivery acknowledgement. 
 -Why It Matters:
 1) Prevents message loss in case a consumer crashes or fails before processing the message.
 2) Ensures messages are only removed from the queue after successful processing.

# Message durability:
 -Message durability ensures that messages are not lost even if the RabbitMQ server crashes or restarts. It guarantees that both the queue and the messages are stored on disk.
 -Three Things Must Be Set for Full Durability:
 1) Durable Queue
   -Declared with: durable: true
   -The queue itself will survive a broker(queue) restart.
   -This durable option change needs to be applied to both the producer and consumer code.
 2) Persistent Message
   -Sent with: { persistent: true }
   -The message is saved to disk.  
   -Marking messages as persistent doesn't fully guarantee that a message won't be lost. Although it tells RabbitMQ to save the message to disk, there is still a short time window when RabbitMQ has accepted a message and hasn't saved it yet.
 3) RabbitMQ Shutdown Gracefully
   -Messages saved to disk will be recovered on restart, unless RabbitMQ crashed before flushing.

# Fair Dispatch:
 -Fair Dispatch is a strategy in RabbitMQ that ensures no worker is overloaded, by making the broker wait until a worker acknowledges its current message before sending another.     
 -Why It’s Needed:
 1) Default behavior (round-robin) doesn't consider whether a worker is busy or idle.
 2) Some workers may get multiple heavy tasks while others sit idle.
 3) Fair dispatch avoids this by sending messages only to free (acknowledged) workers.
 -channel.prefetch(1) - This tells RabbitMQ: “Don’t give more than one unacknowledged message to a worker at a time.”

*** Note - RabbitMQ doesn't allow you to redefine an existing queue with different parameters and will return an error to any program that tries to do that.   


## Publish/Subscribe
-Publish/Subscribe is a messaging pattern in RabbitMQ where a single message sent by a producer (publisher) is delivered to multiple consumers (subscribers) through an exchange, instead of just one.
-How It Works:
1) The producer sends messages to an exchange (not directly to a queue).
2) The exchange routes the message to all bound queues.
3) Each queue has its own consumer (subscriber).
-Exchange Type Used:
 -fanout exchange – broadcasts the message to all queues bound to it, ignoring routing keys.
 -channel.assertExchange('logs', 'fanout', { durable: false });

-Producer
   |
   v (message)
[ fanout exchange ]
   |        \
   v         v
[Queue A]  [Queue B]
   |          |
Consumer A  Consumer B

 -Both consumers get the same message.

-Use Cases:
1) Broadcasting logs to multiple monitoring services
2) Sending notifications to multiple microservices
3) Distributing events to multiple downstream systems

# Exchanges
-The core idea in the messaging model in RabbitMQ is that the producer never sends any messages directly to a queue.
-Instead, the producer can only send messages to an exchange.
-An Exchange on one side receives messages from producers and on the other side it pushes them to queues.
-There are a few exchange types available: direct, topic, headers and fanout. We use fanout for publish/subscribe.
-ch.assertExchange('logs', 'fanout', {durable: false})
-The default exchange:
 -In previous parts of the learning we knew nothing about exchanges, but still were able to send messages to queues. That was possible because we were using a default exchange, which is identified by the empty string ("").
 -channel.sendToQueue('hello', Buffer.from('Hello World!'));
 -In the above code we use the default or nameless exchange: messages are routed to the queue with the name specified as first parameter, if it exists.
-To publish to exchange we use:
 -channel.publish('logs', '', Buffer.from('Hello World!'));
 -The empty string as second parameter means that we don't want to send the message to any specific queue. We want only to publish it to our 'logs' exchange.

# Fanout Exchange
-A fanout exchange in RabbitMQ is a type of exchange that broadcasts all messages it receives to all queues that are bound to it, regardless of the routing key.
-It is commonly used in the publish/subscribe pattern, where multiple consumers need to receive a copy of the same message.

# Temporary Queues (Auto-delete / Exclusive Queues)
-A Temporary Queue in RabbitMQ is a short-lived queue that is automatically deleted when:
1) The consumer disconnects, or
2) The connection/channel is closed.
3) eg. - await channel.assertQueue('', { exclusive: true });
-Key Use Case:
1) Used in publish/subscribe pattern where each consumer wants its own copy of the message.
2) Ideal for temporary listeners like CLI log tailing, notifications, debugging, etc. 

# Bindings
-A binding is a link between an exchange and a queue in RabbitMQ. It tells the exchange how to route messages to one or more queues based on certain rules (like routing keys or patterns).
-It connects queues to exchanges.
-Defines the conditions (e.g., routing key match) under which a message from an exchange should be delivered to a queue.
-channel.bindQueue(queueName, exchangeName, routingKey);
-routingKey is ignored in fanout exchange type.


## Routing
-Routing in RabbitMQ refers to the process of delivering messages from an exchange to one or more queues based on specific routing rules.
-Routing in RabbitMQ is the mechanism by which an exchange delivers messages to the correct queue(s), based on the routing key and exchange type.
-It is determined by:
1) The type of exchange (direct, topic, headers)
2) The routing key used when the message is published
3) The binding key used when queues are bound to the exchange
-How Routing Works:
1) A producer sends a message to an exchange with a routing key.
2) The exchange uses its type and the routing key to decide which queue(s) to forward the message to.
3) Consumers then receive messages from those queues.
-Example:
 -Exchange Type: direct
1) Queue errorQueue is bound with binding key "error" to the direct exchange
2) Producer sends a message with routing key "error"
3) Message is routed only to errorQueue

# Bindings
-A binding is a link between an exchange and a queue in RabbitMQ. It tells the exchange how to route messages to one or more queues based on certain rules (like routing keys or patterns).
-Here in routing we use bindings with a routing key

# Direct exchange
-Our logging system from the previous tutorial broadcasts (Check code in Publish_Subscribe folder) all messages to all consumers. 
-We want to extend that to allow filtering messages based on their severity. For example we may want the script which is writing log messages to the disk to only receive critical errors, and not waste disk space on warning or info log messages.
-We were using a fanout exchange before, which doesn't give us much flexibility - it's only capable of mindless broadcasting.
-We will use a direct exchange instead. The routing algorithm behind a direct exchange is simple - a message goes to the queues whose binding key (key used to attach a queue and an exchange) exactly matches the routing key of the message.
-Use Cases:
 -User role-based notifications (e.g., send alerts only to admin, moderator, etc.)
 -Email queueing system (e.g., route emails by type: welcome, reset, promotion)
 -Microservices command dispatch (e.g., user.update, order.cancel)

*** Note - Multiple bindings:
           -It is perfectly legal to bind multiple queues with the same binding key. 
           -In that case, the direct exchange will behave like fanout and will broadcast the message to all the matching queues barring those that don't have the same binding key.


## Topics Exchange
-A topic exchange routes messages to one or more queues based on wildcard pattern-matching between the message’s routing key and the queue’s binding key.
-Although using the direct exchange improves our system, it still has limitations - it can't do routing based on multiple criteria.
-Topic exchange is powerful and can behave like other exchanges.
-When a queue is bound with # (hash) binding key - it will receive all the messages, regardless of the routing key like in fanout exchange.
-When special characters * (star) and # (hash) aren't used in bindings, the topic exchange will behave just like a direct one.
-Refer to speed.color.animal example in docs of rabbitMQ in topic exchange for better understanding.
-Key Concepts:
1) Exchange Type	- topic
2) Routing Key	   - A dot-separated string like "user.created" or "log.error"
3) Binding Key	   - A pattern that uses wildcards (*, #) to match routing keys      
-Wildcard Rules:
Wildcard	       Matches	           Example Binding Key	               Matches Routing Key
*	         Exactly one word	            user.*	                     user.login, user.logout
#	         Zero or more words	         log.#	                       log, log.error, log.error.db
-Real-World Analogy:
 -Think of topic exchange as a news filter system.
 -You subscribe to categories like:
 1) "sports.*" (all sports news)
 2) "weather.#" (all weather updates, any depth)
 3) "india.*.politics" (state-specific politics in India)
 -You only receive messages that match your interest pattern.
-Use Cases:
 -Microservices event systems (e.g., order.created, payment.failed)
 -Fine-grained logging systems (app.region.level)
 -Dynamic topic-based notifications (IoT sensors, logs, metrics) 


## Headers Exchange
-In RabbitMQ, a headers exchange is a special type of exchange where routing is done based on message headers (key–value pairs) instead of the routing key.
-How it works:
1) When you publish a message, you can attach headers (metadata in key–value format).
2) A queue is bound to the headers exchange with certain matching rules.
3) The exchange delivers the message to the queue(s) if the message’s headers match the binding’s headers.

-Binding with headers
 -When you bind a queue to a headers exchange, you define:
 1) One or more key–value pairs.
 2) A match type:
   -"x-match" = "all" → all key–value pairs must match.
   -"x-match" = "any" → at least one pair must match.

-Example
 -Suppose we have:
 Exchange: logs_headers (type = headers)
 Queue A: bound with {"x-match": "all", "format": "pdf", "type": "report"}
 Queue B: bound with {"x-match": "any", "format": "doc", "department": "finance"}

 -Now, if we publish:
 Message 1: headers = {"format": "pdf", "type": "report"}
 → Delivered to Queue A (matches all).

 Message 2: headers = {"format": "doc"}
 → Delivered to Queue B (matches any).

 Message 3: headers = {"department": "finance", "urgent": true}
 → Delivered to Queue B (matches any).

-When to use headers exchange?
1) When routing decisions depend on multiple attributes, not just a single routing key.
2) More flexible than direct or topic exchanges if you need complex routing logic.
3) But note: slower and less common in practice than direct or topic exchanges, because headers matching involves more overhead.

## RPC (Remote Procedure Call)
-In RabbitMQ, RPC (Remote Procedure Call) is a messaging pattern where a client sends a request message to a server via a queue, and the server processes it and sends back a response — simulating a function call over RabbitMQ.
-RPC in RabbitMQ allows a client to request some work and wait for a response, just like calling a function — but it's done through queues and messages.
-How It Works in RabbitMQ:
1) Client sends a message to a request queue.
2) It sets two special properties on the message:
   -replyTo: a queue where the response should be sent.
   -correlationId: a unique ID to match the response to the request.
3) Server listens to the request queue, processes the request, and sends the result back to the queue specified in replyTo.
4) Client listens to the replyTo queue and uses correlationId to match the response.
-Component	            Purpose
request queue	      Queue where client sends request
replyTo	            Queue for server to send result
correlationId	      Tracks request-response pair

# Correlation ID 
-A Correlation ID is a unique identifier used to match a request with its corresponding response in asynchronous messaging systems like RabbitMQ, especially in RPC (Remote Procedure Call) patterns.
-It ensures that the client can identify which response belongs to which request, especially when multiple requests are in-flight.

*** Note - Although RPC is a pretty common pattern in computing, it's often criticised. The problems arise when a programmer is not aware whether a function call is local or if it's a slow RPC. Confusions like that result in an unpredictable system and adds unnecessary complexity to debugging. Instead of simplifying software, misused RPC can result in unmaintainable spaghetti code.