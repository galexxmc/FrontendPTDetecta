// src/components/layout/AuthLayout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export const AuthLayout: React.FC = () => {
  const location = useLocation();

  return (
    // 1. FONDO (Ocupa toda la pantalla, centrado)
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Decoración del fondo (Estática) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-lime-400/10 rounded-full blur-[100px]"></div>
      </div>

      {/* 2. CONTENEDOR GRID (El Secreto) */}
      {/* 'grid' y 'items-center' centran el contenido. */}
      {/* IMPORTANTE: Definimos un ancho máximo para que las tarjetas no crezcan infinito */}
      <div className="z-10 w-full max-w-md grid grid-cols-1 grid-rows-1">
        
        {/* mode="popLayout" permite que la salida ocurra sin bloquear el layout */}
        <AnimatePresence mode="popLayout">
          
          <motion.div
            key={location.pathname}
            
            // Animación de deslizamiento lateral suave
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            
            // Física tipo "Resorte" para que se sienta moderno (no robótico)
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            
            // 3. LA CLAVE DEL ÉXITO: 
            // 'col-start-1 row-start-1' obliga al elemento a vivir en la celda 1x1.
            // Cuando hay dos elementos (el que entra y el que sale), AMBOS ocupan este mismo espacio.
            className="col-start-1 row-start-1 w-full"
          >
            {/* Aquí se inyecta tu LoginPage o RegisterPage */}
            <Outlet /> 
          </motion.div>

        </AnimatePresence>
      </div>

    </div>
  );
};