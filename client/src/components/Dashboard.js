import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [userName, setUserName] = useState('');
    const [stats, setStats] = useState({ total: 0, completed: 0, overdue: 0 });
    const [taskData, setTaskData] = useState({ title: '', description: '', project: '' });
    const [newProjectName, setNewProjectName] = useState('');

    const navigate = useNavigate();
    const API = 'https://redesigned-pancake-7v9qwgg5ww9ghrrq4-5000.app.github.dev/api';

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/');
    }, [navigate]);

    const loadData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return handleLogout();
        const config = { headers: { 'x-auth-token': token } };

        try {
            const resUser = await axios.get(`${API}/auth/me`, config);
            setUserName(resUser.data?.name || 'User');

            const resProj = await axios.get(`${API}/projects`, config);
            setProjects(resProj.data || []);

            const resStats = await axios.get(`${API}/tasks/dashboard/stats`, config);
            setStats(resStats.data || { total: 0, completed: 0, overdue: 0 });

            const resTasks = await axios.get(`${API}/tasks`, config);
            setTasks(resTasks.data || []);
        } catch (err) {
            if (err.response?.status === 401) handleLogout();
        }
    }, [handleLogout]);

    useEffect(() => { loadData(); }, [loadData]);

    const addProject = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${API}/projects`, { name: newProjectName }, { headers: { 'x-auth-token': token } });
            setNewProjectName('');
            loadData();
        } catch (err) { alert("Error adding project"); }
    };

    const onSubmitTask = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${API}/tasks`, taskData, { headers: { 'x-auth-token': token } });
            setTaskData({ title: '', description: '', project: '' });
            loadData();
        } catch (err) { alert("Error adding task"); }
    };

    const updateStatus = async (id) => {
        const token = localStorage.getItem('token');
        await axios.patch(`${API}/tasks/${id}`, { status: 'Done' }, { headers: { 'x-auth-token': token } });
        loadData();
    };

    const deleteTask = async (id) => {
        if (window.confirm("Delete this task?")) {
            const token = localStorage.getItem('token');
            await axios.delete(`${API}/tasks/${id}`, { headers: { 'x-auth-token': token } });
            loadData();
        }
    };

    return (
        <div style={styles.container}>
            {/* Header Area */}
            <header style={styles.header}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3436' }}>🎯 TeamTask <span style={{color: '#0984e3'}}>Pro</span></h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontWeight: '500' }}>Hi, {userName}</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </header>

            {/* Stats Insight Cards */}
            <div style={styles.statsRow}>
                <div style={{ ...styles.glassCard, flex: 1, borderTop: '5px solid #0984e3' }}>
                    <h2 style={{ margin: 0, color: '#0984e3' }}>{stats.total}</h2>
                    <p style={styles.statLabel}>Total Tasks</p>
                </div>
                <div style={{ ...styles.glassCard, flex: 1, borderTop: '5px solid #00b894' }}>
                    <h2 style={{ margin: 0, color: '#00b894' }}>{stats.completed}</h2>
                    <p style={styles.statLabel}>Completed</p>
                </div>
                <div style={{ ...styles.glassCard, flex: 1, borderTop: '5px solid #d63031' }}>
                    <h2 style={{ margin: 0, color: '#d63031' }}>{stats.overdue}</h2>
                    <p style={styles.statLabel}>Overdue</p>
                </div>
            </div>

            <div style={styles.mainGrid}>
                {/* Left Side: Sidebar Forms */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={styles.glassCard}>
                        <h4 style={styles.sectionTitle}>📂 New Project</h4>
                        <form onSubmit={addProject} style={styles.form}>
                            <input style={styles.input} value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder="e.g. B.Tech Finals" required />
                            <button type="submit" style={styles.primaryBtn}>Create Project</button>
                        </form>
                    </div>

                    <div style={styles.glassCard}>
                        <h4 style={styles.sectionTitle}>📝 New Task</h4>
                        <form onSubmit={onSubmitTask} style={styles.form}>
                            <input style={styles.input} value={taskData.title} onChange={e => setTaskData({...taskData, title: e.target.value})} placeholder="What needs to be done?" required />
                            <select style={styles.input} value={taskData.project} onChange={e => setTaskData({...taskData, project: e.target.value})}>
                                <option value="">General Tasks</option>
                                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                            <button type="submit" style={{ ...styles.primaryBtn, background: '#00b894' }}>Add to List</button>
                        </form>
                    </div>
                </aside>

                {/* Right Side: Main Task List */}
                <main style={styles.glassCard}>
                    <h3 style={styles.sectionTitle}>📌 Active Roadmap</h3>
                    {tasks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#b2bec3' }}>
                            <h3>🚀</h3>
                            <p>No tasks yet. Start by adding one!</p>
                        </div>
                    ) : (
                        tasks.map(t => (
                            <div key={t._id} style={styles.taskCard}>
                                <div style={{ flex: 1 }}>
                                    <div style={styles.badge(t.status)}>{t.status}</div>
                                    <h4 style={{ margin: '10px 0 5px 0', textDecoration: t.status === 'Done' ? 'line-through' : 'none', color: '#2d3436' }}>{t.title}</h4>
                                    <span style={{ fontSize: '12px', color: '#0984e3', fontWeight: '600' }}>
                                        {t.project?.name ? `📁 ${t.project.name}` : '📁 General'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {t.status !== 'Done' && <button onClick={() => updateStatus(t._id)} style={styles.actionBtn('#00b894')}>✔</button>}
                                    <button onClick={() => deleteTask(t._id)} style={styles.actionBtn('#d63031')}>🗑</button>
                                </div>
                            </div>
                        ))
                    )}
                </main>
            </div>
        </div>
    );
};

// --- STYLES OBJECT ---
const styles = {
    container: {
        maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        fontFamily: "'Inter', sans-serif", color: '#2d3436'
    },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    logoutBtn: { padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    statsRow: { display: 'flex', gap: '20px', marginBottom: '30px' },
    glassCard: {
        background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)',
        borderRadius: '20px', padding: '25px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    statLabel: { fontSize: '14px', fontWeight: '600', color: '#636e72', marginTop: '5px' },
    mainGrid: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' },
    sectionTitle: { marginBottom: '20px', fontSize: '18px', fontWeight: '700', color: '#2d3436' },
    form: { display: 'flex', flexDirection: 'column', gap: '12px' },
    input: { padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', fontSize: '14px' },
    primaryBtn: { padding: '12px', background: '#0984e3', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' },
    taskCard: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(255,255,255,0.5)', padding: '15px', borderRadius: '12px',
        marginBottom: '12px', border: '1px solid rgba(255,255,255,0.3)'
    },
    badge: (status) => ({
        display: 'inline-block', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '800',
        background: status === 'Done' ? '#55efc4' : '#ffeaa7', color: status === 'Done' ? '#00b894' : '#d6a01d'
    }),
    actionBtn: (bg) => ({
        background: bg, color: '#fff', border: 'none', borderRadius: '8px',
        width: '35px', height: '35px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
    })
};

export default Dashboard;