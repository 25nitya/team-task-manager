import React, { useState } from 'react';
import API from './api'; // Ensure this points to your Port 5000 URL

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Member'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Endpoints based on your backend routes
            const url = isLogin ? '/auth/login' : '/auth/register';
            
            // If logging in, we only need email/password. If registering, we send everything.
            const payload = isLogin 
                ? { email: formData.email, password: formData.password } 
                : formData;

            const res = await API.post(url, payload);

            if (isLogin) {
                // Store the JWT token for your ProtectedRoutes
                localStorage.setItem('token', res.data.token);
                // Hard refresh to Dashboard to ensure App.js catches the new token
                window.location.href = '/dashboard';
            } else {
                alert('Registration successful! You can now log in.');
                setIsLogin(true); // Switch to login mode automatically
            }
        } catch (err) {
            // Pull specific error message from your backend (e.g., "User already exists")
            const message = err.response?.data?.msg || "Connection error. Check your backend port.";
            alert(message);
            console.error("Auth Error:", err);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
                
                <form onSubmit={handleSubmit} style={formStyle}>
                    {!isLogin && (
                        <>
                            <input 
                                style={inputStyle}
                                type="text" 
                                name="name" 
                                placeholder="Full Name" 
                                onChange={handleChange} 
                                required 
                            />
                            <select 
                                style={inputStyle} 
                                name="role" 
                                value={formData.role} 
                                onChange={handleChange}
                            >
                                <option value="Member">Member</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </>
                    )}

                    <input 
                        style={inputStyle}
                        type="email" 
                        name="email" 
                        placeholder="Email Address" 
                        onChange={handleChange} 
                        required 
                    />

                    <input 
                        style={inputStyle}
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        required 
                    />

                    <button type="submit" style={buttonStyle}>
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <p style={{ marginTop: '15px', fontSize: '14px' }}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span 
                        onClick={() => setIsLogin(!isLogin)} 
                        style={toggleLinkStyle}
                    >
                        {isLogin ? ' Sign Up' : ' Login'}
                    </span>
                </p>
            </div>
        </div>
    );
};

// --- Simple Styles ---
const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5'
};

const cardStyle = {
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '350px',
    textAlign: 'center'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
};

const inputStyle = {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px'
};

const buttonStyle = {
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const toggleLinkStyle = {
    color: '#007bff',
    cursor: 'pointer',
    fontWeight: 'bold'
};

export default Login;