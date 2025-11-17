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