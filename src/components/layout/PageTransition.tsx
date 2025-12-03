// src/components/layout/PageTransition.tsx (CREAR DE NUEVO)
import type { ReactNode } from 'react'; 
import { motion, type Transition } from 'framer-motion';

const pageVariants = {
  // Desaparece hacia arriba
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition: Transition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.35,
};

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // <--- ANTES DE ENTRAR
      animate="in"
      exit="out" // <--- SALIDA DEFINIDA
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};