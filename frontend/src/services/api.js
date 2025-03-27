// En un entorno de desarrollo local, usa localhost
const API_URL = 'http://localhost:3001/api/';

// Si estás en un entorno de Codespaces, usa la URL pública
// Para obtener la URL, ve a la pestaña de PORTS en Codespaces
// y encuentra la URL pública para el puerto 3001
// const API_URL = 'https://tu-codespace-url-puerto-3001/api';

// Función auxiliar para hacer peticiones
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(`${API_URL}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Error HTTP: ${response.status} ${response.statusText}`
      }));
      throw new Error(errorData.message || 'Ocurrió un error en la petición');
    }
    
    return response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

// Servicio de autenticación
export const authService = {
  login: (email, password) => {
    return fetchWithAuth('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  register: (name, email, password) => {
    return fetchWithAuth('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },
  
  getProfile: () => {
    return fetchWithAuth('/users/profile');
  }
};

// Servicio de proyectos
export const projectService = {
  getAllProjects: () => {
    return fetchWithAuth('/projects');
  },
  
  getProjectById: (id) => {
    return fetchWithAuth(`/projects/${id}`);
  },
  
  createProject: (name) => {
    return fetchWithAuth('/projects', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  },
  
  updateProject: (id, name) => {
    return fetchWithAuth(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name })
    });
  },
  
  deleteProject: (id) => {
    return fetchWithAuth(`/projects/${id}`, {
      method: 'DELETE'
    });
  }
};
