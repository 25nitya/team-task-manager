import React, { useEffect, useState } from 'react';
import API from './api';

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, completed: 0, overdue: 0 });
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [newProject, setNewProject] = useState({ name: '', description: '', members: [] });
    const [newTask, setNewTask] = useState({ title: '', description: '', project: '', assignedTo: '', dueDate: '' });

    useEffect(() => {
        fetchStats();
        fetchProjects();
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchStats = () => {
        API.get('/tasks/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error("API Error:", err));
    };

    const fetchProjects = () => {
        API.get('/projects')
            .then(res => setProjects(res.data))
            .catch(err => console.error("API Error:", err));
    };

    const fetchTasks = () => {
        API.get('/tasks')
            .then(res => setTasks(res.data))
            .catch(err => console.error("API Error:", err));
    };

    const fetchUsers = () => {
        API.get('/auth/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error("API Error:", err));
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await API.post('/projects', newProject);
            setNewProject({ name: '', description: '', members: [] });
            fetchProjects();
        } catch (err) {
            alert('Failed to create project');
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await API.post('/tasks', newTask);
            setNewTask({ title: '', description: '', project: '', assignedTo: '', dueDate: '' });
            fetchTasks();
            fetchStats();
        } catch (err) {
            alert('Failed to create task');
        }
    };

    const handleStatusChange = async (taskId, status) => {
        try {
            await API.patch(`/tasks/${taskId}`, { status });
            fetchTasks();
            fetchStats();
        } catch (err) {
            alert('Failed to update task');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Team Task Manager</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                <button onClick={() => setActiveTab('projects')}>Projects</button>
                <button onClick={() => setActiveTab('tasks')}>Tasks</button>
            </div>

            {activeTab === 'dashboard' && (
                <div>
                    <h2>Dashboard</h2>
                    <p>Total Tasks: {stats.total}</p>
                    <p>Completed: {stats.completed}</p>
                    <p>Overdue: {stats.overdue}</p>
                </div>
            )}

            {activeTab === 'projects' && (
                <div>
                    <h2>Projects</h2>
                    <form onSubmit={handleCreateProject} style={{ marginBottom: '20px' }}>
                        <input type="text" placeholder="Project Name" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} required />
                        <input type="text" placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
                        <select multiple value={newProject.members} onChange={(e) => setNewProject({ ...newProject, members: Array.from(e.target.selectedOptions, option => option.value) })}>
                            {users.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                        </select>
                        <button type="submit">Create Project</button>
                    </form>
                    <ul>
                        {projects.map(project => (
                            <li key={project._id}>
                                <h3>{project.name}</h3>
                                <p>{project.description}</p>
                                <p>Admin: {project.admin.name}</p>
                                <p>Members: {project.members.map(m => m.name).join(', ')}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'tasks' && (
                <div>
                    <h2>Tasks</h2>
                    <form onSubmit={handleCreateTask} style={{ marginBottom: '20px' }}>
                        <input type="text" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                        <input type="text" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
                        <select value={newTask.project} onChange={(e) => setNewTask({ ...newTask, project: e.target.value })} required>
                            <option value="">Select Project</option>
                            {projects.map(project => <option key={project._id} value={project._id}>{project.name}</option>)}
                        </select>
                        <select value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}>
                            <option value="">Assign to</option>
                            {users.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                        </select>
                        <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
                        <button type="submit">Create Task</button>
                    </form>
                    <ul>
                        {tasks.map(task => (
                            <li key={task._id}>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p>Project: {task.project.name}</p>
                                <p>Assigned to: {task.assignedTo ? task.assignedTo.name : 'Unassigned'}</p>
                                <p>Status: {task.status}</p>
                                <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                                <select value={task.status} onChange={(e) => handleStatusChange(task._id, e.target.value)}>
                                    <option value="Todo">Todo</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;