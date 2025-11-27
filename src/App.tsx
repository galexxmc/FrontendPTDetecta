import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListaPacientes from './pages/ListaPacientes';
import PacienteForm from './pages/PacienteForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListaPacientes />} />
        <Route path="/crear" element={<PacienteForm />} />
        <Route path="/editar/:id" element={<PacienteForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;