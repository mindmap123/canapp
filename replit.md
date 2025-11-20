# Premium Sofa Catalog

## Overview

A premium, tablet-optimized web application for browsing and comparing sofas. The application features a modern, Apple-inspired design system with sophisticated filtering capabilities and an intuitive product comparison interface. Built with React, TypeScript, and Express, it delivers a fluid, PWA-ready experience optimized for iPad and desktop usage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- Radix UI primitives for accessible, unstyled component foundations
- shadcn/ui component library (New York style variant) for premium, consistent UI patterns
- Tailwind CSS with custom design tokens for styling
- Class Variance Authority (CVA) for component variant management

**Design System Implementation**
- Premium color system with HSL-based theming supporting light/dark modes
- Custom spacing scale following Tailwind's 4-based rhythm (4, 6, 8, 12, 16, 20, 24)
- Rounded design language with micro-interactions (hover-elevate, active-elevate patterns)
- Touch-optimized components with 44px minimum hit areas
- Typography system using Inter font family with defined hierarchy

**State Management**
- React Context API for selection state (multi-product comparison)
- URL-based filter state for shareable catalog views
- Local component state for UI interactions

**Key Application Patterns**
- Home screen with visual sofa type selection cards
- Advanced filtering system (type, dimensions, price, availability)
- Product catalog with grid layout
- Individual product detail pages with image gallery
- Multi-product comparison view
- Photo upload capability for custom product images

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for API server
- ESM module system throughout the codebase
- Custom request logging middleware for API monitoring

**API Design**
- RESTful endpoints for CRUD operations on sofa data
- Filter endpoint supporting multiple query parameters
- File upload endpoint using Multer middleware
- Static file serving for product images and uploads

**Data Layer**
- In-memory storage implementation (MemStorage) as primary data store
- Drizzle ORM schema defined for PostgreSQL compatibility (ready for database integration)
- Type-safe data models using Zod schemas derived from Drizzle

**File Management**
- Multer-based image upload with file size limits (5MB)
- Organized file storage: `/uploads` for user uploads, `/attached_assets/generated_images` for product images
- Image validation to accept only image MIME types

**Development Tooling**
- Vite middleware integration for development HMR
- TypeScript compilation with strict mode enabled
- Path aliases for clean imports (@, @shared, @assets)

### Data Models

**Sofa Schema**
```typescript
- id: UUID (auto-generated)
- name: Text
- type: Enum (fixe, convertible, fauteuil, meridienne)
- dimensions: width, depth, height (integers in cm)
- price: Decimal
- comfort: Text description
- availability: Boolean flags (inStore, inStock, onOrder)
- images: Array of image URLs with mainImage reference
- description: Text
- features: Array of feature strings
```

**Filter Parameters**
- Sofa type selection
- Maximum width (slider)
- Depth range (categorical: shallow/standard/lounge)
- Maximum budget (slider)
- Availability checkboxes (store/stock/order)

## External Dependencies

### UI & Component Libraries
- **Radix UI**: Headless UI component primitives (@radix-ui/react-*)
- **shadcn/ui**: Pre-built component library built on Radix
- **Lucide React**: Icon system for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with PostCSS and Autoprefixer

### State & Data Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management
- **Zod**: Schema validation and type inference
- **Drizzle ORM**: TypeScript ORM with PostgreSQL support

### File Handling
- **Multer**: Multipart form data handling for file uploads

### Database (Configured, Not Currently Active)
- **Neon Serverless PostgreSQL**: Serverless PostgreSQL client (@neondatabase/serverless)
- **Drizzle Kit**: Database migrations and schema management
- Connection configured via `DATABASE_URL` environment variable

### Build & Development Tools
- **Vite**: Build tool and dev server
- **esbuild**: JavaScript/TypeScript bundler for production server build
- **TypeScript**: Type system
- **ESLint & Prettier**: Code quality tools (implicit via Replit ecosystem)

### Utility Libraries
- **clsx & tailwind-merge**: Conditional className composition
- **date-fns**: Date manipulation utilities
- **nanoid**: Unique ID generation
- **wouter**: Lightweight routing library

### Design Inspiration References
Application design follows principles from:
- Apple Store product configurators (premium visual hierarchy)
- Tesla design system (minimalist, spacious layouts)
- Dyson aesthetics (rounded forms, soft shadows, fluid animations)