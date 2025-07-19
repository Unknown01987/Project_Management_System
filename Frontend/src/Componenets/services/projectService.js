import api, { endpoints } from './api';

export const projectService = {
  // Get all projects
  getAllProjects: async (params = {}) => {
    try {
      const response = await api.get(endpoints.projects.getAll, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's projects
  getUserProjects: async (params = {}) => {
    try {
      const response = await api.get(endpoints.projects.getUserProjects, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get project by ID
  getProjectById: async (id) => {
    try {
      const response = await api.get(endpoints.projects.getById(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new project
  createProject: async (projectData) => {
    try {
      const response = await api.post(endpoints.projects.create, projectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update project
  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(endpoints.projects.update(id), projectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete project
  deleteProject: async (id) => {
    try {
      const response = await api.delete(endpoints.projects.delete(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get project members
  getProjectMembers: async (id) => {
    try {
      const response = await api.get(endpoints.projects.getMembers(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add member to project
  addMember: async (projectId, userData) => {
    try {
      const response = await api.post(endpoints.projects.addMember(projectId), userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove member from project
  removeMember: async (projectId, userId) => {
    try {
      const response = await api.delete(endpoints.projects.removeMember(projectId), {
        data: { userId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update member role
  updateMemberRole: async (projectId, userId, role) => {
    try {
      const response = await api.put(endpoints.projects.addMember(projectId), {
        userId,
        role
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get project statistics
  getProjectStats: async (id) => {
    try {
      const response = await api.get(`${endpoints.projects.getById(id)}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search projects
  searchProjects: async (query, params = {}) => {
    try {
      const response = await api.get(`${endpoints.projects.getAll}/search`, {
        params: { q: query, ...params }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Archive project
  archiveProject: async (id) => {
    try {
      const response = await api.put(`${endpoints.projects.update(id)}/archive`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Unarchive project
  unarchiveProject: async (id) => {
    try {
      const response = await api.put(`${endpoints.projects.update(id)}/unarchive`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Duplicate project
  duplicateProject: async (id, newProjectData) => {
    try {
      const response = await api.post(`${endpoints.projects.getById(id)}/duplicate`, newProjectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get project activity
  getProjectActivity: async (id, params = {}) => {
    try {
      const response = await api.get(`${endpoints.projects.getById(id)}/activity`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update project settings
  updateProjectSettings: async (id, settings) => {
    try {
      const response = await api.put(`${endpoints.projects.update(id)}/settings`, settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload project avatar
  uploadProjectAvatar: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post(`${endpoints.projects.getById(id)}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete project avatar
  deleteProjectAvatar: async (id) => {
    try {
      const response = await api.delete(`${endpoints.projects.getById(id)}/avatar`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default projectService;