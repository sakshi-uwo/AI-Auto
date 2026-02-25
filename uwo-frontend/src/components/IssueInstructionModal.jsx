import React, { useState } from 'react';
import { X, CheckCircle, Warning, PaperPlaneRight, TextT, Tag, List, Calendar, MapPin, ClipboardText, Paperclip, Image, FileText, Book, UserCircle, Users, Clock, Bell, ArrowsClockwise, CurrencyDollar, GitBranch, Eye, ClockCounterClockwise } from '@phosphor-icons/react';

const IssueInstructionModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'Structural',
        priority: 'Medium',
        project: 'Saffron Greens',
        siteLocation: '',
        description: '',
        reason: '',
        reference: '',
        expectedOutcome: '',
        assignedTo: 'Site Manager',
        supportingTeam: '',
        approvalRequired: 'No',
        effectiveFrom: '',
        completionDate: '',
        validityPeriod: '30',
        autoReminders: true,
        complianceStatus: 'Pending',
        costImpact: 'No',
        timeImpact: 'No',
        createChangeRequest: false,
        autoNotification: true,
        escalationEnabled: true,
        autoStatusUpdate: true,
        logToReports: true
    });

    const [attachments, setAttachments] = useState({
        drawings: [],
        images: [],
        boq: [],
        standards: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("Issuing Instruction:", formData);
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, backdropFilter: 'blur(5px)' }}>
            <div style={{ width: '800px', maxHeight: '90vh', background: 'white', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ padding: '1.5rem 2rem', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--pivot-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Warning size={24} weight="fill" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Issue Site Instruction</h2>
                            <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.8rem' }}>Formal technical directive to site team</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                        <X size={18} weight="bold" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Section 1: Instruction Basic Details */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pivot-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--pivot-blue)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
                            Instruction Basic Details
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Instruction Title <span style={{ color: '#ef4444' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <TextT size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="e.g. Stop concreting at Block B due to rain"
                                        value={formData.title}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Instruction Type <span style={{ color: '#ef4444' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <Tag size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                                    >
                                        <option value="Structural">Structural</option>
                                        <option value="Architectural">Architectural</option>
                                        <option value="MEP">MEP</option>
                                        <option value="Quality">Quality</option>
                                        <option value="Safety">Safety</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Priority Level <span style={{ color: '#ef4444' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <Warning size={18} color={formData.priority === 'Critical' ? '#ef4444' : '#64748b'} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Related Project <span style={{ color: '#ef4444' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <List size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <select
                                        name="project"
                                        value={formData.project}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                                    >
                                        <option value="Saffron Greens">Saffron Greens</option>
                                        <option value="Metro Plaza">Metro Plaza</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Site / Block / Floor</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        name="siteLocation"
                                        placeholder="e.g. Block A, 4th Floor Slab"
                                        value={formData.siteLocation}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Issue Date</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        value={new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        disabled
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: '#f8fafc', color: '#64748b' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Instruction Description */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pivot-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--pivot-blue)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
                            Instruction Content
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Detailed Instruction <span style={{ color: '#ef4444' }}>*</span></label>
                                <textarea
                                    name="description"
                                    placeholder="Provide clear, step-by-step technical instructions..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '100px', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                                ></textarea>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Reason for Instruction</label>
                                <input
                                    type="text"
                                    name="reason"
                                    placeholder="e.g. Safety non-compliance observed, Design revision"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Reference (Drawing / BOQ ID)</label>
                                    <div style={{ position: 'relative' }}>
                                        <ClipboardText size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input
                                            type="text"
                                            name="reference"
                                            placeholder="e.g. DWG-102-R3"
                                            value={formData.reference}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Expected Outcome</label>
                                    <input
                                        type="text"
                                        name="expectedOutcome"
                                        placeholder="e.g. Rectification within 24 hours"
                                        value={formData.expectedOutcome}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Attachments & References */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pivot-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--pivot-blue)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>3</span>
                            Attachments & References
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {/* Drawings Upload */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    <FileText size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                    Drawings (PDF / DWG)
                                </label>
                                <div style={{
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    background: '#f8fafc',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--pivot-blue)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                                >
                                    <Paperclip size={24} color="#94a3b8" style={{ marginBottom: '8px' }} />
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Click to upload or drag & drop</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>PDF, DWG up to 10MB</div>
                                </div>
                            </div>

                            {/* Site Images Upload */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    <Image size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                    Marked-up Site Images
                                </label>
                                <div style={{
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    background: '#f8fafc',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--pivot-blue)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                                >
                                    <Image size={24} color="#94a3b8" style={{ marginBottom: '8px' }} />
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Click to upload or drag & drop</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>JPG, PNG up to 5MB each</div>
                                </div>
                            </div>

                            {/* BOQ References Upload */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    <ClipboardText size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                    BOQ References
                                </label>
                                <div style={{
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    background: '#f8fafc',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--pivot-blue)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                                >
                                    <Paperclip size={24} color="#94a3b8" style={{ marginBottom: '8px' }} />
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Click to upload or drag & drop</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>Excel, PDF up to 5MB</div>
                                </div>
                            </div>

                            {/* Code/IS Standards Upload */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    <Book size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                    Code / IS Standard References
                                </label>
                                <div style={{
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    background: '#f8fafc',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--pivot-blue)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                                >
                                    <Book size={24} color="#94a3b8" style={{ marginBottom: '8px' }} />
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Click to upload or drag & drop</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>PDF up to 10MB</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Target & Responsibility */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pivot-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--pivot-blue)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>4</span>
                            Target & Responsibility
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    Assigned To <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <UserCircle size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <select
                                        name="assignedTo"
                                        value={formData.assignedTo}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                                    >
                                        <option value="Site Manager">Site Manager</option>
                                        <option value="Supervisor">Supervisor</option>
                                        <option value="Contractor">Contractor</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    Approval Required?
                                </label>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '10px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="approvalRequired"
                                            value="Yes"
                                            checked={formData.approvalRequired === 'Yes'}
                                            onChange={handleChange}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Yes</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="approvalRequired"
                                            value="No"
                                            checked={formData.approvalRequired === 'No'}
                                            onChange={handleChange}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>No</span>
                                    </label>
                                </div>
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    Supporting Team <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#94a3b8' }}>(Optional)</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Users size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        name="supportingTeam"
                                        placeholder="e.g. Quality Team, Safety Officer"
                                        value={formData.supportingTeam}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Execution Timeline */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pivot-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--pivot-blue)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>5</span>
                            Execution Timeline
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    Effective From <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="date"
                                        name="effectiveFrom"
                                        value={formData.effectiveFrom}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    Expected Completion Date <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="date"
                                        name="completionDate"
                                        value={formData.completionDate}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    Instruction Validity Period (Days)
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Clock size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="number"
                                        name="validityPeriod"
                                        value={formData.validityPeriod}
                                        onChange={handleChange}
                                        placeholder="30"
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    Auto Reminders Before Due Date
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="autoReminders"
                                        checked={formData.autoReminders}
                                        onChange={(e) => setFormData(prev => ({ ...prev, autoReminders: e.target.checked }))}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                                        <Bell size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                        Enable reminder notifications
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Section 6: Compliance & Confirmation */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pivot-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--pivot-blue)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>6</span>
                            Compliance & Confirmation
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    Compliance Status
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <ArrowsClockwise size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <select
                                        name="complianceStatus"
                                        value={formData.complianceStatus}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    Acknowledge Instruction
                                </label>
                                <div style={{
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    background: '#f0f9ff',
                                    border: '1px solid #bae6fd',
                                    fontSize: '0.85rem',
                                    color: '#0369a1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <CheckCircle size={18} weight="fill" />
                                    Site team will confirm receipt
                                </div>
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    Completion Evidence Upload
                                </label>
                                <div style={{
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    background: '#f8fafc',
                                    cursor: 'pointer'
                                }}>
                                    <Paperclip size={24} color="#94a3b8" style={{ marginBottom: '8px' }} />
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Site team will upload completion proof here</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>Photos, reports, test certificates</div>
                                </div>
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <div style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: '#fef3c7',
                                    border: '1px solid #fde047',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <Warning size={20} color="#ca8a04" weight="fill" />
                                    <div style={{ fontSize: '0.85rem', color: '#854d0e' }}>
                                        <strong>Engineer Review & Closure:</strong> You will review completion evidence and mark this instruction as closed.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 7: Change Impact */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pivot-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--pivot-blue)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>7</span>
                            Change Impact (If Applicable)
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    Cost Impact
                                </label>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '10px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="costImpact"
                                            value="Yes"
                                            checked={formData.costImpact === 'Yes'}
                                            onChange={handleChange}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Yes</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="costImpact"
                                            value="No"
                                            checked={formData.costImpact === 'No'}
                                            onChange={handleChange}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>No</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    Time Impact
                                </label>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '10px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="timeImpact"
                                            value="Yes"
                                            checked={formData.timeImpact === 'Yes'}
                                            onChange={handleChange}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Yes</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="timeImpact"
                                            value="No"
                                            checked={formData.timeImpact === 'No'}
                                            onChange={handleChange}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>No</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                    Auto-Create Change Request
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="createChangeRequest"
                                        checked={formData.createChangeRequest}
                                        onChange={(e) => setFormData(prev => ({ ...prev, createChangeRequest: e.target.checked }))}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                                        <GitBranch size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                        Link to Change Request
                                    </span>
                                </label>
                            </div>
                        </div>

                        {(formData.costImpact === 'Yes' || formData.timeImpact === 'Yes') && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '12px',
                                borderRadius: '8px',
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <Warning size={20} color="#dc2626" weight="fill" />
                                <div style={{ fontSize: '0.85rem', color: '#991b1b' }}>
                                    This instruction has cost/time impact. Consider creating a formal Change Request for approval.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 8: Automation & Alerts */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pivot-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--pivot-blue)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>8</span>
                            Automation & Alerts
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '8px', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
                                <input
                                    type="checkbox"
                                    name="autoNotification"
                                    checked={formData.autoNotification}
                                    onChange={(e) => setFormData(prev => ({ ...prev, autoNotification: e.target.checked }))}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Bell size={18} color="var(--pivot-blue)" />
                                        Auto Notification to Site Team
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Instantly notify assigned personnel via email and app</div>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '8px', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
                                <input
                                    type="checkbox"
                                    name="escalationEnabled"
                                    checked={formData.escalationEnabled}
                                    onChange={(e) => setFormData(prev => ({ ...prev, escalationEnabled: e.target.checked }))}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Warning size={18} color="#f59e0b" />
                                        Escalation if Overdue
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Alert project manager if instruction is not completed by due date</div>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '8px', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
                                <input
                                    type="checkbox"
                                    name="autoStatusUpdate"
                                    checked={formData.autoStatusUpdate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, autoStatusUpdate: e.target.checked }))}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <ArrowsClockwise size={18} color="#10b981" />
                                        Auto Status Update on Task Completion
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Automatically mark as completed when evidence is uploaded</div>
                                </div>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '8px', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
                                <input
                                    type="checkbox"
                                    name="logToReports"
                                    checked={formData.logToReports}
                                    onChange={(e) => setFormData(prev => ({ ...prev, logToReports: e.target.checked }))}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={18} color="#8b5cf6" />
                                        Log into Global Reports
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Include this instruction in project compliance and audit reports</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Section 9: Instruction History & Audit Trail */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pivot-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--pivot-blue)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>9</span>
                            Instruction History & Audit Trail
                        </h3>

                        <div style={{
                            padding: '1.5rem',
                            borderRadius: '12px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Issued By</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                                        <UserCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                        Engineer Name (Auto-captured)
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Issue Timestamp</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                                        <ClockCounterClockwise size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                        {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div style={{ padding: '1.5rem 2rem', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleSubmit} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'var(--pivot-blue)', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        Issue Instruction & Notify Team
                        <PaperPlaneRight size={18} weight="fill" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IssueInstructionModal;
