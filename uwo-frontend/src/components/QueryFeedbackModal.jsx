
import React from 'react';
import { X, Check } from '@phosphor-icons/react';

const QueryFeedbackModal = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                background: 'white', borderRadius: '20px', width: '90%', maxWidth: '600px',
                padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Raise a Query / Feedback</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} color="#64748b" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Select Type */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Type</label>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            {['Query', 'Feedback', 'Suggestion', 'Complaint'].map(type => (
                                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: '#475569', cursor: 'pointer' }}>
                                    <input type="radio" name="type" value={type} defaultChecked={type === 'Query'} />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Related To & Project */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Related To</label>
                            <select name="relatedTo" style={inputStyle}>
                                <option>Project</option>
                                <option>Dashboard Feature</option>
                                <option>Automation Flow</option>
                                <option>Billing / Plan</option>
                                <option>Site Issue</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Project</label>
                            <select name="projectName" style={inputStyle}>
                                <option>Skyline Towers</option>
                                <option>Green Valley</option>
                                <option>Downtown Hts</option>
                            </select>
                        </div>
                    </div>

                    {/* Category & Priority */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Category</label>
                            <select name="category" style={inputStyle}>
                                <option>Technical</option>
                                <option>Planning</option>
                                <option>Schedule</option>
                                <option>Safety</option>
                                <option>Quality</option>
                                <option>Billing</option>
                                <option>General</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Priority</label>
                            <select name="priority" style={inputStyle}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </select>
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Message</label>
                        <input type="text" name="title" placeholder="Short description" style={{ ...inputStyle, marginBottom: '0.5rem' }} />
                        <textarea name="description" placeholder="Describe your issue or feedback clearly..." rows="4" style={{ ...inputStyle, resize: 'vertical' }}></textarea>
                    </div>

                    {/* Attachments (Visual Placeholder) */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Attachments</label>
                        <div style={{
                            border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '1rem',
                            textAlign: 'center', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', background: '#f8fafc'
                        }}>
                            Click or drag to upload photos, PDFs, or reports
                        </div>
                    </div>

                    {/* Optional Toggles */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}>
                            <input type="checkbox" name="callback" /> Request callback
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}>
                            <input type="checkbox" name="urgent" /> Mark as urgent
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}>
                            <input type="checkbox" name="aiSuggestion" defaultChecked /> Allow AI suggestion
                        </label>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white',
                            color: '#475569', fontWeight: 700, cursor: 'pointer'
                        }}>
                            Cancel
                        </button>
                        <button type="submit" style={{
                            padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--pivot-blue)',
                            color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}>
                            <Check size={18} weight="bold" /> Submit Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1',
    fontSize: '0.9rem', color: '#334155', outline: 'none'
};

export default QueryFeedbackModal;
