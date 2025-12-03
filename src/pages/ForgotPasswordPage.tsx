import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import logoDetecta from "../assets/Logo-Detecta-Vertical.png";
import api from "../config/api";
import Swal from "sweetalert2";

interface ForgotForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenSimulado, setTokenSimulado] = useState("");
  const [emailEnviado, setEmailEnviado] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>();

  const onSubmit = async (data: ForgotForm) => {
    setIsSubmitting(true);
    try {
      const response = await api.post("/Auth/forgot-password", data);
      setIsSuccess(true);
      setTokenSimulado(response.data.tokenDePrueba);
      setEmailEnviado(data.email);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo procesar la solicitud.",
        customClass: { popup: "!rounded-3xl" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      
      <div className="mb-6 text-center">
        <img src={logoDetecta} alt="Logo" className="w-32 h-auto object-contain drop-shadow-md mx-auto" />
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl w-full shadow-2xl">
        
        {!isSuccess ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Recuperar Acceso</h1>
            <p className="text-gray-400 text-sm mb-6 text-center">Ingresa tu correo para buscar tu cuenta</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Correo Electrónico</label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Mail size={18} /></div>
                  <input
                    type="email"
                    {...register("email", { required: "Requerido", pattern: { value: /.+@.+\..+/, message: "Correo inválido" } })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                {errors.email && <span className="text-red-400 text-xs ml-1">{errors.email.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Enviar Instrucciones"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">¡Correo Enviado!</h2>
            <p className="text-gray-400 text-sm mb-6">
              En un entorno real, recibirías un email. <br/>
              Como estamos en <strong>Desarrollo</strong>, usa este botón mágico:
            </p>
            
            <button 
              onClick={() => navigate(`/reset-password?token=${encodeURIComponent(tokenSimulado)}&email=${emailEnviado}`)}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2 mb-4 shadow-lg shadow-yellow-500/20"
            >
              <ExternalLink size={20} />
              Simular "Click en el Correo"
            </button>

            <button 
              onClick={() => navigate("/")}
              className="text-slate-400 hover:text-white text-sm underline transition"
            >
              Volver al Login
            </button>
          </div>
        )}

        {!isSuccess && (
          <div className="mt-6 text-center">
            <Link to="/" className="text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2 transition">
              <ArrowLeft size={16} /> Regresar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}