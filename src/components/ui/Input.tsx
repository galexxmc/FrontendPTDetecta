// src/components/ui/Input.tsx
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

// forwardRef es OBLIGATORIO para que funcione con {...register("campo")}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-semibold mb-1 text-slate-700">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            w-full p-2.5 border text-sm rounded-lg outline-none transition
            bg-white focus:bg-white focus:ring-2 
            ${error 
              ? 'border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:ring-cyan-500 focus:border-cyan-500'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-red-500 text-xs mt-1 block font-medium animate-pulse">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';