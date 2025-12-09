import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-4 md:py-6 mt-auto w-full">
      <div className="w-full px-4 mx-auto text-center">
        <p className="text-sm md:text-base text-slate-600 font-medium leading-tight">
          © {new Date().getFullYear()} Sistema Detecta
          <span className="hidden sm:inline"> - </span>
          <span className="block sm:inline text-slate-500 sm:text-slate-600">
            Gestión Hospitalaria Empresarial
          </span>
        </p>

        <p className="text-[10px] md:text-xs text-slate-400 mt-1 md:mt-2">
          Versión 1.0.0
        </p>
      </div>
    </footer>
  );
};