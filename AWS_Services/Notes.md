### AWS Lambda
-What It Is:
 -AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers. You upload your code, set a trigger (like an API call, file upload, DB change), and AWS executes the function in response.
 -In the context of AWS Lambda, "without provisioning" means: You don’t have to manually set up or manage any servers, virtual machines (VMs), or containers to run your code.
 -Analogy:
  -Think of Lambda like this:
  1) Instead of renting a kitchen and hiring a chef (traditional server),
  2) You just hand over a recipe (your code) and the meal is cooked for you on demand,
  3) No need to buy ingredients, clean dishes, or maintain the kitchen (i.e., no provisioning).

-What "Provisioning" Normally Involves:
 -In traditional computing or even cloud-based VMs/containers, provisioning means:
 1) Choosing server specs (CPU, RAM, storage).
 2) Launching instances or containers.
 3) Installing runtimes/dependencies (e.g., Node.js, Python).
 4) Scaling infrastructure (adding more servers under high load).
 5) Handling OS updates, security patches, etc.

-In AWS Lambda:
 -You skip all of the above. Instead:
 1) You just upload your function code (in a ZIP or via editor).
 2) Lambda automatically runs it in a secure, scalable compute environment.
 3) It scales automatically, handles runtime provisioning, patching, and termination behind the scenes. 

-Key Features:
1) Automatic scaling (based on number of events)
2) Stateless functions (no memory between calls)
3) Max execution time: 15 minutes
4) Environment variables, Layers for shared code, and Versions/Aliases
5) IAM-based permission model (via execution roles) 

-Pros:
1) No server management
2) Cost-effective (you pay only per request and per ms)
3) Seamless integration with other AWS services
4) Easy to scale and update

-Cons:
1) Cold starts: Delay when starting inactive functions (especially in VPC or certain languages)
2) Limited runtime (15 min max)
3) Limited memory and disk space (512MB temp storage)
4) Debugging is less straightforward than traditional servers

# Cold Start in AWS Lambda
-A cold start in AWS Lambda occurs when your function is invoked after being idle for a while, and AWS has to set up a new execution environment before running your code. This setup takes some time and causes a delay in response (high latency) — that's the cold start issue.
-Cold start = delay caused when AWS has to boot a new container to run your Lambda.
-It only happens when your function has been idle.

-Why Does Cold Start Happen?
 -AWS Lambda is serverless, so it doesn’t keep your function running all the time. When a function is idle (no invocations for minutes or hours), AWS may shut down the execution environment to save resources.
 -Then, when the function is called again AWS has to do the following before running your code:
 1) Allocate compute resources (VM/container).
 2) Load the runtime (Node.js, Python, etc.).
 3) Initialize your function code.
 4) Run any global setup code (e.g., DB connections, config loading).
 -This setup phase is the cold start.

-How to Reduce Cold Starts
1) Use Provisioned Concurrency
   -Keeps a number of instances always warm.
   -Costs more but improves latency.
2) Minimize Initialization Logic
   -Move heavy setup (e.g., DB connection) inside the handler if possible.
3) Avoid unnecessary dependencies
   -Smaller package = faster cold start.
4) Keep functions warm manually (not ideal)
   -Schedule a ping every few minutes (e.g., CloudWatch cron).
   -This is more of a workaround. 


### Amazon S3 (Simple Storage Service)
-What It Is:
 -Amazon S3 is an object storage service that stores data as “objects” inside “buckets”. Used for storing images, files, backups, logs, and even static websites.

-How It Works:
 -You create a bucket, then upload files (objects) into it.
 -Each object has:
 1) Key (filename)
 2) Value (data)
 3) Metadata
 4) ACLs (access controls)
 -Objects are accessible via unique URLs and can be made public or private.
 -You can trigger Lambda/SNS/SQS on file events (upload, delete). 

-Key Features:
1) 11 9’s durability (99.999999999%)
2) Versioning, encryption, lifecycle policies
3) Static website hosting
4) Event notifications
5) Storage classes (Standard, Intelligent-Tiering, Glacier) 

-Pros:
1) Scalable and highly durable
2) Integrated with many AWS services
3) Supports large files (up to 5TB)
4) Lifecycle management reduces cost

-Cons:
1) Not a real-time database
2) Default eventual consistency (some operations only)
3) Latency can be high for frequent access use cases

# What is a Presigned URL in S3?
-A presigned URL is a temporary, secure link that grants access to a specific S3 object without needing AWS credentials.

-Use Case:
 -When you want to allow someone (like a user or app) to:
 1) Download a private file from your bucket, or
 2) Upload a file to your bucket,
 -…without making the entire bucket public.

-How It Works?
1) You (the server-side app) generate a presigned URL using AWS SDK.
2) You specify:
   -The HTTP method (GET for download, PUT for upload)
   -The object key (file name)
   -The expiration time (e.g., 10 minutes)
3) You send that URL to the client.
4) The client accesses the file using that URL — no need to authenticate. 

-Security Notes:
1) Presigned URLs expire automatically after the time you set.
2) You can restrict uploads/downloads to specific objects.
3) They’re ideal for temporary sharing, like:
   -Allowing a client to upload profile pictures.
   -Letting a user download a private report.


### Amazon SQS (Simple Queue Service)   
-What It Is:
 -SQS is a message queue service that allows components of a distributed system to communicate asynchronously via messages.

