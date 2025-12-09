import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AuthLayout } from './components/layout/AuthLayout';

import ListaPacientes from './pages/ListaPacientes';
import PacienteForm from './pages/PacienteForm';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ComingSoonPage from './pages/ComingSoonPage';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50">Cargando...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

// ✅ CORRECCIÓN AQUÍ:
// Ya no pasamos children. El MainLayout usa useOutlet() internamente.
const DashboardLayoutWrapper = () => (
  <MainLayout />
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* GRUPO 1: RUTAS PÚBLICAS (Auth) */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* GRUPO 2: RUTAS PRIVADAS (Dashboard) */}
        <Route element={<ProtectedRoute />}> 
            {/* El Wrapper renderiza el MainLayout, que gestiona las animaciones */}
            <Route element={<DashboardLayoutWrapper />}>
                <Route path="/pacientes" element={<ListaPacientes />} />
                <Route path="/crear" element={<PacienteForm />} />
                <Route path="/editar/:id" element={<PacienteForm />} />
                <Route path="/historias" element={<ComingSoonPage title="Historias Clínicas" />} />
                <Route path="/historias/:idPaciente" element={<ComingSoonPage title="Historial Detalle" />} />
                <Route path="/citas" element={<ComingSoonPage title="Gestión de Citas" />} />
                <Route path="/medicos" element={<ComingSoonPage title="Directorio Médico" />} />
                <Route path="/examenes" element={<ComingSoonPage title="Laboratorio" />} />
            </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;