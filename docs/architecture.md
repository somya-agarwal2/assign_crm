# EngageX AI CRM - Architecture Documentation

## 1. System Architecture
This diagram outlines the high-level system architecture, showing how the frontend, backend, database, and external AI services interact.

```mermaid
graph TD
    User([User / Marketer]) -->|HTTP/REST| ReactFrontend[React Frontend SPA]
    ReactFrontend -->|JSON over HTTPS| BackendAPI[Flask Backend API]
    BackendAPI <-->|SQLAlchemy| Database[(PostgreSQL/SQLite)]
    BackendAPI <-->|REST API| AIService[Google Gemini AI Service]
    BackendAPI -->|Webhooks| ExternalServices[External Channels: Twilio/SendGrid Simulator]
```

## 2. Database ER Diagram
This diagram represents the core data models and their relationships within the multi-tenant architecture.

```mermaid
erDiagram
    Organization ||--o{ Workspace : has
    Workspace ||--o{ User : contains
    Workspace ||--o{ Customer : manages
    Workspace ||--o{ Segment : owns
    Workspace ||--o{ Campaign : runs
    Workspace ||--o{ Journey : builds
    Workspace ||--o{ Template : stores
    Workspace ||--o{ AIOpportunity : generates

    Customer ||--o{ Order : places
    Order ||--o{ OrderItem : contains
    Segment }|--|{ Customer : contains
    
    Campaign ||--o{ CampaignMessage : includes
    Campaign ||--o{ DeliveryEvent : triggers
    Campaign }|--|| Segment : targets
    
    Journey ||--o{ JourneyNode : consists_of
    Journey ||--o{ JourneyRun : creates
    JourneyRun ||--o{ JourneyLog : records
    
    Organization {
        string id PK
        string name
    }
    Workspace {
        string id PK
        string name
        string organization_id FK
    }
    User {
        string id PK
        string name
        string email
        string role
        string workspace_id FK
    }
    Customer {
        string id PK
        string email
        float churn_score
        float total_spent
        string workspace_id FK
    }
    Segment {
        string id PK
        string name
        string filters
        boolean is_ai
    }
    Campaign {
        string id PK
        string name
        string status
        string audience_id FK
    }
    Journey {
        string id PK
        string name
        string campaign_id FK
    }
    Order {
        string id PK
        float amount
        string status
        string customer_id FK
    }
```

## 3. Frontend Architecture
The frontend is a React Single Page Application (SPA) structured around feature-based components and pages.

```mermaid
graph TD
    App[App.tsx - Routing] --> Layout[Main Layout / Sidebar]
    
    Layout --> Pages
    
    subgraph Pages [Core Pages / Views]
        Dashboard[Dashboard.tsx]
        CustomerInt[CustomerIntelligence.tsx]
        Audience[AudiencesHub.tsx & AudienceBuilder.tsx]
        Campaigns[CampaignStudio.tsx]
        Journeys[JourneyBuilder.tsx & JourneyAnalytics.tsx]
        AICommand[AICommandCenter.tsx & AIStrategistOverview.tsx]
        Templates[TemplateEditor.tsx]
    end
    
    Pages --> Hooks[Custom Hooks]
    Pages --> Contexts[React Context Providers]
    Pages --> API[API Service Layer / fetch wrappers]
    API --> Backend[(Backend API)]
```

## 4. Backend Architecture
The backend uses a modular App-Factory pattern with Flask, keeping routes, models, and AI logic separated.

```mermaid
graph TD
    Request[Incoming Request] --> Auth[JWT Authentication Middleware]
    Auth --> Routes[API Routes / Blueprints]
    
    subgraph Core Modules
        Routes --> CustomersRoute[Customers]
        Routes --> CampaignsRoute[Campaigns]
        Routes --> JourneysRoute[Journeys]
        Routes --> AIServiceRoute[AI Insights]
    end
    
    CustomersRoute --> Models[SQLAlchemy Models]
    CampaignsRoute --> Models
    JourneysRoute --> Models
    AIServiceRoute --> Models
    
    JourneysRoute --> Threading[Background Processing / Simulation]
    AIServiceRoute --> ExternalAI[Google Gemini LLM]
    
    Models --> DB[(Database)]
```

## 5. AI Flow
How AI insights and content generations are processed throughout the platform.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant AIService as AI Service Wrapper
    participant LLM as Google Gemini API
    participant DB as Database

    User->>Frontend: Clicks "Generate AI Journey"
    Frontend->>Backend: POST /ai/journey/generate {goal, segment}
    Backend->>DB: Fetch Segment Data & Customer Analytics
    DB-->>Backend: Return Data Context
    Backend->>AIService: Construct Prompt with Data Context
    AIService->>LLM: Send Prompt to LLM
    LLM-->>AIService: Return JSON Response
    AIService-->>Backend: Parse & Validate Output
    Backend->>DB: Save Generated Journey Nodes
    Backend-->>Frontend: Return Journey UI Payload
    Frontend-->>User: Render Generated Journey on Canvas
```

## 6. Journey Builder Flow
The execution flow of a customer passing through an active marketing journey automation.

```mermaid
graph TD
    Trigger[Trigger: Segment Match] --> Enter[Customer Enters Journey]
    
    Enter --> JourneyRun[Create JourneyRun Record]
    JourneyRun --> Action1[Action: Email / SMS / WhatsApp]
    
    Action1 --> Wait[Wait Node]
    Wait --> Condition{Condition Node: e.g. Opened Email?}
    
    Condition -->|Yes| ExitSuccess[Exit: Goal Met / Positive Path]
    Condition -->|No| Action2[Action: Follow-up Message]
    Action2 --> ExitFail[Exit: Default Completion]
    
    Action1 -.-> Log1[Create JourneyLog]
    Wait -.-> Log2[Create JourneyLog]
    Action2 -.-> Log3[Create JourneyLog]
```
