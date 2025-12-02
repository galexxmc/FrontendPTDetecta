// src/components/layout/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-6 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-slate-600 font-medium">
          © {new Date().getFullYear()} Sistema Detecta - Gestión Hospitalaria Empresarial
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Versión 1.0.0
        </p>
      </div>
    </footer>
  );
};