// src/hooks/usePacienteForm.ts
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  crearPaciente,
  actualizarPaciente,
  obtenerSeguros,
  obtenerPacientePorId,
} from "../services/pacienteService";
import type { PacienteCrear, TipoSeguro } from "../types";

export const usePacienteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = !!id; 

  const [seguros, setSeguros] = useState<TipoSeguro[]>([]);

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    setValue, // Necesario para actualizar la edad
    watch,    // Necesario para vigilar la fecha
    formState: { errors },
  } = useForm<PacienteCrear>();

  // --- LÓGICA DE CARGA DE DATOS ---
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const listaSeguros = await obtenerSeguros();
        setSeguros(listaSeguros);

        if (esEdicion) {
          const paciente = await obtenerPacientePorId(Number(id));

          // Mapeo de datos
          setValue("dni", paciente.dni);
          setValue("nombres", paciente.nombres);
          setValue("apellidos", paciente.apellidos);
          setValue("edad", paciente.edad);
          setValue("sexo", paciente.sexo);
          setValue("direccion", paciente.direccion);
          setValue("telefono", paciente.telefono);
          setValue("email", paciente.email);
          setValue("idTipoSeguro", paciente.seguro?.idTipoSeguro || 0);

          if (paciente.fechaNacimiento) {
            const fechaStr = String(paciente.fechaNacimiento);
            const fechaYYYYMMDD = fechaStr.split("T")[0];
            setValue("fechaNacimiento", fechaYYYYMMDD);
          }
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cargar la información", "error");
        navigate("/pacientes");
      }
    };

    cargarDatos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, esEdicion]); 

  // --- LÓGICA DE GUARDADO (SUBMIT) ---
  const onGuardar = async (data: PacienteCrear) => {
    try {
      // Conversiones de tipos
      data.idTipoSeguro = Number(data.idTipoSeguro);
      data.edad = Number(data.edad);

      if (esEdicion) {
        await actualizarPaciente(Number(id), data);
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "Datos modificados correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // 🔥 LIMPIEZA DE ARQUITECTURA: 
        // Eliminamos: data.usuarioRegistro = "WebUser"; 
        // El Backend (Interceptor + JWT) ya sabe quién eres.
        
        await crearPaciente(data);
        Swal.fire({
          icon: "success",
          title: "Registrado",
          text: "Paciente creado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      navigate("/pacientes");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Hubo un problema al guardar.",
      });
    }
  };

  // Retorno del Hook (La API pública para tu componente)
  return {
    register,
    handleSubmit,
    errors,
    onGuardar,
    seguros,
    esEdicion,
    navigate,
    id,
    watch,    // <--- NUEVO: Exponemos el vigilante
    setValue  // <--- NUEVO: Exponemos el escritor
  };
};