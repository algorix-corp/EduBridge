import axios from 'axios';
import { getRecoil } from 'recoil-nexus';
import { token } from '../states';

const api = axios.create({
  baseURL: 'https://ja2023api.algorix.io',
});

/* below code is written by GPT-3 */
// Check if a token exists in local storage
const token_1 = getRecoil(token);
// If a token exists, set it in the request headers
if (token_1 != '') {
  api.defaults.headers.common['Authorization'] = `Bearer ${token_1}`;
}

export default api;
