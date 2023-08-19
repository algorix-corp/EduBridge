import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ja2023api.algorix.io',
});

/* below code is written by GPT-3 */
// Check if a token exists in local storage
const token = localStorage.getItem('token');
// If a token exists, set it in the request headers
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
