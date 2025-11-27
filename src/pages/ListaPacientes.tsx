import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { obtenerPacientes, eliminarPaciente } from '../services/pacienteService';
import type { Paciente } from '../types';
import Swal from 'sweetalert2';
import { Trash2, UserPlus, FileText, Eye, Pencil, Hash } from 'lucide-react'; // <--- Nuevos íconos

export default function ListaPacientes() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => { cargarDatos(); }, []);

  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const pacientesOrdenados = [...pacientes].sort((a, b) => {
    return ordenAscendente 
      ? a.idPaciente - b.idPaciente  // Menor a Mayor (1, 2, 3...)
      : b.idPaciente - a.idPaciente; // Mayor a Menor (3, 2, 1...)
  });

  const toggleOrden = () => {
    setOrdenAscendente(!ordenAscendente);
  };

  const cargarDatos = async () => {
    try {
      const data = await obtenerPacientes();
      setPacientes(data);
    } catch {
      Swal.fire('Error', 'No se pudo conectar al servidor', 'error');
    } finally { setCargando(false); }
  };

  const handleEliminar = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar?', text: "Se dará de baja lógica.", icon: 'warning',
      showCancelButton: true, confirmButtonText: 'Sí, borrar', confirmButtonColor: '#d33'
    });
    if (result.isConfirmed) {
      await eliminarPaciente(id);
      cargarDatos();
      Swal.fire('Eliminado', '', 'success');
    }
  };

  // Función rápida para "Visualizar" sin crear otra página aún
const handleVisualizar = (p: Paciente) => {
  // Formatear la fecha para que se vea limpia (YYYY-MM-DD)
    const fechaFormat = p.fechaNacimiento 
        ? String(p.fechaNacimiento).split('T')[0] 
        : 'No registrada';
    Swal.fire({
      title: '', 
      html: `
        <div class="font-sans">
          
          <div class="flex items-center gap-4 border-b border-gray-200 pb-4 mb-4">
            <div class="bg-blue-100 p-3 rounded-full text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="text-left">
              <h2 class="text-xl font-bold text-slate-800 m-0 ">${p.apellidos}, ${p.nombres}</h2>
              <h2 class="text-sm font-medium text-slate-600 m-0 inline-block">Código:</h2>
              <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono font-bold mt-1 inline-block">
                ${p.codigoPaciente}
              </span>
            </div>
          </div>

          <div class="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <table class="w-full text-sm text-left">
              <tbody class="divide-y divide-slate-200">
                
                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100 w-1/3">DNI</td>
                  <td class="p-3 text-slate-800 font-mono">${p.dni}</td>
                </tr>

                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100 w-1/3">Correo</td>
                  <td class="p-3 text-slate-800 font-mono">${p.email}</td>
                </tr>
                
                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100">Edad</td>
                  <td class="p-3 text-slate-800">${p.edad} años</td>
                </tr>

                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100/50">Fecha Nacimiento</td>
                  <td class="p-3 text-slate-800 font-mono">${fechaFormat}</td>
                </tr>

                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100">Sexo</td>
                  <td class="p-3 text-slate-800">
                    ${p.sexo === 'M' ? 'Masculino' : p.sexo === 'F' ? 'Femenino' : p.sexo}
                  </td>
                </tr>

                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100">Teléfono</td>
                  <td class="p-3 text-slate-800">${p.telefono || '-'}</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100">Dirección</td>
                  <td class="p-3 text-slate-800">${p.direccion || 'No registrada'}</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold text-blue-800 bg-blue-50">Seguro</td>
                  <td class="p-3 text-blue-900 font-medium bg-blue-50/30">
                    ${p.seguro?.nombreSeguro || 'N/A'} 
                    <span class="text-xs text-slate-500 block font-normal">${p.seguro?.tipoCobertura || ''}</span>
                  </td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold text-slate-600 bg-slate-100">N° Historial</td>
                  <td class="p-3 text-slate-800 font-mono font-bold">${p.historial?.codigoHistoria || 'Pendiente'}</td>
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      `,
      showCloseButton: true, // Mantiene la X arriba a la derecha
      showConfirmButton: false, // Oculta el botón "Cerrar" azul de abajo
      width: '600px',
      customClass: {
        popup: '!rounded-[20px] overflow-hidden shadow-2xl border border-gray-100'
      }
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestión de Pacientes</h1>
          <p className="text-slate-500">Sistema "Detecta" - Panel Principal</p>
        </div>
        <button onClick={() => navigate('/crear')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition shadow-sm">
          <UserPlus size={20} /> Nuevo Paciente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {cargando ? <div className="p-10 text-center text-gray-500">Cargando...</div> : (
          <table className="w-full text-center border-collapse text-sm">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                {/* --- TUS NUEVAS COLUMNAS --- */}
                <th className="p-4 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-100 transition" onClick={toggleOrden}>
                  <div className="flex items-center gap-1 select-none justify-center">
                    Código
                    {ordenAscendente ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-slate-600">Apellidos</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Nombres</th>
                <th className="p-4 text-sm font-semibold text-slate-600">DNI</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Seguro</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Historia Clínica</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pacientesOrdenados.map((p) => (
                <tr key={p.idPaciente} className="hover:bg-slate-50 transition text-center">

                  {/* CÓDIGO (Viene de la BD: P000XX) */}
                  <td className="p-4 ">
                    <div className="flex items-center gap-2 justify-center">
                        <Hash size={14} className="text-slate-400"/>
                        <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                            {p.codigoPaciente}
                        </span>
                    </div>
                  </td>

                  {/* APELLIDOS */}
                  <td className="p-4 text-slate-800">
                    {p.apellidos}
                  </td>

                  {/* NOMBRES */}
                  <td className="p-4 text-slate-600">
                    {p.nombres}
                  </td>
                  
                  {/* 1. DNI */}
                  <td className="p-4">
                    <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                      {p.dni}
                    </span>
                  </td>

                  {/* 3. SEGURO */}
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      p.seguro?.nombreSeguro === 'SIS' ? 'bg-green-100 text-green-800' : 
                      p.seguro?.nombreSeguro === 'EsSalud' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {p.seguro?.nombreSeguro || 'N/A'}
                    </span>
                  </td>

                  {/* 4. HISTORIAL */}
                  <td className="p-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1 justify-center" >
                      <FileText size={16} className="text-slate-400" /> 
                      {p.historial?.codigoHistoria || "Pendiente"}
                    </div>
                  </td>

                  {/* 5. ACCIONES (Visualizar, Editar, Eliminar) */}
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {/* Visualizar */}
                      <button 
                        onClick={() => handleVisualizar(p)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition" 
                        title="Visualizar Detalle">
                        <Eye size={18} />
                      </button>
                      
                      {/* Botón Editar */}
                      <button 
                        onClick={() => navigate(`/editar/${p.idPaciente}`)} // <--- AHORA NAVEGA
                        className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded transition" 
                        title="Editar Registro">
                        <Pencil size={18} />
                      </button>

                      {/* Eliminar */}
                      <button 
                        onClick={() => handleEliminar(p.idPaciente)} 
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Eliminar Registro">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}