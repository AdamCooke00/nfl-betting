// Tailwind-based effects and transitions
export const effects = {
  // Shadow variants
  shadow: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    base: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },

  // Border radius
  rounded: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    base: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  },

  // Transitions
  transition: {
    none: '',
    all: 'transition-all duration-200 ease-in-out',
    colors: 'transition-colors duration-200 ease-in-out',
    shadow: 'transition-shadow duration-200 ease-in-out',
    transform: 'transition-transform duration-200 ease-in-out',
  },

  // Hover effects
  hover: {
    lift: 'hover:shadow-lg hover:-translate-y-1',
    glow: 'hover:shadow-md',
    scale: 'hover:scale-105',
  },

  // Focus styles
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    outline: 'focus:outline-none focus:border-blue-500',
  },

  // Border styles
  border: {
    none: 'border-0',
    thin: 'border border-gray-200',
    thick: 'border-2 border-gray-300',
  },
} as const;
