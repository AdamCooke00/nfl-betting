export interface SelectProps {
  value: string | number;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface SelectItemProps {
  value: string | number;
  children: React.ReactNode;
  className?: string;
}
