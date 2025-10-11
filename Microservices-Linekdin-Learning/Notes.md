-_Resources/_support/snippets.md contains commands for project setup and docker containers needed for the setup.

-Admin username - akshit@jain.com
 Admin password - akshit
 
# Telemetry
-Telemetry is the automatic collection, transmission, and analysis of data from software applications or systems to monitor their performance, health, and usage.
-In context of backend/microservices:
1) It includes metrics (CPU, memory, request counts), logs, and traces
2) Helps engineers observe what’s happening inside services without logging into them
3) Used for debugging, alerting, and performance monitoring

# Jaeger
-Jaeger is an open-source tool used for distributed tracing to monitor and troubleshoot transactions across microservices.
-In simple terms:
1) It helps you see the flow of a request as it moves through various services
2) Shows how long each part of the process takes
3) Great for identifying bottlenecks and failures in microservice architectures
4) Built by Uber, and part of the Cloud Native Computing Foundation (CNCF)

# Analogy: Microservices as a Factory
-Imagine your microservices application is like a factory where multiple machines (services) work together to build a product (handle a user request).
-Telemetry = Smart Cameras on Every Machine:
1) OpenTelemetry acts like a network of smart cameras installed on each machine. These cameras automatically record what each machine is doing — how long a task takes, when it starts/stops, and what goes wrong — without interfering with the work.
2) They collect traces, metrics, and logs
3) Everything is tagged with a request ID so you know which product/request it's related to
-Jaeger = Playback Room for Supervisors:
1) Jaeger is like the control room where supervisors (developers/engineers) can play back the footage of how a specific product/request moved through the factory.
2) You can see the entire journey of a request: which services it touched, how long each step took, and where any delay or error occurred
3) It gives a timeline view, helping spot slow or broken machines (services)

# server.listen(0)
-Means: Start the server on a random available port assigned by the operating system.
-Useful when:
1) You don’t care which port is used (e.g. during testing or spawning multiple instances)
2) You can later retrieve the actual port with: server.address().port
-eg.
const server = require('http').createServer();
server.listen(0, () => {
  console.log('Server running on port', server.address().port);
});

# Service Registry
-A Service Registry is a central directory where microservices register themselves and discover each other dynamically at runtime.

-Why is it needed?
1) Microservices often scale up/down, change IP/ports
2) Hardcoding service locations is not practical
3) Enables dynamic discovery of services

-Key Components:
1) Service Provider: Registers itself with the registry
2) Service Registry: Keeps track of all service instances
3) Service Consumer: Queries the registry to find other services

-How it works (Flow):
1) Service A starts and registers with the registry (e.g., "I’m Auth Service, running at IP:Port")
2) Service B asks the registry: “Where’s Auth Service?”
3) Registry responds with available instance info
4) Service B calls Auth Service using the retrieved address

-Examples of Service Registries:
1) Eureka (Netflix OSS)
2) Consul (by HashiCorp)
3) Etcd (used by Kubernetes)
4) Zookeeper

-Modes:
1) Self-registration: Services register/deregister themselves
2) Third-party registration: Orchestration tool (like Kubernetes) handles registration

-Benefits:
1) Dynamic discovery
2) Load balancing
3) Failover & fault tolerance
4) Health checks (in advanced registries)

-Note - registry-service:0.0.1. Here 0.0.1 is the service version used in nodejs-microservices-4403064\workspace\microservices\registry-service\routes\index.js for the api call to :serviceversion.

-if (serviceip.includes("::1") || serviceip.includes("::ffff:127.0.0.1")) {
    serviceip = "127.0.0.1";
}

-This code normalizes the IP address to "127.0.0.1" (IPv4 localhost) if the detected IP is in IPv6 format representing localhost.
-Breakdown:
1) "::1" → This is the IPv6 loopback address (equivalent to 127.0.0.1 in IPv4)
2) "::ffff:127.0.0.1" → This is an IPv4-mapped IPv6 address, often returned on some systems when using IPv6 mode but pointing to 127.0.0.1
-Why it's useful:
1) Ensures consistency (especially if you only want to use IPv4)
2) Prevents bugs where service discovery or client logic fails due to mismatched IP formats

# SemVer (Semantic Versioning)
-Commonly used for versioning software and npm 
-SemVer Format: MAJOR.MINOR.PATCH
-Example: 2.5.3

-Breakdown:
Part	      Meaning	                                         When to Increment
MAJOR	   Breaking changes	                          Incompatible API changes or big refactors
MINOR	   Backward-compatible feature additions	   Adding new functionality (non-breaking)
PATCH	   Backward-compatible bug fixes	           Fixing bugs, improving internals (non-breaking)

-Example: 1.2.3 → MAJOR.MINOR.PATCH
1) 1.2.3 → 1.3.0: Added a new feature
2) 1.2.3 → 1.2.4: Fixed a bug
3) 1.2.3 → 2.0.0: Made breaking changes

