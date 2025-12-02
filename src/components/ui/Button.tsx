// src/components/ui/Button.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  
  // Definimos estilos base y variantes
  const baseStyles = "px-5 py-2.5 rounded-xl font-medium transition flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95";
  
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-600 text-white shadow-cyan-500/20",
    secondary: "bg-[#d7e65d] hover:bg-[#bcca55] text-slate-700",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" size={18} />}
      {!isLoading && icon && <span>{icon}</span>}
      {children}
    </button>
  );
};