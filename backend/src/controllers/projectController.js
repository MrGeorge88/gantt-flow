const db = require('../db');

exports.getAllProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener proyectos donde el usuario es propietario o miembro
    const result = await db.query(
      `SELECT p.* FROM projects p
       LEFT JOIN project_members pm ON p.project_id = pm.project_id
       WHERE p.owner_user_id = $1 OR pm.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    
    // Crear nuevo proyecto
    const result = await db.query(
      'INSERT INTO projects (name, owner_user_id, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [name, userId]
    );
    
    // Añadir al creador como miembro administrador
    await db.query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)',
      [result.rows[0].project_id, userId, 'admin']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Verificar acceso al proyecto
    const accessCheck = await db.query(
      `SELECT 1 FROM projects p
       LEFT JOIN project_members pm ON p.project_id = pm.project_id
       WHERE p.project_id = $1 AND (p.owner_user_id = $2 OR pm.user_id = $2)`,
      [id, userId]
    );
    
    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    // Obtener detalles del proyecto
    const projectResult = await db.query(
      'SELECT * FROM projects WHERE project_id = $1',
      [id]
    );
    
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    const project = projectResult.rows[0];
    
    // Obtener secciones del proyecto
    const sectionsResult = await db.query(
      'SELECT * FROM sections WHERE project_id = $1 ORDER BY "order"',
      [id]
    );
    
    // Obtener tareas del proyecto
    const tasksResult = await db.query(
      `SELECT t.*, u.name as assignee_name
       FROM tasks t
       LEFT JOIN users u ON t.assignee_user_id = u.user_id
       WHERE t.project_id = $1
       ORDER BY t.section_id, t."order"`,
      [id]
    );
    
    // Obtener miembros del proyecto
    const membersResult = await db.query(
      `SELECT pm.role, u.user_id, u.name, u.email
       FROM project_members pm
       JOIN users u ON pm.user_id = u.user_id
       WHERE pm.project_id = $1`,
      [id]
    );
    
    // Obtener dependencias
    const dependenciesResult = await db.query(
      `SELECT d.* FROM dependencies d
       JOIN tasks t ON d.predecessor_task_id = t.task_id
       WHERE t.project_id = $1`,
      [id]
    );
    
    res.json({
      ...project,
      sections: sectionsResult.rows,
      tasks: tasksResult.rows,
      members: membersResult.rows,
      dependencies: dependenciesResult.rows
    });
  } catch (error) {
    console.error('Error al obtener proyecto:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;
    
    // Verificar que el usuario sea propietario o admin
    const accessCheck = await db.query(
      `SELECT 1 FROM projects p
       LEFT JOIN project_members pm ON p.project_id = pm.project_id
       WHERE p.project_id = $1 AND (p.owner_user_id = $2 OR (pm.user_id = $2 AND pm.role = 'admin'))`,
      [id, userId]
    );
    
    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    // Actualizar el proyecto
    const result = await db.query(
      'UPDATE projects SET name = $1 WHERE project_id = $2 RETURNING *',
      [name, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Verificar que el usuario sea propietario
    const accessCheck = await db.query(
      'SELECT 1 FROM projects WHERE project_id = $1 AND owner_user_id = $2',
      [id, userId]
    );
    
    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    
    // Eliminar el proyecto (las dependencias se eliminarán por cascada)
    await db.query('DELETE FROM projects WHERE project_id = $1', [id]);
    
    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
