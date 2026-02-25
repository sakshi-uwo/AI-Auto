import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, CheckCircle, Clock, Plus, Trash, Warning } from '@phosphor-icons/react';
import { milestoneService } from '../services/api';
import socketService from '../services/socket';

const MilestoneManagementModal = ({ project, onClose }) => {
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMilestone, setNewMilestone] = useState({
        title: '',
        date: '',
        status: 'Upcoming',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (project?._id) {
            fetchMilestones();
        }

        const handleMilestoneUpdate = (updated) => {
            if (updated.projectId === project._id) {
                fetchMilestones();
            }
        };

        socketService.on('milestoneUpdated', handleMilestoneUpdate);
        return () => socketService.off('milestoneUpdated', handleMilestoneUpdate);
    }, [project?._id]);

    const fetchMilestones = async () => {
        try {
            setLoading(true);
            const data = await milestoneService.getByProject(project._id);
            setMilestones(data);
        } catch (error) {
            console.error("Error fetching milestones:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMilestone = async (e) => {
        e.preventDefault();
        if (!newMilestone.title || !newMilestone.date) return;

        try {
            setIsSubmitting(true);
            await milestoneService.create({
                ...newMilestone,
                projectId: project._id
            });
            setNewMilestone({ title: '', date: '', status: 'Upcoming', description: '' });
            fetchMilestones();
        } catch (error) {
            console.error("Error creating milestone:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle size={20} color="#10b981" weight="fill" />;
            case 'In Progress': return <Clock size={20} color="#3b82f6" weight="fill" />;
            case 'Delayed': return <Warning size={20} color="#ef4444" weight="fill" />;
            default: return <Flag size={20} color="#94a3b8" weight="fill" />;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return { bg: '#ecfdf5', color: '#065f46' };
            case 'In Progress': return { bg: '#eff6ff', color: '#1e40af' };
            case 'Delayed': return { bg: '#fef2f2', color: '#991b1b' };
            default: return { bg: '#f8fafc', color: '#475569' };
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200, backdropFilter: 'blur(10px)' }}>
            <div style={{ width: '800px', height: '80vh', background: 'white', borderRadius: '32px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ padding: '2rem', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--pivot-blue-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pivot-blue)' }}>
                            <Flag size={28} weight="fill" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Project Milestones</h2>
                            <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Project: {project.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#f8fafc', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                        <X size={20} weight="bold" />
                    </button>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', overflow: 'hidden' }}>

                    {/* List of Milestones */}
                    <div style={{ padding: '2rem', overflowY: 'auto', borderRight: '1px solid #f1f5f9' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Current Timeline <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px', color: '#64748b' }}>{milestones.length}</span>
                        </h3>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading timeline...</div>
                        ) : milestones.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                                <Flag size={40} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                <p style={{ color: '#64748b', fontWeight: 600, margin: 0 }}>No milestones defined for this project.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                                {/* Vertical Line */}
                                <div style={{ position: 'absolute', left: '10px', top: '10px', bottom: '10px', width: '2px', background: '#f1f5f9' }}></div>

                                {milestones.map((m, idx) => (
                                    <div key={idx} style={{ position: 'relative', paddingLeft: '2.5rem' }}>
                                        <div style={{ position: 'absolute', left: '0', top: '5px', width: '22px', height: '22px', borderRadius: '50%', background: 'white', border: '2px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusStyle(m.status).color }}></div>
                                        </div>
                                        <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{m.title}</h4>
                                                <span style={{
                                                    fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
                                                    background: getStatusStyle(m.status).bg, color: getStatusStyle(m.status).color
                                                }}>
                                                    {m.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem', marginBottom: '8px' }}>
                                                <Calendar size={16} />
                                                <span>{new Date(m.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            {m.description && <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>{m.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add Milestone Form */}
                    <div style={{ padding: '2rem', background: '#f8fafc', overflowY: 'auto' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>Add New Milestone</h3>
                        <form onSubmit={handleAddMilestone} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Milestone Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Ground Floor Completion"
                                    value={newMilestone.title}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Target Date</label>
                                <input
                                    type="date"
                                    required
                                    value={newMilestone.date}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Initial Status</label>
                                <select
                                    value={newMilestone.status}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, status: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', background: 'white' }}
                                >
                                    <option value="Upcoming">Upcoming</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Delayed">Delayed</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Description (Optional)</label>
                                <textarea
                                    rows="3"
                                    placeholder="Brief details about this milestone..."
                                    value={newMilestone.description}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', resize: 'none' }}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    marginTop: '1rem', padding: '14px', borderRadius: '16px', background: 'var(--pivot-blue)',
                                    color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    opacity: isSubmitting ? 0.7 : 1
                                }}
                            >
                                <Plus size={20} weight="bold" />
                                {isSubmitting ? 'Creating...' : 'Add Milestone'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '1.5rem 2rem', background: 'white', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '10px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default MilestoneManagementModal;
