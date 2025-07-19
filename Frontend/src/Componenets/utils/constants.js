/**
 * Constants for the project management app
 */

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile'
  },
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/update'
  },
  PROJECTS: {
    BASE: '/api/projects',
    CREATE: '/api/projects',
    UPDATE: (id) => `/api/projects/${id}`,
    DELETE: (id) => `/api/projects/${id}`,
    MEMBERS: (id) => `/api/projects/${id}/members`,
    ADD_MEMBER: (id) => `/api/projects/${id}/members`,
    REMOVE_MEMBER: (id, userId) => `/api/projects/${id}/members/${userId}`
  },
  TASKS: {
    BASE: '/api/tasks',
    CREATE: '/api/tasks',
    UPDATE: (id) => `/api/tasks/${id}`,
    DELETE: (id) => `/api/tasks/${id}`,
    BY_PROJECT: (projectId) => `/api/tasks/project/${projectId}`,
    ASSIGN: (id) => `/api/tasks/${id}/assign`,
    CHANGE_STATUS: (id) => `/api/tasks/${id}/status`
  }
};

// Task Status
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  DONE: 'done'
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.REVIEW]: 'Review',
  [TASK_STATUS.DONE]: 'Done'
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.TODO]: 'bg-gray-100 text-gray-800',
  [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TASK_STATUS.REVIEW]: 'bg-yellow-100 text-yellow-800',
  [TASK_STATUS.DONE]: 'bg-green-100 text-green-800'
};

// Task Priority
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Low',
  [TASK_PRIORITY.MEDIUM]: 'Medium',
  [TASK_PRIORITY.HIGH]: 'High',
  [TASK_PRIORITY.URGENT]: 'Urgent'
};

export const TASK_PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: 'bg-green-100 text-green-800',
  [TASK_PRIORITY.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [TASK_PRIORITY.HIGH]: 'bg-orange-100 text-orange-800',
  [TASK_PRIORITY.URGENT]: 'bg-red-100 text-red-800'
};

// Project Status
export const PROJECT_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.PLANNING]: 'Planning',
  [PROJECT_STATUS.ACTIVE]: 'Active',
  [PROJECT_STATUS.ON_HOLD]: 'On Hold',
  [PROJECT_STATUS.COMPLETED]: 'Completed',
  [PROJECT_STATUS.CANCELLED]: 'Cancelled'
};

export const PROJECT_STATUS_COLORS = {
  [PROJECT_STATUS.PLANNING]: 'bg-blue-100 text-blue-800',
  [PROJECT_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
  [PROJECT_STATUS.ON_HOLD]: 'bg-yellow-100 text-yellow-800',
  [PROJECT_STATUS.COMPLETED]: 'bg-purple-100 text-purple-800',
  [PROJECT_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member'
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.MANAGER]: 'Manager',
  [USER_ROLES.MEMBER]: 'Member'
};

// Project Roles
export const PROJECT_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer'
};

export const PROJECT_ROLE_LABELS = {
  [PROJECT_ROLES.OWNER]: 'Owner',
  [PROJECT_ROLES.ADMIN]: 'Admin',
  [PROJECT_ROLES.MEMBER]: 'Member',
  [PROJECT_ROLES.VIEWER]: 'Viewer'
};

// Socket Events
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Authentication
  JOIN_USER: 'join_user',
  LEAVE_USER: 'leave_user',
  
  // Projects
  JOIN_PROJECT: 'join_project',
  LEAVE_PROJECT: 'leave_project',
  PROJECT_UPDATED: 'project_updated',
  PROJECT_MEMBER_ADDED: 'project_member_added',
  PROJECT_MEMBER_REMOVED: 'project_member_removed',
  
  // Tasks
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_DELETED: 'task_deleted',
  TASK_ASSIGNED: 'task_assigned',
  TASK_STATUS_CHANGED: 'task_status_changed',
  
  // Notifications
  NOTIFICATION_SENT: 'notification_sent',
  NOTIFICATION_READ: 'notification_read',
  
  // Real-time updates
  USER_TYPING: 'user_typing',
  USER_STOP_TYPING: 'user_stop_typing',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_DUE_SOON: 'task_due_soon',
  TASK_OVERDUE: 'task_overdue',
  TASK_COMPLETED: 'task_completed',
  PROJECT_INVITED: 'project_invited',
  PROJECT_UPDATED: 'project_updated',
  MENTION: 'mention'
};

export const NOTIFICATION_LABELS = {
  [NOTIFICATION_TYPES.TASK_ASSIGNED]: 'Task Assigned',
  [NOTIFICATION_TYPES.TASK_DUE_SOON]: 'Task Due Soon',
  [NOTIFICATION_TYPES.TASK_OVERDUE]: 'Task Overdue',
  [NOTIFICATION_TYPES.TASK_COMPLETED]: 'Task Completed',
  [NOTIFICATION_TYPES.PROJECT_INVITED]: 'Project Invitation',
  [NOTIFICATION_TYPES.PROJECT_UPDATED]: 'Project Updated',
  [NOTIFICATION_TYPES.MENTION]: 'Mentioned'
};

