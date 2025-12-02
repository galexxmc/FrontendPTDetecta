// src/components/ui/Select.tsx
import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react'; // Usamos un icono para la flecha

// Definimos la estructura de una opción
export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options?: SelectOption[]; // Array de opciones (opcional)
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder = "Seleccione...", className = '', children, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-semibold mb-1 text-slate-700">
          {label}
        </label>
        
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full p-2.5 pr-10 border text-sm rounded-lg outline-none transition appearance-none bg-white
              text-slate-700
              ${error 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-400'
              }
              ${className}
            `}
            {...props}
          >
            <option value="">{placeholder}</option>
            
            {/* Opción A: Si pasas un array de 'options' */}
            {options && options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}

            {/* Opción B: Si prefieres pasar <option> manualmente como children */}
            {children}
          </select>

          {/* Flecha personalizada (Truco Senior UI) */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <ChevronDown size={16} />
          </div>
        </div>

        {error && (
          <span className="text-red-500 text-xs mt-1 block font-medium animate-pulse">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';