-How It Works:
 -Producer sends a message to a queue.
 -Consumer reads messages from the queue and processes them.
 -Ensures loose coupling of components.
 -Two types of queues:
 1) Standard: 
    -At-least-once delivery.
    -Each message might be delivered more than once. SQS makes a best effort to deliver messages at least once. -It's not guaranteed to be exactly once.
    -High throughput - Supports nearly unlimited number of transactions per second (TPS), making it ideal for high-volume systems.
    -Messages may not be processed in the order sent.
    -Use when:
    1) Order doesn't matter (e.g., log processing, notifications)
    2) You can handle duplicate messages (e.g., idempotent processing)
 2) FIFO: 
    -Exactly-once delivery, preserves order.
    -Each message is delivered only once and not duplicated (as long as deduplication is handled properly).
    -Messages are delivered in the exact order they are sent, based on message group IDs.
    -Low throughput - Limited to up to 300 messages/sec (or 3,000 with batching).
    -Use when:
    1) Order is critical (e.g., financial transactions, inventory updates)
    2) Duplicates are unacceptable

-Key Features:
1) Dead Letter Queues (DLQs) for failed messages
2) Visibility Timeout to prevent duplicate processing
3) Message retention: up to 14 days
4) Integration with Lambda, SNS 

-Pros:
1) Highly scalable
2) Reliable message delivery
3) Decouples application components
4) Secure and managed

-Cons:
1) No ordering in Standard queues
2) Throughput is limited in FIFO queues
3) Messages are deleted after consumption unless DLQ is configured


### Amazon API Gateway
-What It Is:
 -API Gateway is a fully managed service that makes it easy to create, publish, and manage APIs for backend services. Supports REST, HTTP, and WebSocket protocols.

-How It Works:
1) You define an API with endpoints, methods (GET, POST, etc.)
2) Each endpoint integrates with a backend: Lambda, HTTP URL, or AWS service
3) API Gateway handles:
   -Throttling
   -Authorization (IAM, Cognito)
   -Request/response transformation
   -Caching and rate limiting 

-Key Features:
1) RESTful + WebSocket + HTTP APIs
2) API Keys, Custom Domains
3) CORS support
4) Monitoring via CloudWatch   

-Pros:
1) Built-in scaling and security
2) Reduces server code (e.g., request validation, auth)
3) Supports caching and logging

-Cons:
1) Configuration complexity
2) Pricing based on number of requests and data transferred


### Amazon DynamoDB
-Amazon DynamoDB is a fully managed NoSQL database service that provides key-value and document-based data storage. It’s optimized for applications needing consistent, single-digit millisecond latency at any scale.

-How It Works:
1) Tables store data in items (rows) and attributes (columns).
2) Each item must have a primary key:
   -Partition key (simple key)
   -Partition + Sort key (composite key)
3) Data is distributed across partitions using a hash of the partition key, allowing horizontal scaling.
4) You define Read Capacity Units (RCUs) and Write Capacity Units (WCUs) unless using on-demand mode.
5) DynamoDB Streams can capture item changes in real time (integrate with Lambda).

-Key Features:
1) On-Demand or Provisioned capacity
2) Automatic scaling
3) Global Tables for multi-region replication
4) DynamoDB Streams for change data capture
5) Time To Live (TTL) for automatic expiry
6) Conditional writes & transactions
7) Secondary Indexes (LSI and GSI) for flexible querying

-Pros:
1) Millisecond latency
2) Serverless and highly scalable
3) Integrated with AppSync, Lambda, Step Functions
4) Encryption at rest and in transit

-Cons:
1) Limited querying (no joins, complex filters)
2) Must design for access patterns upfront
3) Pricing can get complex and high with large-scale workloads

### Amazon CloudWatch
-What It Is:
 -CloudWatch is AWS's monitoring and observability service. It collects logs, metrics, and events from AWS resources and applications to enable visibility, alerting, and automation.

-How It Works:
1) CloudWatch Metrics: Numerical data like CPUUtilization, Lambda duration, S3 requests, etc.
2) CloudWatch Logs: Application/system logs (e.g., from Lambda, ECS, EC2)
3) CloudWatch Alarms: Set thresholds on metrics to trigger actions (e.g., auto-scaling, SNS notifications)
4) CloudWatch Events (EventBridge): Respond to system events (e.g., EC2 instance terminated)
5) CloudWatch Dashboards: Visual representation of metrics across regions/services 

-Key Features:
1) Collect metrics, logs, events
2) Create dashboards and visualizations
3) Create alarms to trigger actions (e.g., stop EC2 if CPU low)
4) Integration with nearly all AWS services
5) Real-time insights and automated responses

-Pros:
1) Centralized monitoring platform
2) Automated actions on metric-based alarms
3) Granular control over log retention and queries
4) Scalable and fully managed

-Cons:
1) Can become expensive with high log/metric volume
2) Complex UI for beginners
3) Retention and filtering need manual setup


### AWS AppSync
-What It Is:
 -AWS AppSync is a managed GraphQL service for building real-time, serverless APIs. It automatically handles querying, mutating, and synchronizing data from multiple sources like DynamoDB, Lambda, and HTTP APIs.

-How It Works:
1) You define a GraphQL schema (types, queries, mutations, subscriptions).
2) AppSync maps schema fields to data sources (e.g., a DynamoDB table or Lambda function).
3) Supports real-time data updates using GraphQL subscriptions.
4) Can handle offline sync, caching, and authorization (via IAM, API Key, or Cognito). 

-Key Features:
1) Managed GraphQL backend
2) Subscriptions for real-time updates
3) Connect to multiple data sources (DynamoDB, Lambda, HTTP APIs)
4) Caching layer (for performance)
5) Fine-grained auth (IAM/Cognito)

-Pros:
1) Built-in real-time sync
2) Works seamlessly with serverless architecture
3) Reduces backend boilerplate code
4) Easy integration with front-end clients (via Amplify)

-Cons:
1) Steep learning curve (GraphQL + VTL/resolvers) - Now resolvers can be written in Javascript
2) Limited control over resolver logic unless using Lambda
3) Debugging and schema evolution can be tricky