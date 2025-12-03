import React from "react";
import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    // Agregamos overflow-x-hidden para evitar scrollbar horizontal durante el deslizamiento
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      
      <Header />

      {/* 1. CONTENEDOR GRID */}
      {/* grid-cols-1 grid-rows-1: Prepara la superposición */}
      {/* items-start: Importante para que el contenido empiece arriba */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 grid grid-cols-1 grid-rows-1 items-start">
        
        {/* 2. MODE POPLAYOUT: Permite la salida simultánea sin empujar el layout */}
        <AnimatePresence mode="popLayout">
          
          <motion.div
            key={location.pathname}
            
            // 3. MISMA ANIMACIÓN QUE TU AUTHLAYOUT (Lateral + Resorte)
            initial={{ opacity: 0, x: 100 }}  // Entra desde derecha
            animate={{ opacity: 1, x: 0 }}    // Se centra
            exit={{ opacity: 0, x: -100 }}    // Sale hacia izquierda
            
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            
            // 4. LA CLAVE DEL STACK:
            // col-start-1 row-start-1: Obliga a ambas páginas a ocupar el mismo espacio
            className="w-full h-full col-start-1 row-start-1"
          >
            {children}
          </motion.div>

        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
};