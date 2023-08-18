import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ja2023api.algorix.io',
});

export default api;
