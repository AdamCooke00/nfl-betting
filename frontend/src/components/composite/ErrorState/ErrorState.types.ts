export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}
