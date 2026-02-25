import React, { useState } from 'react';
import { X, Calendar, Buildings, Ruler, Wrench, Clock, CheckCircle } from '@phosphor-icons/react';

const ScheduleGenerationModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        projectType: 'Villa',
        floors: '',
        area: '',
        method: 'RCC',
        workingDays: 'Mon-Sat',
        workingHours: '8'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Handle schedule generation logic here
        console.log("Generating schedule with:", formData);
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, backdropFilter: 'blur(5px)' }}>
            <div style={{ width: '600px', background: 'white', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ padding: '1.5rem 2rem', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--pivot-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Calendar size={24} weight="fill" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Generate Schedule</h2>
                            <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.8rem' }}>AI-powered timeline creation</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                        <X size={18} weight="bold" />
                    </button>
                </div>

                {/* Form Content */}
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Project Start Date</label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Target End Date <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Optional)</span></label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Project Type</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['Villa', 'Apartment', 'Commercial'].map(type => (
                                <div
                                    key={type}
                                    onClick={() => setFormData(prev => ({ ...prev, projectType: type }))}
                                    style={{
                                        flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${formData.projectType === type ? 'var(--pivot-blue)' : '#e2e8f0'}`,
                                        background: formData.projectType === type ? '#eff6ff' : 'white', cursor: 'pointer', textAlign: 'center',
                                        fontSize: '0.9rem', fontWeight: formData.projectType === type ? 700 : 500, color: formData.projectType === type ? 'var(--pivot-blue)' : '#64748b',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                    }}
                                >
                                    <Buildings weight={formData.projectType === type ? 'fill' : 'regular'} />
                                    {type}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Number of Floors</label>
                            <input
                                type="number"
                                name="floors"
                                placeholder="e.g. 3"
                                value={formData.floors}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Total Area (Sq ft)</label>
                            <div style={{ position: 'relative' }}>
                                <Ruler size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="number"
                                    name="area"
                                    placeholder="e.g. 2400"
                                    value={formData.area}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Construction Method</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['RCC', 'Precast', 'Hybrid'].map(method => (
                                <div
                                    key={method}
                                    onClick={() => setFormData(prev => ({ ...prev, method: method }))}
                                    style={{
                                        flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${formData.method === method ? 'var(--pivot-blue)' : '#e2e8f0'}`,
                                        background: formData.method === method ? '#eff6ff' : 'white', cursor: 'pointer', textAlign: 'center',
                                        fontSize: '0.9rem', fontWeight: formData.method === method ? 700 : 500, color: formData.method === method ? 'var(--pivot-blue)' : '#64748b',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                    }}
                                >
                                    <Wrench weight={formData.method === method ? 'fill' : 'regular'} />
                                    {method}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Working Days</label>
                            <select
                                name="workingDays"
                                value={formData.workingDays}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                            >
                                <option value="Mon-Sat">Mon - Sat (6 Days)</option>
                                <option value="7 Days">Every Day (7 Days)</option>
                                <option value="Mon-Fri">Mon - Fri (5 Days)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Daily Working Hours</label>
                            <div style={{ position: 'relative' }}>
                                <Clock size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="number"
                                    name="workingHours"
                                    value={formData.workingHours}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '10px 20px', borderRadius: '10px', background: 'white', border: '1px solid #cbd5e1', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: '10px 20px', borderRadius: '10px', background: 'var(--pivot-blue)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <CheckCircle size={18} weight="bold" />
                        Generate Schedule
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ScheduleGenerationModal;
