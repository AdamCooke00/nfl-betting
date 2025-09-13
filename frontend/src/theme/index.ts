// Centralized theme export
export { colors, getBg, getText, getBorder } from './colors';
export { spacing, layout } from './spacing';
export { typography } from './typography';
export { effects } from './effects';

// Utility function to combine multiple Tailwind classes
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(' ');
};
