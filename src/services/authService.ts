import api from '../config/api'; // <--- Importamos nuestra instancia configurada
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/Auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/Auth/register', data);
  return response.data;
};

// Utilidad para guardar la sesión (Token) en el navegador
export const setSession = (token: string) => {
  localStorage.setItem('token', token);
  // Aquí podríamos configurar el header por defecto de axios también
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeSession = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

// Utilidad para recuperar el token al recargar la página
export const getToken = () => localStorage.getItem('token');