-Why Use SemVer?
1) Predictability and consistency
2) Helps developers manage dependencies safely
3) Indicates the impact of a new release

const candidates = Object.values(this.services).filter((service) => {
            return name === service.name && semver.satisfies(service.version, version);
        });

        return candidates[Math.floor(Math.random() * candidates.length)];

-With above code we are trying to create a load balancing scenario along with different versions of the service using semver. (Refer section 4- Querying the registry in Linekdin Learning).

-cleanup() {
        const now = Math.floor(new Date() / 1000);
        Object.keys(this.services).forEach((key) => {
            if(this.services[key].timestamp + this.timeout < now){
                delete this.services[key];
                console.log(`Removed expired service ${key}`);
            }
        });
    }

-Code to cleanup services after they exceed the timeout limit

-Note - Its a good practice to have tracing at the very start of your file before invoking any npm package. In response to the code:

// eslint-disable-next-line no-unused-vars
const tracing = require("../lib/tracing")(
  `${config.serviceName}:${config.serviceVersion}`
);

# Code at catalog-service/bin/start.js
const register = async () => axios.put(
    `http://127.0.0.1:3080/register/${config.serviceName}/${config.serviceVersion}/${server.address().port}`
  ).catch(err => console.error(err));

  const unRegister = async () => axios.delete(
    `http://127.0.0.1:3080/register/${config.serviceName}/${config.serviceVersion}/${server.address().port}`
  ).catch(err => console.error(err));

  register();
  const interval = setInterval(register, 10000);

  const cleanUp = async () => {
    const clean = false;
    if (!clean) {
      clearInterval(interval);
      await unRegister();
    }
  };

  process.on("uncaughtException", async () => {
    await cleanUp();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await cleanUp();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    await cleanUp();
    process.exit(0);
  });

1) Purpose:
   -This code is for registering a microservice with a service registry (like a custom-built service registry or a tool like Consul) when it starts, and unregistering it when the process exits or crashes.

2) Code Breakdown:
   -Service Registration Code:
   const register = async () => axios.put(
  `http://127.0.0.1:3080/register/${config.serviceName}/${config.serviceVersion}/${server.address().port}`
  ).catch(err => console.error(err));

  1) Sends an HTTP PUT request to register the service with the registry.
  2) Uses dynamic values: serviceName, serviceVersion, and the port the service is running on (server.address().port).
  3) Catches and logs any registration errors.

  -Service Unregistration Code:
  const unRegister = async () => axios.delete(
  `http://127.0.0.1:3080/register/${config.serviceName}/${config.serviceVersion}/${server.address().port}`
  ).catch(err => console.error(err));

  1) Sends a DELETE request to unregister the service.
  2) Same URL format as registration.
  3) Also logs any errors if unregistration fails.

  -Initial Registration + Heartbeat Code:
  register();
  const interval = setInterval(register, 10000);

  1) Calls register() once immediately on startup.
  2) Sets a heartbeat (re-registers every 10 seconds) to ensure liveness in registry.

  -Cleanup Logic (Unregister & Stop Heartbeat) Code:
  const cleanUp = async () => {
  const clean = false;
  if (!clean) {
    clearInterval(interval);
    await unRegister();
   }
  };
  1) Called during shutdown or crash.
  2) Stops the heartbeat interval.
  3) Calls unRegister() to inform the registry that the service is going offline.
  4) The clean = false line appears unused — possibly leftover or placeholder logic.

  -Process Exit Handlers Code:
    process.on("uncaughtException", async () => {
    await cleanUp();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await cleanUp();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    await cleanUp();
    process.exit(0);
  });

  1) Handles different ways the process might exit:
     -uncaughtException: runtime crash
     -SIGTERM: kill signal (used in Docker/container shutdowns)
     -SIGINT: Ctrl+C from terminal
  2) On each, it calls cleanUp() and then exits the process safely.

-What are lifecycle hooks in the context of a service?
 -Lifecycle hooks manage a service's phases—start, run, stop—ensuring registration at start, regular heartbeat signals to avoid expiration, and unregistration upon stopping.
 -Lifecycle hooks in a service context are crucial for managing a service's behavior during its lifecycle. They ensure that a service registers when it starts up, sends a heartbeat to prevent being considered expired, and unregisters when it is about to stop.

-Why is the HTTP verb 'PUT' used for the service registration route?
 -The HTTP verb 'PUT' is used because it's idempotent, meaning it can be called multiple times without changing the result beyond the initial application.
 -The 'PUT' verb is used in the service registration route because it is idempotent. This means that no matter how many times it's called, the outcome will be the same after the initial application. This makes it ideal for registering a service, as calling it multiple times will not result in multiple registrations.

-Why is a service registry needed in a microservices architecture?
 -A service registry acts as a phonebook for services, storing their names and locations, which helps applications find and communicate with each other
 -A service registry acts like a phonebook for microservices, keeping track of the location (IP and port) of each service. It helps resolve the problem of service discovery in a dynamic environment where services might be running on different hosts, ports, or even in different cloud environments. When a service starts, it registers itself with the service registry. When an application needs to interact with a service, it first asks the service registry for the service's location.

