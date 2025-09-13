import { useState, useRef, useEffect, Children } from 'react';
import { cn } from '../../../theme';
import type { SelectProps, SelectItemProps } from './Select.types';

export const Select = ({
  value,
  onValueChange,
  placeholder = 'Select...',
  disabled = false,
  className,
  children,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedValue: string | number) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    const items = Children.toArray(children);
    const selectedItem = items.find((item: any) => item?.props?.value === value);
    return selectedItem?.props?.children || placeholder;
  };

  return (
    <div ref={selectRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center justify-between w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          disabled
            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'hover:border-gray-400 cursor-pointer',
          className
        )}
      >
        <span className="block truncate">{getDisplayValue()}</span>
        <svg
          className={cn(
            'w-5 h-5 transition-transform',
            isOpen && 'transform rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1 max-h-60 overflow-auto">
            {Children.toArray(children).map((child: any, index) => {
              if (!child?.props) return null;
              return (
                <div
                  key={child.props.value || index}
                  onClick={() => handleSelect(child.props.value)}
                  className="block w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none cursor-pointer"
                >
                  {child.props.children}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// SelectItem is now just a prop container - rendering handled internally
export const SelectItem = ({ children }: SelectItemProps) => {
  return <>{children}</>;
};
