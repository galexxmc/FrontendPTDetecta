// src/services/pacienteService.ts
import api from '../config/api'; // <--- Importamos nuestra instancia configurada
import type { Paciente, PacienteCrear, TipoSeguro } from '../types';

// --- PACIENTES ---

export const obtenerPacientes = async (): Promise<Paciente[]> => {
    // Ya no necesitas poner la URL completa, 'api' ya tiene la base
    const response = await api.get<Paciente[]>('/pacientes');
    return response.data;
};

export const obtenerPacientePorId = async (id: number): Promise<Paciente> => {
    const response = await api.get<Paciente>(`/pacientes/${id}`);
    return response.data;
};

export const crearPaciente = async (data: PacienteCrear): Promise<Paciente> => {
    const response = await api.post<Paciente>('/pacientes', data);
    return response.data;
};

export const actualizarPaciente = async (id: number, data: PacienteCrear): Promise<void> => {
    const payload = {
        ...data,
        idPaciente: id, // Asegúrate de que tu backend requiera esto en el body
        usuarioModificacion: "WebUser", // Idealmente esto vendría del Token en el Backend
        motivoModificacion: "Edición desde formulario web"
    };
    await api.put(`/pacientes/${id}`, payload);
};

export const eliminarPaciente = async (id: number, motivo: string): Promise<void> => {
    await api.put(`/pacientes/eliminar/${id}`, {
        usuarioEliminacion: "AdminWeb",
        motivoEliminacion: motivo
    });
};

// --- RECUPERACIÓN ---

export const buscarPacienteEliminado = async (dni: string): Promise<Paciente> => {
    const response = await api.get<Paciente>(`/pacientes/buscar-eliminado/${dni}`);
    return response.data;
};

export const habilitarPaciente = async (id: number): Promise<void> => {
    await api.put(`/pacientes/habilitar/${id}`);
};

// --- CATALOGOS ---

export const obtenerSeguros = async (): Promise<TipoSeguro[]> => {
    const response = await api.get<TipoSeguro[]>('/tiposseguro');
    return response.data;
};