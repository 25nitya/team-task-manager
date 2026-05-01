import axios from 'axios';

const API = axios.create({
    // USE YOUR CODESPACE 5000 URL HERE
    baseURL: 'https://redesigned-pancake-7v9qwgg5ww9ghrrq4-5000.app.github.dev/api' 
});

// Add this to handle the token automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;