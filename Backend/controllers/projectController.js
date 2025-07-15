const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const { getIO } = require('../config/socket');

const createProject = async (req, res) => {
  try {
    const { name, description, endDate } = req.body;
    
    const project = new Project({
      name,
      description,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'admin' }],
      endDate
    });
    
    await project.save();
    await project.populate('owner members.user', 'name email');
    
    // Add project to user's projects
    await User.findByIdAndUpdate(req.user.id, {
      $push: { projects: project._id }
    });
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    })
    .populate('owner members.user', 'name email')
    .populate('tasks')
    .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner members.user', 'name email')
      .populate({
        path: 'tasks',
        populate: {
          path: 'assignedTo createdBy',
          select: 'name email'
        }
      });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is member
    const isMember = project.members.some(member => 
      member.user._id.toString() === req.user.id
    );
    
    if (!isMember && project.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is owner or admin
    const isOwner = project.owner.toString() === req.user.id;
    const isAdmin = project.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('owner members.user', 'name email');
    
    // Emit update to project members
    const io = getIO();
    io.to(req.params.id).emit('project-updated', updatedProject);
    
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Only owner can delete
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Delete all tasks
    await Task.deleteMany({ project: req.params.id });
    
    // Remove project from users
    await User.updateMany(
      { projects: req.params.id },
      { $pull: { projects: req.params.id } }
    );
    
    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addMember = async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is owner or admin
    const isOwner = project.owner.toString() === req.user.id;
    const isAdmin = project.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already member
    const isMember = project.members.some(member => 
      member.user.toString() === user._id.toString()
    );
    
    if (isMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }
    
    project.members.push({ user: user._id, role });
    await project.save();
    
    // Add project to user's projects
    await User.findByIdAndUpdate(user._id, {
      $push: { projects: project._id }
    });
    
    await project.populate('members.user', 'name email');
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is owner or admin
    const isOwner = project.owner.toString() === req.user.id;
    const isAdmin = project.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    project.members = project.members.filter(member => 
      member.user.toString() !== req.params.memberId
    );
    
    await project.save();
    
    // Remove project from user's projects
    await User.findByIdAndUpdate(req.params.memberId, {
      $pull: { projects: project._id }
    });
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};