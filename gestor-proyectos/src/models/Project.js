// models/Project.js

class Project {
    constructor(id, name, description, startDate, endDate, status, members = [], tasks = []) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.startDate = startDate;
      this.endDate = endDate;
      this.status = status; // 'pendiente', 'en_progreso', 'completado', 'cancelado'
      this.members = members;
      this.tasks = tasks;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  }
  
  export default Project;