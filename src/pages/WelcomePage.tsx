import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import logoDetecta from "../assets/Logo-Detecta-Vertical.png";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* --- EFECTOS DE FONDO (El juego de colores que pediste) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Mancha Cian arriba izquierda */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
        {/* Mancha Lima abajo derecha */}
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-lime-400/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="z-10 flex flex-col items-center text-center max-w-lg w-full">
        {/* --- ÁREA DEL LOGO --- */}
        <div className="mb-8 relative group">
          {/* Efecto de resplandor detrás del logo */}
          <div >
            <img
              src={logoDetecta}
              alt="Logo Detecta"
              // Ajusta el ancho 'w-48' según lo grande que quieras que se vea
              className="w-48 h-auto object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* --- TÍTULO --- */}
        <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">
          Prueba{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#53c2e2] to-[#e1e04e]">
            Técnica
          </span>
        </h1>

        {/* --- TEXTO DESCRIPTIVO --- */}
        <p className="text-gray-400 text-lg mb-10 leading-relaxed border-t border-gray-800 pt-6 mt-2 w-full">
          Centro médico especializado en diagnóstico y tratamiento con tecnología de vanguardia y atención humana.
          <br />
          <span className="text-[#e1e04e]/80 font-medium text-sm mt-2 block">
            Seguridad · Rapidez · Eficiencia
          </span>
        </p>

        {/* --- BOTÓN INGRESAR --- */}
        <button
          onClick={() => navigate("/pacientes")}
          className="group relative w-full sm:w-auto px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] transform hover:-translate-y-1 overflow-hidden"
        >
          {/* Brillo al pasar el mouse */}
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

      {/* Footer */}
      <div className="absolute bottom-6 flex items-center gap-2 text-gray-600 text-xs">
        <ShieldCheck size={14} />
        <span>Gherson Alexis Monje Castro: V-1.0.0</span>
      </div>
    </div>
  );
}
