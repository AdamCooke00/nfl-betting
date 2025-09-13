// Tailwind-based color system
export const colors = {
  // Primary colors (using blue scale)
  primary: {
    50: 'bg-blue-50 text-blue-50 border-blue-50',
    100: 'bg-blue-100 text-blue-100 border-blue-100',
    500: 'bg-blue-500 text-blue-500 border-blue-500',
    600: 'bg-blue-600 text-blue-600 border-blue-600',
    700: 'bg-blue-700 text-blue-700 border-blue-700',
  },

  // Semantic colors
  success: {
    50: 'bg-green-50 text-green-50 border-green-50',
    100: 'bg-green-100 text-green-100 border-green-100',
    800: 'bg-green-800 text-green-800 border-green-800',
  },

  warning: {
    50: 'bg-yellow-50 text-yellow-50 border-yellow-50',
    100: 'bg-yellow-100 text-yellow-100 border-yellow-100',
    800: 'bg-yellow-800 text-yellow-800 border-yellow-800',
  },

  error: {
    50: 'bg-red-50 text-red-50 border-red-50',
    100: 'bg-red-100 text-red-100 border-red-100',
    200: 'bg-red-200 text-red-200 border-red-200',
    600: 'bg-red-600 text-red-600 border-red-600',
    800: 'bg-red-800 text-red-800 border-red-800',
  },

  // Neutral colors (using gray scale)
  neutral: {
    50: 'bg-gray-50 text-gray-50 border-gray-50',
    100: 'bg-gray-100 text-gray-100 border-gray-100',
    200: 'bg-gray-200 text-gray-200 border-gray-200',
    400: 'bg-gray-400 text-gray-400 border-gray-400',
    500: 'bg-gray-500 text-gray-500 border-gray-500',
    600: 'bg-gray-600 text-gray-600 border-gray-600',
    700: 'bg-gray-700 text-gray-700 border-gray-700',
    800: 'bg-gray-800 text-gray-800 border-gray-800',
    900: 'bg-gray-900 text-gray-900 border-gray-900',
  },

  // Background colors
  white: 'bg-white text-white border-white',
  transparent: 'bg-transparent text-transparent border-transparent',

  // Chart colors (for consistent visualization)
  chart: {
    blue: '#3B82F6',
    red: '#EF4444',
    green: '#10B981',
    yellow: '#F59E0B',
    purple: '#8B5CF6',
    gray: '#6B7280',
  },

  // Interactive states
  interactive: {
    hover: 'hover:bg-gray-100',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500',
    active: 'active:bg-gray-200',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
} as const;

// Helper function to extract just the background class
export const getBg = (colorString: string) => {
  return colorString.split(' ')[0];
};

// Helper function to extract just the text class
export const getText = (colorString: string) => {
  return colorString.split(' ')[1];
};

// Helper function to extract just the border class
export const getBorder = (colorString: string) => {
  return colorString.split(' ')[2];
};
