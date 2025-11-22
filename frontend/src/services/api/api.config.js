// API CONFIGURATION - Base URL for all API endpoints
export const API_BASE_URL = 'http://localhost:8000/api';

// CORE REQUEST HANDLER - Main function for all API calls
export const makeRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('AUTH_REQUIRED: Please log in to access this resource');
    }
    
    let data;
    const responseText = await response.text();
    
    if (responseText && responseText.trim() !== '') {
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        throw new Error('Invalid JSON response from server');
      }
    } else {
      data = { message: 'Success' };
    }

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('NOT_FOUND: The requested resource was not found');
      } else if (response.status === 401) {
        throw new Error('AUTH_REQUIRED: Please log in to access this resource');
      } else if (response.status === 403) {
        throw new Error('FORBIDDEN: You do not have permission to access this resource');
      } else if (response.status === 422) {
        const errors = data.errors ? Object.values(data.errors).flat().join(', ') : data.message;
        throw new Error(`VALIDATION_ERROR: ${errors}`);
      } else if (data && data.message) {
        throw new Error(data.message);
      } else {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    }

    return { data };
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
};

// FORM DATA REQUEST HANDLER - Specialized for file uploads
export const makeFormDataRequest = async (endpoint, formData, method = 'POST') => {
  const token = localStorage.getItem('token');
  
  const config = {
    method: method,
    headers: {
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: formData,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('AUTH_REQUIRED: Please log in to access this resource');
    }
    
    let data;
    const responseText = await response.text();
    
    if (responseText && responseText.trim() !== '') {
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error('Invalid JSON response from server');
      }
    } else {
      data = { message: 'Success' };
    }

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('NOT_FOUND: The requested resource was not found');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('AUTH_REQUIRED: Please log in to access this resource');
      } else if (response.status === 422) {
        const errors = data.errors ? Object.values(data.errors).flat().join(', ') : data.message;
        throw new Error(`VALIDATION_ERROR: ${errors}`);
      } else if (data && data.message) {
        throw new Error(data.message);
      } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    }

    return { data };
  } catch (error) {
    console.error('FormData request error:', error);
    throw error;
  }
};

// IMAGE URL HELPER - Generate product image URLs
export const getProductImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://media.istockphoto.com/id/1071359118/vector/missing-image-vector-illustration-no-image-available-vector-concept.jpg?s=612x612&w=0&k=20&c=ukQmxO3tnUxz6mk7akh7aRCw_nyO9mmuvabs9FDPpfw=';
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const baseUrl = 'http://localhost:8000';
  
  if (imagePath.startsWith('storage/')) {
    return `${baseUrl}/${imagePath}`;
  } else if (imagePath.startsWith('public/')) {
    const cleanPath = imagePath.replace('public/', 'storage/');
    return `${baseUrl}/${cleanPath}`;
  } else {
    return `${baseUrl}/storage/${imagePath}`;
  }
};

// AUTHENTICATION UTILITIES - User session management
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setAuth = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

export const removeAuth = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};