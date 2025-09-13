// Tailwind-based spacing system
export const spacing = {
  // Padding variants
  padding: {
    none: '',
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },

  // Margin variants
  margin: {
    none: '',
    xs: 'm-2',
    sm: 'm-3',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
  },

  // Gap for flexbox/grid
  gap: {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  },

  // Space between elements
  space: {
    none: 'space-y-0',
    xs: 'space-y-2',
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
  },
} as const;

// Common spacing patterns
export const layout = {
  container: 'container mx-auto px-4',
  section: 'py-8',
  card: 'p-6',
  button: 'px-4 py-2',
  input: 'px-3 py-2',
} as const;
