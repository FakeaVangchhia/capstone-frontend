# Overview

This is a full-stack chat application called StudyBot, designed as an AI-powered study companion. The application features a modern, responsive interface with real-time chat functionality. Users can create multiple chat sessions, send messages, and interact with an AI assistant through a sleek, glass-morphism styled interface.

The application is built using a monorepo structure with separate client and server directories, sharing common types and schemas through a shared directory.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for development and production builds
- **UI Framework**: Tailwind CSS with custom glass-morphism styling and shadcn/ui components
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Component Library**: Radix UI primitives with custom styling via shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **Theme**: Dark mode by default with custom CSS variables and Inter font family

## Backend Architecture
- **Runtime**: Node.js with TypeScript (ES modules)
- **Framework**: Express.js with custom middleware for logging and error handling
- **Development**: Integrated Vite dev server for hot module replacement
- **API Design**: RESTful endpoints following `/api/` prefix convention
- **Error Handling**: Centralized error middleware with structured error responses
- **Logging**: Custom request logging with response time tracking

## Data Storage Solutions
- **Database**: PostgreSQL configured via Drizzle ORM
- **ORM**: Drizzle with type-safe schema definitions
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Migrations**: Drizzle Kit for schema migrations
- **Development Fallback**: In-memory storage implementation for development/testing
- **Schema**: Three main entities - users, chat sessions, and messages with proper relationships

## Database Schema Design
- **Users**: ID (UUID), username (unique), password, timestamps
- **Chat Sessions**: ID (UUID), optional user ID, title, timestamps
- **Messages**: ID (UUID), session ID (foreign key), content, role (user/assistant), timestamp
- **Relationships**: Sessions can have multiple messages, sessions can be anonymous or user-associated

## Authentication and Authorization
- **Current State**: Basic structure in place but not fully implemented
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **User Model**: Username/password based authentication schema defined
- **Authorization**: Currently allows anonymous chat sessions

## API Architecture
- **Chat Sessions**: CRUD operations for managing chat conversations
- **Messages**: Create and retrieve messages within sessions
- **Validation**: Zod schemas for request validation
- **Response Format**: Consistent JSON responses with error handling
- **Endpoints**:
  - `GET /api/chat-sessions` - List sessions by user
  - `POST /api/chat-sessions` - Create new session
  - `GET /api/chat-sessions/:id/messages` - Get session messages
  - `POST /api/messages` - Send new message

## Development Architecture
- **Hot Reload**: Vite integration with Express for seamless development
- **TypeScript**: Strict configuration with path aliases
- **Code Organization**: Clear separation between client, server, and shared code
- **Build Process**: Vite for client bundling, esbuild for server bundling

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for state management
- **Build Tools**: Vite for bundling, esbuild for server compilation, tsx for development
- **TypeScript**: Full TypeScript support across the stack

## Database and ORM
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection Pooling**: Built-in connection management through Neon client

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Radix UI**: Headless UI components for accessibility and behavior
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library for consistent iconography

## Development and Deployment
- **Replit Integration**: Vite plugins for Replit development environment
- **Session Management**: PostgreSQL session store for production use
- **Environment Configuration**: Environment variables for database and deployment settings

## Form and Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **Drizzle Zod**: Integration between Drizzle schemas and Zod validation

## Utilities and Helpers
- **Class Variance Authority**: Type-safe CSS class management
- **clsx & tailwind-merge**: Conditional CSS class composition
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation