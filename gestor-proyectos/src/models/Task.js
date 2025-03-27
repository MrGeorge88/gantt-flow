// models/Task.js
class Task {
    constructor(id, projectId, title, description, startDate, endDate, progress = 0, dependencies = [], assignedTo = [], priority = 'media') {
      this.id = id;
      this.projectId = projectId;
      this.title = title;
      this.description = description;
      this.startDate = startDate;
      this.endDate = endDate;
      this.progress = progress; // Porcentaje de progreso (0-100)
      this.dependencies = dependencies; // Array de IDs de tareas de las que depende esta tarea
      this.assignedTo = assignedTo; // Array de IDs de usuarios asignados
      this.priority = priority; // 'baja', 'media', 'alta', 'crítica'
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  
    // Calcular la duración en días
    getDuration() {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
  
    // Verificar si la tarea está retrasada
    isDelayed() {
      const today = new Date();
      const end = new Date(this.endDate);
      return today > end && this.progress < 100;
    }
  }
  
  export default Task;