-Why is a service randomly selected when more than one matching service is available in the service registry?
 -A service is randomly selected to distribute the load among all matching services, ensuring no single service is overloaded.
 -Randomly selecting a service when multiple match the criteria aids in load balancing, preventing any single service from becoming a bottleneck.     

-What is the purpose of the RegistryClient class (class name ServiceClient in file ServiceClient.js) in this script?
 -File path - nodejs-microservices-4403064\workspace\shopper\server\services\ServiceClient.js
 -The RegistryClient class communicates with the registry and calls services using two methods: getService, which gets service details, and callService, which executes service requests.
 -The RegistryClient is a helper class designed for interactions with the registry and calling the correct service. It comprises two static methods, 'getService' and 'callService'. 'getService' is responsible for getting the service details like IP and port from the registry, while 'callService' leverages these details to make requests to the specific service.

-What distinguishes OpenTelemetry from Jaeger in microservices?
 -OpenTelemetry provides APIs and SDKs for instrumenting applications, while Jaeger collects, visualizes, and analyzes trace data.
 -OpenTelemetry and Jaeger serve distinct roles in microservices. OpenTelemetry offers APIs and SDKs to instrument applications to generate telemetry data. Jaeger, on the other hand, is a tracing system that collects, visualizes, and analyzes trace data for performance optimization and troubleshooting. 

-Is the data within a JWT token encrypted?
 -No, the data within a JWT token is not encrypted, it's encoded and can be read by anyone.
 -The data within a JWT token is not encrypted, but rather encoded. This means it can be read by anyone, but only created and validated using a secret.

-Question: What is the purpose of the 'Bearer' authentication scheme in HTTP requests?
 -The 'Bearer' authentication scheme in HTTP requests is used to send JWT in the Authorization header of the HTTP request.
 -The 'Bearer' authentication scheme in HTTP requests is used to send a JWT (JSON Web Token) in the Authorization header. This token represents the authenticated session and can be used to identify and authenticate the user for secure routes. 

-What potential issue might arise from using JWTs if data changes in the database while the token is still valid?
 -JWT doesn't reflect changes made to user information in the database after its creation until a new token is issued.
 -The JWT contains static user data from its creation time. It won't reflect changes like updated user roles or permissions in the database until a new token is generated.   

# Microservices handling failures:
1) With multiple independent services, the probability of failure increases. 
2) There can be network issues, hardware failures, software bugs, everything can take down a service, and such a service outage can have a cascading effect on all other services. 
3) Resilience helps the system to continue to function despite individual service failures.

-Service Resilience:
1) Gracefully react to errors and recover from failures.
2) Not about avoiding failures but responding to them effectively.
3) The goal is to prevent downtime and data loss.

-Resilience Techniques:
1) Chaos Testing (Chaos Engineering)
-Purpose: To intentionally inject failures into a system to test its resilience and ability to recover gracefully.
-Key Concepts:
 1) Simulate real-world outages (e.g., network latency, service crashes).
 2) Monitor system behavior under stress.
 3) Validate that fallbacks, retries, circuit breakers work.
-Tools:
 1) Chaos Monkey (Netflix)
 2) Gremlin, LitmusChaos, ChaosBlade
-Best Practices:
 1) Start in staging, not production.
 2) Inject small failures first (like killing a pod).
 3) Use observability tools (logs, metrics, traces).

2) Caching
-Purpose: To reduce load on backend systems by storing frequently accessed data closer to the user.
-Types:
 1) Client-side cache: browser memory, localStorage
 2) Server-side cache: in-memory (e.g., LRU cache), file cache
 3) Distributed cache: Redis, Memcached  

-Use Cases:
 1) Frequently accessed database queries
 2) Static API responses
 3) Session storage 

-Strategies:
 1) Write-through: write to cache + DB together
 2) Write-behind: write to cache, async to DB
 3) Cache-aside: app checks cache first, then DB if miss
 4) TTL (Time To Live): auto-expire stale data 

3) Message Queues
-Purpose:
 1) Decouple services by sending messages asynchronously via a queue.
 2) Improve scalability and fault tolerance. 

-Popular Tools: RabbitMQ, Amazon SQS, Kafka, BullMQ (Node.js) 

-Use Cases:
 1) Email/SMS sending
 2) Payment processing
 3) Retry mechanism for failed tasks
 4) Order processing workflows

-Benefits:
 1) Avoids tight coupling
 2) Absorbs traffic spikes
 3) Enables event-driven architectures 

-Key Concepts:
 1) Producer: Sends message to queue
 2) Consumer: Processes message
 3) Dead-letter queue: Stores failed messages for review 

-V.Imp Note - Always use try catch block wherever possible to avoid application crash in the browser in case of service shutdown or network failures, etc. 