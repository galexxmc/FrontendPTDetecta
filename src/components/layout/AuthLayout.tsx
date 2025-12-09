// Capa: Frontend - Layout (Infrastructure/Presentation)
import React from 'react';
// 1. IMPORTAMOS useOutlet y useLocation
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export const AuthLayout: React.FC = () => {
  const location = useLocation();
  
  // 2. CAPTURAMOS EL COMPONENTE HIJO EXACTO (Login, Register, etc.)
  // Esto congela la instancia del componente para que la animación de salida sea estable.
  const currentOutlet = useOutlet();

  return (
    // Mantenemos el contenedor centrado
    <div className="min-h-screen bg-gray-900 relative overflow-hidden font-sans flex items-center justify-center p-4">
      
      {/* Fondo Decorativo (Blobs) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-lime-400/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Contenedor del Formulario */}
      <div className="relative z-10 w-full max-w-md">
         
         {/* 3. ANIMACIÓN CONTROLADA 
             mode="wait": Espera a que el formulario viejo se vaya antes de mostrar el nuevo.
             Esto elimina cualquier posibilidad de superposición o doble scroll.
         */}
         <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              
              // --- CONFIGURACIÓN DE MOVIMIENTO SUAVE ---
              
              // Entrada: Viene sutilmente desde abajo (+20px)
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              
              // Visible: En su sitio
              animate={{ opacity: 1, y: 0, scale: 1 }}
              
              // Salida: Se va sutilmente hacia arriba (-20px)
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              
              // Tiempo: 0.4s es el estándar de oro para UI (ni muy rápido ni muy lento)
              transition={{ duration: 0.4, ease: "easeInOut" }}
              
              className="w-full"
            >
               {/* 4. RENDERIZAMOS LA VARIABLE CAPTURADA (NO <Outlet />) */}
               {currentOutlet}
            </motion.div>
         </AnimatePresence>
      </div>
      
    </div>
  );
};