import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (data) => API.post('/login', data),
    register: (data) => API.post('/register', data),
    logout: () => API.post('/logout'),
    getMe: () => API.get('/me'),
};

export const productsAPI = {
    getAll: () => API.get('/products'),
    getOne: (id) => API.get(`/products/${id}`),
    create: (data) => API.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => API.put(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => API.delete(`/products/${id}`),
    search: (query) => API.get(`/products/search?q=${query}`),
};

export const categoriesAPI = {
    getAll: () => API.get('/categories'),
    create: (data) => API.post('/categories', data),
    update: (id, data) => API.put(`/categories/${id}`, data),
    delete: (id) => API.delete(`/categories/${id}`),
};

export const cartAPI = {
    get: () => API.get('/cart'),
    add: (data) => API.post('/cart', data),
    remove: (id) => API.delete(`/cart/${id}`),
    clear: () => API.delete('/cart'),
    checkout: () => API.post('/cart/checkout'),
};

export const ordersAPI = {
    getAll: () => API.get('/orders'),
    getOne: (id) => API.get(`/orders/${id}`),
    create: (data) => API.post('/orders', data),
    delete: (id) => API.delete(`/orders/${id}`),
    getAllAdmin: () => API.get('/admin/orders'),
};

export const usersAPI = {
    getAll: () => API.get('/users'),
    getOne: (id) => API.get(`/users/${id}`),
    create: (data) => API.post('/users', data),
    update: (id, data) => API.put(`/users/${id}`, data),
    delete: (id) => API.delete(`/users/${id}`),
};

export const imageHelpers = {
    getProductImageUrl: (imagePath) => {
        if (!imagePath) {
            return 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';
        }
        return `http://localhost:8000/storage/${imagePath}`;
    }
};

export default API;