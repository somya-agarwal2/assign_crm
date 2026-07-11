# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-11

### Added
- **Multi-Tenant Architecture**: Complete backend isolation using Workspace IDs and SQLAlchemy.
- **JWT Authentication**: Full role-based access control and secured API routes.
- **Journey Builder UI**: Drag-and-drop interactive canvas to create multi-step marketing automations.
- **AI Command Center**: Integration with Google Gemini for automated audience insight generation.
- **Campaign Studio**: Dedicated module to build, launch, and track bulk and personal AI campaigns.
- **Dynamic Segment Builder**: Advanced query builder mapping UI filters to SQLAlchemy JSON fields.
- **Channel Simulator**: Webhook-based event simulator to mock delivery events (Sends, Opens, Clicks).
- **Analytics Dashboard**: Centralized dashboard to view Total Revenue, Active Journeys, and AI metrics.
- **Custom Templates**: Rich text and HTML template management for personalized customer communications.

### Fixed
- Resolved Journey Builder recursive prop drilling and canvas state mutations.
- Fixed `DeliveryEvent` webhook schema validation errors.
- Corrected active journey backend polling authorization issues.
- Optimized segment count estimation and customer querying logic.
