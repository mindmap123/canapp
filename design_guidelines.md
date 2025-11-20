# Premium Sofa Catalog - Design Guidelines

## Design Approach
**Reference-Based Approach**: Apple Store product configurators + Tesla design system + Dyson premium aesthetics
- Minimaliste, elegant, highly readable
- 2025-ready premium interface optimized for tablet (iPad) + desktop
- PWA-ready, iFrame-compatible architecture

## Core Design Principles
- **Generous negative space** for breathing room
- **Rounded forms** with soft shadows
- **Fluid micro-animations** (subtle fade, zoom, slide)
- **Touch-optimized** interactions for tablet-first experience
- **Ultra-intuitive** navigation (< 2 seconds comprehension time)

## Typography
- **Font Family**: SF Pro Display (primary) or Inter (fallback)
- **Hierarchy**:
  - Hero headlines: text-4xl to text-5xl, font-semibold
  - Section titles: text-2xl to text-3xl, font-semibold
  - Product names: text-xl, font-medium
  - Body text: text-base, font-normal
  - Metadata/badges: text-sm, font-medium

## Layout System
**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-20
- Card gaps: gap-6 to gap-8
- Touch-friendly minimum hit areas: 44px (h-11, min-h-11)

## Color System (Availability Badges)
- 🟢 **En magasin** (In Store): Green accent
- 🔵 **En stock** (In Stock): Blue accent  
- 🟡 **Sur commande** (On Order): Yellow/Amber accent
- Use badges with soft backgrounds, colored borders, and matching icons

## Component Library

### 1. Home Screen - Quick Search
**Layout**: Full-screen card-based interface with visual hierarchy
- **Sofa Type Selector**: Large interactive cards (2×2 grid on tablet)
  - Visual icons + sofa type imagery
  - Types: Fixe (Fixed), Convertible, Fauteuil (Armchair), Méridienne
  - Premium hover states with subtle scale/shadow animations
  - Active state with border highlight

- **Filter Controls**:
  - Width slider (cm) with visible value display
  - Depth radio cards: "Pas profonde" / "Standard" / "Lounge"
  - Budget range slider with currency formatting
  - Availability checkboxes with color-coded badges

- **CTA Button**: Full-width, prominent, gradient or solid with subtle shadow
  - Text: "Voir les modèles compatibles"

### 2. Catalog Grid - Results Page
**Layout**: Responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) with gap-6
- **Product Cards**: Elevated cards with rounded corners (rounded-2xl), soft shadows
  - Hero image (16:10 ratio) with lazy loading
  - Product name (text-lg, font-semibold)
  - Version/dimensions (text-sm, text-gray-600)
  - Price (text-2xl, font-bold) with "TTC" label
  - Availability badges (stacked or inline, top-right overlay on image)
  - Icon indicators for type (fixed/convertible/armchair/meridienne)
  - Action buttons: "Voir détails" (outline) + "Ajouter à la sélection" (solid)
  - Hover: Subtle lift (shadow-lg), smooth transition

### 3. Product Detail Page
**Layout**: Hero-driven, full-width with contained content sections

- **Hero Section**: 
  - Large product image (60% viewport height)
  - Horizontal thumbnail gallery below (scrollable, 6-8 visible)
  - "Ajouter photo" button for manual uploads (subtle, secondary style)
  - Zoom capability on image click

- **Content Sections** (max-w-5xl, centered):
  - **Price Block**: Prominent, clear pricing with availability badge
  - **Specifications Grid**: 2-column layout showing:
    - Dimensions (L × P × H)
    - Confort rating/description
    - Type with icon
  - **Availability Table**: Modern, card-based with color-coded status
  - **Variants Section**: Horizontal scrollable cards showing:
    - Other widths/depths
    - Angle/relax/convertible versions
    - Each as mini product card
  - **Technical Plans**: Expandable/zoomable image viewer
  - **Showroom Gallery**: Masonry or grid layout for uploaded photos

### 4. Comparison View
**Layout**: Side-by-side cards (2-4 products) with sticky headers
- Responsive: Stack on mobile, 2 columns on tablet, 3-4 on desktop
- **Comparison Cards**: Equal width, synchronized scrolling
  - Product image
  - Name + version
  - Price comparison
  - Dimensions table
  - Comfort indicators
  - Availability badges
  - Feature checklist (convertible, relax options)
- Visual differentiators: Highlight differences with subtle background colors

## Animations
**Micro-interactions only** (no distracting motion):
- Page transitions: Subtle fade (200ms)
- Card hover: Scale 1.02, shadow elevation (150ms ease-out)
- Button press: Scale 0.98 (100ms)
- Gallery swipe: Smooth slide (300ms cubic-bezier)
- Filter application: Fade-in results (250ms)

## Images
- **Product photos**: 16:10 ratio, high quality, white/neutral backgrounds
- **Gallery images**: Variable ratios, maintain aspect with object-fit
- **Icons**: Use Heroicons for UI elements, custom icons for sofa types
- **Hero sections**: Large product imagery throughout (NOT generic backgrounds)

## Touch Optimization
- Minimum 44px tap targets for all interactive elements
- Swipeable galleries with momentum scrolling
- Pull-to-refresh on catalog
- Large, obvious buttons and controls
- No hover-dependent interactions (all touch-accessible)

## Key Interactions
- **Filter application**: Immediate visual feedback, results update smoothly
- **Photo upload**: Drag-and-drop or tap-to-select with progress indication
- **Product selection**: Visual checkmark, add to comparison tray
- **Gallery navigation**: Swipe gestures with haptic feedback suggestion