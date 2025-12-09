// Capa: Frontend - Presentation (Page)
// Archivo: src/pages/PacienteForm.tsx

import { Save, ArrowLeft } from "lucide-react";
import { usePacienteForm } from "../hooks/usePacienteForm";

// Importamos nuestro UI Kit (Design System)
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
    id 
  } = usePacienteForm();

  // Mapeo de datos para los selectores
  const opcionesSeguro = seguros.map((s) => ({
    value: s.idTipoSeguro,
    label: s.nombreSeguro
  }));

  const opcionesSexo = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' }
  ];

  return (
    // RESPONSIVE 1: Padding externo ajustado (p-4 en móvil, md:p-8 en escritorio)
    <div className="flex justify-center p-4 md:p-8">
      <Card className="w-full max-w-3xl">
        
        {/* ENCABEZADO */}
        {/* RESPONSIVE 2: Padding interno ajustado (p-4 vs p-6) */}
        <div className="bg-slate-800 p-4 md:p-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/pacientes")}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition text-white backdrop-blur-sm shrink-0"
            type="button"
            title="Volver"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="text-white min-w-0"> {/* min-w-0 ayuda a truncar texto si es necesario */}
            {/* RESPONSIVE 3: Tamaño de fuente adaptable (text-xl vs text-2xl) */}
            <h2 className="text-xl md:text-2xl font-bold truncate">
              {esEdicion ? "Editar Paciente" : "Registrar Paciente"}
            </h2>
            <p className="text-white text-xs md:text-sm mt-1 opacity-90 truncate">
              {esEdicion
                ? `Modificando registro ID: #${id}`
                : "Todos los campos son obligatorios"}
            </p>
          </div>
        </div>

        {/* CUERPO DEL FORMULARIO */}
        {/* RESPONSIVE 4: Menos padding en móvil para ganar espacio horizontal */}
        <div className="p-4 md:p-8">
          <form onSubmit={handleSubmit(onGuardar)} className="space-y-6">
            
            {/* GRID PRINCIPAL: 1 columna en móvil, 2 en escritorio (md:grid-cols-2) */}
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

              {/* Fila Edad/Sexo: Mantenemos 2 columnas incluso en móvil porque son campos cortos */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <Input
                  label="Edad"
                  type="number"
                  placeholder="0"
                  error={errors.edad?.message}
                  {...register("edad", { 
                    required: "Requerido", 
                    min: { value: 0, message: "Mínimo 0" } 
                  })}
                />
                
                <Select
                  label="Sexo"
                  options={opcionesSexo}
                  error={errors.sexo?.message}
                  {...register("sexo", { required: "Seleccione sexo" })}
                />
              </div>

              <Input
                label="Fecha Nacimiento"
                type="date"
                error={errors.fechaNacimiento?.message}
                {...register("fechaNacimiento", { required: "Fecha requerida" })}
              />

              <Select
                label="Seguro Médico"
                options={opcionesSeguro}
                error={errors.idTipoSeguro?.message}
                {...register("idTipoSeguro", { required: "Seleccione un seguro" })}
              />

              {/* --- DATOS DE CONTACTO --- */}
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

            {/* BOTONES DE ACCIÓN */}
            {/* RESPONSIVE 5:
                - flex-col-reverse: En móvil, 'Guardar' va arriba y 'Cancelar' abajo.
                - md:flex-row: En escritorio, van uno al lado del otro.
            */}
            <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/pacientes")}
                // RESPONSIVE 6: Botones full width en móvil
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