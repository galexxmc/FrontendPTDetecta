// Capa: Frontend - Page (Presentation)
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import logoDetecta from "../assets/Logo-Detecta-Vertical.png";
import type { LoginRequest } from "../types";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isSuccess) {
      navigate("/pacientes");
    }
  }, [isAuthenticated, navigate, isSuccess]);

  const { register, handleSubmit } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setIsSubmitting(true);
    try {
      await login(data);
      setIsSuccess(true);

      setTimeout(() => {
        setIsFadingOut(true);
      }, 3000);

      setTimeout(() => {
        navigate("/pacientes");
      }, 3800);

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Acceso Denegado",
        customClass: { popup: "!rounded-3xl" },
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* --- CAPA 1: FONDO BLANCO --- */}
      <AnimatePresence>
        {isSuccess && (
            <motion.div 
                className="fixed inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0, duration: 0.8 }}
                style={{ zIndex: 20 }}
            />
        )}
      </AnimatePresence>

      {/* --- CAPA 2: LOGO (AJUSTADO) --- */}
      <motion.img
        layout 
        src={logoDetecta}
        animate={{ 
            scale: isSuccess ? 0.75 : 1,
            opacity: isFadingOut ? 0 : 1,
            // NUEVO: Si hay éxito, sube 50px. Si no, se queda en 0.
            // Puedes jugar con este valor: -30, -50, -80...
            y: isSuccess ? -50 : 0 
        }} 
        transition={{ 
            // Usamos spring para el movimiento 'y' también, para que rebote un poco al subir
            scale: { type: "spring", stiffness: 100, damping: 20 },
            y: { type: "spring", stiffness: 100, damping: 20 }, 
            opacity: { duration: 0.5, ease: "easeInOut" } 
        }}
        className="w-40 h-auto object-contain drop-shadow-md mx-auto mb-5 relative z-50" 
      />
      
      {/* --- CAPA 3: CÍRCULOS DE CARGA (AJUSTADO) --- */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            // Initial: Empieza un poco más abajo para que el efecto de subida sea más notorio
            initial={{ opacity: 0, y: 0 }}
            
            // Animate: Se mueve a la misma posición 'y' que el logo (-50)
            animate={{ 
                opacity: isFadingOut ? 0 : 1,
                y: -50 // Sincronizado con el logo
            }}
            transition={{ duration: 1 }} 
            style={{ zIndex: 40 }}
          >
             <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.5, duration: 0.5 }}
                className="relative flex items-center justify-center"
             >
                {/* Círculos giratorios (Velocidad rápida mantenida) */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute w-48 h-48 rounded-full border-2 border-dotted border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="absolute w-55 h-55 rounded-full border-4 border-cyan-500 border-t-transparent shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                />
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CAPA 4: FORMULARIO --- */}
      <AnimatePresence mode="popLayout">
        {!isSuccess && (
          <motion.div
            key="login-form"
            className="w-full max-w-md relative"
            style={{ zIndex: 30 }}
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl">
              <h1 className="text-2xl font-bold text-white mb-2 text-center">Bienvenido</h1>
              <p className="text-gray-400 text-sm mb-6 text-center">Ingresa tus credenciales</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Correo</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Mail size={18} /></div>
                    <input {...register("email", { required: true })} className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 transition" placeholder="admin@detecta.com" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Contraseña</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Lock size={18} /></div>
                    <input type="password" {...register("password", { required: true })} className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 transition" placeholder="••••••" />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-4">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <>Ingresar <ArrowRight size={20} /></>}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm hover:underline">Regístrate aquí</Link>
                <p className="mt-2"><Link to="/forgot-password" className="text-slate-400 hover:text-white text-xs underline">Olvidé mi contraseña</Link></p>
              </div>
            </div>

            <div className="mt-8 flex justify-center items-center gap-2 text-gray-600 text-xs">
              <ShieldCheck size={14} /> <span>Acceso Seguro v1.0</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}