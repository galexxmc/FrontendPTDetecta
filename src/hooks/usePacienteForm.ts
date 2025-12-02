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
  const esEdicion = !!id; // Convertimos a booleano

  const [seguros, setSeguros] = useState<TipoSeguro[]>([]);

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PacienteCrear>();

  // --- LÓGICA DE CARGA DE DATOS ---
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1. Cargar Seguros (Siempre necesario)
        const listaSeguros = await obtenerSeguros();
        setSeguros(listaSeguros);

        // 2. Si es edición, cargar datos del paciente
        if (esEdicion) {
          const paciente = await obtenerPacientePorId(Number(id));

          // Mapeo de datos al formulario
          setValue("dni", paciente.dni);
          setValue("nombres", paciente.nombres);
          setValue("apellidos", paciente.apellidos);
          setValue("edad", paciente.edad);
          setValue("sexo", paciente.sexo);
          setValue("direccion", paciente.direccion);
          setValue("telefono", paciente.telefono);
          setValue("email", paciente.email);
          setValue("idTipoSeguro", paciente.seguro?.idTipoSeguro || 0);

          // Formateo de fecha para input type="date"
          if (paciente.fechaNacimiento) {
            const fechaStr = String(paciente.fechaNacimiento);
            const fechaYYYYMMDD = fechaStr.split("T")[0];
            setValue("fechaNacimiento", fechaYYYYMMDD);
          }
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cargar la información necesaria", "error");
        navigate("/pacientes");
      }
    };

    cargarDatos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, esEdicion]); // Dependencias correctas

  // --- LÓGICA DE GUARDADO (SUBMIT) ---
  const onGuardar = async (data: PacienteCrear) => {
    try {
      // Conversiones de tipos necesarias
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
          customClass: {
            popup: "!rounded-3xl",
            icon: "text-xs",
            title: "!text-xl",
            htmlContainer: "!text-base",
          },
        });
      } else {
        data.usuarioRegistro = "WebUser"; // O tomar del contexto de autenticación
        await crearPaciente(data);
        Swal.fire({
          icon: "success",
          title: "Registrado",
          text: "Paciente creado correctamente.",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: "!rounded-3xl",
            icon: "text-xs",
            title: "!text-xl",
            htmlContainer: "!text-base",
          },
        });
      }
      navigate("/pacientes");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Hubo un problema al guardar.",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: "!rounded-3xl",
          icon: "text-xs",
          title: "!text-xl",
          htmlContainer: "!text-base",
        },
      });
    }
  };

  // Retornamos todo lo que la vista necesita
  return {
    register,
    handleSubmit,
    errors,
    onGuardar, // Función procesada
    seguros,
    esEdicion,
    navigate, // Por si el botón cancelar lo necesita
    id // Por si quieres mostrar el ID en el título
  };
};