import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${window.location.origin}/api/auth/register`, formData);
            alert("Registration Successful! Please Login.");
            navigate('/');
        } catch (err) {
            alert("Error registering user");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' }}>
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <input style={inputStyle} type="text" placeholder="Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
                    <input style={inputStyle} type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
                    <input style={inputStyle} type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required />
                    <button style={btnStyle} type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <Link to="/">Login here</Link></p>
            </div>
        </div>
    );
};

const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '10px', border: '1px solid #ddd' };
const btnStyle = { width: '100%', padding: '10px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' };

export default Register;