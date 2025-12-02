// src/pages/ListaPacientes.tsx
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Trash2, UserPlus, Eye, Pencil, Hash, Activity, UserCheck } from "lucide-react";
import type { Paciente } from "../types";

// 1. IMPORTAMOS EL NUEVO HOOK
import { usePacientes } from "../hooks/usePacientes";

export default function ListaPacientes() {
  const navigate = useNavigate();

  // 2. USAMOS EL HOOK (Desempaquetamos la lógica)
  const { pacientes, cargando, handleEliminar, handleHabilitarPaciente } = usePacientes();

  // --- LÓGICA DE VISUALIZAR (Puramente UI/Presentacional, se queda aquí para no ensuciar el hook) ---
  const handleVisualizar = (p: Paciente) => {
    const fechaFormat = p.fechaNacimiento
      ? String(p.fechaNacimiento).split("T")[0]
      : "No registrada";
    
    let colorEtiqueta = "bg-purple-50 text-purple-800";
    let colorContenido = "bg-purple-50/30 text-purple-900";

    if (p.seguro?.nombreSeguro === "SIS") {
      colorEtiqueta = "bg-green-50 text-green-800";
      colorContenido = "bg-green-50/30 text-green-900";
    } else if (p.seguro?.nombreSeguro === "EsSalud") {
      colorEtiqueta = "bg-blue-50 text-blue-800";
      colorContenido = "bg-blue-50/30 text-blue-900";
    } 

    Swal.fire({
      title: "",
      html: `
        <div class="font-sans">
          <div class="flex items-center gap-4 border-b border-gray-200 pb-4 mb-4">
            <div class="bg-cyan-50 p-3 rounded-full text-cyan-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="text-left">
              <h2 class="text-xl font-bold text-slate-800 m-0 ">${p.apellidos}, ${p.nombres}</h2>
              <h2 class="text-sm font-medium text-slate-600 m-0 inline-block">Código:</h2>
              <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono font-bold mt-1 inline-block">
                ${p.codigoPaciente}
              </span>
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <table class="w-full text-sm text-left">
              <tbody class="divide-y divide-slate-200">
                <tr><td class="p-3 font-semibold text-slate-600 bg-slate-100 w-1/3">DNI</td><td class="p-3 text-slate-800">${p.dni}</td></tr>
                <tr><td class="p-3 font-semibold text-slate-600 bg-slate-100 w-1/3">Correo</td><td class="p-3 text-slate-800">${p.email}</td></tr>
                <tr><td class="p-3 font-semibold text-slate-600 bg-slate-100">Edad</td><td class="p-3 text-slate-800">${p.edad} años</td></tr>
                <tr><td class="p-3 font-semibold text-slate-600 bg-slate-100/50">Fecha Nacimiento</td><td class="p-3 text-slate-800">${fechaFormat}</td></tr>
                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100">Sexo</td>
                  <td class="p-3 text-slate-800">${p.sexo === "M" ? "Masculino" : p.sexo === "F" ? "Femenino" : p.sexo}</td>
                </tr>
                <tr><td class="p-3 font-semibold text-slate-600 bg-slate-100">Teléfono</td><td class="p-3 text-slate-800">${p.telefono || "-"}</td></tr>
                <tr><td class="p-3 font-semibold text-slate-600 bg-slate-100">Dirección</td><td class="p-3 text-slate-800">${p.direccion || "No registrada"}</td></tr>
                <tr>
                  <td class="p-3 font-semibold ${colorEtiqueta}">Seguro</td>
                  <td class="p-3 font-medium ${colorContenido}">
                    ${p.seguro?.nombreSeguro || "N/A"} 
                    <span class="text-xs text-slate-500 block font-normal">${p.seguro?.tipoCobertura || ""}</span>
                  </td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100">N° Historial</td>
                  <td class="p-3 text-slate-800 font-bold">${p.historial?.codigoHistoria || "Pendiente"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: "600px",
      customClass: {
        popup: "!rounded-[20px] overflow-hidden shadow-2xl border border-gray-100",
      },
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Gestión de Pacientes
          </h1>
          <p className="text-slate-500">Sistema "Detecta" - Panel Principal</p>
        </div>
        <div className="flex gap-3">
            <button
              onClick={handleHabilitarPaciente}
              className="bg-[#d7e65d] hover:bg-[#bcca55] text-slate-700  px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition shadow-sm cursor-pointer"
            >
              <UserCheck size={20} />
              <span className="hidden sm:inline">Habilitar Paciente</span>
            </button>
            <button
              onClick={() => navigate("/crear")}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition shadow-sm cursor-pointer"
            >
              <UserPlus size={20} /> Nuevo Paciente
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {cargando ? (
          <div className="p-10 text-center text-gray-500">Cargando...</div>
        ) : (
          <table className="w-full text-center border-collapse text-sm">
            <thead className="bg-gray-800 border-b border-gray-800">
              <tr>
                <th className="p-4 text-sm font-semibold text-white">
                  <div className="flex items-center gap-1 select-none justify-center">Código</div>
                </th>
                <th className="p-4 text-sm font-semibold text-white">Apellidos</th>
                <th className="p-4 text-sm font-semibold text-white">Nombres</th>
                <th className="p-4 text-sm font-semibold text-white">DNI</th>
                <th className="p-4 text-sm font-semibold text-white">Seguro</th>
                <th className="p-4 text-sm font-semibold text-white">Historia Clínica</th>
                <th className="p-4 text-sm font-semibold text-white">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pacientes.map((p) => (
                <tr key={p.idPaciente} className="hover:bg-slate-50 transition text-center">
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-center">
                      <Hash size={14} className="text-slate-400" />
                      <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                        {p.codigoPaciente}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-800">{p.apellidos}</td>
                  <td className="p-4 text-slate-800">{p.nombres}</td>
                  <td className="p-4">
                    <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                      {p.dni}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        p.seguro?.nombreSeguro === "SIS"
                          ? "bg-green-100 text-green-800"
                          : p.seguro?.nombreSeguro === "EsSalud"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {p.seguro?.nombreSeguro || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1 justify-center">
                      <Activity size={16} className="text-slate-400" />
                      {p.historial?.codigoHistoria || "Pendiente"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleVisualizar(p)}
                        className="p-2 text-slate-500 hover:text-blue-600 rounded transition cursor-pointer"
                        title="Visualizar Detalle"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/editar/${p.idPaciente}`)}
                        className="p-2 text-slate-500 hover:text-amber-500 rounded transition cursor-pointer"
                        title="Editar Registro"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleEliminar(p.idPaciente)}
                        className="p-2 text-slate-500 hover:text-red-600 rounded transition cursor-pointer"
                        title="Eliminar Registro"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}