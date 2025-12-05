import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, Lock, Mail, ArrowRight } from "lucide-react";
import type { LoginRequest } from "../types";
import Swal from "sweetalert2";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/pacientes");
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setIsSubmitting(true);
    try {
      await login(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Acceso Denegado",
        text: "Credenciales incorrectas. Intenta de nuevo.",
        customClass: { popup: "!rounded-3xl" },
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* TÍTULOS (Estilos originales conservados) */}
      <h1 className="text-2xl font-bold text-white mb-2 text-center">Bienvenido</h1>
      <p className="text-gray-400 text-sm mb-6 text-center">
        Ingresa tus credenciales para acceder
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
        
        {/* EMAIL INPUT */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
            Correo Electrónico
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Mail size={18} />
            </div>
            <input
              type="email"
              {...register("email", { required: "El correo es obligatorio" })}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              placeholder="admin@detecta.com"
            />
          </div>
          {errors.email && (
            <span className="text-red-400 text-xs ml-1">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* PASSWORD INPUT */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
            Contraseña
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Lock size={18} />
            </div>
            <input
              type="password"
              {...register("password", { required: "La contraseña es obligatoria" })}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              placeholder="••••••"
            />
          </div>
          {errors.password && (
            <span className="text-red-400 text-xs ml-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* BOTÓN LOGIN (Gradiente Cyan original) */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Verificando...
            </>
          ) : (
            <>
              Ingresar <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      {/* LINKS INFERIORES */}
      <div className="mt-6 text-center">
        <p className="text-slate-400 text-sm">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline transition"
          >
            Regístrate aquí
          </Link>
        </p>
        <p className="text-slate-400 text-sm mt-2">
          <Link
            to="/forgot-password"
            className="text-slate-400 hover:text-white text-xs underline transition"
          >
            Olvidé mi contraseña
          </Link>
        </p>
      </div>
    </div>
  );
}