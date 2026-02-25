import React, { useState, useRef } from 'react';
import { X, Megaphone, CaretDown, CheckCircle, Paperclip, Warning, FloppyDisk, Calendar, Trash, File } from '@phosphor-icons/react';

const RaiseRequestModal = ({ onClose, onSave, projects }) => {
    const [formData, setFormData] = useState({
        requestType: '',
        title: '',
        projectId: '',
        location: '',
        relatedTask: '',
        priority: 'Normal',
        message: '',
        attachments: [],        // stores File objects for display
        attachmentData: [],     // stores base64 strings for sending
        standardsReference: '',
        requestedAction: '',
        assignTo: '',
        expectedTimeline: '',
        impactIfDelayed: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [errorMsg, setErrorMsg] = useState('');
    const fileInputRef = useRef(null);

    const requestTypes = [
        'Material Request',
        'Drawing / Design Clarification',
        'Technical Approval',
        'Site Instruction',
        'Inspection Request',
        'Change Request (Design / Scope)',
        'Safety Action Request',
        'Resource / Equipment Request'
    ];

    const actions = ['Approval', 'Review', 'On-site action', 'Procurement', 'Schedule change'];
    const assignees = ['Builder', 'Admin', 'Procurement', 'Safety Officer', 'Site Manager'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Convert each selected file to base64 and store both for display & sending
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length === 0) return;

        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, file],
                    attachmentData: [...prev.attachmentData, {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        data: reader.result  // base64 string: "data:image/png;base64,..."
                    }]
                }));
            };
            reader.readAsDataURL(file);
        });

        // Reset input so same file can be re-added if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
            attachmentData: prev.attachmentData.filter((_, i) => i !== index)
        }));
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return '🖼️';
        if (type === 'application/pdf') return '📄';
        if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
        if (type.includes('word') || type.includes('document')) return '📝';
        return '📎';
    };

    // Validate required fields; skip action/assignTo/timeline for Draft
    const validate = (isDraft) => {
        if (!formData.requestType) return 'Please select a Request Type.';
        if (!formData.title.trim()) return 'Please enter a Request Title.';
        if (!isDraft) {
            if (!formData.requestedAction) return 'Please select a Requested Action.';
            if (!formData.assignTo) return 'Please select an Assignee.';
            if (!formData.expectedTimeline) return 'Please set an Expected Timeline.';
        }
        return null;
    };

    const handleSubmit = async (isDraft = false) => {
        const validationError = validate(isDraft);
        if (validationError) {
            setErrorMsg(validationError);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus(null), 4000);
            return;
        }

        setLoading(true);
        setSubmitStatus(null);

        try {
            await onSave({
                ...formData,
                attachments: formData.attachmentData,   // pass base64 file data
                status: isDraft ? 'Draft' : 'Submitted'
            });
            setSubmitStatus('success');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setErrorMsg(err?.response?.data || 'Submission failed. Please try again.');
            setSubmitStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px', borderRadius: '12px',
        border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none',
        boxSizing: 'border-box', background: 'white', color: '#1e293b'
    };

    const selectWrap = { position: 'relative' };
    const caretStyle = { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' };
    const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '7px' };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(6px)'
        }}>
            <div style={{
                width: '820px', maxHeight: '92vh', background: 'white', borderRadius: '24px',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 32px 64px -12px rgba(0,0,0,0.3)', overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.25rem 2rem', background: 'white', borderBottom: '1px solid #e2e8f0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Megaphone size={22} weight="fill" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Raise Request</h2>
                            <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.78rem' }}>Technical submission for project precision</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                        <X size={17} weight="bold" />
                    </button>
                </div>

                {/* Success Banner */}
                {submitStatus === 'success' && (
                    <div style={{ padding: '14px 24px', background: '#dcfce7', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '10px', color: '#15803d', fontWeight: 700, fontSize: '0.9rem' }}>
                        <CheckCircle size={22} weight="fill" />
                        Request submitted successfully! Closing...
                    </div>
                )}

                {/* Error Banner */}
                {submitStatus === 'error' && (
                    <div style={{ padding: '14px 24px', background: '#fef2f2', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626', fontWeight: 700, fontSize: '0.9rem' }}>
                        <Warning size={22} weight="fill" />
                        {errorMsg}
                    </div>
                )}

                {/* Scrollable Body */}
                <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', flex: 1 }}>

                    {/* Row 1: Request Type & Priority */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Request Type <span style={{ color: '#dc2626' }}>*</span></label>
                            <div style={selectWrap}>
                                <select name="requestType" value={formData.requestType} onChange={handleChange}
                                    style={{ ...inputStyle, appearance: 'none' }}>
                                    <option value="" disabled>Select Type</option>
                                    {requestTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <CaretDown size={15} style={caretStyle} />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Priority & Urgency <span style={{ color: '#dc2626' }}>*</span></label>
                            <div style={selectWrap}>
                                <select name="priority" value={formData.priority} onChange={handleChange}
                                    style={{
                                        ...inputStyle, appearance: 'none',
                                        border: `1px solid ${formData.priority === 'Critical' ? '#dc2626' : '#e2e8f0'}`,
                                        background: formData.priority === 'Critical' ? '#fef2f2' : 'white',
                                        color: formData.priority === 'Critical' ? '#dc2626' : '#1e293b',
                                        fontWeight: formData.priority === 'Critical' ? 700 : 500
                                    }}>
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                    <option value="Critical">🔴 Critical (Instant Alert)</option>
                                </select>
                                <CaretDown size={15} style={caretStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Title */}
                    <div>
                        <label style={labelStyle}>Request Title <span style={{ color: '#dc2626' }}>*</span></label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange}
                            placeholder="e.g. Additional reinforcement required in slab – Block B"
                            style={inputStyle} />
                    </div>

                    {/* Row 3: Project & Location */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Project</label>
                            <div style={selectWrap}>
                                <select name="projectId" value={formData.projectId} onChange={handleChange}
                                    style={{ ...inputStyle, appearance: 'none' }}>
                                    <option value="">Select Project</option>
                                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                                <CaretDown size={15} style={caretStyle} />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Block / Floor / Zone</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange}
                                placeholder="e.g. Block A, 4th Floor" style={inputStyle} />
                        </div>
                    </div>

                    {/* Row 4: Standards & Related Task */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Standards / Compliance Ref <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Optional)</span></label>
                            <input type="text" name="standardsReference" value={formData.standardsReference} onChange={handleChange}
                                placeholder="IS code, SOP number, or Safety regulation" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Related Task / Activity</label>
                            <input type="text" name="relatedTask" value={formData.relatedTask} onChange={handleChange}
                                placeholder="e.g. Slab Casting, Column Reinforcement" style={inputStyle} />
                        </div>
                    </div>

                    {/* Row 5: Action & Assign To */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Requested Action <span style={{ color: '#dc2626' }}>*</span></label>
                            <div style={selectWrap}>
                                <select name="requestedAction" value={formData.requestedAction} onChange={handleChange}
                                    style={{ ...inputStyle, appearance: 'none' }}>
                                    <option value="" disabled>Select Action</option>
                                    {actions.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                <CaretDown size={15} style={caretStyle} />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Assign To <span style={{ color: '#dc2626' }}>*</span></label>
                            <div style={selectWrap}>
                                <select name="assignTo" value={formData.assignTo} onChange={handleChange}
                                    style={{ ...inputStyle, appearance: 'none' }}>
                                    <option value="" disabled>Select Assignee</option>
                                    {assignees.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                <CaretDown size={15} style={caretStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Row 6: Timeline & Description */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Expected Timeline <span style={{ color: '#dc2626' }}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <input type="date" name="expectedTimeline" value={formData.expectedTimeline} onChange={handleChange}
                                    style={{ ...inputStyle, paddingRight: '40px' }} />
                                <Calendar size={17} style={{ ...caretStyle, pointerEvents: 'none' }} />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Impact if Delayed</label>
                            <input type="text" name="impactIfDelayed" value={formData.impactIfDelayed} onChange={handleChange}
                                placeholder="e.g. 2-day delay, cost overrun..." style={inputStyle} />
                        </div>
                    </div>

                    {/* Detailed Explanation */}
                    <div>
                        <label style={labelStyle}>Detailed Explanation</label>
                        <textarea name="message" value={formData.message} onChange={handleChange}
                            rows="4" placeholder="Current issue, Technical reasoning, Drawing/Code references..."
                            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6', minHeight: '100px' }}
                        ></textarea>
                    </div>

                    {/* Attachments */}
                    <div>
                        <label style={labelStyle}>Attachments & References</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.dwg,.png,.jpg,.jpeg,.xlsx,.xls,.doc,.docx,.csv,.zip"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="file-upload-input"
                        />
                        <label htmlFor="file-upload-input" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            width: '100%', padding: '14px', borderRadius: '12px',
                            border: '2px dashed #93c5fd', background: '#eff6ff',
                            color: '#2563eb', fontSize: '0.88rem', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s', boxSizing: 'border-box'
                        }}>
                            <Paperclip size={20} weight="bold" />
                            Click to attach Drawings, Photos, Reports, Calc Sheets
                            <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.78rem' }}>(.pdf, .dwg, .jpg, .xlsx, .doc, .zip)</span>
                        </label>

                        {/* File List */}
                        {formData.attachments.length > 0 && (
                            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {formData.attachments.map((file, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '10px 14px', background: '#f8fafc', borderRadius: '10px',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <span style={{ fontSize: '1.2rem' }}>{getFileIcon(file.type)}</span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {file.name}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{formatFileSize(file.size)}</div>
                                        </div>
                                        <button type="button" onClick={() => removeFile(idx)} style={{
                                            background: '#fef2f2', border: 'none', borderRadius: '8px',
                                            width: '30px', height: '30px', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', cursor: 'pointer', color: '#dc2626', flexShrink: 0
                                        }}>
                                            <Trash size={15} weight="bold" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Critical Priority Alert */}
                    {formData.priority === 'Critical' && (
                        <div style={{
                            padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca',
                            borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px',
                            color: '#991b1b', fontSize: '0.85rem', fontWeight: 600
                        }}>
                            <Warning size={20} weight="fill" />
                            CRITICAL PRIORITY: An instant alert will be sent to Project Admin and Builder upon submission.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1.25rem 2rem', borderTop: '1px solid #e2e8f0',
                    display: 'flex', justifyContent: 'flex-end', gap: '1rem',
                    background: '#f8fafc', flexShrink: 0
                }}>
                    <button type="button" onClick={onClose}
                        style={{ padding: '11px 22px', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit(true)}
                        disabled={loading}
                        style={{
                            padding: '11px 22px', borderRadius: '12px', background: loading ? '#e2e8f0' : '#f1f5f9',
                            border: '1px solid #e2e8f0', color: '#475569', fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                        <FloppyDisk size={19} weight="bold" />
                        {loading ? 'Saving...' : 'Save as Draft'}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit(false)}
                        disabled={loading}
                        style={{
                            padding: '11px 24px', borderRadius: '12px',
                            background: loading ? '#93c5fd' : '#2563eb',
                            color: 'white', border: 'none', fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
                        }}>
                        {loading
                            ? <><span style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Submitting...</>
                            : <><CheckCircle size={20} weight="bold" /> Submit Request</>
                        }
                    </button>
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default RaiseRequestModal;
