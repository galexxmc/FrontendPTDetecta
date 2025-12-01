/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerPacientes,
  eliminarPaciente,
  buscarPacienteEliminado,
  habilitarPaciente,
} from "../services/pacienteService";
import type { Paciente } from "../types";
import Swal from "sweetalert2";
import { Trash2, UserPlus, Eye, Pencil, Hash, Activity, UserCheck} from "lucide-react";

export default function ListaPacientes() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);
  const cargarDatos = async () => {
    try {
      const data = await obtenerPacientes();
      const dataOrdenada = data.sort((a, b) => a.idPaciente - b.idPaciente);
      setPacientes(dataOrdenada);
    } catch {
      Swal.fire("Error", "No se pudo conectar al servidor", "error");
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    // 1. Mostrar el Popup con input de texto
    const { value: motivo } = await Swal.fire({
      title: "¿Eliminar Paciente?",
      text: "Esta acción dará de baja al paciente. Es obligatorio indicar el motivo.",
      input: "textarea", // <--- Esto habilita el cuadro de texto
      inputPlaceholder: "Escribe aquí el motivo de eliminación...",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",

      buttonsStyling: false,

      customClass: {
        popup: "!rounded-3xl",
        title: "!text-xl !mt-1",
        htmlContainer: "!text-base",
        input:
          "!text-base !rounded-xl !bg-slate-50 !p-3 !h-25 !ring-0 !border-2 !border-gray-200",
        confirmButton:
          "bg-red-500 hover:bg-red-600 text-white text-base font-medium py-2 px-4 rounded-xl !transition ring-2 ring-red-500 hover:ring-red-600 mx-2",
        cancelButton:
          "bg-gray-100 hover:bg-gray-200 text-slate-600 text-base font-medium py-2 px-4 rounded-xl !transition ring-2 ring-gray-200 mx-2",
      },
      inputValidator: (value) => {
        if (!value) {
          return "¡Debes escribir un motivo para continuar!";
        }
      },
    });

    // 2. Si el usuario escribió un motivo y confirmó:
    if (motivo) {
      try {
        await eliminarPaciente(id, motivo);
        await cargarDatos();
        await Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El paciente ha sido dado de baja correctamente.",
          timer: 2000,
          showConfirmButton: false,

          customClass: {
            popup: "!rounded-3xl",
            icon: "text-xs",
            title: "!text-xl",
            htmlContainer: "!text-base",
          },
        });
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: "Hubo un problema al intentar eliminar.",
          confirmButtonText: "Aceptar",

          buttonsStyling: false,

          customClass: {
            popup: "!rounded-3xl",
            icon: "text-xs",
            title: "!text-xl",
            htmlContainer: "!text-base",
            confirmButton:
              "bg-gray-100 hover:bg-gray-200 text-base font-medium py-2 px-4 rounded-xl !transition ring-2 ring-gray-200 mx-2",
          },
        });
      }
    }
  };

  // Función rápida para "Visualizar" sin crear otra página aún
  const handleVisualizar = (p: Paciente) => {
    // Formatear la fecha para que se vea limpia (YYYY-MM-DD)
    const fechaFormat = p.fechaNacimiento
      ? String(p.fechaNacimiento).split("T")[0]
      : "No registrada";
    // 1. LÓGICA DE COLORES DEL SEGURO
    // Definimos los colores por defecto (para EPS u otros)
    let colorEtiqueta = "bg-purple-50 text-purple-800";
    let colorContenido = "bg-purple-50/30 text-purple-900";

    // Cambiamos si es SIS o EsSalud
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
              <h2 class="text-xl font-bold text-slate-800 m-0 ">${
                p.apellidos
              }, ${p.nombres}</h2>
              <h2 class="text-sm font-medium text-slate-600 m-0 inline-block">Código:</h2>
              <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono font-bold mt-1 inline-block">
                ${p.codigoPaciente}
              </span>
            </div>
          </div>

          <div class="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <table class="w-full text-sm text-left">
              <tbody class="divide-y divide-slate-200">
                
                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100 w-1/3">DNI</td>
                  <td class="p-3 text-slate-800">${p.dni}</td>
                </tr>

                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100 w-1/3">Correo</td>
                  <td class="p-3 text-slate-800">${p.email}</td>
                </tr>
                
                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100">Edad</td>
                  <td class="p-3 text-slate-800">${p.edad} años</td>
                </tr>

                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100/50">Fecha Nacimiento</td>
                  <td class="p-3 text-slate-800">${fechaFormat}</td>
                </tr>

                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100">Sexo</td>
                  <td class="p-3 text-slate-800">
                    ${
                      p.sexo === "M"
                        ? "Masculino"
                        : p.sexo === "F"
                        ? "Femenino"
                        : p.sexo
                    }
                  </td>
                </tr>

                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100">Teléfono</td>
                  <td class="p-3 text-slate-800">${p.telefono || "-"}</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100">Dirección</td>
                  <td class="p-3 text-slate-800">${
                    p.direccion || "No registrada"
                  }</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold ${colorEtiqueta}">Seguro</td>
                  <td class="p-3 font-medium ${colorContenido}">
                    ${p.seguro?.nombreSeguro || "N/A"} 
                    <span class="text-xs text-slate-500 block font-normal">${
                      p.seguro?.tipoCobertura || ""
                    }</span>
                  </td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100">N° Historial</td>
                  <td class="p-3 text-slate-800 font-bold">${
                    p.historial?.codigoHistoria || "Pendiente"
                  }</td>
                </tr>

              </tbody>
            </table>
          </div>

          

        </div>
      `,
      showCloseButton: true, // Mantiene la X arriba a la derecha
      showConfirmButton: false, // Oculta el botón "Cerrar" azul de abajo
      width: "600px",
      customClass: {
        popup:
          "!rounded-[20px] overflow-hidden shadow-2xl border border-gray-100",
      },
    });
  };

  const handleHabilitarPaciente = async () => {
    // 1. Pedir DNI
    const { value: dni } = await Swal.fire({
      title: 'Recuperar Paciente',
      text: 'Ingrese el DNI del paciente eliminado para buscarlo.',
      input: 'text',
      inputPlaceholder: 'Ej: 74526359',
      confirmButtonText: 'Buscar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        popup: "!rounded-3xl",
        title: "!text-xl",
        htmlContainer: "!text-base",
        confirmButton: "bg-cyan-500 hover:bg-cyan-600 text-white text-base font-medium py-2 px-4 rounded-xl !transition ring-2 ring-cyan-500 hover:ring-cyan-600 mx-2",
        cancelButton: "bg-gray-100 hover:bg-gray-200 text-slate-600 text-base font-medium py-2 px-4 rounded-xl !transition ring-2 ring-gray-200 mx-2",
        input:
          "!text-base !rounded-xl !bg-slate-50 !p-3 !h-12 !ring-0 !border-2 !border-gray-200",
      },
      inputValidator: (value) => {
        if (!value || value.length < 8) return 'Ingrese un DNI válido (mínimo 8 dígitos)';
      }
    });

    if (dni) {
      try {
        Swal.showLoading();
        
        // 2. USAMOS EL SERVICIO (Limpio y profesional)
        const pEncontrado = await buscarPacienteEliminado(dni);

        // 3. Confirmación Visual
        const confirmacion = await Swal.fire({
          title: 'Paciente Encontrado',
          html: `
            <div class="text-left bg-slate-50 p-5 rounded-2xl border border-slate-200 text-sm mt-2 shadow-inner">
               <div class="flex justify-between border-b border-slate-200 pb-2 mb-2">
                 <span class="font-bold text-slate-500">DNI:</span>
                 <span class="text-slate-800 text-sm">${pEncontrado.dni}</span>
               </div>
               <div class="flex justify-between border-b border-slate-200 pb-2 mb-2">
                 <span class="font-bold text-slate-500">Código:</span>
                 <span class="text-slate-800 text-sm">${pEncontrado.codigo || pEncontrado.codigoPaciente || 'N/A'}</span>
               </div>
               <div class="flex justify-between">
                 <span class="font-bold text-slate-500">Nombre Completo:</span>
                 <span class="text-slate-800 text-sm">${pEncontrado.apellidos}, ${pEncontrado.nombres}</span>
               </div>
            </div>
            <p class="text-slate-500 text-base mt-6">¿Desea restaurar este registro al sistema?</p>
          `,
          showCancelButton: true,
          confirmButtonText: 'Sí, Habilitar',
          cancelButtonText: 'Cancelar',
          buttonsStyling: false,
          customClass: {
            popup: "!rounded-3xl",
            title: "!text-xl",
            confirmButton: "bg-[#e1e04e] hover:bg-[#bfc04b] text-slate-600 text-base font-medium py-2 px-4 rounded-xl !transition ring-2 ring-[#e1e04e] hover:ring-[#bfc04b] mx-2",
            cancelButton: "bg-gray-100 hover:bg-gray-200 text-slate-600 text-base font-medium py-2 px-4 rounded-xl !transition ring-2 ring-gray-200 mx-2",
          }
        });

        if (confirmacion.isConfirmed) {
            await habilitarPaciente(pEncontrado.idPaciente);
            await cargarDatos();
            Swal.fire({
                title: '¡Habilitado!',
                text: 'El paciente ha sido restaurado correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                customClass: { 
                  popup: "!rounded-3xl",
                  icon: "text-xs",
                  title: "!text-xl",
                  htmlContainer: "!text-base",
                }
            });
        }

      } catch (error) {
        Swal.fire({
            title: 'No encontrado',
            text: 'No existe ningún paciente eliminado con ese DNI.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            buttonsStyling: false,
            customClass: {
              popup: "!rounded-3xl",
              icon: "text-xs",
              title: "!text-xl",
              htmlContainer: "!text-base",
              confirmButton:
                "bg-gray-100 hover:bg-gray-200 text-base font-medium py-2 px-4 rounded-xl !transition ring-2 ring-gray-200 mx-2",
          },
        });
      }
    }
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
                {/* --- TUS NUEVAS COLUMNAS --- */}
                <th className="p-4 text-sm font-semibold text-white">
                  <div className="flex items-center gap-1 select-none justify-center">
                    Código
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-white">
                  Apellidos
                </th>
                <th className="p-4 text-sm font-semibold text-white">
                  Nombres
                </th>
                <th className="p-4 text-sm font-semibold text-white">DNI</th>
                <th className="p-4 text-sm font-semibold text-white">Seguro</th>
                <th className="p-4 text-sm font-semibold text-white">
                  Historia Clínica
                </th>
                <th className="p-4 text-sm font-semibold text-white">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pacientes.map((p) => (
                <tr
                  key={p.idPaciente}
                  className="hover:bg-slate-50 transition text-center"
                >
                  {/* CÓDIGO (Viene de la BD: P000XX) */}
                  <td className="p-4 ">
                    <div className="flex items-center gap-2 justify-center">
                      <Hash size={14} className="text-slate-400" />
                      <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                        {p.codigoPaciente}
                      </span>
                    </div>
                  </td>

                  {/* APELLIDOS */}
                  <td className="p-4 text-slate-800">{p.apellidos}</td>

                  {/* NOMBRES */}
                  <td className="p-4 text-slate-800">{p.nombres}</td>

                  {/* 1. DNI */}
                  <td className="p-4">
                    <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                      {p.dni}
                    </span>
                  </td>

                  {/* 3. SEGURO */}
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

                  {/* 4. HISTORIAL */}
                  <td className="p-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1 justify-center">
                      <Activity size={16} className="text-slate-400" />
                      {p.historial?.codigoHistoria || "Pendiente"}
                    </div>
                  </td>

                  {/* 5. ACCIONES (Visualizar, Editar, Eliminar) */}
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {/* Visualizar */}
                      <button
                        onClick={() => handleVisualizar(p)}
                        className="p-2 text-slate-500 hover:text-blue-600 rounded transition cursor-pointer"
                        title="Visualizar Detalle"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Botón Editar */}
                      <button
                        onClick={() => navigate(`/editar/${p.idPaciente}`)} // <--- AHORA NAVEGA
                        className="p-2 text-slate-500 hover:text-amber-500 rounded transition cursor-pointer"
                        title="Editar Registro"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Eliminar */}
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
