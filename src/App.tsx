import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ListaPacientes from './pages/ListaPacientes';
import PacienteForm from './pages/PacienteForm';
import WelcomePage from './pages/WelcomePage'; // Importamos la nueva página

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. RUTA RAÍZ: Muestra la bienvenida */}
        <Route path="/" element={<WelcomePage />} />

        {/* 2. RUTA PRINCIPAL: Muestra la tabla de gestión */}
        <Route path="/pacientes" element={<ListaPacientes />} />

        {/* 3. RUTAS DEL FORMULARIO */}
        <Route path="/crear" element={<PacienteForm />} />
        <Route path="/editar/:id" element={<PacienteForm />} />

        {/* 4. REDIRECCIÓN DE SEGURIDAD: Si escriben cualquier cosa rara, van al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;