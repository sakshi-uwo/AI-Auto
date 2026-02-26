import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import {
    HouseLine, CaretRight, ChartPieSlice, CurrencyDollar,
    CalendarCheck, FileText, ChatCircleText, CheckCircle,
    DownloadSimple, PaperPlaneRight, Receipt, Clock,
    ThumbsUp, ThumbsDown, Info
} from '@phosphor-icons/react';
import QueryFeedbackModal from '../../components/QueryFeedbackModal';
import ProjectScheduleModal from '../../components/ProjectScheduleModal';
import TransactionHistoryModal from '../../components/TransactionHistoryModal';
import DocumentApprovalsModal from '../../components/DocumentApprovalsModal';
import socketService from '../../services/socket';
import { authService } from '../../services/api';

const ClientDashboard = () => {
    const [user] = useState(authService.getCurrentUser());
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showQueryModal, setShowQueryModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showTransactionHistory, setShowTransactionHistory] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Dynamic Data States
    const [financials, setFinancials] = useState({
        totalBudget: '$0',
        paid: '$0',
        pending: '$0',
        nextPaymentDue: 'None',
        nextPaymentAmount: '$0'
    });

    const [timeline, setTimeline] = useState([]);
    const [documents, setDocuments] = useState([
        { id: 1, name: 'Floor_Plan_v3.pdf', type: 'Design', status: 'Approved', date: '2026-02-10' },
        { id: 2, name: 'Material_Selection_Opt2.pdf', type: 'Specs', status: 'Action Required', date: '2026-02-17' },
    ]);

    const [invoices, setInvoices] = useState([]);
    const [queries, setQueries] = useState([]);

    useEffect(() => {
        fetchAllData();

        // ── Real-time Listeners ──
        socketService.on('projectUpdated', (updatedProject) => {
            if (project?._id === updatedProject._id) {
                setProject(updatedProject);
            }
        });

        socketService.on('milestoneUpdated', (newMilestone) => {
            if (project?._id === newMilestone.projectId) {
                setTimeline(prev => {
                    const exists = prev.find(m => m._id === newMilestone._id);
                    if (exists) return prev.map(m => m._id === newMilestone._id ? newMilestone : m);
                    return [...prev, newMilestone].sort((a, b) => new Date(a.date) - new Date(b.date));
                });
            }
        });

        socketService.on('paymentUpdated', (newPayment) => {
            if (project?._id === newPayment.projectId) {
                setInvoices(prev => [newPayment, ...prev]);
                fetchFinancials(project._id);
            }
        });

        socketService.on('supportUpdated', (newTicket) => {
            if (user?.id === newTicket.userId) {
                setQueries(prev => {
                    const exists = prev.find(t => t._id === newTicket._id);
                    if (exists) return prev.map(t => t._id === newTicket._id ? newTicket : t);
                    return [newTicket, ...prev];
                });
            }
        });

        socketService.on('documentAdded', (newLog) => {
            if (project?._id === newLog.project && newLog.documents?.length > 0) {
                const newDocs = newLog.documents.map(url => ({
                    _id: `${newLog._id}-${url}`,
                    name: url.split('/').pop(),
                    type: 'Site Update',
                    status: 'Review',
                    date: new Date(newLog.timestamp).toLocaleDateString(),
                    url: url
                }));
                setDocuments(prev => [...newDocs, ...prev]);
            }
        });

        socketService.on('taskUpdated', (updatedTask) => {
            if (project?._id === updatedTask.projectId) {
                setTasks(prev => {
                    const exists = prev.find(t => t._id === updatedTask._id);
                    if (exists) return prev.map(t => t._id === updatedTask._id ? updatedTask : t);
                    return [...prev, updatedTask].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                });
            }
        });

        return () => {
            socketService.off('projectUpdated');
            socketService.off('milestoneUpdated');
            socketService.off('paymentUpdated');
            socketService.off('supportUpdated');
            socketService.off('documentAdded');
            socketService.off('taskUpdated');
        };
    }, [project?._id, user?.id]);

    const fetchAllData = async () => {
        try {
            const projectsRes = await axios.get(`${API_BASE_URL}/projects`);

            // Robust matching: Check both .id and ._id for the user and the assignedTo object
            const userId = user?.id || user?._id;
            const userProject = projectsRes.data.find(p => {
                const assignedId = p.assignedTo?._id || p.assignedTo;
                return assignedId === userId;
            }) || projectsRes.data[0];

            if (userProject) {
                setProject(userProject);
                await Promise.all([
                    fetchTimeline(userProject._id),
                    fetchFinancials(userProject._id),
                    fetchInvoices(userProject._id),
                    fetchExpenses(userProject._id),
                    fetchSupport(userId),
                    fetchDocuments(userProject._id),
                    fetchTasks(userProject._id)
                ]);
            }
        } catch (error) {
            console.error("Error fetching client data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDocuments = async (projectId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/site-ops/logs?project=${projectId}`);
            const docs = [];
            res.data.forEach(log => {
                if (log.documents && log.documents.length > 0) {
                    log.documents.forEach(url => {
                        docs.push({
                            _id: `${log._id}-${url}`,
                            name: url.split('/').pop(),
                            type: 'Site Update',
                            status: 'Review',
                            date: new Date(log.timestamp).toLocaleDateString(),
                            url: url
                        });
                    });
                }
            });
            setDocuments(docs.reverse());
        } catch (err) { console.error("Documents error:", err); }
    };

    const fetchTasks = async (projectId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/tasks/project/${projectId}`);
            setTasks(res.data);
        } catch (err) { console.error("Task error:", err); }
    };

    const fetchSupport = async (userId) => {
        if (!userId) return;
        try {
            const res = await axios.get(`${API_BASE_URL}/support/user/${userId}`);
            setQueries(res.data);
        } catch (err) { console.error("Support error:", err); }
    };

    const fetchTimeline = async (projectId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/milestones/project/${projectId}`);
            setTimeline(res.data);
        } catch (err) { console.error("Timeline error:", err); }
    };

    const fetchFinancials = async (projectId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/projects/${projectId}`);
            const p = res.data;
            const budgetVal = parseFloat(p.budget.replace(/[^0-9.]/g, '')) || 0;
            const spentVal = parseFloat(p.spent.replace(/[^0-9.]/g, '')) || 0;

            setFinancials({
                totalBudget: p.budget,
                paid: p.spent,
                pending: `$${(budgetVal - spentVal).toLocaleString()}`,
                nextPaymentDue: '2026-03-15', // Mocked as it usually depends on contracts
                nextPaymentAmount: '$15,000'
            });
        } catch (err) { console.error("Financials error:", err); }
    };

    const fetchInvoices = async (projectId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/payments/project/${projectId}`);
            setInvoices(res.data);
        } catch (err) { console.error("Invoices error:", err); }
    };

    const fetchExpenses = async (projectId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/expenses/project/${projectId}`);
            setExpenses(res.data);
        } catch (err) { console.error("Expenses error:", err); }
    };

    const handleTicketSubmit = async (data) => {
        try {
            await axios.post(`${API_BASE_URL}/support`, {
                email: user.email,
                issueType: data.type,
                message: data.description,
                userId: user.id,
                priority: data.priority,
                relatedTo: data.relatedTo,
                projectName: data.projectName,
                category: data.category,
                title: data.title
            });
            setShowQueryModal(false);
            alert("Your query has been raised. Expected response in 24 hrs.");
        } catch (err) {
            console.error("Failed to submit ticket:", err.response ? err.response.data : err.message);
            alert("Failed to submit ticket. Please try again.");
        }
    };

    const FeatureCard = ({ title, icon, children, action, onActionClick }) => (
        <div className="dashboard-card" style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '20px',
            border: '1px solid #f0f0f0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b', margin: 0 }}>
                    {icon} {title}
                </h3>
                {action && (
                    <button
                        onClick={onActionClick}
                        style={{
                            background: 'transparent', border: 'none', color: 'var(--pivot-blue)',
                            fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem'
                        }}
                    >
                        {action}
                    </button>
                )}
            </div>
            <div style={{ flex: 1 }}>{children}</div>
        </div>
    );

    if (loading) return <div style={{ padding: '2rem' }}>Loading your dashboard...</div>;

    if (!project) return (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <HouseLine size={48} weight="duotone" />
            <h3>No Active Projects</h3>
            <p>Please contact support to link your account.</p>
        </div>
    );

    return (
        <div style={{ padding: isMobile ? '1rem' : '2rem', maxWidth: '1600px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ color: '#0f172a', marginBottom: '0.5rem', fontWeight: 800, fontSize: '2rem' }}>Welcome Home, Client</h1>
                <p style={{ color: '#64748b', fontWeight: 500, fontSize: '1rem' }}>
                    Tracking progress for <span style={{ fontWeight: 700, color: 'var(--pivot-blue)' }}>{project.name}</span>
                </p>
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '2rem' }}>

                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* 1. Project Progress & 4. Timeline */}
                    <FeatureCard
                        title="Project Timeline & Progress"
                        icon={<CalendarCheck size={24} color="#2563eb" weight="fill" />}
                        action="Full Schedule"
                        onActionClick={() => setShowScheduleModal(true)}
                    >
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 700, color: '#334155' }}>Overall Completion</span>
                                <span style={{ fontWeight: 800, color: '#2563eb' }}>{project.progress || 0}%</span>
                            </div>
                            <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{ width: `${project.progress || 0}%`, height: '100%', background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', borderRadius: '5px', transition: 'width 1s ease-in-out' }}></div>
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', minWidth: isMobile ? '600px' : 'auto' }}>
                                {/* Simple line behind steps */}
                                <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', background: '#e2e8f0', zIndex: 0 }}></div>

                                {timeline.length > 0 ? timeline.map((step) => (
                                    <div key={step._id} style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: `${100 / Math.max(1, timeline.length)}%` }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 10px',
                                            background: step.status === 'Completed' ? '#16a34a' : step.status === 'In Progress' ? '#2563eb' : 'white',
                                            border: `2px solid ${step.status === 'Completed' ? '#16a34a' : step.status === 'In Progress' ? '#2563eb' : '#cbd5e1'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                        }}>
                                            {step.status === 'Completed' && <CheckCircle size={16} weight="bold" />}
                                            {step.status === 'In Progress' && <Clock size={16} weight="bold" />}
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>{step.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(step.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', width: '100%', color: '#94a3b8', fontSize: '0.85rem', padding: '10px' }}>No milestones scheduled yet.</div>
                                )}
                            </div>
                        </div>
                    </FeatureCard>

                    {/* 3. Budget & 5. Payments/Invoices */}
                    <FeatureCard
                        title="Financial Overview"
                        icon={<ChartPieSlice size={24} color="#059669" weight="fill" />}
                        action="Transaction History"
                        onActionClick={() => setShowTransactionHistory(true)}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '15px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                                <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>Total Budget</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14532d' }}>{financials.totalBudget}</div>
                                <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '5px' }}>Paid: {financials.paid}</div>
                            </div>
                            <div style={{ padding: '15px', background: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                                <div style={{ fontSize: '0.8rem', color: '#9a3412', fontWeight: 600 }}>Net Balance</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7c2d12' }}>{financials.pending}</div>
                                <div style={{ fontSize: '0.75rem', color: '#9a3412', marginTop: '5px' }}>Next: {financials.nextPaymentAmount} ({financials.nextPaymentDue})</div>
                            </div>
                        </div>

                        <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#64748b', textTransform: 'uppercase' }}>Recent Invoices</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {invoices.length > 0 ? invoices.slice(0, 3).map(inv => (
                                <div key={inv._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '8px', color: '#64748b' }}>
                                            <Receipt size={20} weight="fill" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{inv.method || 'Payment'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(inv.date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700 }}>{inv.amount}</div>
                                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: inv.status === 'Paid' ? '#dcfce7' : '#fffbeb', color: inv.status === 'Paid' ? '#15803d' : '#92400e', fontWeight: 700 }}>{inv.status}</span>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '0.85rem' }}>No recent transactions.</div>
                            )}
                        </div>
                    </FeatureCard>

                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* 5. Review & Approve Documents */}
                    <FeatureCard
                        title="Document Approvals"
                        icon={<FileText size={24} color="#d97706" weight="fill" />}
                        action="View All"
                        onActionClick={() => setShowDocumentModal(true)}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {documents.length > 0 ? documents.map(doc => (
                                <div key={doc._id} style={{ padding: '12px', background: doc.status === 'Action Required' ? '#fffbeb' : '#f8fafc', borderRadius: '12px', border: `1px solid ${doc.status === 'Action Required' ? '#fcd34d' : '#e2e8f0'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: doc.status === 'Action Required' ? '#b45309' : '#16a34a', textTransform: 'uppercase' }}>{doc.status}</span>
                                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{doc.date}</span>
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '10px', color: '#334155', wordBreak: 'break-all' }}>{doc.name}</div>

                                    {doc.status === 'Action Required' ? (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button style={{ flex: 1, padding: '6px', borderRadius: '6px', background: '#16a34a', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                                <ThumbsUp size={14} weight="bold" /> Approve
                                            </button>
                                            <button style={{ flex: 1, padding: '6px', borderRadius: '6px', background: 'white', border: '1px solid #e2e8f0', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                                <ThumbsDown size={14} weight="bold" /> Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <a href={`${API_BASE_URL.replace('/api', '')}${doc.url}`} target="_blank" rel="noreferrer" style={{ width: '100%', padding: '6px', borderRadius: '6px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', textDecoration: 'none' }}>
                                            <DownloadSimple size={14} weight="bold" /> View Document
                                        </a>
                                    )}
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '0.85rem' }}>No documents shared yet.</div>
                            )}
                        </div>
                    </FeatureCard>

                    {/* 6. Communicate & 7. Queries */}
                    <FeatureCard
                        title="Builder Communication"
                        icon={<ChatCircleText size={24} color="#7c3aed" weight="fill" />}
                    >
                        <div style={{ height: '250px', background: '#f8fafc', borderRadius: '12px', marginBottom: '1rem', padding: '1rem', overflowY: 'auto' }}>
                            {queries.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem', fontSize: '0.9rem' }}>
                                    <Info size={24} style={{ marginBottom: '5px' }} />
                                    <p>No active queries. Raise a ticket below.</p>
                                </div>
                            ) : (
                                queries.map(q => (
                                    <div key={q.id} style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>You</span>
                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(q.date).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ background: '#ede9fe', padding: '8px 12px', borderRadius: '8px 8px 0 8px', fontSize: '0.9rem', color: '#4c1d95', marginTop: '4px' }}>
                                            {q.message}
                                            {q.priority && q.priority !== 'Normal' && <span style={{ fontSize: '0.65rem', marginLeft: '8px', padding: '2px 6px', borderRadius: '4px', background: q.priority === 'Critical' ? '#fee2e2' : '#e0f2fe', color: q.priority === 'Critical' ? '#991b1b' : '#075985', fontWeight: 700 }}>{q.priority}</span>}
                                        </div>
                                        {q.status === 'Resolved' && (
                                            <div style={{ textAlign: 'right', marginTop: '5px' }}>
                                                <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>RESOLVED</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        <button
                            onClick={() => setShowQueryModal(true)}
                            style={{
                                width: '100%', padding: '12px', background: 'var(--pivot-blue)', color: 'white', border: 'none',
                                borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                fontWeight: 700, fontSize: '0.9rem'
                            }}
                        >
                            <PaperPlaneRight size={18} weight="bold" /> Raise New Query / Feedback
                        </button>
                    </FeatureCard>

                </div>

            </div>

            <style>{`
                .dashboard-card {
                    transition: all 0.3s ease;
                }
                .dashboard-card:hover {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    transform: translateY(-2px);
                }
            `}</style>

            <QueryFeedbackModal
                isOpen={showQueryModal}
                onClose={() => setShowQueryModal(false)}
                onSubmit={handleTicketSubmit}
            />

            <ProjectScheduleModal
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                project={project}
                tasks={tasks}
                user={user}
            />

            {showTransactionHistory && (
                <TransactionHistoryModal
                    isOpen={showTransactionHistory}
                    onClose={() => setShowTransactionHistory(false)}
                    transactions={invoices}
                    expenses={expenses}
                    financials={financials}
                />
            )}

            <DocumentApprovalsModal
                isOpen={showDocumentModal}
                onClose={() => setShowDocumentModal(false)}
                documents={documents}
                project={project}
            />
        </div>
    );
};

export default ClientDashboard;
