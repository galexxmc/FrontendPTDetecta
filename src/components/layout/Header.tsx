import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/Logo-Detecta-Horizontal.png";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User as UserIcon, ChevronDown } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Obtener iniciales (o 'U' si no hay usuario)
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
      <header className="sticky top-0 z-50 w-full bg-white shadow-md h-20 flex items-center justify-between px-8">
        {/* 1. Logo Area */}
        <Link
          to="/pacientes"
          className="flex items-center gap-4 w-48 cursor-pointer hover:opacity-80 transition-opacity duration-200"
        >
          <img
            src={logo}
            alt="Logo Detecta"
            className="h-17 w-auto object-contain"
          />
        </Link>

        {/* 2. Menú de Navegación */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex gap-8 list-none m-0 p-0">
            {MENU_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li key={item.path} className="hidden lg:block">
                  <Link
                    to={item.path}
                    className={`text-sm font-medium transition-colors duration-200 py-2 border-b-2 
                      ${
                        isActive
                          ? "text-cyan-600 border-cyan-600"
                          : "text-gray-500 border-transparent hover:text-cyan-500"
                      }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 3. Área de Usuario (Dropdown) */}

        <div className="w-auto md:w-48 flex justify-end relative">
          {/* BOTÓN DISPARADOR (Avatar) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 focus:outline-none group"
          >
            {/* Círculo con Iniciales */}
            <div
              className={`
              h-10 w-10 rounded-full flex items-center justify-center 
              font-bold border transition-all duration-200 shadow-sm
              ${
                isMenuOpen
                  ? "bg-cyan-600 text-white border-cyan-600 ring-2 ring-cyan-100"
                  : "bg-cyan-50 text-cyan-700 border-cyan-200 group-hover:bg-cyan-100"
              }
            `}
            >
              {user ? getInitials(user.nombreCompleto) : <UserIcon size={20} />}
            </div>

            {/* Flechita pequeña (opcional, ayuda a indicar que es un menú) */}
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* MENÚ DESPLEGABLE (Visible solo si isMenuOpen es true) */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                // ESTADO INICIAL (Antes de entrar): Invisible, un poco más arriba y pequeño
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                // ESTADO VISIBLE (Entrada): Totalmente visible y en su lugar
                animate={{ opacity: 1, y: 0, scale: 1 }}
                // ESTADO DE SALIDA (Al cerrar): Vuelve a subir y desvanecerse
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                // DURACIÓN: Muy rápida para que se sienta ágil (0.1s - 0.2s)
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden origin-top-right"
              >
                {" "}
                {/* Cabecera del Menú (Datos del Usuario) */}
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 ">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {user?.nombreCompleto || "Usuario Invitado"}
                  </p>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-0.5">
                    {user?.rol || "Sin Rol"}
                  </p>
                </div>
                {/* Opciones del Menú */}
                <div className="p-2">
                  {/* Aquí podrías agregar "Mi Perfil" o "Configuración" en el futuro */}

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    Cerrar Sesión
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* BACKDROP INVISIBLE (Cierra el menú si haces click fuera) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent cursor-default"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};
