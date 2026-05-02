import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        
        // 🚀 USE THE PUBLIC CODESPACE URL FOR THE BACKEND
        const BACKEND_URL = 'https://redesigned-pancake-7v9qwgg5ww9ghrrq4-5000.app.github.dev/api/auth/login';

        try {
            const res = await axios.post(BACKEND_URL, formData);
            
            // Save the JWT token
            localStorage.setItem('token', res.data.token);
            
            alert('Login Successful!');
            navigate('/dashboard'); 
        } catch (err) {
            console.error('Login Error:', err.response?.data);
            alert('Error: ' + (err.response?.data?.msg || 'Invalid Credentials'));
        }
    };

    return (
        <div style={{ 
            maxWidth: '400px', 
            margin: '50px auto', 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h2 style={{ textAlign: 'center' }}>Login</h2>
            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        name="email" 
                        value={email} 
                        onChange={onChange} 
                        required 
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name="password" 
                        value={password} 
                        onChange={onChange} 
                        required 
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <button type="submit" style={{ 
                    width: '100%', 
                    padding: '10px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}>
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default Login;