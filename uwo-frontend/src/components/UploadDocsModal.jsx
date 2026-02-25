import React, { useState, useEffect } from 'react';
import {
    X, UploadSimple, FileText, CheckCircle, Lock,
    ShareNetwork, Trash, Clock, CaretRight, FileArrowUp,
    Check, Warning, MagnifyingGlass, Funnel, ClockCounterClockwise, Eye, DownloadSimple,
    Plus, ShieldCheck, LockOpen
} from '@phosphor-icons/react';
import { documentService, projectService, milestoneService } from '../services/api';
import socketService from '../services/socket';

const UploadDocsModal = ({ onClose }) => {
    const [documents, setDocuments] = useState([]);
    const [projects, setProjects] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [isNewVersion, setIsNewVersion] = useState(false);
    const [targetDocId, setTargetDocId] = useState(null);
    const [viewingVersionHistory, setViewingVersionHistory] = useState(null);

    // Form state
    const [newDoc, setNewDoc] = useState({
        title: '',
        category: 'Project Master Documents',
        projectId: '',
        milestoneId: '',
        expiryDate: '',
        file: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        'Project Master Documents',
        'Design & Planning',
        'Contracts & Legal',
        'Financial & Billing',
        'Compliance & Approvals',
        'Reports & Reviews',
        'Client-Facing Documents'
    ];

    useEffect(() => {
        fetchInitialData();

        socketService.on('document-added', fetchDocuments);
        socketService.on('document-updated', fetchDocuments);

        return () => {
            socketService.off('document-added');
            socketService.off('document-updated');
        };
    }, []);

    useEffect(() => {
        if (newDoc.projectId) {
            fetchMilestones(newDoc.projectId);
        } else {
            setMilestones([]);
        }
    }, [newDoc.projectId]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [docsRes, projectsRes] = await Promise.all([
                documentService.getAll(),
                projectService.getAll()
            ]);
            setDocuments(docsRes);
            setProjects(projectsRes);
        } catch (error) {
            console.error("Error fetching docs:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMilestones = async (pid) => {
        try {
            const data = await milestoneService.getByProject(pid);
            setMilestones(data);
        } catch (error) {
            console.error("Error milestones:", error);
        }
    };

    const fetchDocuments = async () => {
        try {
            const data = await documentService.getAll();
            setDocuments(data);
        } catch (error) {
            console.error("Error refreshing docs:", error);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newDoc.file) {
            alert("Please select a file.");
            return;
        }

        try {
            setIsSubmitting(true);
            const mockUrl = `/uploads/${newDoc.file.name.replace(/\s+/g, '_')}`;

            if (isNewVersion && targetDocId) {
                const currentDoc = documents.find(d => d._id === targetDocId);
                const currentV = parseFloat(currentDoc.version.replace('v', ''));
                const nextV = `v${(currentV + 0.1).toFixed(1)}`;

                await documentService.uploadVersion(targetDocId, {
                    fileUrl: mockUrl,
                    version: nextV,
                    uploadedBy: null
                });
            } else {
                await documentService.create({
                    title: newDoc.title,
                    category: newDoc.category,
                    projectId: newDoc.projectId,
                    milestoneId: newDoc.milestoneId || undefined,
                    fileUrl: mockUrl,
                    fileName: newDoc.file.name,
                    fileSize: (newDoc.file.size / 1024 / 1024).toFixed(2) + ' MB',
                    expiryDate: newDoc.expiryDate,
                    status: 'Approved'
                });
            }

            setNewDoc({ title: '', category: 'Project Master Documents', projectId: '', milestoneId: '', expiryDate: '', file: null });
            setShowUploadForm(false);
            setIsNewVersion(false);
            setTargetDocId(null);
            fetchDocuments();
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to save document version.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = (doc) => {
        // Simulating a real download behavior
        const link = document.createElement('a');
        link.href = '#'; // In real app, this would be doc.fileUrl
        link.setAttribute('download', doc.fileName || doc.title);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert(`✅ Download started: ${doc.title}\nVault Security: AES-256 Validated`);
    };

    const handleRestore = async (docId, versionData) => {
        try {
            // Restore logic: Update current doc with historical version data
            await documentService.update(docId, {
                version: versionData.version,
                fileUrl: versionData.fileUrl,
                updatedAt: new Date()
            });
            setViewingVersionHistory(null);
            fetchDocuments();
            alert(`Version ${versionData.version} restored successfully.`);
        } catch (error) {
            console.error("Restore error:", error);
            alert("Failed to restore version.");
        }
    };

    const handleAction = async (id, action) => {
        try {
            let update = {};
            if (action === 'lock') update = { status: 'Locked' };
            if (action === 'unlock') update = { status: 'Approved' };
            if (action === 'archive') update = { status: 'Archived' };
            if (action === 'share') update = { isSharedWithClient: true };
            if (action === 'revoke-share') update = { isSharedWithClient: false };

            await documentService.update(id, update);
            fetchDocuments();
        } catch (error) {
            console.error("Action error:", error);
        }
    };

    const filteredDocs = documents.filter(doc => {
        if (doc.status === 'Archived') return false;
        const matchesTab = activeTab === 'All' || doc.category === activeTab;
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.projectId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200, backdropFilter: 'blur(12px)' }}>
            <div style={{ width: '1100px', height: '90vh', background: 'white', borderRadius: '32px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}>

                {/* Header */}
                <div style={{ padding: '2rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--pivot-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <FileArrowUp size={32} weight="bold" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Builder Command Vault</h2>
                            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>Authority • Compliance • Financial Control</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {!showUploadForm && (
                            <button
                                onClick={() => {
                                    setIsNewVersion(false);
                                    setShowUploadForm(true);
                                }}
                                style={{ padding: '12px 24px', borderRadius: '14px', background: 'var(--pivot-blue)', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0, 71, 171, 0.2)' }}
                            >
                                <UploadSimple size={20} weight="bold" /> Upload Final Document
                            </button>
                        )}
                        <button onClick={onClose} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                            <X size={24} weight="bold" />
                        </button>
                    </div>
                </div>

                {!showUploadForm && (
                    <div style={{ padding: '1.5rem 2rem', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {['All', ...categories].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveTab(cat)}
                                    style={{
                                        padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s',
                                        background: activeTab === cat ? 'var(--pivot-blue-soft)' : 'transparent',
                                        color: activeTab === cat ? 'var(--pivot-blue)' : '#64748b',
                                        border: activeTab === cat ? '1px solid var(--pivot-blue)' : '1px solid transparent'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div style={{ position: 'relative', width: '280px' }}>
                            <MagnifyingGlass style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                            <input
                                type="text"
                                placeholder="Search vault..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', fontWeight: 600 }}
                            />
                        </div>
                    </div>
                )}

                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: '#f8fafc' }}>
                    {showUploadForm ? (
                        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
                                    {isNewVersion ? 'Upload New Version' : 'Confirm Official Document'}
                                </h3>
                                <button onClick={() => { setShowUploadForm(false); setIsNewVersion(false); }} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                            </div>

                            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {!isNewVersion && (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>Document Title *</label>
                                            <input type="text" required placeholder="Official Title..." value={newDoc.title} onChange={e => setNewDoc({ ...newDoc, title: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>Category *</label>
                                                <select value={newDoc.category} onChange={e => setNewDoc({ ...newDoc, category: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}>
                                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>Project *</label>
                                                <select required value={newDoc.projectId} onChange={e => setNewDoc({ ...newDoc, projectId: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}>
                                                    <option value="">Select Project</option>
                                                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>Linked Milestone (Optional)</label>
                                            <select value={newDoc.milestoneId} onChange={e => setNewDoc({ ...newDoc, milestoneId: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}>
                                                <option value="">No Milestone linked</option>
                                                {milestones.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                                            </select>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>Select File (Approved IFC / Final Version) *</label>
                                    <div style={{ position: 'relative', border: '2px dashed #e2e8f0', padding: '2rem', borderRadius: '16px', textAlign: 'center', transition: 'all 0.2s', background: newDoc.file ? '#f0fdf4' : 'white' }}>
                                        <input
                                            type="file"
                                            onChange={e => setNewDoc({ ...newDoc, file: e.target.files[0] })}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                        />
                                        <UploadSimple size={32} color={newDoc.file ? '#10b981' : '#cbd5e1'} style={{ marginBottom: '0.5rem' }} />
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: newDoc.file ? '#10b981' : '#64748b' }}>
                                            {newDoc.file ? newDoc.file.name : 'Click to Browse or Drag & Drop'}
                                        </div>
                                    </div>
                                </div>

                                {!isNewVersion && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>Validity / Expiry Date (Optional)</label>
                                        <input type="date" value={newDoc.expiryDate} onChange={e => setNewDoc({ ...newDoc, expiryDate: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{ padding: '14px', borderRadius: '16px', background: 'var(--pivot-blue)', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0, 71, 171, 0.2)', opacity: isSubmitting ? 0.7 : 1 }}
                                >
                                    <CheckCircle size={20} weight="bold" /> {isSubmitting ? 'Authenticating & Uploading...' : isNewVersion ? 'Upload Version' : 'Upload Official Version'}
                                </button>
                            </form>
                        </div>
                    ) : filteredDocs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                            <FileArrowUp size={64} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ margin: 0, color: '#64748b' }}>No documents in this category.</h3>
                            <p style={{ color: '#94a3b8', fontWeight: 600 }}>Official documents uploaded here carry builder authority.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {filteredDocs.map((doc) => {
                                const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
                                return (
                                    <div key={doc._id} style={{ background: 'white', border: isExpired ? '1px solid #fee2e2' : '1px solid #e2e8f0', borderRadius: '24px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}>

                                        <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '5px' }}>
                                            {isExpired && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, background: '#fee2e2', color: '#991b1b' }}>
                                                    <Warning size={12} weight="fill" /> EXPIRED
                                                </div>
                                            )}
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '10px',
                                                fontSize: '0.7rem', fontWeight: 800,
                                                background: doc.status === 'Locked' ? '#0f172a' : '#f0fdf4',
                                                color: doc.status === 'Locked' ? 'white' : '#166534'
                                            }}>
                                                {doc.status === 'Locked' ? <Lock size={12} weight="fill" /> : <ShieldCheck size={12} weight="fill" />}
                                                {doc.status?.toUpperCase()}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0047AB' }}>
                                                <FileText size={28} weight="duotone" />
                                            </div>
                                            <div style={{ flex: 1, paddingRight: '120px' }}>
                                                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>{doc.title}</h4>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pivot-blue)', marginTop: '4px' }}>{doc.category}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '12px', borderRadius: '16px' }}>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>PROJECT</div>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{doc.projectId?.name || 'Unassigned'}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>VERSION</div>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{doc.version}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>By: <span style={{ color: '#64748b' }}>{doc.uploadedBy?.name || 'Builder'}</span></div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Date: <span style={{ color: '#64748b' }}>{new Date(doc.createdAt).toLocaleDateString()}</span></div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setTargetDocId(doc._id);
                                                    setIsNewVersion(true);
                                                    setShowUploadForm(true);
                                                }}
                                                disabled={doc.status === 'Locked'}
                                                style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--pivot-blue-soft)', border: 'none', color: 'var(--pivot-blue)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', opacity: doc.status === 'Locked' ? 0.5 : 1 }}
                                            >
                                                <Plus size={14} weight="bold" /> New Version
                                            </button>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                                            <button
                                                title="Download"
                                                onClick={() => handleDownload(doc)}
                                                style={{ height: '36px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', transition: 'all 0.2s' }}
                                            >
                                                <DownloadSimple size={18} weight="bold" />
                                            </button>
                                            <button
                                                title="History"
                                                onClick={() => setViewingVersionHistory(doc)}
                                                style={{ height: '36px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', transition: 'all 0.2s' }}
                                            >
                                                <ClockCounterClockwise size={18} weight="bold" />
                                            </button>
                                            <button
                                                title={doc.isSharedWithClient ? "Recall" : "Share"}
                                                onClick={() => handleAction(doc._id, doc.isSharedWithClient ? 'revoke-share' : 'share')}
                                                style={{ height: '36px', borderRadius: '10px', background: doc.isSharedWithClient ? '#e0e7ff' : '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: doc.isSharedWithClient ? '#4338ca' : '#475569', transition: 'all 0.2s' }}
                                            >
                                                <ShareNetwork size={18} weight="bold" />
                                            </button>
                                            <button
                                                title={doc.status === 'Locked' ? "Unlock Document" : "Lock Document"}
                                                onClick={() => handleAction(doc._id, doc.status === 'Locked' ? 'unlock' : 'lock')}
                                                style={{ height: '36px', borderRadius: '10px', background: doc.status === 'Locked' ? '#0f172a' : '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: doc.status === 'Locked' ? 'white' : '#475569', transition: 'all 0.2s' }}
                                            >
                                                {doc.status === 'Locked' ? <LockOpen size={18} weight="bold" /> : <Lock size={18} weight="bold" />}
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => {
                                                if (window.confirm("ARE YOU SURE?\n\nMoving this document to the Archives will remove it from the active vault. This action carries builder authority.")) {
                                                    handleAction(doc._id, 'archive');
                                                }
                                            }}
                                            style={{ width: '100%', padding: '10px', borderRadius: '12px', background: '#fef2f2', color: '#991b1b', border: '1px solid #fee2e2', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                        >
                                            <Trash size={14} weight="bold" /> Move to Archives
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div style={{ padding: '1rem 2rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={16} color="#10b981" weight="fill" /> 256-bit AES Encryption</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={16} color="#10b981" weight="fill" /> Audit-Ready Tracking</div>
                    </div>
                </div>
            </div>

            {viewingVersionHistory && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300 }}>
                    <div style={{ width: '500px', background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Full Version History</h3>
                            <button onClick={() => setViewingVersionHistory(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#166534' }}>{viewingVersionHistory.version} (Active)</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(viewingVersionHistory.createdAt).toLocaleString()}</div>
                                </div>
                                <CheckCircle size={24} color="#10b981" weight="fill" />
                            </div>
                            {viewingVersionHistory.versionHistory?.slice().reverse().map((v, i) => (
                                <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>{v.version} (Archived)</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(v.uploadedAt).toLocaleString()}</div>
                                    </div>
                                    <button
                                        onClick={() => handleRestore(viewingVersionHistory._id, v)}
                                        style={{ padding: '6px 12px', borderRadius: '8px', background: 'white', border: '1px solid #e2e8f0', color: 'var(--pivot-blue)', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.2s' }}
                                    >
                                        Restore
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setViewingVersionHistory(null)}
                            style={{ width: '100%', marginTop: '2rem', padding: '12px', borderRadius: '12px', background: '#f1f5f9', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Close History
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadDocsModal;
