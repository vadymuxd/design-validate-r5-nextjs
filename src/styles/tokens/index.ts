/**
 * Design tokens extracted from Figma
 * Last updated: 2024-01-12
 */

export const tokens = {
  colors: {
    white: '#FFFFFF',
    black: '#000000',
    red: '#FF3654',     // Primary brand color
    green: '#77DB95',   // Success/positive actions
    grey: '#F2F2F7',    // Surface/background color
  },

  typography: {
    // Font families
    fontFamily: {
      primary: 'Inter, sans-serif',  // From Figma design system
    },

    // Font sizes mapped from Figma
    fontSize: {
      h1: '40px',      // Main headings
      h3: '24px',      // Card titles
      body: '16px',    // Regular text
      label: '12px',   // Pills and labels
      annotation: '10px', // Footer text
    },

    // Font weights mapped from Figma
    fontWeight: {
      regular: '400',   // Annotation text
      medium: '500',    // Body text
      semibold: '600',  // Labels
      bold: '700',      // Headings
    },

    // Line heights mapped from Figma
    lineHeight: {
      tight: '100%',    // Headings
      normal: '140%',   // Body text
    },

    // Predefined text styles for consistent typography
    textStyle: {
      h1: {
        font: 'Inter, sans-serif',
        size: '40px',
        weight: '700',
        lineHeight: '100%',
      },
      h3: {
        font: 'Inter, sans-serif',
        size: '24px',
        weight: '700',
        lineHeight: '100%',
      },
      body: {
        font: 'Inter, sans-serif',
        size: '16px',
        weight: '500',
        lineHeight: '140%',
      },
      label: {
        font: 'Inter, sans-serif',
        size: '12px',
        weight: '600',
        lineHeight: '100%',
      },
      annotation: {
        font: 'Inter, sans-serif',
        size: '10px',
        weight: '400',
        lineHeight: '140%',
      },
    },
  },

  spacing: {
    // Base spacing units
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
  },

  borderRadius: {
    sm: '10px',     // Voter buttons
    md: '20px',     // Cards
    lg: '36px',     // Pills
    full: '9999px', // Circular elements
  },

  // Layout constraints
  layout: {
    maxWidth: '730px',  // Maximum content width from Figma
    contentPadding: {
      x: '32px',  // Horizontal padding for cards
      y: '24px',  // Vertical padding
    },
  },
} as const;

// Type for our design tokens
export type DesignTokens = typeof tokens;

// Helper type for accessing nested token values
export type TokenValue<T> = T extends object ? {
  [K in keyof T]: TokenValue<T[K]>
} : T;

// Export individual token categories for more granular imports
export const {
  colors,
  typography,
  spacing,
  borderRadius,
  layout,
} = tokens; 