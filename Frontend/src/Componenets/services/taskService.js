import api, { endpoints } from './api';

export const taskService = {
  // Get all tasks
  getAllTasks: async (params = {}) => {
    try {
      const response = await api.get(endpoints.tasks.getAll, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get task by ID
  getTaskById: async (id) => {
    try {
      const response = await api.get(endpoints.tasks.getById(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get tasks by project
  getTasksByProject: async (projectId, params = {}) => {
    try {
      const response = await api.get(endpoints.tasks.getByProject(projectId), { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      const response = await api.post(endpoints.tasks.create, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update task
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(endpoints.tasks.update(id), taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(endpoints.tasks.delete(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update task status
  updateTaskStatus: async (id, status) => {
    try {
      const response = await api.put(endpoints.tasks.updateStatus(id), { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Assign task to user
  assignTask: async (id, userId) => {
    try {
      const response = await api.put(endpoints.tasks.assign(id), { userId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Unassign task
  unassignTask: async (id) => {
    try {
      const response = await api.put(endpoints.tasks.assign(id), { userId: null });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get task comments
  getTaskComments: async (id) => {
    try {
      const response = await api.get(endpoints.tasks.getComments(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add comment to task
  addComment: async (id, comment) => {
    try {
      const response = await api.post(endpoints.tasks.addComment(id), { comment });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update comment
  updateComment: async (taskId, commentId, comment) => {
    try {
      const response = await api.put(`${endpoints.tasks.getComments(taskId)}/${commentId}`, { comment });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete comment
  deleteComment: async (taskId, commentId) => {
    try {
      const response = await api.delete(`${endpoints.tasks.getComments(taskId)}/${commentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload task attachment
  uploadAttachment: async (id, file, onUploadProgress) => {
    try {
      const formData = new FormData();
      formData.append('attachment', file);
      
      const response = await api.post(endpoints.tasks.uploadAttachment(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete task attachment
  deleteAttachment: async (taskId, attachmentId) => {
    try {
      const response = await api.delete(endpoints.tasks.deleteAttachment(taskId, attachmentId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get task attachments
  getTaskAttachments: async (id) => {
    try {
      const response = await api.get(`${endpoints.tasks.getById(id)}/attachments`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search tasks
  searchTasks: async (query, params = {}) => {
    try {
      const response = await api.get(`${endpoints.tasks.getAll}/search`, {
        params: { q: query, ...params }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get task history
  getTaskHistory: async (id) => {
    try {
      const response = await api.get(`${endpoints.tasks.getById(id)}/history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Duplicate task
  duplicateTask: async (id, newTaskData = {}) => {
    try {
      const response = await api.post(`${endpoints.tasks.getById(id)}/duplicate`, newTaskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Archive task
  archiveTask: async (id) => {
    try {
      const response = await api.put(`${endpoints.tasks.update(id)}/archive`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Unarchive task
  unarchiveTask: async (id) => {
    try {
      const response = await api.put(`${endpoints.tasks.update(id)}/unarchive`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update task priority
  updateTaskPriority: async (id, priority) => {
    try {
      const response = await api.put(`${endpoints.tasks.update(id)}/priority`, { priority });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Set task due date
  setTaskDueDate: async (id, dueDate) => {
    try {
      const response = await api.put(`${endpoints.tasks.update(id)}/due-date`, { dueDate });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add task tags
  addTaskTags: async (id, tags) => {
    try {
      const response = await api.post(`${endpoints.tasks.getById(id)}/tags`, { tags });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove task tags
  removeTaskTags: async (id, tags) => {
    try {
      const response = await api.delete(`${endpoints.tasks.getById(id)}/tags`, { data: { tags } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get task statistics
  getTaskStats: async (params = {}) => {
    try {
      const response = await api.get(`${endpoints.tasks.getAll}/stats`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bulk update tasks
  bulkUpdateTasks: async (taskIds, updateData) => {
    try {
      const response = await api.put(`${endpoints.tasks.getAll}/bulk-update`, {
        taskIds,
        updateData
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bulk delete tasks
  bulkDeleteTasks: async (taskIds) => {
    try {
      const response = await api.delete(`${endpoints.tasks.getAll}/bulk-delete`, {
        data: { taskIds }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default taskService;