import axios from 'axios';
export const api = axios.create({baseURL:import.meta.env.VITE_API_URL || 'http://localhost:5000/api'});
api.interceptors.request.use(config=>{const token=localStorage.getItem('cc_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
api.interceptors.response.use(r=>r,error=>{if(error.response?.status===401){localStorage.removeItem('cc_token');localStorage.removeItem('cc_user');if(!location.pathname.includes('/login'))location.href='/login';}return Promise.reject(error);});
export const messageOf = e => e?.response?.data?.message || e?.message || 'Something went wrong. Please try again.';