// Date Ranges
export const DATE_RANGES = {
  TODAY: 'today',
  TOMORROW: 'tomorrow',
  THIS_WEEK: 'this_week',
  NEXT_WEEK: 'next_week',
  THIS_MONTH: 'this_month',
  NEXT_MONTH: 'next_month',
  OVERDUE: 'overdue'
};

export const DATE_RANGE_LABELS = {
  [DATE_RANGES.TODAY]: 'Today',
  [DATE_RANGES.TOMORROW]: 'Tomorrow',
  [DATE_RANGES.THIS_WEEK]: 'This Week',
  [DATE_RANGES.NEXT_WEEK]: 'Next Week',
  [DATE_RANGES.THIS_MONTH]: 'This Month',
  [DATE_RANGES.NEXT_MONTH]: 'Next Month',
  [DATE_RANGES.OVERDUE]: 'Overdue'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PROJECT_NAME_MAX_LENGTH: 100,
  TASK_TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50
};

// File Upload
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  LAST_VISITED_PROJECT: 'last_visited_project'
};

// Themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// View Types
export const VIEW_TYPES = {
  LIST: 'list',
  KANBAN: 'kanban',
  CALENDAR: 'calendar',
  GANTT: 'gantt'
};

export const VIEW_TYPE_LABELS = {
  [VIEW_TYPES.LIST]: 'List View',
  [VIEW_TYPES.KANBAN]: 'Kanban Board',
  [VIEW_TYPES.CALENDAR]: 'Calendar View',
  [VIEW_TYPES.GANTT]: 'Gantt Chart'
};

// Filter Options
export const FILTER_OPTIONS = {
  ALL: 'all',
  ASSIGNED_TO_ME: 'assigned_to_me',
  CREATED_BY_ME: 'created_by_me',
  DUE_TODAY: 'due_today',
  DUE_THIS_WEEK: 'due_this_week',
  OVERDUE: 'overdue',
  COMPLETED: 'completed'
};

export const FILTER_LABELS = {
  [FILTER_OPTIONS.ALL]: 'All Tasks',
  [FILTER_OPTIONS.ASSIGNED_TO_ME]: 'Assigned to Me',
  [FILTER_OPTIONS.CREATED_BY_ME]: 'Created by Me',
  [FILTER_OPTIONS.DUE_TODAY]: 'Due Today',
  [FILTER_OPTIONS.DUE_THIS_WEEK]: 'Due This Week',
  [FILTER_OPTIONS.OVERDUE]: 'Overdue',
  [FILTER_OPTIONS.COMPLETED]: 'Completed'
};

// Sort Options
export const SORT_OPTIONS = {
  CREATED_DATE: 'created_date',
  DUE_DATE: 'due_date',
  PRIORITY: 'priority',
  STATUS: 'status',
  TITLE: 'title',
  ASSIGNEE: 'assignee'
};

export const SORT_LABELS = {
  [SORT_OPTIONS.CREATED_DATE]: 'Created Date',
  [SORT_OPTIONS.DUE_DATE]: 'Due Date',
  [SORT_OPTIONS.PRIORITY]: 'Priority',
  [SORT_OPTIONS.STATUS]: 'Status',
  [SORT_OPTIONS.TITLE]: 'Title',
  [SORT_OPTIONS.ASSIGNEE]: 'Assignee'
};

// Sort Directions
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
};

// Default Values
export const DEFAULTS = {
  TASK_STATUS: TASK_STATUS.TODO,
  TASK_PRIORITY: TASK_PRIORITY.MEDIUM,
  PROJECT_STATUS: PROJECT_STATUS.PLANNING,
  VIEW_TYPE: VIEW_TYPES.LIST,
  THEME: THEMES.LIGHT,
  SORT_BY: SORT_OPTIONS.CREATED_DATE,
  SORT_DIRECTION: SORT_DIRECTIONS.DESC
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  TASK_NOT_FOUND: 'Task not found.',
  PROJECT_NOT_FOUND: 'Project not found.',
  USER_NOT_FOUND: 'User not found.',
  DUPLICATE_EMAIL: 'Email already exists.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  FILE_TOO_LARGE: 'File size must be less than 5MB.',
  INVALID_FILE_TYPE: 'File type not supported.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  TASK_CREATED: 'Task created successfully!',
  TASK_UPDATED: 'Task updated successfully!',
  TASK_DELETED: 'Task deleted successfully!',
  PROJECT_CREATED: 'Project created successfully!',
  PROJECT_UPDATED: 'Project updated successfully!',
  PROJECT_DELETED: 'Project deleted successfully!',
  MEMBER_ADDED: 'Member added successfully!',
  MEMBER_REMOVED: 'Member removed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!'
};

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Breakpoints (for responsive design)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Debounce Delays
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  SAVE: 1000,
  RESIZE: 100
};