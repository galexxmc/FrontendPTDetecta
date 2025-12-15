# PT Detecta – Frontend (Cliente Web)

Cliente web para el sistema **PT Detecta**, orientado a la gestión clínica básica.

Incluye:
- Autenticación (registro / login / recuperación de contraseña) consumiendo la API.
- Rutas protegidas (dashboard) con React Router.
- Gestión de pacientes (listar, crear, editar, eliminación lógica, re-habilitar) consumiendo la API.

## Demo
Si existe un despliegue activo, en este repositorio se usó:
- https://frontend-pt-detecta.vercel.app

## Tecnologías
- React 19
- TypeScript
- Vite
- Tailwind CSS (v4, vía plugin de Vite)
- React Router DOM
- Axios
- React Hook Form
- Framer Motion
- ESLint

## Arquitectura / estructura del proyecto
Organización por responsabilidades dentro de `src/`:

- `src/pages/`: pantallas (login, register, lista de pacientes, formulario, etc.)
- `src/components/`:
  - `layout/`: layouts (auth layout, main layout, header/footer)
  - `ui/`: componentes reutilizables (button, input, select, card)
- `src/services/`: capa de acceso a la API (auth y pacientes)
- `src/config/`: configuración compartida (cliente Axios y baseURL)
- `src/context/`: estado global (AuthContext) y manejo de sesión
- `src/hooks/`: hooks de lógica (fetching y formularios)
- `src/types/`: tipos/contratos TypeScript
- `src/utils/`: utilidades (fechas, etc.)

## Ejecutar en local (guía para un usuario nuevo)

### Prerrequisitos
- Node.js 18+
- npm (recomendado) o yarn
- Backend ejecutándose (por defecto):
  - API: `http://localhost:5036`

### 1) Clonar
```bash
git clone https://github.com/galexxmc/FrontendPTDetecta.git
cd FrontendPTDetecta
```

### 2) Instalar dependencias
Este repo incluye `package-lock.json`, por lo que lo más reproducible es usar npm:
```bash
npm install
```

### 3) Configurar variables de entorno
Este proyecto usa Vite; por eso las variables deben empezar con `VITE_`.

Crea/ajusta el archivo `.env` (en la raíz) con la URL base de la API:
```bash
VITE_API_URL=http://localhost:5036/api
```

Notas:
- El cliente Axios usa `import.meta.env.VITE_API_URL` y hace fallback a `http://localhost:5036/api`.
- Si cambias el puerto o el host del backend, actualiza esta variable.

### 4) Ejecutar en modo desarrollo
```bash
npm run dev
```

Vite levantará el sitio (por defecto):
- `http://localhost:5173`

### 5) Build de producción (opcional)
```bash
npm run build
```

### 6) Previsualizar el build (opcional)
```bash
npm run preview
```

## Autenticación (cómo funciona)
- Al iniciar sesión/registrarte, el backend retorna un JWT.
- El frontend guarda el token en `localStorage` y lo setea en el header `Authorization` del cliente Axios.
- Las rutas del dashboard están protegidas con un `ProtectedRoute`.

---
Autor: Gherson Alexis
