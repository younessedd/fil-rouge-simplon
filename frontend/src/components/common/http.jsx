export const apiUrl = 'http://localhost:8000/api'

export const adminToken = () => {
  const stored = localStorage.getItem('adminInfo');
  if (!stored) return null;
  const data = JSON.parse(stored);
  return data?.token || null;
};
