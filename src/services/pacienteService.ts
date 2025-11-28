import axios from 'axios';
import type { Paciente, PacienteCrear, TipoSeguro } from '../types';

// ⚠️ Asegúrate de que este puerto sea el correcto (mira tu terminal dotnet run)
const API_URL = 'http://localhost:5036/api';

// --- PACIENTES ---

// 1. Obtener Todos (Para la Tabla)
export const obtenerPacientes = async (): Promise<Paciente[]> => {
    const response = await axios.get<Paciente[]>(`${API_URL}/pacientes`);
    return response.data;
};

// 2. Obtener UNO por ID (ESTA ES LA QUE TE FALTABA PARA EDITAR)
export const obtenerPacientePorId = async (id: number): Promise<Paciente> => {
    const response = await axios.get<Paciente>(`${API_URL}/pacientes/${id}`);
    return response.data;
};

// 3. Crear Nuevo
export const crearPaciente = async (data: PacienteCrear): Promise<Paciente> => {
    const response = await axios.post<Paciente>(`${API_URL}/pacientes`, data);
    return response.data;
};

// 4. Actualizar Existente (ESTA TAMBIÉN ES NUEVA)
export const actualizarPaciente = async (id: number, data: PacienteCrear): Promise<void> => {
    // Agregamos los datos de auditoría y el ID necesario para el Backend
    const payload = {
        ...data,
        idPaciente: id,
        usuarioModificacion: "WebUser",
        motivoModificacion: "Edición desde formulario web"
    };
    await axios.put(`${API_URL}/pacientes/${id}`, payload);
};

// 5. Eliminar
export const eliminarPaciente = async (id: number, motivo: string): Promise<void> => {
    await axios.put(`${API_URL}/pacientes/eliminar/${id}`, {
        usuarioEliminacion: "AdminWeb",
        motivoEliminacion: motivo
    });
};

// --- CATALOGOS ---

export const obtenerSeguros = async (): Promise<TipoSeguro[]> => {
    const response = await axios.get<TipoSeguro[]>(`${API_URL}/tiposseguro`);
    return response.data;
};