import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoDetecta from "../../assets/Logo-Detecta-Vertical.png";

export const AuthLayout: React.FC = () => {
  const location = useLocation();
  
  // Detectamos si estamos en la página de registro para ajustar el logo
  const isRegister = location.pathname === '/register';

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* --- FONDO (Tu código original) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-lime-400/10 rounded-full blur-[100px]"></div>
      </div>

      {/* --- CONTENEDOR CENTRAL --- */}
      <div className="z-10 w-full max-w-md flex flex-col items-center">
        
        {/* LOGO ANIMADO (Ahora vive en el Layout) 
            layout: Permite que Framer Motion anime el cambio de posición suavemente.
        */}
        <motion.div
          layout
          className="mb-6 relative z-20"
          animate={{
            // Si es registro, lo hacemos un poco más pequeño para dar espacio al form grande
            scale: isRegister ? 0.85 : 1, 
            y: isRegister ? -10 : 0 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <img 
            src={logoDetecta} 
            alt="Logo Detecta" 
            className="w-40 h-auto object-contain drop-shadow-md"
          />
        </motion.div>

        {/* CONTENEDOR DEL FORMULARIO (OUTLET)
            layout: Anima la altura del contenedor cuando cambia el contenido (Outlet).
        */}
        <motion.div 
            layout
            className="w-full bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden"
            style={{ borderRadius: "1.5rem" }} // Forzamos el radio para que no se deforme al animar
            transition={{ duration: 0.3 }}
        >
            {/* AnimatePresence para transiciones suaves entre rutas */}
            <AnimatePresence mode="wait">
                {/* La 'key' es vital: le dice a React que el contenido cambió 
                    y debe disparar la animación de salida/entrada.
                */}
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.9 }}
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
};