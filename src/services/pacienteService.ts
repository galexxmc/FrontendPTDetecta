import axios from 'axios';
import type { Paciente, PacienteCrear, TipoSeguro } from '../types';

// 1. PROFESIONAL: Leer del entorno (o usar localhost como fallback de seguridad)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5036/api';

// --- PACIENTES ---

export const obtenerPacientes = async (): Promise<Paciente[]> => {
    const response = await axios.get<Paciente[]>(`${API_URL}/pacientes`);
    return response.data;
};

export const obtenerPacientePorId = async (id: number): Promise<Paciente> => {
    const response = await axios.get<Paciente>(`${API_URL}/pacientes/${id}`);
    return response.data;
};

export const crearPaciente = async (data: PacienteCrear): Promise<Paciente> => {
    const response = await axios.post<Paciente>(`${API_URL}/pacientes`, data);
    return response.data;
};

export const actualizarPaciente = async (id: number, data: PacienteCrear): Promise<void> => {
    const payload = {
        ...data,
        idPaciente: id,
        usuarioModificacion: "WebUser",
        motivoModificacion: "Edición desde formulario web"
    };
    await axios.put(`${API_URL}/pacientes/${id}`, payload);
};

export const eliminarPaciente = async (id: number, motivo: string): Promise<void> => {
    await axios.put(`${API_URL}/pacientes/eliminar/${id}`, {
        usuarioEliminacion: "AdminWeb",
        motivoEliminacion: motivo
    });
};

// --- NUEVOS MÉTODOS PARA RECUPERACIÓN (Habilitar) ---

export const buscarPacienteEliminado = async (dni: string): Promise<Paciente> => {
    // Ya no necesitas poner la URL completa en el componente
    const response = await axios.get<Paciente>(`${API_URL}/pacientes/buscar-eliminado/${dni}`);
    return response.data;
};

export const habilitarPaciente = async (id: number): Promise<void> => {
    await axios.put(`${API_URL}/pacientes/habilitar/${id}`);
};

// --- CATALOGOS ---

export const obtenerSeguros = async (): Promise<TipoSeguro[]> => {
    const response = await axios.get<TipoSeguro[]>(`${API_URL}/tiposseguro`);
    return response.data;
};