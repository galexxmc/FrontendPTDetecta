// Capa: Frontend - Infrastructure (Layout)
import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AnimatePresence, motion } from "framer-motion";
// 1. IMPORTAMOS useOutlet
import { useLocation, useOutlet } from "react-router-dom";

// Ya no necesitamos props de children obligatoriamente
interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  const location = useLocation();
  // 2. CAPTURAMOS EL COMPONENTE DE LA RUTA ACTUAL
  const currentOutlet = useOutlet();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 relative">
        
        {/* mode="wait": Es vital para que no se monten uno sobre otro */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }} // Movimiento más sutil (15px)
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            {/* 3. RENDERIZAMOS LA VARIABLE CAPTURADA, NO <Outlet /> DIRECTO */}
            {currentOutlet} 
          </motion.div>
        </AnimatePresence>

      </main>
      
      <Footer />
    </div>
  );
};