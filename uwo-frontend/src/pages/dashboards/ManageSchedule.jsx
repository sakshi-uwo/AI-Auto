import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    X, Plus, Pencil, Calendar, List, ChartBar,
    TrendUp, CheckCircle, Clock, WarningCircle,
    CaretRight, ArrowsClockwise, User, MapPin,
    Tag, Timer, HardHat, Info, FloppyDisk,
    ArrowLeft, CaretLeft, PlusCircle, ArrowRight
} from '@phosphor-icons/react';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';

const CATEGORIES = ['Structural', 'Finishing', 'Inspection', 'Electrical', 'Plumbing', 'Other'];
const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed', 'Blocked', 'Delayed'];

const ManageSchedule = ({ setCurrentPage }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // list, calendar, gantt
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Timeline / Gantt State
    const [currentDate, setCurrentDate] = useState(new Date());
    const ganttContainerRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        task: '',
        category: 'Structural',
        locationArea: '',
        assignedTeam: 'General',
        startDate: new Date().toISOString().split('T')[0],
        duration: 1,
        priority: 'Medium',
        dependency: '',
    });

    useEffect(() => {
        fetchTasks();
        socketService.on('taskUpdated', fetchTasks);
        return () => socketService.off('taskUpdated');
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/tasks`);
            setTasks(res.data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/tasks`, formData);
            setShowAddTask(false);
            setFormData({
                task: '', category: 'Structural', locationArea: '',
                assignedTeam: 'General', startDate: new Date().toISOString().split('T')[0],
                duration: 1, priority: 'Medium', dependency: '',
            });
            fetchTasks();
        } catch (err) {
            alert('Error adding task');
        }
    };

    const handleUpdateTask = async (id, data) => {
        try {
            await axios.patch(`${API_BASE_URL}/tasks/${id}`, data);
            setEditingTask(null);
            fetchTasks();
        } catch (err) {
            alert('Error updating task');
        }
    };

    // Summary Stats
    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'Pending').length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        delayed: tasks.filter(t => t.status === 'Delayed' || t.status === 'Blocked').length,
    };

    // --- Calendar View Helpers ---
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const prevMonthDays = getDaysInMonth(year, month - 1);

        const days = [];
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ day: prevMonthDays - i, currentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
        }
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
        }

        const getTasksForDate = (date) => {
            return tasks.filter(t => {
                const start = new Date(t.startDate);
                start.setHours(0, 0, 0, 0);
                const end = t.endDate ? new Date(t.endDate) : new Date(start);
                if (!t.endDate) end.setDate(start.getDate() + (t.duration || 1) - 1);
                end.setHours(23, 59, 59, 999);
                const checkDate = new Date(date);
                checkDate.setHours(12, 0, 0, 0);
                return checkDate >= start && checkDate <= end;
            });
        };

        const getStatusStyles = (status) => {
            switch (status) {
                case 'Completed': return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
                case 'In Progress': return { bg: '#fffbeb', text: '#d97706', border: '#fef3c7' };
                case 'Delayed':
                case 'Blocked': return { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' };
                default: return { bg: '#eff6ff', text: '#3b82f6', border: '#dbeafe' };
            }
        };

        return (
            <div style={{ background: 'white' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} style={{ padding: '8px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '8px', cursor: 'pointer' }}><CaretLeft /></button>
                        <button onClick={() => setCurrentDate(new Date())} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>Today</button>
                        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} style={{ padding: '8px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '8px', cursor: 'pointer' }}><CaretRight /></button>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #f1f5f9' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} style={{ padding: '12px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', background: '#f8fafc', borderRight: '1px solid #f1f5f9' }}>{d.toUpperCase()}</div>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {days.map((d, i) => {
                        const dayTasks = getTasksForDate(d.date);
                        const isToday = d.date.toDateString() === new Date().toDateString();
                        return (
                            <div key={i} style={{
                                minHeight: '120px', padding: '10px', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9',
                                background: d.currentMonth ? 'white' : '#fcfdfe'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{
                                        fontSize: '0.9rem', fontWeight: 800,
                                        color: isToday ? 'white' : d.currentMonth ? '#1e293b' : '#94a3b8',
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isToday ? '#0047AB' : 'transparent'
                                    }}>
                                        {d.day}
                                    </span>
                                    {d.currentMonth && (
                                        <button onClick={() => { setFormData({ ...formData, startDate: d.date.toISOString().split('T')[0] }); setShowAddTask(true); }} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex' }}>
                                            <PlusCircle size={16} />
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {dayTasks.map(t => {
                                        const styles = getStatusStyles(t.status);
                                        return (
                                            <div key={t._id} onClick={() => setEditingTask(t)} style={{ padding: '6px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, background: styles.bg, color: styles.text, border: `1px solid ${styles.border}`, cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
                                                {t.task}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // --- Gantt View Helpers ---
    const renderGantt = () => {
        const DAY_WIDTH = 50;
        const timelineStartDate = new Date(currentDate);
        timelineStartDate.setDate(currentDate.getDate() - 5); // Start 5 days ago

        const timelineDays = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date(timelineStartDate);
            date.setDate(timelineStartDate.getDate() + i);
            timelineDays.push(date);
        }

        const getTaskOffsetAndWidth = (task) => {
            const start = new Date(task.startDate);
            const duration = task.duration || 1;
            const diffTime = start - timelineStartDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return {
                left: diffDays * DAY_WIDTH,
                width: duration * DAY_WIDTH
            };
        };

        return (
            <div style={{ background: 'white', position: 'relative' }}>
                <div style={{ display: 'flex' }}>
                    {/* Fixed Task List Column */}
                    <div style={{ width: '250px', borderRight: '1px solid #e2e8f0', flexShrink: 0, zIndex: 10, background: 'white' }}>
                        <div style={{ height: '50px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', padding: '0 1.5rem', display: 'flex', alignItems: 'center', fontWeight: 800, color: '#64748b', fontSize: '0.75rem' }}>TASKS</div>
                        {tasks.map(t => (
                            <div key={t._id} style={{ height: '60px', borderBottom: '1px solid #f8fafc', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.task}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{t.assignedTeam}</div>
                            </div>
                        ))}
                    </div>

                    {/* Scrollable Timeline Area */}
                    <div ref={ganttContainerRef} style={{ overflowX: 'auto', flex: 1 }}>
                        {/* Timeline Header */}
                        <div style={{ display: 'flex', height: '50px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            {timelineDays.map((date, i) => (
                                <div key={i} style={{
                                    width: `${DAY_WIDTH}px`, flexShrink: 0, borderRight: '1px solid #f1f5f9',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    background: date.toDateString() === new Date().toDateString() ? '#eff6ff' : 'transparent'
                                }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>{date.toLocaleDateString('default', { weekday: 'short' }).toUpperCase()}</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 900, color: date.toDateString() === new Date().toDateString() ? '#0047AB' : '#475569' }}>{date.getDate()}</div>
                                </div>
                            ))}
                        </div>

                        {/* Timeline Rows */}
                        <div style={{ position: 'relative', width: `${timelineDays.length * DAY_WIDTH}px` }}>
                            {/* Today Indicator Line */}
                            <div style={{
                                position: 'absolute', top: 0, bottom: 0,
                                left: `${Math.floor((new Date() - timelineStartDate) / (1000 * 60 * 60 * 24)) * DAY_WIDTH + (DAY_WIDTH / 2)}px`,
                                width: '2px', background: '#3b82f6', zIndex: 5, opacity: 0.5
                            }} />

                            {tasks.map(t => {
                                const { left, width } = getTaskOffsetAndWidth(t);
                                const isDelayed = t.status === 'Delayed' || t.status === 'Blocked';
                                return (
                                    <div key={t._id} style={{ height: '60px', borderBottom: '1px solid #f8fafc', position: 'relative' }}>
                                        <div
                                            onClick={() => setEditingTask(t)}
                                            style={{
                                                position: 'absolute', top: '15px', left: `${left}px`, width: `${width}px`, height: '30px',
                                                background: isDelayed ? '#fff1f2' : (t.status === 'Completed' ? '#f0fdf4' : '#eff6ff'),
                                                borderRadius: '8px', border: `1.5px solid ${isDelayed ? '#fecdd3' : (t.status === 'Completed' ? '#bbf7d0' : '#dbeafe')}`,
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '0 8px',
                                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', zIndex: 2
                                            }}
                                        >
                                            <div style={{
                                                position: 'absolute', inset: 0, width: `${t.progress}%`,
                                                background: isDelayed ? '#e11d4820' : (t.status === 'Completed' ? '#16a34a20' : '#0047AB20'),
                                                zIndex: -1
                                            }} />
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: isDelayed ? '#e11d48' : (t.status === 'Completed' ? '#16a34a' : '#0047AB'), whiteSpace: 'nowrap' }}>
                                                {t.progress}%
                                            </span>
                                        </div>

                                        {/* Dependency Line Rendering (Simple horizontal) */}
                                        {t.dependency && (
                                            <div style={{
                                                position: 'absolute', top: '30px', left: `${getTaskOffsetAndWidth({ startDate: t.dependency.startDate, duration: t.dependency.duration }).left + getTaskOffsetAndWidth({ startDate: t.dependency.startDate, duration: t.dependency.duration }).width}px`,
                                                width: `${left - (getTaskOffsetAndWidth({ startDate: t.dependency.startDate, duration: t.dependency.duration }).left + getTaskOffsetAndWidth({ startDate: t.dependency.startDate, duration: t.dependency.duration }).width)}px`,
                                                height: '2px', background: '#cbd5e1', zIndex: 1
                                            }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {/* Timeline Controls */}
                <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#eff6ff', border: '1px solid #dbeafe' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Planned</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f0fdf4', border: '1px solid #bbf7d0' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Completed</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#fff1f2', border: '1px solid #fecdd3' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Delayed / Risk</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => setCurrentPage('dashboard')} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}><ArrowLeft size={20} color="#64748b" /></button>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>Project Schedule Management</h2>
                        <p style={{ margin: 0, color: '#64748b', fontWeight: 600 }}>Track and manage task-level execution across the site</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '4px', display: 'flex' }}>
                        <button onClick={() => setView('list')} style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', background: view === 'list' ? 'white' : 'transparent', color: view === 'list' ? '#0047AB' : '#64748b', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><List size={18} /> List</button>
                        <button onClick={() => setView('calendar')} style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', background: view === 'calendar' ? 'white' : 'transparent', color: view === 'calendar' ? '#0047AB' : '#64748b', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={18} /> Calendar</button>
                        <button onClick={() => setView('gantt')} style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', background: view === 'gantt' ? 'white' : 'transparent', color: view === 'gantt' ? '#0047AB' : '#64748b', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><ChartBar size={18} /> Gantt</button>
                    </div>
                    <button onClick={() => setShowAddTask(true)} style={{ padding: '10px 20px', background: '#0047AB', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,71,171,0.2)' }}><Plus size={20} weight="bold" /> Add Task</button>
                </div>
            </div>

            {/* Summary Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Total Tasks', value: stats.total, color: '#0047AB', icon: <List /> },
                    { label: 'Pending', value: stats.pending, color: '#64748b', icon: <Clock /> },
                    { label: 'In Progress', value: stats.inProgress, color: '#3b82f6', icon: <ArrowsClockwise /> },
                    { label: 'Completed', value: stats.completed, color: '#16a34a', icon: <CheckCircle /> },
                    { label: 'Delayed', value: stats.delayed, color: '#dc2626', icon: <WarningCircle />, warning: stats.delayed > 0 },
                ].map((s, i) => (
                    <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {React.cloneElement(s.icon, { size: 24, weight: 'fill' })}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{s.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b' }}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content View */}
            <div style={{ background: 'white', borderRadius: '28px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                {view === 'list' ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <th style={{ textAlign: 'left', padding: '1.2rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>TASK NAME \ CATEGORY</th>
                                <th style={{ textAlign: 'left', padding: '1.2rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>LOCATION \ TEAM</th>
                                <th style={{ textAlign: 'left', padding: '1.2rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>TIMELINE</th>
                                <th style={{ textAlign: 'left', padding: '1.2rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>STATUS \ PROGRESS</th>
                                <th style={{ textAlign: 'right', padding: '1.2rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>{task.task}</div>
                                        <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><Tag size={12} weight="fill" color="#94a3b8" /> <span style={{ color: '#94a3b8', fontWeight: 700 }}>{task.category}</span></div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} color="#64748b" /> {task.locationArea || 'Site Wide'}</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginTop: '4px' }}>{task.assignedTeam}</div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{new Date(task.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} <CaretRight size={10} style={{ margin: '0 4px' }} /> {task.endDate ? new Date(task.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : `${task.duration || 1}d`}</div>
                                        {task.dependency && <div style={{ fontSize: '0.7rem', color: '#0047AB', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendUp size={12} /> After: {task.dependency.task}</div>}
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}><span style={{ fontSize: '0.7rem', fontWeight: 900, padding: '3px 8px', borderRadius: '6px', background: task.status === 'Completed' ? '#f0fdf4' : task.status === 'Delayed' ? '#fff1f2' : '#eff6ff', color: task.status === 'Completed' ? '#16a34a' : task.status === 'Delayed' ? '#e11d48' : '#3b82f6', textTransform: 'uppercase' }}>{task.status}</span> <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{task.progress}%</span></div>
                                        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: `${task.progress}%`, height: '100%', background: task.status === 'Completed' ? '#16a34a' : '#0047AB', borderRadius: '3px' }} /></div>
                                    </td>
                                    <td style={{ padding: '1.2rem', textAlign: 'right' }}><button onClick={() => setEditingTask(task)} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}><Pencil size={18} color="#0047AB" /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : view === 'calendar' ? (
                    renderCalendar()
                ) : (
                    renderGantt()
                )}
            </div>

            {/* Add Task Modal */}
            {showAddTask && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <form onSubmit={handleAddTask} style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ background: '#0047AB', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ color: 'white', margin: 0, fontWeight: 900 }}>Create New Task</h3>
                            <button type="button" onClick={() => setShowAddTask(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                        </div>
                        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                            <div style={{ gridColumn: 'span 2' }}><label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: '#64748b' }}>TASK NAME</label><input style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }} required value={formData.task} onChange={e => setFormData({ ...formData, task: e.target.value })} /></div>
                            <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: '#64748b' }}>CATEGORY</label><select style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                            <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: '#64748b' }}>LOCATION / AREA</label><input placeholder="e.g. Block A, Floor 2" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }} value={formData.locationArea} onChange={e => setFormData({ ...formData, locationArea: e.target.value })} /></div>
                            <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: '#64748b' }}>TEAM / CONTRACTOR</label><input style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }} value={formData.assignedTeam} onChange={e => setFormData({ ...formData, assignedTeam: e.target.value })} /></div>
                            <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: '#64748b' }}>DURATION (DAYS)</label><input type="number" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }} value={formData.duration} onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })} /></div>
                            <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: '#64748b' }}>START DATE</label><input type="date" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }} value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} /></div>
                            <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: '#64748b' }}>DEPENDENCY</label><select style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }} value={formData.dependency} onChange={e => setFormData({ ...formData, dependency: e.target.value })}><option value="">None</option>{tasks.map(t => <option key={t._id} value={t._id}>{t.task}</option>)}</select></div>
                        </div>
                        <div style={{ padding: '1.2rem 2rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}><button type="button" onClick={() => setShowAddTask(false)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button><button type="submit" style={{ padding: '10px 25px', border: 'none', background: '#0047AB', color: 'white', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Save Task</button></div>
                    </form>
                </div>
            )}

            {/* Edit / Update Progress Modal */}
            {editingTask && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ background: '#f1f5f9', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ color: '#0f172a', margin: 0, fontWeight: 900 }}>Update Progress</h3>
                            <button onClick={() => setEditingTask(null)} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                        </div>
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div><div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{editingTask.task}</div><div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{editingTask.locationArea} • {editingTask.assignedTeam}</div></div>
                            <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><label style={{ fontWeight: 800, fontSize: '0.8rem', color: '#64748b' }}>PROGRESS</label><span style={{ fontWeight: 900, color: '#0047AB' }}>{editingTask.progress}%</span></div><input type="range" min="0" max="100" value={editingTask.progress} onChange={e => setEditingTask({ ...editingTask, progress: Number(e.target.value) })} style={{ width: '100%', accentColor: '#0047AB' }} /></div>
                            <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: '#64748b' }}>STATUS</label><select style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }} value={editingTask.status} onChange={e => setEditingTask({ ...editingTask, status: e.target.value })}>{STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}</select></div>
                            <div><label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: '#64748b' }}>DAILY REMARK / NOTE</label><textarea placeholder="Add a comment or remark..." rows={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, resize: 'none', outline: 'none' }} value={editingTask.remark || ''} onChange={e => setEditingTask({ ...editingTask, remark: e.target.value })} /></div>
                        </div>
                        <div style={{ padding: '1.2rem 2rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}><button onClick={() => setEditingTask(null)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button><button onClick={() => handleUpdateTask(editingTask._id, editingTask)} style={{ padding: '10px 25px', border: 'none', background: '#0047AB', color: 'white', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><FloppyDisk weight="bold" size={18} /> Save Update</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSchedule;
