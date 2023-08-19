import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ja2023api.algorix.io',
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

export default api;
