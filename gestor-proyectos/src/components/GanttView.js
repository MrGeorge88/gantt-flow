// components/GanttView.js

import { useProjects } from '../context/ProjectContext';
import { TaskProvider } from '../context/TaskContext';
import GanttChart from './GanttChart';

const GanttView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState(id || '');

  const handleProjectChange = (e) => {
    const newProjectId = e.target.value;
    setSelectedProjectId(newProjectId);
    navigate(`/gantt/${newProjectId}`);
  };

  if (projectsLoading) return <div className="text-center my-8">Cargando proyectos...</div>;

  if (projectsError) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {projectsError}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Diagrama de Gantt</h1>
        
        <div className="mb-6">
          <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Proyecto
          </label>
          <select
            id="project-select"
            value={selectedProjectId}
            onChange={handleProjectChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Selecciona un proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        
        {!selectedProjectId ? (
          <div className="text-center p-10 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">No hay proyecto seleccionado</h2>
            <p className="text-gray-500 mb-4">
              Selecciona un proyecto de la lista desplegable para ver su diagrama de Gantt.
            </p>
            {projects.length === 0 && (
              <div className="mt-4">
                <p className="text-gray-500 mb-2">No tienes proyectos creados.</p>
                <button
                  onClick={() => navigate('/projects/new')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Crear nuevo proyecto
                </button>
              </div>
            )}
          </div>
        ) : (
          <TaskProvider>
            <GanttChart />
          </TaskProvider>
        )}
      </div>
    </div>
  );
};

export default GanttView;