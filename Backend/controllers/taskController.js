const Task = require('../models/Task');
const Project = require('../models/Project');
const { getIO } = require('../config/socket');

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const projectId = req.params.projectId;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is member
    const isMember = project.members.some(member => 
      member.user.toString() === req.user.id
    ) || project.owner.toString() === req.user.id;
    
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const task = new Task({
      title,
      description,
      assignedTo,
      priority,
      dueDate,
      project: projectId,
      createdBy: req.user.id
    });
    
    await task.save();
    await task.populate('assignedTo createdBy', 'name email');
    
    // Add task to project
    await Project.findByIdAndUpdate(projectId, {
      $push: { tasks: task._id }
    });
    
    // Emit real-time update
    const io = getIO();
    io.to(projectId).emit('task-created', task);
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { status, assignedTo } = req.query;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is member
    const isMember = project.members.some(member => 
      member.user.toString() === req.user.id
    ) || project.owner.toString() === req.user.id;
    
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    let query = { project: projectId };
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    
    const tasks = await Task.find(query)
      .populate('assignedTo createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const project = await Project.findById(task.project);
    
    // Check if user is member
    const isMember = project.members.some(member => 
      member.user.toString() === req.user.id
    ) || project.owner.toString() === req.user.id;
    
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // If status is being changed to 'done', set completedAt
    if (req.body.status === 'done' && task.status !== 'done') {
      req.body.completedAt = new Date();
    } else if (req.body.status !== 'done') {
      req.body.completedAt = null;
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedTo createdBy', 'name email');
    
    // Emit real-time update
    const io = getIO();
    io.to(task.project.toString()).emit('task-updated', updatedTask);
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const project = await Project.findById(task.project);
    
    // Check if user is member and either created the task or is admin
    const isMember = project.members.some(member => 
      member.user.toString() === req.user.id
    ) || project.owner.toString() === req.user.id;
    
    const isCreator = task.createdBy.toString() === req.user.id;
    const isAdmin = project.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    ) || project.owner.toString() === req.user.id;
    
    if (!isMember || (!isCreator && !isAdmin)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    
    // Remove task from project
    await Project.findByIdAndUpdate(task.project, {
      $pull: { tasks: req.params.id }
    });
    
    // Emit real-time update
    const io = getIO();
    io.to(task.project.toString()).emit('task-deleted', req.params.id);
    
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};