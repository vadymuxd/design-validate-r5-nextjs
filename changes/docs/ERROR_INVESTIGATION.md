# Next.js Error Investigation - Metadata Export Issue

## Current Error Analysis

```
Error: ./src/app/page.tsx
You are attempting to export "metadata" from a component marked with "use client", which is disallowed.
```

## The Problem
Next.js is detecting that `page.tsx` is being treated as a client component (has "use client" directive) but is trying to export metadata, which is only allowed in server components.

## Investigation Steps

### 1. Check page.tsx for "use client" directive
Need to verify if page.tsx has a "use client" directive at the top

### 2. Check imported components for client contamination
The error could be caused by importing client components that force the parent to become a client component:

**Imported components in page.tsx:**
- `CollectionCard` from '@/components/CollectionCard'
- `TitleNavigation` from '@/components/TitleNavigation'  
- `PageLoader` from '@/components/PageLoader'
- `Footer` from '@/components/Footer'

### 3. Check each component for "use client" directives

**Known client components:**
- `TitleNavigation.tsx` - Has "use client" (uses useState, useEffect, useRouter)

**Need to check:**
- `CollectionCard.tsx` - May have been modified with client-side features
- `PageLoader.tsx` - May have client-side logic
- `Footer.tsx` - Should be server component

## Hypothesis
The issue is likely that **CollectionCard.tsx** was modified to include:
- "use client" directive
- useState/useEffect for API calls
- Client-side state management

When `page.tsx` imports a client component, it can cause the entire page to be treated as a client component, which conflicts with the metadata export.

## Investigation Results - ISSUE FOUND! ✅

### Root Cause Identified
The error is caused by **client component contamination**. When a server component (page.tsx with metadata export) imports client components, it can cause the entire page to be treated as a client component.

### Client Components Found:
1. ✅ **TitleNavigation.tsx** - Has 'use client' (uses useState, useEffect, useRouter) - ✅ Expected
2. ✅ **PageLoader.tsx** - Has 'use client' (uses useState, useEffect) - ⚠️ This is the problem!
3. ✅ **Footer.tsx** - Has 'use client' (uses useState) - ⚠️ This is also a problem!
4. ✅ **CollectionCard.tsx** - No 'use client' - ✅ Good

### The Problem
In `page.tsx` line structure:
```tsx
import { PageLoader } from '@/components/PageLoader';  // ⚠️ Client component
import { Footer } from '@/components/Footer';          // ⚠️ Client component

export const metadata: Metadata = { ... }             // ❌ Can't export from client component
```

**PageLoader uses:** useState, useEffect for loading state management
**Footer uses:** useState for popup state management

### The Solution Strategy
We need to restructure to avoid importing client components directly into the page that exports metadata.

**Option 1: Move metadata to layout.tsx**
**Option 2: Create wrapper components**  
**Option 3: Use dynamic imports**
**Option 4: Restructure component responsibilities**

### Client Features Analysis

**PageLoader.tsx client dependencies:**
- `useState(false)` for `isContentLoaded` state
- `useEffect()` for window.addEventListener('load') event
- Document.readyState checking
- Conditional rendering based on load state

**Footer.tsx client dependencies:**  
- `useState(false)` for `showPopup` state
- Click handlers for popup modal
- Event.stopPropagation() for modal interactions

### Solution Options

**RECOMMENDED: Option 1 - Dynamic Imports**
Use Next.js dynamic imports to load client components without affecting server component:
```tsx
import dynamic from 'next/dynamic'

const PageLoader = dynamic(() => import('@/components/PageLoader').then(mod => ({ default: mod.PageLoader })), {
  ssr: false
})
const Footer = dynamic(() => import('@/components/Footer').then(mod => ({ default: mod.Footer })), {
  ssr: false  
})
```

**Option 2 - Component Restructuring**
- Move PageLoader's client logic to a separate ClientPageLoader component
- Move Footer's popup logic to a separate ClientFooter component
- Keep base components as server components

**Option 3 - Layout-based Solution**
- Move metadata export to layout.tsx
- Keep page.tsx as client component

### Next Steps
1. ✅ Implement Option 1 (Dynamic Imports) - Minimal disruption
2. ✅ Test that metadata export works
3. ✅ Verify PageLoader and Footer functionality is preserved

---
*Investigation Date: July 25, 2025*
*Focus: Next.js client/server component boundary issue*
