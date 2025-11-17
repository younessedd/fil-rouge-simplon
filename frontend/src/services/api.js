const API_BASE_URL = 'http://localhost:8000/api';

// دالة مساعدة للطلبات
const makeRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // إزالة Content-Type لـ FormData
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // التحقق إذا كان الرد HTML بدلاً من JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`الخادم أرجع HTML بدلاً من JSON. قد يكون هناك خطأ في المصادقة أو الـ endpoint.`);
    }
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `خطأ: ${response.status}`);
    }

    return { data };
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
};

// دالة خاصة لطلبات FormData (للملفات)
const makeFormDataRequest = async (endpoint, formData, method = 'POST') => {
  const token = localStorage.getItem('token');
  
  const config = {
    method: method,
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      // لا نضيف Content-Type لـ FormData
    },
    body: formData,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // التحقق من نوع المحتوى
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Server returned HTML:', text.substring(0, 200));
      throw new Error(`استجابة غير متوقعة من الخادم. تحقق من المصادقة.`);
    }
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `خطأ في الحفظ: ${response.status}`);
    }

    return { data };
  } catch (error) {
    console.error('FormData request error:', error);
    throw error;
  }
};

// دالة الحصول على رابط الصورة
export const getProductImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const baseUrl = 'http://localhost:8000';
  const cleanPath = imagePath.replace('public/', '');
  return `${baseUrl}/storage/${cleanPath}`;
};

// Auth APIs
export const authAPI = {
  register: (userData) => makeRequest('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => makeRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  logout: () => makeRequest('/logout', { method: 'POST' }),
  getMe: () => makeRequest('/me'),
};

// Products APIs مع Pagination
export const productsAPI = {
  getAll: (page = 1) => makeRequest(`/products?page=${page}`),
  search: (query, page = 1) => makeRequest(`/products/search?q=${encodeURIComponent(query)}&page=${page}`),
  getById: (id) => makeRequest(`/products/${id}`),
  create: (productData) => makeFormDataRequest('/products', productData, 'POST'),
  update: (id, productData) => {
    productData.append('_method', 'PUT');
    return makeFormDataRequest(`/products/${id}`, productData, 'POST');
  },
  delete: (id) => makeRequest(`/products/${id}`, { method: 'DELETE' }),
};

// Categories APIs مع Pagination
export const categoriesAPI = {
  getAll: (page = 1) => makeRequest(`/categories?page=${page}`),
  getById: (id) => makeRequest(`/categories/${id}`),
  create: (categoryData) => makeRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }),
  update: (id, categoryData) => makeRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }),
  delete: (id) => makeRequest(`/categories/${id}`, { method: 'DELETE' }),
};

// Users APIs مع Pagination
export const usersAPI = {
  getAll: (page = 1) => makeRequest(`/users?page=${page}`),
  getById: (id) => makeRequest(`/users/${id}`),
  create: (userData) => makeRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  update: (id, userData) => makeRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  delete: (id) => makeRequest(`/users/${id}`, { method: 'DELETE' }),
};

// Cart APIs
export const cartAPI = {
  get: () => makeRequest('/cart'),
  add: (itemData) => makeRequest('/cart', {
    method: 'POST',
    body: JSON.stringify(itemData),
  }),
  remove: (id) => makeRequest(`/cart/${id}`, { method: 'DELETE' }),
  clear: () => makeRequest('/cart', { method: 'DELETE' }),
  checkout: () => makeRequest('/cart/checkout', { method: 'POST' }),
};

// Orders APIs مع Pagination
export const ordersAPI = {
  getUserOrders: (page = 1) => makeRequest(`/orders?page=${page}`),
  getOrder: (id) => makeRequest(`/orders/${id}`),
  create: (orderData) => makeRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  delete: (id) => makeRequest(`/orders/${id}`, { method: 'DELETE' }),
  getAllOrders: (page = 1) => makeRequest(`/admin/orders?page=${page}`),
};
// Dashboard APIs
export const dashboardAPI = {
  getStats: () => makeRequest('/admin/dashboard-stats'),
};