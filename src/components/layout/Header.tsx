// Capa: Frontend - Components (UI/Layout)
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/Logo-Detecta-Horizontal.png";
import { useAuth } from "../../context/AuthContext";
// Agregamos iconos 'Menu' y 'X' para la versión móvil
import { LogOut, User as UserIcon, ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const MENU_ITEMS = [
  { label: "Pacientes", path: "/pacientes" },
  { label: "Historias Clínicas", path: "/historias" },
  { label: "Citas", path: "/citas" },
  { label: "Médicos", path: "/medicos" },
  { label: "Exámenes Lab", path: "/examenes" },
];

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Estado para el Dropdown de Usuario
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // NUEVO: Estado para el Menú Hamburguesa en Móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper para cerrar ambos menús al navegar
  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-md h-20 px-4 md:px-8">
        <div className="flex items-center justify-between h-full max-w-8xl mx-auto">
            
            {/* 1. SECCIÓN IZQUIERDA: LOGO */}
            <div className="flex items-center gap-2">
                {/* BOTÓN HAMBURGUESA (Solo visible en Móvil < lg) */}
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <Link to="/pacientes" onClick={handleNavigation} className="flex items-center gap-2 hover:opacity-80 transition">
                    <img src={logo} alt="Logo Detecta" className="h-15 lg:h-17 md:h-15 w-auto object-contain" />
                </Link>
            </div>

            {/* 2. SECCIÓN CENTRAL: NAVEGACIÓN DESKTOP (Oculta en Móvil) */}
            <nav className="hidden lg:flex flex-1 justify-center">
                <ul className="flex gap-8 list-none">
                    {MENU_ITEMS.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <li key={item.path}>
                        <Link
                            to={item.path}
                            className={`text-sm font-medium transition-all duration-200 py-2 border-b-2 
                            ${
                                isActive
                                ? "text-cyan-600 border-cyan-600"
                                : "text-gray-500 border-transparent hover:text-cyan-500 hover:border-cyan-200"
                            }`}
                        >
                            {item.label}
                        </Link>
                        </li>
                    );
                    })}
                </ul>
            </nav>

            {/* 3. SECCIÓN DERECHA: USUARIO */}
            <div className="flex items-center justify-end relative">
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 focus:outline-none group"
                >
                    <div className={`
                        h-10 w-10 rounded-full flex items-center justify-center 
                        font-bold border transition-all duration-200 shadow-sm text-sm
                        ${isUserMenuOpen
                            ? "bg-cyan-600 text-white border-cyan-600 ring-2 ring-cyan-100"
                            : "bg-cyan-50 text-cyan-700 border-cyan-200 group-hover:bg-cyan-100"
                        }
                    `}>
                        {user ? getInitials(user.nombreCompleto) : <UserIcon size={20} />}
                    </div>
                    {/* Ocultamos la flecha en móvil para ahorrar espacio */}
                    <ChevronDown size={16} className={`hidden md:block text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* DROPDOWN DE USUARIO (Desktop & Mobile) */}
                <AnimatePresence>
                    {isUserMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-14 right-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden origin-top-right z-50"
                    >
                        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                            <p className="text-sm font-bold text-slate-800 truncate">{user?.nombreCompleto}</p>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-0.5">{user?.rol}</p>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={18} /> Cerrar Sesión
                            </button>
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* 4. MENÚ MÓVIL DESPLEGABLE (Solo visible si isMobileMenuOpen es true) */}
        {/* Se renderiza FUERA del flex principal, pero dentro del header sticky */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.nav
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-lg absolute left-0 right-0 top-20"
                >
                    <ul className="flex flex-col p-4 gap-2">
                        {MENU_ITEMS.map((item) => {
                             const isActive = location.pathname.startsWith(item.path);
                             return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={handleNavigation} // Cierra el menú al hacer click
                                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors
                                            ${isActive 
                                                ? "bg-cyan-50 text-cyan-700" 
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                    >
                                        {/* Podrías agregar iconos aquí si quisieras */}
                                        {item.label}
                                    </Link>
                                </li>
                             )
                        })}
                    </ul>
                </motion.nav>
            )}
        </AnimatePresence>

      </header>

      {/* BACKDROP PARA CERRAR MENÚS AL HACER CLICK AFUERA */}
      {(isUserMenuOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]" // Agregué un blur sutil
          onClick={() => {
              setIsUserMenuOpen(false);
              setIsMobileMenuOpen(false);
          }}
        />
      )}
    </>
  );
};