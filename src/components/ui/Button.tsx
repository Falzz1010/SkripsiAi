import React from 'react';
import { ButtonProps } from '../../types';

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 hover:shadow-red-600/30',
};

export default function Button({ 
  onClick, 
  disabled, 
  loading = false,
  variant = 'primary', 
  children, 
  icon, 
  className = '' 
}: ButtonProps & { 
  className?: string;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center gap-1 sm:gap-2 
        px-2 sm:px-4 py-2 sm:py-3 
        text-xs sm:text-base font-medium
        rounded-lg
        transition-all duration-200 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${variants[variant]}
        ${className}
      `}
    >
      {loading ? (
        <div className="w-6 h-6 relative">
          <div className="absolute inset-0 border-4 border-t-transparent border-black dark:border-white rounded-full animate-spin" />
        </div>
      ) : icon && <span className="w-4 h-4 sm:w-5 sm:h-5">{icon}</span>}
      {children}
    </button>
  );
}