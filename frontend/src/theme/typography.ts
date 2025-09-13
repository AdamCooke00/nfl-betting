// Tailwind-based typography system
export const typography = {
  // Font sizes with line heights
  text: {
    xs: 'text-xs leading-4',
    sm: 'text-sm leading-5',
    base: 'text-base leading-6',
    lg: 'text-lg leading-7',
    xl: 'text-xl leading-8',
    '2xl': 'text-2xl leading-9',
    '3xl': 'text-3xl leading-10',
  },

  // Font weights
  weight: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },

  // Heading presets
  heading: {
    h1: 'text-3xl font-bold leading-tight',
    h2: 'text-2xl font-bold leading-tight',
    h3: 'text-xl font-semibold leading-tight',
    h4: 'text-lg font-semibold leading-tight',
    h5: 'text-base font-semibold leading-tight',
    h6: 'text-sm font-semibold leading-tight',
  },

  // Text alignment
  align: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  },

  // Text truncation
  truncate: {
    none: '',
    single: 'truncate',
    multiline: 'line-clamp-3',
  },
} as const;
