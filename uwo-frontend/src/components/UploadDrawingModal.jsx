import React, { useState, useRef } from 'react';
import { X, UploadSimple, FilePdf, CheckCircle, Warning, Trash, Blueprint, CaretDown } from '@phosphor-icons/react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const UploadDrawingModal = ({ onClose, projects, onSuccess }) => {
    const [formData, setFormData] = useState({
        drawingName: '',
        drawingNumber: '',
        revision: 'R0',
        projectId: '',
        discipline: '',
        drawingType: '',
        description: ''
    });

    const [files, setFiles] = useState([]);         // File objects for display
    const [fileData, setFileData] = useState([]);   // base64 data for sending
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);     // 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const disciplines = ['Structural', 'Architectural', 'MEP', 'Civil', 'Geotechnical', 'Electrical', 'Plumbing'];
    const drawingTypes = ['Plan', 'Section', 'Elevation', 'Detail', 'Isometric', 'Site Layout', 'Foundation', 'Beam/Column Schedule'];
    const revisions = ['R0', 'R1', 'R2', 'R3', 'R4', 'Final'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const processFiles = (newFiles) => {
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFiles(prev => [...prev, file]);
                setFileData(prev => [...prev, {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: reader.result
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);
        processFiles(selected);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = Array.from(e.dataTransfer.files);
        processFiles(dropped);
    };

    const removeFile = (idx) => {
        setFiles(prev => prev.filter((_, i) => i !== idx));
        setFileData(prev => prev.filter((_, i) => i !== idx));
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getIcon = (type) => {
        if (type === 'application/pdf') return '📄';
        if (type.startsWith('image/')) return '🖼️';
        if (type.includes('dwg') || type.includes('dxf') || type.includes('autocad')) return '📐';
        return '📎';
    };

    const handleSubmit = async () => {
        if (!formData.drawingName.trim()) { setErrorMsg('Please enter the Drawing Name.'); setStatus('error'); return; }
        if (!formData.projectId) { setErrorMsg('Please select a Project.'); setStatus('error'); return; }
        if (files.length === 0) { setErrorMsg('Please attach at least one drawing file.'); setStatus('error'); return; }

        setLoading(true);
        setStatus(null);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const payload = {
                title: `[Drawing Upload] ${formData.drawingName}${formData.drawingNumber ? ` — ${formData.drawingNumber}` : ''}`,
                issueType: 'Drawing / Design Clarification',
                message: formData.description?.trim() || `Drawing uploaded: ${formData.drawingName}`,
                userId: user?.id,
                email: user?.email,
                projectName: projects.find(p => p._id === formData.projectId)?.name || '',
                category: 'Drawing',
                priority: 'Normal',
                relatedTo: `${formData.discipline} — ${formData.drawingType} | Rev: ${formData.revision}`,
                attachments: fileData.map(f => f.name),
                status: 'Submitted'
            };

            await axios.post(`${API_BASE_URL}/support`, payload);
            setStatus('success');
            setTimeout(() => {
                onSuccess && onSuccess();
                onClose();
            }, 1800);
        } catch (err) {
            setErrorMsg(err?.response?.data || 'Upload failed. Please try again.');
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '11px 14px', borderRadius: '12px',
        border: '1px solid #e2e8f0', fontSize: '0.88rem', outline: 'none',
        background: 'white', color: '#1e293b', boxSizing: 'border-box'
    };
    const selectWrap = { position: 'relative' };
    const caretStyle = { position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' };
    const labelStyle = { display: 'block', fontSize: '0.81rem', fontWeight: 700, color: '#334155', marginBottom: '6px' };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(6px)'
        }}>
            <div style={{
                width: '760px', maxHeight: '92vh', background: 'white', borderRadius: '24px',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 32px 64px -12px rgba(0,0,0,0.3)', overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Blueprint size={22} weight="fill" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Upload Drawing</h2>
                            <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.77rem' }}>Submit technical drawings for project review</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                        <X size={17} weight="bold" />
                    </button>
                </div>

                {/* Status Banners */}
                {status === 'success' && (
                    <div style={{ padding: '13px 24px', background: '#dcfce7', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '10px', color: '#15803d', fontWeight: 700, fontSize: '0.88rem', flexShrink: 0 }}>
                        <CheckCircle size={20} weight="fill" /> Drawing submitted for review! Closing...
                    </div>
                )}
                {status === 'error' && (
                    <div style={{ padding: '13px 24px', background: '#fef2f2', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626', fontWeight: 700, fontSize: '0.88rem', flexShrink: 0 }}>
                        <Warning size={20} weight="fill" /> {errorMsg}
                    </div>
                )}

                {/* Scrollable Body */}
                <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', flex: 1 }}>

                    {/* Row 1: Drawing Name & Number */}
                    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Drawing Name / Title <span style={{ color: '#dc2626' }}>*</span></label>
                            <input type="text" name="drawingName" value={formData.drawingName} onChange={handleChange}
                                placeholder="e.g. Foundation Plan — Block A" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Drawing Number</label>
                            <input type="text" name="drawingNumber" value={formData.drawingNumber} onChange={handleChange}
                                placeholder="e.g. STR-FDN-001" style={inputStyle} />
                        </div>
                    </div>

                    {/* Row 2: Project, Revision */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Project <span style={{ color: '#dc2626' }}>*</span></label>
                            <div style={selectWrap}>
                                <select name="projectId" value={formData.projectId} onChange={handleChange}
                                    style={{ ...inputStyle, appearance: 'none' }}>
                                    <option value="" disabled>Select Project</option>
                                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                                <CaretDown size={14} style={caretStyle} />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Discipline</label>
                            <div style={selectWrap}>
                                <select name="discipline" value={formData.discipline} onChange={handleChange}
                                    style={{ ...inputStyle, appearance: 'none' }}>
                                    <option value="">Select Discipline</option>
                                    {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <CaretDown size={14} style={caretStyle} />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Revision</label>
                            <div style={selectWrap}>
                                <select name="revision" value={formData.revision} onChange={handleChange}
                                    style={{ ...inputStyle, appearance: 'none' }}>
                                    {revisions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <CaretDown size={14} style={caretStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Drawing Type & Description */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Drawing Type</label>
                            <div style={selectWrap}>
                                <select name="drawingType" value={formData.drawingType} onChange={handleChange}
                                    style={{ ...inputStyle, appearance: 'none' }}>
                                    <option value="">Select Type</option>
                                    {drawingTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <CaretDown size={14} style={caretStyle} />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Description / Notes</label>
                            <input type="text" name="description" value={formData.description} onChange={handleChange}
                                placeholder="e.g. Revised footing dimensions per soil test report dated Feb 2026" style={inputStyle} />
                        </div>
                    </div>

                    {/* Drag & Drop Upload Zone */}
                    <div>
                        <label style={labelStyle}>Drawing Files <span style={{ color: '#dc2626' }}>*</span> <span style={{ fontWeight: 400, color: '#94a3b8' }}> (.pdf, .dwg, .dxf, .png, .jpg)</span></label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.tiff,.svg"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="drawing-upload-input"
                        />
                        <label
                            htmlFor="drawing-upload-input"
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                gap: '10px', padding: '32px 20px', borderRadius: '16px',
                                border: `2px dashed ${dragOver ? '#dc2626' : '#fca5a5'}`,
                                background: dragOver ? '#fff1f1' : '#fff8f8',
                                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
                            }}
                        >
                            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <UploadSimple size={26} color="#dc2626" weight="bold" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                                    {dragOver ? 'Drop files here' : 'Click or Drag & Drop to Upload'}
                                </div>
                                <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px' }}>
                                    Supports PDF, DWG, DXF, PNG, JPG — Multiple files allowed
                                </div>
                            </div>
                        </label>

                        {/* File List */}
                        {files.length > 0 && (
                            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {files.map((file, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                        <span style={{ fontSize: '1.3rem' }}>{getIcon(file.type)}</span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                                            <div style={{ fontSize: '0.73rem', color: '#64748b' }}>{formatSize(file.size)}</div>
                                        </div>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#dcfce7', color: '#15803d' }}>Ready</span>
                                        <button type="button" onClick={() => removeFile(idx)} style={{ background: '#fef2f2', border: 'none', borderRadius: '7px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#dc2626', flexShrink: 0 }}>
                                            <Trash size={14} weight="bold" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} ready to upload` : 'No files selected yet'}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={onClose}
                            style={{ padding: '11px 22px', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                padding: '11px 26px', borderRadius: '12px',
                                background: loading ? '#fca5a5' : '#dc2626',
                                color: 'white', border: 'none', fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: '9px',
                                boxShadow: '0 4px 14px rgba(220,38,38,0.35)'
                            }}>
                            {loading
                                ? <><span style={{ width: '15px', height: '15px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Uploading...</>
                                : <><UploadSimple size={19} weight="bold" /> Upload Drawing</>
                            }
                        </button>
                    </div>
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default UploadDrawingModal;
