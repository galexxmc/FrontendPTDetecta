import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import logoDetecta from "../assets/Logo-Detecta-Vertical.png";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleIngresar = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate("/pacientes");
    }, 2000);
  };

  return (
    <div
      className={`
        min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans
        transition-colors duration-1000 ease-in-out
        ${isNavigating ? "bg-white" : "bg-gray-900"} 
      `}
    >
      <div
        className={`absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none transition-opacity duration-500 ${
          isNavigating ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-lime-400/10 rounded-full blur-[100px]"></div>
      </div>

      {/* 2. CONTENEDOR CENTRAL */}
      <div className="z-10 flex flex-col items-center text-center max-w-lg w-full relative">
        {/* --- ÁREA DEL LOGO Y LOADER --- */}
        <div className="relative flex items-center justify-center mb-12 isolate">
          {/* SPINNER / CÍRCULO GIRATORIO GIGANTE */}
          <div
            className={`
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        flex items-center justify-center pointer-events-none -z-10
        transition-opacity duration-500
        ${isNavigating ? "opacity-100" : "opacity-0"}
    `}
          >
            <svg
              className="animate-spin w-[25vmin] h-[25vmin] max-w-[800px] max-h-[800px]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none" 
              viewBox="0 0 24 24"
            >
              {/* 1. Círculo de Fondo (Sutil) */}
              <circle
                className="text-cyan-600/20" 
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="0.2" 
              />

              {/* 2. Círculo de Carga (Visible) */}
              <circle
                className="text-cyan-600"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="0.5" 
                strokeLinecap="round" 
                strokeDasharray="62.83"
                strokeDashoffset="40" 
              />
            </svg>
          </div>

          {/* IMAGEN DEL LOGO */}
          <img
            src={logoDetecta}
            alt="Logo Detecta"
            className={`
                object-contain drop-shadow-md relative z-50
                transition-all duration-1000 ease-in-out
                ${isNavigating ? "w-32 scale-75" : "w-48 scale-100"} 
              `}
          />
        </div>

        {/* --- ELEMENTOS QUE DESAPARECEN --- */}
        <div
          className={`
                w-full transition-all duration-500 ease-out transform
                ${
                  isNavigating
                    ? "opacity-0 translate-y-4 pointer-events-none"
                    : "opacity-100 translate-y-0"
                }
            `}
        >
          <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">
            Prueba{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#53c2e2] to-[#e1e04e]">
              Técnica
            </span>
          </h1>

          <p className="text-gray-400 text-lg mb-10 leading-relaxed border-t border-gray-800 pt-6 mt-2 w-full">
            Centro médico especializado en diagnóstico y tratamiento.
            <br />
            <span className="text-[#e1e04e]/80 font-medium text-sm mt-2 block">
              Seguridad · Rapidez · Eficiencia
            </span>
          </p>

          <button
            onClick={handleIngresar}
            className="group relative w-full sm:w-auto px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
            <div className="flex items-center justify-center gap-3">
              <span>Ingresar al Sistema</span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`absolute bottom-6 flex items-center gap-2 text-gray-600 text-xs transition-opacity duration-500 ${
          isNavigating ? "opacity-0" : "opacity-100"
        }`}
      >
        <ShieldCheck size={14} />
        <span>Gherson Alexis Monje Castro: V-1.0.0</span>
      </div>
    </div>
  );
}
