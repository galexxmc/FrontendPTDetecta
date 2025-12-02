// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ListaPacientes from './pages/ListaPacientes';
import PacienteForm from './pages/PacienteForm';
import WelcomePage from './pages/WelcomePage';
import ComingSoonPage from './pages/ComingSoonPage'; // <--- Importamos el componente
import { MainLayout } from './components/layout/MainLayout';

const LayoutWrapper = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />

        {/* Rutas del Sistema (Dentro del Layout) */}
        <Route element={<LayoutWrapper />}>
          
          {/* Módulo Activo */}
          <Route path="/pacientes" element={<ListaPacientes />} />
          <Route path="/crear" element={<PacienteForm />} />
          <Route path="/editar/:id" element={<PacienteForm />} />

          {/* Módulos "Próximamente" (Reutilizando el componente) */}
          <Route 
            path="/historias" 
            element={<ComingSoonPage title="Historias Clínicas" description="El módulo de gestión de historias digitales estará disponible pronto." />} 
          />
          <Route 
            path="/citas" 
            element={<ComingSoonPage title="Gestión de Citas" />} 
          />
          <Route 
            path="/medicos" 
            element={<ComingSoonPage title="Directorio Médico" />} 
          />
          <Route 
            path="/examenes" 
            element={<ComingSoonPage title="Laboratorio" description="Integración con equipos de laboratorio en proceso." />} 
          />

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;