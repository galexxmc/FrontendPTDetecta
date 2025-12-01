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
  const { id } = useParams();
  const esEdicion = !!id;

  const [seguros, setSeguros] = useState<TipoSeguro[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PacienteCrear>();

  // --- 1. CARGA DE DATOS ---
  const cargarDatosPaciente = async (idPaciente: number) => {
    try {
      const paciente = await obtenerPacientePorId(idPaciente);

      setValue("dni", paciente.dni);
      setValue("nombres", paciente.nombres);
      setValue("apellidos", paciente.apellidos);
      setValue("edad", paciente.edad);
      setValue("sexo", paciente.sexo);

      if (paciente.fechaNacimiento) {
        const fechaStr = String(paciente.fechaNacimiento);
        const fechaYYYYMMDD = fechaStr.split("T")[0];
        setValue("fechaNacimiento", fechaYYYYMMDD);
      }

      setValue("direccion", paciente.direccion);
      setValue("telefono", paciente.telefono);
      setValue("email", paciente.email);
      setValue("idTipoSeguro", paciente.seguro?.idTipoSeguro || 0);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar la información", "error");
      navigate("/pacientes");
    }
  };

  // --- 2. EFECTOS ---
  useEffect(() => {
    obtenerSeguros().then(setSeguros);
    if (esEdicion) {
      cargarDatosPaciente(Number(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --- 3. SUBMIT ---
  const onSubmit = async (data: PacienteCrear) => {
    try {
      data.idTipoSeguro = Number(data.idTipoSeguro);
      data.edad = Number(data.edad);

      if (esEdicion) {
        await actualizarPaciente(Number(id), data);
        Swal.fire({
                  icon: "success",
                  title: "Actualizado",
                  text: "Datos modificados correctamente.",
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
      } else {
        data.usuarioRegistro = "WebUser";
        await crearPaciente(data);
        Swal.fire({
                  icon: "success",
                  title: "Registrado",
                  text: "Paciente creado correctamente.",
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
      navigate("/pacientes");
    } catch (error) {
      console.error(error);
      Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: "Hubo un problema al guardar.",
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
  };  

  // --- 4. RENDERIZADO (DISEÑO MEJORADO) ---
  return (
    <div className="flex justify-center items-center min-h-screen p-5">
      
      {/* TARJETA PRINCIPAL: Quitamos el p-8 de aquí y agregamos overflow-hidden */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        
        {/* ENCABEZADO CON FONDO DE COLOR (Full Width) */}
        {/* Cambia bg-blue-600 por bg-amber-500 si quieres naranja */}
        <div className="bg-gray-800 p-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/pacientes")}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition text-white backdrop-blur-sm"
            type="button"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="text-white">
            <h2 className="text-2xl font-bold">
              {esEdicion ? "Editar Paciente" : "Registrar Nuevo Paciente"}
            </h2>
            <p className="text-white text-sm mt-1">
              {esEdicion
                ? `Modificando registro #${id}`
                : "Complete el formulario de ingreso"}
            </p>
          </div>
        </div>

        {/* CUERPO DEL FORMULARIO (Aquí ponemos el padding p-8) */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* DNI */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">DNI</label>
                <input
                  {...register("dni", { required: true, maxLength: 8, minLength: 8 })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                  placeholder="8 dígitos"
                />
                {errors.dni && <span className="text-red-500 text-xs">DNI inválido</span>}
              </div>

              {/* Nombres */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Nombres</label>
                <input {...register("nombres", { required: true })} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              {/* Apellidos */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Apellidos</label>
                <input {...register("apellidos", { required: true })} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              {/* Edad y Sexo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">Edad</label>
                  <input type="number" {...register("edad", { required: true })} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">Sexo</label>
                  <select {...register("sexo", { required: true })} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition">
                    <option value="">Elegir...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
              </div>

              {/* Fecha Nacimiento */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Fecha Nacimiento</label>
                <input type="date" {...register("fechaNacimiento", { required: true })} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              {/* Seguro */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Seguro Médico</label>
                <select {...register("idTipoSeguro", { required: true })} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition">
                  <option value="">Seleccione...</option>
                  {seguros.map((s) => (
                    <option key={s.idTipoSeguro} value={s.idTipoSeguro}>{s.nombreSeguro}</option>
                  ))}
                </select>
              </div>

              {/* Contacto */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1 text-slate-700">Dirección</label>
                <input {...register("direccion")} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Av. Principal 123..." />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Teléfono</label>
                <input {...register("telefono")} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Email</label>
                <input type="email" {...register("email")} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={() => navigate("/pacientes")}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 flex items-center gap-2 font-medium shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 cursor-pointer"
              >
                <Save size={19} />
                {esEdicion ? "Guardar Cambios" : "Registrar Paciente"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}