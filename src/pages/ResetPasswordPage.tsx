// Capa: Frontend - Presentation (Page)
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import logoDetecta from "../assets/Logo-Detecta-Vertical.png";
import api from "../config/api";
import Swal from "sweetalert2";

interface ResetForm {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urlToken = searchParams.get("token");
  const urlEmail = searchParams.get("email");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResetForm>();

  useEffect(() => {
    if (urlEmail) setValue("email", urlEmail);
    if (urlToken) setValue("token", urlToken);
  }, [urlEmail, urlToken, setValue]);

  const onSubmit = async (data: ResetForm) => {
    // Validación manual extra por seguridad
    if (data.newPassword !== data.confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "warning",
        customClass: { popup: "!rounded-3xl" },
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/Auth/reset-password", {
        email: data.email,
        token: data.token,
        newPassword: data.newPassword,
      });

      await Swal.fire({
        title: "¡Éxito!",
        text: "Tu contraseña ha sido restablecida. Ahora puedes iniciar sesión",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: "!rounded-3xl",
          icon: "text-xs",
          title: "!text-xl",
          htmlContainer: "!text-base",
        },
      });

      navigate("/");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.mensaje || "Token inválido o expirado.";
      Swal.fire({
        title: "Error",
        text: msg,
        icon: "error",
        customClass: { popup: "!rounded-3xl" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 1. ESTRUCTURA MAESTRA:
    // - min-h-screen: Ocupa toda la altura vertical visible.
    // - justify-center: Empuja el contenido al medio verticalmente.
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      {/* 2. CONTENEDOR LIMITADO:
         - max-w-md: Evita que se estire horizontalmente.
         - w-full: Se asegura de usar el espacio disponible en móviles.
      */}
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="mb-8 text-center">
          <img
            src={logoDetecta}
            alt="Logo Detecta"
            className="w-40 h-auto object-contain drop-shadow-md mx-auto"
          />
        </div>

        {/* TARJETA */}
        <div className="w-full bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-2 text-center">
            Nueva Contraseña
          </h1>
          <p className="text-gray-400 text-sm mb-6 text-center">
            Crea una contraseña segura para tu cuenta
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 text-left"
          >
            {/* Campo Email (Read Only) */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
                Correo
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <input
                  {...register("email", { required: "Requerido" })}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-400 focus:outline-none cursor-not-allowed select-none"
                />
              </div>
            </div>

            <input
              type="hidden"
              {...register("token", { required: "Token faltante" })}
            />

            {/* Nueva Contraseña */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
                Nueva Contraseña
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  {...register("newPassword", {
                    required: "Requerido",
                    minLength: { value: 6, message: "Mínimo 6 caracteres" },
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 transition placeholder-gray-600"
                  placeholder="••••••"
                />
              </div>
              {errors.newPassword && (
                <span className="text-red-400 text-xs ml-1">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
                Confirmar Contraseña
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Requerido",
                    validate: (val) =>
                      val === watch("newPassword") ||
                      "Las contraseñas no coinciden",
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 transition placeholder-gray-600"
                  placeholder="••••••"
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-red-400 text-xs ml-1">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Cambiar Contraseña <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
