export interface TipoSeguro {
    idTipoSeguro: number;
    nombreSeguro: string;
    tipoCobertura: string;
    coPago: string;
}

export interface HistorialClinico {
    idHistorialClinico: number;
    codigoHistoria: string;
    fechaApertura: string;
    grupoSanguineo: string;
    alergiasPrincipales: string;
    enfermedadesCronicas: string;
    estadoPacienteActual: string;
}

export interface Paciente {
    idPaciente: number;
    dni: string;
    codigoPaciente?: string; 
    codigo?: string;
    nombres: string;
    apellidos: string;
    edad: number;
    sexo: string;
    fechaNacimiento: string;
    direccion: string;
    telefono: string;
    email: string;
    seguro?: TipoSeguro;
    historial?: HistorialClinico;
}

export interface PacienteCrear {
    dni: string;
    nombres: string;
    apellidos: string;
    sexo: string;
    fechaNacimiento: string;
    edad: number;
    direccion: string;
    telefono: string;
    email: string;
    idTipoSeguro: number;
    usuarioRegistro: string;
}

export interface User {
  email: string;
  nombreCompleto: string;
  rol: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  nombreCompleto: string;
  rol: string;
  expiracion: string;
}

// Lo que enviamos al Login
export interface LoginRequest {
  email: string;
  password: string;
}

// Lo que enviamos al Registro
export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}