import React from 'react';

export const Button = ({
    label = 'Button',
    type = 'button',
    className = '',
    disabled = false,
}) => {
  return (
    <button 
      type={type} 
      className={`text-white bg-[var(--primary-color)] hover:bg-[var(--primary-color)] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center ${className}`} 
      disabled={disabled}
    >
      {label}
    </button>
  );
};
