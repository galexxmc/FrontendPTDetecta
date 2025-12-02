// src/components/layout/Header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/Logo-Detecta-Horizontal.png';

const MENU_ITEMS = [
  { label: 'Pacientes', path: '/pacientes' },
  { label: 'Historias Clínicas', path: '/historias' },
  { label: 'Citas', path: '/citas' },
  { label: 'Médicos', path: '/medicos' },
  { label: 'Exámenes Lab', path: '/examenes' },
];

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md h-20 flex items-center justify-between px-8">
      
      {/* 1. Logo Area */}
      <Link to="/" className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
        aria-label="Volver al inicio">
        <img src={logo} alt="Logo Detecta" className="h-17 w-auto object-contain" />
      </Link>

      {/* 2. Menú de Navegación */}
      <nav className="flex-1 flex justify-center">
        <ul className="flex gap-8 list-none m-0 p-0">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 py-2 border-b-2 
                    ${isActive 
                      ? 'text-blue-600 border-blue-600' // Estilo Activo
                      : 'text-gray-500 border-transparent hover:text-blue-400' // Estilo Inactivo
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 3. Área de Usuario (Placeholder) */}
      <div className="w-48 flex justify-end">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 cursor-pointer hover:bg-blue-200 transition-colors">
          DR
        </div>
      </div>
    </header>
  );
};