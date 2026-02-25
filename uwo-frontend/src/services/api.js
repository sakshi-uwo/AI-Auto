import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add Interceptor to attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('aiauto_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add Interceptor to handle unauthorized responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('[AUTH] Unauthorized access (401), clearing session.');
            localStorage.removeItem('aiauto_token');
            localStorage.removeItem('aiauto_user');
            // Prevent recursive redirect if already on login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('aiauto_token', response.data.token);
            localStorage.setItem('aiauto_user', JSON.stringify(response.data.user || response.data));
        }
        return response.data;
    },
    signup: async (userData) => {
        const response = await api.post('/users/signup', userData);
        if (response.data.token) {
            localStorage.setItem('aiauto_token', response.data.token);
            localStorage.setItem('aiauto_user', JSON.stringify(response.data.user || response.data));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('aiauto_token');
        localStorage.removeItem('aiauto_user');
    },
    getCurrentUser: () => {
        const userData = localStorage.getItem('aiauto_user');
        if (!userData) return null;
        const user = JSON.parse(userData);
        // Normalize ID fields for backward compatibility/consistency
        if (user.id && !user._id) user._id = user.id;
        if (user._id && !user.id) user.id = user._id;
        return user;
    }
};

export const dashboardService = {
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    },
};

export const leadService = {
    getAll: async () => {
        const response = await api.get('/lead'); // Fixed path to /lead to match backend
        return response.data;
    },
    create: async (leadData) => {
        const response = await api.post('/lead', leadData);
        return response.data;
    },
    seed: async () => {
        const response = await api.post('/leads/seed');
        return response.data;
    },
};

export const projectService = {
    getAll: async () => {
        const response = await api.get('/projects');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/projects', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/projects/${id}`, data);
        return response.data;
    }
};

export const visitService = {
    getAll: async () => {
        const response = await api.get('/site-visits');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/site-visits', data);
        return response.data;
    },
    updateStatus: async (id, status) => {
        const response = await api.patch(`/site-visits/${id}`, { status });
        return response.data;
    }
};

export const chatService = {
    sendMessage: async (messageData) => {
        const response = await api.post('/chat', messageData);
        return response.data;
    },
};

export const analyticsService = {
    getGlobalData: async () => {
        const response = await api.get('/analytics/global');
        return response.data;
    }
};

export default api;

export const notificationService = {
    getAll: async (userId) => {
        const response = await api.get('/notifications', { headers: { 'x-user-id': userId } });
        return response.data;
    },
    markAsRead: async (id) => {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data;
    },
    getSettings: async (userId) => {
        const response = await api.get('/notifications/settings', { headers: { 'x-user-id': userId } });
        return response.data;
    },
    updateSettings: async (settings) => {
        const response = await api.put('/notifications/settings', settings, {
            headers: { 'x-user-id': settings.userId }
        });
        return response.data;
    }
};

export const milestoneService = {
    getAll: async () => {
        const response = await api.get('/milestones');
        return response.data;
    },
    getByProject: async (projectId) => {
        const response = await api.get(`/milestones/project/${projectId}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/milestones', data);
        return response.data;
    }
};

export const documentService = {
    getAll: async () => {
        const response = await api.get('/documents');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/documents', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.patch(`/documents/${id}`, data);
        return response.data;
    },
    uploadVersion: async (id, data) => {
        const response = await api.post(`/documents/${id}/version`, data);
        return response.data;
    }
};

export const attendanceService = {
    getRecords: async (date) => {
        const response = await api.get('/attendance', { params: { date } });
        return response.data;
    },
    updateRecords: async (data) => {
        const response = await api.post('/attendance', data);
        return response.data;
    },
    getWorkers: async () => {
        const response = await api.get('/attendance/workers');
        return response.data;
    },
    getStats: async () => {
        const response = await api.get('/attendance/stats');
        return response.data;
    },
    getAlerts: async () => {
        const response = await api.get('/attendance/alerts');
        return response.data;
    }
};

export const taskService = {
    getAll: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },
    getByProject: async (projectId) => {
        const response = await api.get(`/tasks/project/${projectId}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/tasks', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.patch(`/tasks/${id}`, data);
        return response.data;
    }
};

export const materialService = {
    getAll: async () => {
        const response = await api.get('/materials');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/materials', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.patch(`/materials/${id}`, data);
        return response.data;
    },
    recordUsage: async (data) => {
        const response = await api.post('/materials/record-usage', data);
        return response.data;
    }
};

export const supportService = {
    getByUser: async (userId) => {
        const response = await api.get(`/support/user/${userId}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/support', data);
        return response.data;
    }
};

export const siteOpsService = {
    getLogs: async () => {
        const response = await api.get('/site-ops/logs');
        return response.data;
    },
    createLog: async (data) => {
        const response = await api.post('/site-ops/logs', data);
        return response.data;
    },
    getIncidents: async () => {
        const response = await api.get('/site-ops/incidents');
        return response.data;
    },
    reportIncident: async (data) => {
        const response = await api.post('/site-ops/incidents', data);
        return response.data;
    },
    updateIncident: async (id, data) => {
        const response = await api.patch(`/site-ops/incidents/${id}`, data);
        return response.data;
    }
};
