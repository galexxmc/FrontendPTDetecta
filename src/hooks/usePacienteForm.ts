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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
        Swal.fire({
          title: "¡Error!",
          text: "No se pudo cargar la información",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: "!rounded-3xl",
            icon: "text-xs",
            title: "!text-xl",
            htmlContainer: "!text-base",
          },
        });
        navigate("/pacientes");
      }
    };

    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, esEdicion]);

  const onGuardar = async (data: PacienteCrear) => {
    try {
      data.idTipoSeguro = Number(data.idTipoSeguro);
      data.edad = Number(data.edad);

      if (esEdicion) {
        await actualizarPaciente(Number(id), data);
        Swal.fire({
          title: "¡Actualizado!",
          text: "Datos del paciente modificados correctamente",
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
      } else {
        await crearPaciente(data);
        Swal.fire({
          title: "¡Registrado!",
          text: "Paciente creado correctamente",
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
      }
      navigate("/pacientes");
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "¡Error!",
        text: "Hubo un problema al guardar",
        icon: "error",
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
    watch,
    setValue,
  };
};
