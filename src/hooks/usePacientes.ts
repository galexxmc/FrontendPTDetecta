// src/hooks/usePacientes.ts
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  obtenerPacientes,
  eliminarPaciente,
  buscarPacienteEliminado,
  habilitarPaciente,
} from "../services/pacienteService";
import type { Paciente } from "../types";

export const usePacientes = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);

  // --- 1. LÓGICA DE CARGA DE DATOS ---
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

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- 2. LÓGICA DE ELIMINAR ---
  const handleEliminar = async (id: number) => {
    const { value: motivo } = await Swal.fire({
      title: "¿Eliminar Paciente?",
      text: "Esta acción dará de baja al paciente. Es obligatorio indicar el motivo.",
      input: "textarea",
      inputPlaceholder: "Escribe aquí el motivo de eliminación...",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      customClass: {
        popup: "!rounded-3xl",
        title: "!text-xl !mt-1",
        htmlContainer: "!text-base",
        input: "!text-base !rounded-xl !bg-slate-50 !p-3 !h-25 !ring-0 !border-2 !border-gray-200",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white text-base font-medium py-2 px-4 rounded-xl !transition ring-2 ring-red-500 hover:ring-red-600 mx-2",
        cancelButton: "bg-gray-100 hover:bg-gray-200 text-slate-600 text-base font-medium py-2 px-4 rounded-xl !transition ring-2 ring-gray-200 mx-2",
      },
      inputValidator: (value) => {
        if (!value) return "¡Debes escribir un motivo para continuar!";
      },
    });

    if (motivo) {
      try {
        await eliminarPaciente(id, motivo);
        await cargarDatos(); // Recargar la lista
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: "Hubo un problema al intentar eliminar.",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: "!rounded-3xl",
            icon: "text-xs",
            title: "!text-xl",
            htmlContainer: "!text-base"
          },
        });
      }
    }
  };

  // --- 3. LÓGICA DE HABILITAR ---
  const handleHabilitarPaciente = async () => {
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
        input: "!text-base !rounded-xl !bg-slate-50 !p-3 !h-12 !ring-0 !border-2 !border-gray-200",
      },
      inputValidator: (value) => {
        if (!value || value.length < 8) return 'Ingrese un DNI válido (mínimo 8 dígitos)';
      }
    });

    if (dni) {
      try {
        Swal.showLoading();
        const pEncontrado = await buscarPacienteEliminado(dni);

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
            await cargarDatos(); // Recargar la lista
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        Swal.fire({
            title: 'No encontrado',
            text: 'No existe ningún paciente eliminado con ese DNI.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
            customClass: {
              popup: "!rounded-3xl",
              icon: "text-xs",
              title: "!text-xl",
              htmlContainer: "!text-base"
          },
        });
      }
    }
  };

  return {
    pacientes,
    cargando,
    handleEliminar,
    handleHabilitarPaciente
  };
};