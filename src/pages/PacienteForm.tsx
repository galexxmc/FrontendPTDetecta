// Capa: Frontend - Presentation (Page)
// Archivo: src/pages/PacienteForm.tsx

import { useEffect } from "react"; // 🔥 CAMBIO: Importamos useEffect
import { Save, ArrowLeft } from "lucide-react";
import { usePacienteForm } from "../hooks/usePacienteForm";
import { calcularEdad } from "../utils/dateUtils"; // 🔥 CAMBIO: Importamos la utilidad

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Card } from "../components/ui/Card";

export default function PacienteForm() {
  const { 
    register, 
    handleSubmit, 
    errors, 
    onGuardar, 
    seguros, 
    esEdicion, 
    navigate, 
    id,
    watch,    // 🔥 CAMBIO: Necesitamos esto del hook
    setValue  // 🔥 CAMBIO: Necesitamos esto del hook
  } = usePacienteForm();

  // 🔥 CAMBIO: Observamos el campo fechaNacimiento
  const fechaNacimientoWatch = watch("fechaNacimiento");

  // 🔥 CAMBIO: Efecto reactivo (Side Effect)
  // Cada vez que cambia la fecha, recalculamos la edad automáticamente
  useEffect(() => {
    if (fechaNacimientoWatch) {
      const edadCalculada = calcularEdad(fechaNacimientoWatch);
      
      // Seteamos el valor en el formulario
      setValue("edad", edadCalculada, { 
        shouldValidate: true, // Para que se quite el error si estaba vacío
        shouldDirty: true     // Para indicar que el formulario cambió
      });
    }
  }, [fechaNacimientoWatch, setValue]);

  // Mapeo de datos...
  const opcionesSeguro = seguros.map((s) => ({
    value: s.idTipoSeguro,
    label: s.nombreSeguro
  }));

  const opcionesSexo = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' }
  ];

  return (
    <div className="flex justify-center p-4 md:p-8">
      <Card className="w-full max-w-3xl">
        
        {/* ENCABEZADO (Sin cambios) */}
        <div className="bg-slate-800 p-4 md:p-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/pacientes")}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition text-white backdrop-blur-sm shrink-0"
            type="button"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="text-white min-w-0">
            <h2 className="text-xl md:text-2xl font-bold truncate">
              {esEdicion ? "Editar Paciente" : "Registrar Paciente"}
            </h2>
            <p className="text-white text-xs md:text-sm mt-1 opacity-90 truncate">
              {esEdicion ? `Modificando registro ID: #${id}` : "Todos los campos son obligatorios"}
            </p>
          </div>
        </div>

        {/* CUERPO DEL FORMULARIO */}
        <div className="p-4 md:p-8">
          <form onSubmit={handleSubmit(onGuardar)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              {/* --- DATOS PERSONALES --- */}
              <Input
                label="DNI"
                placeholder="8 dígitos"
                error={errors.dni?.message}
                {...register("dni", { 
                  required: "El DNI es obligatorio", 
                  minLength: { value: 8, message: "Debe tener 8 dígitos" },
                  maxLength: { value: 8, message: "Máximo 8 dígitos" },
                  pattern: { value: /^[0-9]+$/, message: "Solo números" }
                })}
              />

              <Input
                label="Nombres"
                placeholder="Ej. Juan Carlos"
                error={errors.nombres?.message}
                {...register("nombres", { required: "El nombre es obligatorio" })}
              />

              <Input
                label="Apellidos"
                placeholder="Ej. Pérez Rodriguez"
                error={errors.apellidos?.message}
                {...register("apellidos", { required: "El apellido es obligatorio" })}
              />

              {/* Fila Edad/Sexo */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                
                {/* 🔥 CAMBIO: Input Edad Bloqueado */}
                <Input
                  label="Edad"
                  type="number"
                  placeholder="0"
                  readOnly // 1. Bloqueamos escritura
                  className="bg-gray-100 cursor-not-allowed text-gray-500 focus:ring-0" // 2. Feedback visual
                  // 3. Quitamos validaciones complejas, solo required es suficiente porque se llena solo
                  {...register("edad", { required: true })} 
                />
                
                <Select
                  label="Sexo"
                  options={opcionesSexo}
                  error={errors.sexo?.message}
                  {...register("sexo", { required: "Seleccione sexo" })}
                />
              </div>

              {/* 🔥 CAMBIO: Fecha de Nacimiento es el trigger */}
              <Input
                label="Fecha Nacimiento"
                type="date"
                error={errors.fechaNacimiento?.message}
                {...register("fechaNacimiento", { 
                    required: "Fecha requerida",
                    // Validación opcional: No fechas futuras
                    validate: value => new Date(value) <= new Date() || "Fecha inválida"
                })}
              />

              <Select
                label="Seguro Médico"
                options={opcionesSeguro}
                error={errors.idTipoSeguro?.message}
                {...register("idTipoSeguro", { required: "Seleccione un seguro" })}
              />

              {/* --- DATOS DE CONTACTO (Sin cambios) --- */}
              <div className="md:col-span-2">
                <Input
                  label="Dirección"
                  placeholder="Av. Principal 123, Distrito..."
                  error={errors.direccion?.message}
                  {...register("direccion", { required: "La dirección es obligatoria" })}
                />
              </div>

              <Input 
                label="Teléfono" 
                placeholder="999 000 000"
                error={errors.telefono?.message}
                {...register("telefono", { 
                  required: "El teléfono es obligatorio",
                  pattern: { value: /^[0-9]+$/, message: "Solo números" },
                  minLength: { value: 9, message: "Mínimo 9 dígitos" }
                })} 
              />
              
              <Input 
                label="Email" 
                type="email" 
                placeholder="correo@ejemplo.com"
                error={errors.email?.message}
                {...register("email", { 
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                    message: "Formato de email inválido"
                  }
                })} 
              />

            </div>

            {/* BOTONES DE ACCIÓN (Sin cambios) */}
            <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/pacientes")}
                className="w-full md:w-auto"
              >
                Cancelar
              </Button>
              
              <Button 
                type="submit" 
                variant="primary" 
                icon={<Save size={19} />}
                className="w-full md:w-auto"
              >
                {esEdicion ? "Guardar Cambios" : "Registrar Paciente"}
              </Button>
            </div>

          </form>
        </div>
      </Card>
    </div>
  );
}