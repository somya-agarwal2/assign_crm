# EngageX API Documentation

The EngageX backend is built using Flask and provides a RESTful API for the frontend and external channels. All protected routes require a JWT token passed in the `Authorization` header.

## Base URL
```
http://localhost:5000/api
```

## Authentication
| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Register a new user and create a workspace. |
| `POST` | `/auth/login` | Authenticate and retrieve a JWT token. |

## Customers
| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/customers` | List all customers in the workspace. |
| `GET` | `/customers/<id>` | Get a specific customer profile. |
| `POST` | `/customers/import` | Import bulk customers from JSON/CSV. |
| `GET` | `/customers/<id>/actions` | Get the action timeline for a customer. |

## Audience & Segments
| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/segments` | List all audience segments. |
| `POST` | `/segments` | Create a new segment with dynamic filters. |
| `POST` | `/segments/preview` | Preview the customers matching a segment configuration without saving it. |

## Campaigns
| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/campaigns` | List all campaigns. |
| `POST` | `/campaigns` | Create a new bulk or personal campaign. |
| `POST` | `/campaigns/<id>/launch` | Launch a campaign and trigger the delivery simulator. |

## Journeys
| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/journeys` | List all marketing journeys. |
| `POST` | `/journeys` | Save a new journey or template. |
| `POST` | `/journeys/<id>/activate` | Activate a journey, triggering continuous background processing. |
| `GET` | `/journeys/<id>/analytics` | Retrieve real-time node analytics for the journey canvas. |

## AI Command Center
| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/ai/intent` | Parse user natural language input into actionable UI routes. |
| `POST` | `/ai/journey/generate` | Generate a full JSON journey structure based on a prompt and segment name. |
| `GET` | `/ai/opportunities/audience` | Retrieve AI-identified revenue opportunities. |
| `POST` | `/ai/templates/generate` | Generate marketing copy using Google Gemini based on the selected segment. |

## Webhooks & Channels
| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/webhooks/receive` | Ingress endpoint for the channel simulator to update `DeliveryEvent` statuses (Delivered, Opened, Clicked). |
| `GET` | `/webhooks/stream` | Server-Sent Events (SSE) endpoint for real-time frontend updates. |

---
*Note: Ensure all requests containing payloads set the `Content-Type: application/json` header.*
