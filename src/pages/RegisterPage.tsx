import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, Lock, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";
import logoDetecta from "../assets/Logo-Detecta-Vertical.png";
import type { RegisterRequest } from "../types";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    setIsSubmitting(true);
    try {
      await registerUser(data);
      
      await Swal.fire({
        icon: 'success',
        title: '¡Cuenta Creada!',
        text: 'Tu registro ha sido exitoso. Ahora puedes iniciar sesión.',
        timer: 2000,
        showConfirmButton: false,
        customClass: { 
            popup: "!rounded-3xl",
            title: "!text-xl",
            htmlContainer: "!text-base",
        }
      });
      
      navigate("/"); 

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de Registro',
        text: error.response?.data?.mensaje || 'No se pudo crear la cuenta.',
        customClass: { popup: "!rounded-3xl" }
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    // ⚠️ CAMBIO CRÍTICO AQUÍ:
    // 1. Quitamos 'min-h-screen', 'bg-gray-900', 'flex', 'items-center'.
    // 2. Quitamos los divs de "EFECTOS DE FONDO".
    // 3. Dejamos solo 'w-full'. El AuthLayout se encarga de centrarlo y poner el fondo.
    <div className="w-full"> 
        
        {/* LOGO */}
        <div className="mb-6 text-center">
            <img src={logoDetecta} alt="Logo Detecta" className="w-32 h-auto object-contain drop-shadow-md mx-auto" />
        </div>

        {/* TARJETA */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl w-full shadow-2xl">
             <h1 className="text-2xl font-bold text-white mb-2 text-center">Crear Cuenta</h1>
             <p className="text-gray-400 text-sm mb-6 text-center">Regístrate para acceder al sistema</p>

             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Nombre</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><User size={18} /></div>
                            <input {...register("nombre", { required: "Requerido" })} className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-sm" placeholder="Juan" />
                        </div>
                        {errors.nombre && <span className="text-red-400 text-xs ml-1">{errors.nombre.message}</span>}
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Apellido</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><User size={18} /></div>
                            <input {...register("apellido", { required: "Requerido" })} className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-sm" placeholder="Pérez" />
                        </div>
                        {errors.apellido && <span className="text-red-400 text-xs ml-1">{errors.apellido.message}</span>}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Correo Electrónico</label>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Mail size={18} /></div>
                        <input type="email" {...register("email", { required: "El correo es obligatorio", pattern: { value: /.+@.+\..+/, message: "Correo inválido" } })} className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" placeholder="usuario@detecta.com" />
                    </div>
                    {errors.email && <span className="text-red-400 text-xs ml-1">{errors.email.message}</span>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Contraseña</label>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Lock size={18} /></div>
                        <input type="password" {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" placeholder="••••••" />
                    </div>
                    {errors.password && <span className="text-red-400 text-xs ml-1">{errors.password.message}</span>}
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-linear-to-r from-[#d7e65d] to-[#bcca55] hover:from-[#cdd840] hover:to-[#a9b540] text-slate-800 font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6">
                    {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> Registrando...</> : <>Registrarme <ArrowRight size={20} /></>}
                </button>
             </form>

             <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline transition">Inicia Sesión aquí</Link>
                </p>
            </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-2 text-gray-600 text-xs">
            <ShieldCheck size={14} />
            <span>Acceso Seguro &bull; Sistema Detecta v1.0</span>
        </div>
    </div>
  );
}