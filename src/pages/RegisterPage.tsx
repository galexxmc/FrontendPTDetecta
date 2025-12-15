// Capa: Frontend - Page (Presentation)
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importamos el contexto
import { Loader2, Lock, Mail, User, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import logoDetecta from "../assets/Logo-Detecta-Vertical.png";
import type { RegisterRequest } from "../types";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion"; // 1. Importar Framer Motion

export default function RegisterPage() {
  const navigate = useNavigate();
  // 2. Necesitamos 'login' también para hacer el auto-login tras el registro
  const { register: registerUser, login } = useAuth(); 
  
  // 3. Estados para la animación (Igual que en Login)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    setIsSubmitting(true);
    try {
      // PASO A: Registrar usuario en Backend
      await registerUser(data);

      // PASO B: Auto-Login (Login silencioso para obtener el Token)
      // Usamos el email y password que el usuario acaba de ingresar
      await login({ email: data.email, password: data.password });

      // PASO C: Iniciar Animación de Éxito (Sin SweetAlert, usamos la UI)
      setIsSuccess(true);

      // Cronograma de animación (Mismos tiempos que Login)
      setTimeout(() => {
        setIsFadingOut(true);
      }, 3000);

      setTimeout(() => {
        navigate("/pacientes");
      }, 3800);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudo crear la cuenta",
        icon: "error",
        customClass: { popup: "!rounded-3xl" },
      });
      setIsSubmitting(false); // Solo desbloqueamos si falla
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* --- CAPA 1: FONDO BLANCO (Transición final) --- */}
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

      {/* --- CAPA 2: LOGO ANIMADO --- */}
      <motion.img
        layout 
        src={logoDetecta}
        animate={{ 
            scale: isSuccess ? 0.75 : 1,
            opacity: isFadingOut ? 0 : 1,
            y: isSuccess ? -50 : 0 
        }} 
        transition={{ 
            scale: { type: "spring", stiffness: 100, damping: 20 },
            y: { type: "spring", stiffness: 100, damping: 20 }, 
            opacity: { duration: 0.5, ease: "easeInOut" } 
        }}
        className="w-40 h-auto object-contain drop-shadow-md mx-auto mb-5 relative z-50" 
      />

      {/* --- CAPA 3: CÍRCULOS DE CARGA (Aparecen al éxito) --- */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 0 }}
            animate={{ 
                opacity: isFadingOut ? 0 : 1,
                y: -50 
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

      {/* --- CAPA 4: FORMULARIO DE REGISTRO --- */}
      <AnimatePresence mode="popLayout">
        {!isSuccess && (
          <motion.div
             key="register-form"
             className="w-full max-w-md relative"
             style={{ zIndex: 30 }}
             initial={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.9, height: 0 }} // Desaparece suavemente
             transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl">
              <h1 className="text-2xl font-bold text-white mb-2 text-center">
                Crear Cuenta
              </h1>
              <p className="text-gray-400 text-sm mb-6 text-center">
                Regístrate para acceder al sistema
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                {/* GRID NOMBRE / APELLIDO */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Nombre</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <User size={18} />
                      </div>
                      <input
                        {...register("nombre", { required: "Requerido" })}
                        className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-sm"
                        placeholder="Juan"
                      />
                    </div>
                    {errors.nombre && <span className="text-red-400 text-xs ml-1">{errors.nombre.message}</span>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Apellido</label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <User size={18} />
                      </div>
                      <input
                        {...register("apellido", { required: "Requerido" })}
                        className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-sm"
                        placeholder="Pérez"
                      />
                    </div>
                    {errors.apellido && <span className="text-red-400 text-xs ml-1">{errors.apellido.message}</span>}
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Correo Electrónico</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Requerido",
                        pattern: { value: /.+@.+\..+/, message: "Correo inválido" },
                      })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                      placeholder="usuario@detecta.com"
                    />
                  </div>
                  {errors.email && <span className="text-red-400 text-xs ml-1">{errors.email.message}</span>}
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Contraseña</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      {...register("password", {
                        required: "Requerido",
                        minLength: { value: 6, message: "Mínimo 6 caracteres" },
                      })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                      placeholder="••••••"
                    />
                  </div>
                  {errors.password && <span className="text-red-400 text-xs ml-1">{errors.password.message}</span>}
                </div>

                {/* BOTÓN DE REGISTRO */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-6"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Registrarme <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              {/* LINKS */}
              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2 transition hover:gap-3"
                >
                  <ArrowLeft size={16} /> Volver al Login
                </Link>
              </div>
            </div>

            <div className="mt-8 flex justify-center items-center gap-2 text-gray-600 text-xs">
              <ShieldCheck size={14} /> <span>Registro Seguro SSL</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}