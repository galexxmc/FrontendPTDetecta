import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  crearPaciente,
  actualizarPaciente,
  obtenerSeguros,
  obtenerPacientePorId,
} from "../services/pacienteService";
import type { PacienteCrear, TipoSeguro } from "../types";
import Swal from "sweetalert2";
import { Save, ArrowLeft } from "lucide-react";

export default function PacienteForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Capturar ID de la URL
  const esEdicion = !!id; // true si hay ID, false si es nuevo

  const [seguros, setSeguros] = useState<TipoSeguro[]>([]);

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PacienteCrear>();

  // --------------------------------------------------------
  // 1. FUNCIÓN DE CARGA (Definida ANTES del useEffect)
  // --------------------------------------------------------
  const cargarDatosPaciente = async (idPaciente: number) => {
    try {
      const paciente = await obtenerPacientePorId(idPaciente);

      // Rellenar campos
      setValue("dni", paciente.dni);
      setValue("nombres", paciente.nombres);
      setValue("apellidos", paciente.apellidos);
      setValue("edad", paciente.edad);
      setValue("sexo", paciente.sexo);

      // Formato fecha para input type="date" (YYYY-MM-DD)
      if (paciente.fechaNacimiento) {
        // 1. Convertimos a String por seguridad
        const fechaStr = String(paciente.fechaNacimiento);
        // 2. Cortamos todo lo que esté después de la 'T'
        // Ejemplo: "2003-09-30T00:00:00" se convierte en "2003-09-30"
        const fechaYYYYMMDD = fechaStr.split("T")[0];

        setValue("fechaNacimiento", fechaYYYYMMDD);
      }

      setValue("direccion", paciente.direccion);
      setValue("telefono", paciente.telefono);
      setValue("email", paciente.email);

      // Seguro (manejo de null)
      setValue("idTipoSeguro", paciente.seguro?.idTipoSeguro || 0);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudo cargar la información del paciente",
        "error"
      );
      navigate("/");
    }
  };

  // --------------------------------------------------------
  // 2. EFECTOS (Carga inicial)
  // --------------------------------------------------------
  useEffect(() => {
    obtenerSeguros().then(setSeguros);

    if (esEdicion) {
      cargarDatosPaciente(Number(id));
    }
    // Agrega esta línea mágica justo aquí abajo 👇
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --------------------------------------------------------
  // 3. GUARDADO (Crear o Actualizar)
  // --------------------------------------------------------
  const onSubmit = async (data: PacienteCrear) => {
    try {
      // Conversión de tipos seguros
      data.idTipoSeguro = Number(data.idTipoSeguro);
      data.edad = Number(data.edad);

      if (esEdicion) {
        // MODO EDITAR
        await actualizarPaciente(Number(id), data);
        Swal.fire("Actualizado", "Datos modificados correctamente", "success");
      } else {
        // MODO CREAR
        data.usuarioRegistro = "WebUser";
        await crearPaciente(data);
        Swal.fire("Registrado", "Paciente creado correctamente", "success");
      }

      navigate("/"); // Volver a la tabla
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema al guardar", "error");
    }
  };

  // --------------------------------------------------------
  // 4. RENDERIZADO
  // --------------------------------------------------------
  return (
    <div className="flex justify-center items-center min-h-screen p-5">
      <div className="w-full max-w-3xl bg-white rounded-3xl border shadow-sm  border-gray-200 p-8">
        {/* Encabezado */}
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full transition text-slate-600"
            type="button"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {esEdicion ? "Editar Paciente" : "Registrar Nuevo Paciente"}
            </h2>
            <p className="text-sm text-slate-500">
              {esEdicion
                ? `Modificando registro #${id}`
                : "Complete el formulario de ingreso"}
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DNI */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                DNI
              </label>
              <input
                {...register("dni", {
                  required: "El DNI es obligatorio",
                  maxLength: 8,
                  minLength: 8,
                })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="8 dígitos"
              />
              {errors.dni && (
                <span className="text-red-500 text-xs font-medium">
                  {errors.dni.message || "Debe tener 8 dígitos"}
                </span>
              )}
            </div>

            {/* Nombres */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Nombres
              </label>
              <input
                {...register("nombres", { required: true })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Apellidos */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Apellidos
              </label>
              <input
                {...register("apellidos", { required: true })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Edad y Sexo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Edad
                </label>
                <input
                  type="number"
                  {...register("edad", { required: true, min: 0 })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Sexo
                </label>
                <select
                  {...register("sexo", { required: true })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="">Elegir...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>

            {/* Fecha Nacimiento */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Fecha Nacimiento
              </label>
              <input
                type="date"
                {...register("fechaNacimiento", { required: true })}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Seguro */}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Seguro Médico
              </label>
              <select
                {...register("idTipoSeguro", { required: true })}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">Seleccione...</option>
                {seguros.map((s) => (
                  <option key={s.idTipoSeguro} value={s.idTipoSeguro}>
                    {s.nombreSeguro}
                  </option>
                ))}
              </select>
            </div>

            {/* Contacto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Dirección
              </label>
              <input
                {...register("direccion")}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Av. Principal 123..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Teléfono
              </label>
              <input
                {...register("telefono")}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/")}
              className=" bg-gray-50 hover:bg-gray-100 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-lime-500 text-white rounded-xl hover:bg-lime-600 flex items-center gap-2 font-medium transition cursor-pointer"
            >
              <Save size={18} />
              {esEdicion ? "Guardar Cambios" : "Registrar Paciente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
