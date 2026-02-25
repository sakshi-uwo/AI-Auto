import React, { useState } from 'react';
import { X, CheckCircle, UploadSimple, MapPin, Calendar, CurrencyDollar, Users, Robot, FileText, ShieldCheck, CaretDown, CaretRight } from '@phosphor-icons/react';

const CreateProjectModal = ({ onClose, onSave, project }) => {
    const [formData, setFormData] = useState({
        // 1. Basic Details
        projectName: project?.name || '',
        projectType: project?.projectType || 'Residential',
        description: project?.description || '',
        status: project?.status || 'Draft',
        priority: project?.priority || 'Medium',
        // 2. Client Info
        clientName: project?.clientInfo?.name || '',
        clientEmail: project?.clientInfo?.email || '',
        clientMobile: project?.clientInfo?.mobile || '',
        clientType: project?.clientInfo?.type || 'Individual',
        clientAccess: project?.clientInfo?.access ?? true,
        // 3. Location
        siteAddress: project?.location || '',
        city: project?.city || '',
        state: project?.state || '',
        country: project?.country || '',
        pincode: project?.pincode || '',
        geoLocation: project?.geoLocation || '',
        // ... rest stays the same or adapted as needed ...
        startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        estimatedCost: project?.budget?.replace(/[^0-9]/g, '') || '',
        currency: 'USD',
        paymentMode: 'Milestone-based',
        automationEnabled: project?.automation?.enabled || false,
    });

    const [activeSection, setActiveSection] = useState(1);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    const sectionHeaderStyle = {
        fontSize: '1rem', fontWeight: 800, color: 'var(--pivot-blue)', marginBottom: '1rem',
        display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9'
    };

    const inputGroupStyle = { marginBottom: '1rem' };
    const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' };
    const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600, color: '#334155' };
    const checkboxStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#334155', cursor: 'pointer', marginBottom: '8px' };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
            <div style={{ width: '900px', maxHeight: '90vh', background: 'white', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>

                {/* Header */}
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{project ? 'Edit Project' : 'Start New Project'}</h2>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>{project ? 'Update project details and settings.' : 'Configure all project details, teams, and automation settings.'}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                        <X size={20} weight="bold" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>

                    {/* Sidebar Navigation */}
                    <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '1rem' }}>
                        {[
                            { id: 1, label: 'Basic Details', icon: <FileText /> },
                            { id: 2, label: 'Client Information', icon: <Users /> },
                            { id: 3, label: 'Project Location', icon: <MapPin /> },
                            { id: 4, label: 'Timeline', icon: <Calendar /> },
                            { id: 5, label: 'Budget & Cost', icon: <CurrencyDollar /> },
                            { id: 6, label: 'Team Assignment', icon: <Users /> },
                            { id: 7, label: 'Automation', icon: <Robot /> },
                            { id: 8, label: 'Documents', icon: <UploadSimple /> },
                            { id: 9, label: 'Access & Visibility', icon: <ShieldCheck /> },
                            { id: 10, label: 'Review & Create', icon: <CheckCircle /> },
                        ].map(section => (
                            <div
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                style={{
                                    padding: '12px', borderRadius: '10px', cursor: 'pointer', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 700,
                                    background: activeSection === section.id ? 'var(--pivot-blue-soft)' : 'transparent',
                                    color: activeSection === section.id ? 'var(--pivot-blue)' : '#64748b',
                                    display: 'flex', alignItems: 'center', gap: '10px'
                                }}
                            >
                                {section.icon} {section.label}
                            </div>
                        ))}
                    </div>

                    {/* Form Content */}
                    <div>
                        {activeSection === 1 && (
                            <div>
                                <h3 style={sectionHeaderStyle}>1️⃣ Project Basic Details</h3>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>PROJECT NAME <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="e.g. Skyline Towers Phase 2" style={inputStyle} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', ...inputGroupStyle }}>
                                    <div>
                                        <label style={labelStyle}>PROJECT TYPE</label>
                                        <select name="projectType" value={formData.projectType} onChange={handleChange} style={inputStyle}>
                                            <option>Residential</option><option>Commercial</option><option>Villa</option><option>Apartment</option><option>Infrastructure</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>PROJECT PRIORITY</label>
                                        <select name="priority" value={formData.priority} onChange={handleChange} style={inputStyle}>
                                            <option>Low</option><option>Medium</option><option>High</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>PROJECT DESCRIPTION</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={{ ...inputStyle, resize: 'vertical' }} placeholder="Brief description of the project scope..." />
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>PROJECT STATUS</label>
                                    <input type="text" value="Draft (Will move to Active upon creation)" disabled style={{ ...inputStyle, background: '#f1f5f9', color: '#94a3b8' }} />
                                </div>
                            </div>
                        )}

                        {activeSection === 2 && (
                            <div>
                                <h3 style={sectionHeaderStyle}>2️⃣ Client Information</h3>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>CLIENT NAME</label>
                                    <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="e.g. John Doe" style={inputStyle} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', ...inputGroupStyle }}>
                                    <div>
                                        <label style={labelStyle}>CLIENT EMAIL</label>
                                        <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} placeholder="client@example.com" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>CLIENT MOBILE</label>
                                        <input type="text" name="clientMobile" value={formData.clientMobile} onChange={handleChange} placeholder="+1 234 567 890" style={inputStyle} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', ...inputGroupStyle }}>
                                    <div>
                                        <label style={labelStyle}>CLIENT TYPE</label>
                                        <select name="clientType" value={formData.clientType} onChange={handleChange} style={inputStyle}>
                                            <option>Individual</option><option>Company</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>DASHBOARD ACCESS</label>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                            <label style={checkboxStyle}><input type="radio" name="clientAccess" checked={formData.clientAccess === true} onChange={() => setFormData({ ...formData, clientAccess: true })} /> Yes</label>
                                            <label style={checkboxStyle}><input type="radio" name="clientAccess" checked={formData.clientAccess === false} onChange={() => setFormData({ ...formData, clientAccess: false })} /> No</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 3 && (
                            <div>
                                <h3 style={sectionHeaderStyle}>3️⃣ Project Location</h3>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>SITE ADDRESS</label>
                                    <input type="text" name="siteAddress" value={formData.siteAddress} onChange={handleChange} placeholder="123 Construction Ave" style={inputStyle} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', ...inputGroupStyle }}>
                                    <div>
                                        <label style={labelStyle}>CITY</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>STATE</label>
                                        <input type="text" name="state" value={formData.state} onChange={handleChange} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>COUNTRY</label>
                                        <input type="text" name="country" value={formData.country} onChange={handleChange} style={inputStyle} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', ...inputGroupStyle }}>
                                    <div>
                                        <label style={labelStyle}>PIN CODE</label>
                                        <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>GEO-LOCATION (OPTIONAL)</label>
                                        <input type="text" name="geoLocation" value={formData.geoLocation} onChange={handleChange} placeholder="Lat, Long" style={inputStyle} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 4 && (
                            <div>
                                <h3 style={sectionHeaderStyle}>4️⃣ Project Timeline</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', ...inputGroupStyle }}>
                                    <div>
                                        <label style={labelStyle}>START DATE</label>
                                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>EXPECTED END DATE</label>
                                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} style={inputStyle} />
                                    </div>
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>PROJECT PHASES</label>
                                    <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        {['Foundation', 'Structure', 'Finishing', 'Handover'].map(phase => (
                                            <div key={phase} style={{ display: 'inline-block', padding: '4px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.8rem', marginRight: '8px', marginBottom: '8px' }}>
                                                {phase}
                                            </div>
                                        ))}
                                        <button style={{ background: 'none', border: 'none', color: 'var(--pivot-blue)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>+ Add Phase</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 5 && (
                            <div>
                                <h3 style={sectionHeaderStyle}>5️⃣ Budget & Cost Setup</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', ...inputGroupStyle }}>
                                    <div>
                                        <label style={labelStyle}>ESTIMATED PROJECT COST</label>
                                        <input type="number" name="estimatedCost" value={formData.estimatedCost} onChange={handleChange} placeholder="0.00" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>CURRENCY</label>
                                        <select name="currency" value={formData.currency} onChange={handleChange} style={inputStyle}>
                                            <option>USD</option><option>EUR</option><option>INR</option><option>GBP</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>PAYMENT MODE</label>
                                    <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} style={inputStyle}>
                                        <option>Milestone-based</option><option>Time-based</option>
                                    </select>
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>INITIAL BOQ UPLOAD (OPTIONAL)</label>
                                    <input type="file" name="boqFile" onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>
                        )}

                        {activeSection === 6 && (
                            <div>
                                <h3 style={sectionHeaderStyle}>6️⃣ Team Assignment</h3>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>ASSIGN BUILDER / OWNER</label>
                                    <input type="text" name="builder" value={formData.builder} onChange={handleChange} placeholder="Search user..." style={inputStyle} />
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>ASSIGN CIVIL ENGINEER(S)</label>
                                    <input type="text" name="civilEngineer" value={formData.civilEngineer} onChange={handleChange} placeholder="Search user..." style={inputStyle} />
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>ASSIGN SITE MANAGER</label>
                                    <input type="text" name="siteManager" value={formData.siteManager} onChange={handleChange} placeholder="Search user..." style={inputStyle} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', ...inputGroupStyle }}>
                                    <div>
                                        <label style={labelStyle}>ASSIGN QC (OPTIONAL)</label>
                                        <input type="text" name="qc" value={formData.qc} onChange={handleChange} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>ASSIGN ARCHITECT (OPTIONAL)</label>
                                        <input type="text" name="architect" value={formData.architect} onChange={handleChange} style={inputStyle} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 7 && (
                            <div>
                                <h3 style={sectionHeaderStyle}>7️⃣ Automation Setup</h3>
                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <span style={{ fontWeight: 800, color: '#1e293b' }}>Enable Automation</span>
                                        <label className="switch">
                                            <input type="checkbox" name="automationEnabled" checked={formData.automationEnabled} onChange={handleChange} />
                                            <span style={{ fontSize: '1.5rem', cursor: 'pointer' }}>{formData.automationEnabled ? '✅' : '⬜'}</span>
                                        </label>
                                    </div>

                                    <div style={{ opacity: formData.automationEnabled ? 1 : 0.5, pointerEvents: formData.automationEnabled ? 'auto' : 'none' }}>
                                        <label style={checkboxStyle}><input type="checkbox" name="autoUpdate" checked={formData.autoUpdate} onChange={handleChange} /> Daily Progress Auto-Update</label>
                                        <label style={checkboxStyle}><input type="checkbox" name="delayAlert" checked={formData.delayAlert} onChange={handleChange} /> Delay Alert Automation</label>
                                        <label style={checkboxStyle}><input type="checkbox" name="costAlert" checked={formData.costAlert} onChange={handleChange} /> Cost Overrun Alerts</label>
                                        <label style={checkboxStyle}><input type="checkbox" name="materialAutomation" checked={formData.materialAutomation} onChange={handleChange} /> Material Reorder Automation</label>
                                        <label style={checkboxStyle}><input type="checkbox" name="aiPredictions" checked={formData.aiPredictions} onChange={handleChange} /> AI Predictions</label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 8 && (
                            <div>
                                <h3 style={sectionHeaderStyle}>8️⃣ Documents & Drawings</h3>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>APPROVED DRAWINGS</label>
                                    <input type="file" name="drawings" onChange={handleChange} style={inputStyle} />
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>PERMITS & APPROVALS</label>
                                    <input type="file" name="permits" onChange={handleChange} style={inputStyle} />
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>CONTRACT DOCUMENTS</label>
                                    <input type="file" name="contracts" onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>
                        )}

                        {activeSection === 9 && (
                            <div>
                                <h3 style={sectionHeaderStyle}>9️⃣ Access & Visibility Settings</h3>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>CLIENT VIEW LEVEL</label>
                                    <select name="clientViewLevel" value={formData.clientViewLevel} onChange={handleChange} style={inputStyle}>
                                        <option>Full</option><option>Limited</option><option>Restricted</option>
                                    </select>
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>ENGINEER EDIT RIGHTS</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <label style={checkboxStyle}><input type="radio" name="engineerEditRights" checked={formData.engineerEditRights === true} onChange={() => setFormData({ ...formData, engineerEditRights: true })} /> Full Edit Access</label>
                                        <label style={checkboxStyle}><input type="radio" name="engineerEditRights" checked={formData.engineerEditRights === false} onChange={() => setFormData({ ...formData, engineerEditRights: false })} /> View Only</label>
                                    </div>
                                </div>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>SITE MANAGER PERMISSIONS</label>
                                    <select name="siteManagerPermissions" value={formData.siteManagerPermissions} onChange={handleChange} style={inputStyle}>
                                        <option>Standard</option><option>Admin</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {activeSection === 10 && (
                            <div>
                                <h3 style={sectionHeaderStyle}>🔟 Review & Create</h3>
                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span style={{ fontWeight: 600, color: '#64748b' }}>Project Name:</span>
                                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{formData.projectName || 'Not set'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span style={{ fontWeight: 600, color: '#64748b' }}>Project Type:</span>
                                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{formData.projectType}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span style={{ fontWeight: 600, color: '#64748b' }}>Client:</span>
                                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{formData.clientName || 'Not set'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span style={{ fontWeight: 600, color: '#64748b' }}>Budget:</span>
                                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{formData.estimatedCost ? `${formData.estimatedCost} ${formData.currency}` : 'Not set'}</span>
                                    </div>
                                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                                        Auto-generated Project ID: <span style={{ fontWeight: 700, color: 'var(--pivot-blue)' }}>PRJ-{Math.floor(1000 + Math.random() * 9000)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                    <button onClick={onClose} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>Cancel</button>
                    {activeSection < 10 ? (
                        <button onClick={() => setActiveSection(prev => prev + 1)} style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--pivot-blue)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Next Step <CaretRight weight="bold" />
                        </button>
                    ) : (
                        <button onClick={handleSubmit} style={{ padding: '12px 24px', borderRadius: '12px', background: '#10b981', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                            <CheckCircle weight="bold" size={20} /> {project ? 'Save Changes' : 'Create Project'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
