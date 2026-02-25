import React, { useState } from 'react';
import {
    X, ArrowUpRight, ArrowDownLeft, Clock, WarningCircle,
    Funnel, MagnifyingGlass, FileText, Bank, CreditCard,
    Money, CheckCircle, Question, FilePdf, Hash, UserCheck, CalendarBlank,
    Receipt, Tag, IdentificationCard, FileXls, DownloadSimple, ShieldCheck, ClockCounterClockwise
} from '@phosphor-icons/react';

const TransactionHistoryModal = ({ isOpen, onClose, transactions = [], expenses = [], financials = {} }) => {
    const [activeTab, setActiveTab] = useState('history'); // history, scheduled
    const [filterDateRange, setFilterDateRange] = useState('All Time');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterMode, setFilterMode] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [exporting, setExporting] = useState(false);

    if (!isOpen) return null;

    // --- Helper Functions ---
    const parseAmount = (amtString) => parseFloat(String(amtString).replace(/[^0-9.-]+/g, "")) || 0;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return { bg: '#dcfce7', text: '#15803d', icon: <CheckCircle weight="fill" /> };
            case 'Pending': return { bg: '#eff6ff', text: '#1d4ed8', icon: <Clock weight="fill" /> };
            case 'Overdue': return { bg: '#fee2e2', text: '#b91c1c', icon: <WarningCircle weight="fill" /> };
            case 'Scheduled': return { bg: '#fef3c7', text: '#d97706', icon: <CalendarBlank weight="fill" /> };
            default: return { bg: '#f1f5f9', text: '#64748b', icon: <Question weight="fill" /> };
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Invoice': return <FileText size={18} weight="duotone" color="#0ea5e9" />;
            case 'Payment': return <ArrowUpRight size={18} weight="bold" color="#16a34a" />;
            case 'Expense': return <ArrowDownLeft size={18} weight="bold" color="#ef4444" />;
            default: return <Money size={18} weight="duotone" color="#64748b" />;
        }
    };

    const handleExport = (format) => {
        setExporting(true);
        setTimeout(() => {
            setExporting(false);
            alert(`Financial Report exported successfully as ${format}`);
        }, 1500);
    };

    // --- Mock Data Enhancement ---
    const enrichData = (items, category) => items.map((t, index) => {
        const amt = parseAmount(t.amount);
        const isExpense = category === 'Outflow';
        const type = isExpense ? 'Expense' : (amt > 0 ? 'Payment' : 'Invoice');
        const dateObj = new Date(t.date || t.createdAt);

        return {
            ...t,
            id: t._id || `${category}-${index}`,
            type,
            category,
            description: t.description || (isExpense ? (t.desc || t.category) : 'Project Milestone Payment'),
            vendor: isExpense ? 'Site Expenses' : 'Reality Construction Ltd.',
            mode: t.method || (isExpense ? 'Cash / Transfer' : 'Bank Transfer'),
            transactionId: t._id ? t._id.substring(t._id.length - 8).toUpperCase() : `TXN-${Math.floor(Math.random() * 10000)}`,
            formattedDate: dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            rawDate: dateObj,
            status: t.status || 'Paid',
            invoiceNumber: `INV-${dateObj.getFullYear()}-${Math.floor(1000 + index * 34)}`,
            invoicePdfUrl: '#',
            milestone: `Milestone ${index + 1}: Foundation`,
            contractId: 'CTR-2024-001',
            tax: amt * 0.18,
            deductions: amt * 0.05,
            approvedBy: 'John Architect',
            referenceNumber: `REF-${Math.floor(Math.random() * 100000)}`,
            auditLog: [
                { action: 'Created', user: 'System', date: '2024-02-01 10:00 AM' },
                { action: 'Approved', user: 'Site Manager', date: '2024-02-02 02:30 PM' },
                { action: 'Processed', user: 'Finance Team', date: '2024-02-03 09:15 AM' }
            ]
        };
    });

    const scheduledPayments = [
        { id: 'sch-1', description: 'Milestone 3: Roof Casting', amount: '$15,000', dueDate: '2024-03-15', status: 'Scheduled', autoReminder: true },
        { id: 'sch-2', description: 'Monthly Contractor Payout', amount: '$4,500', dueDate: '2024-03-01', status: 'Scheduled', autoReminder: true },
        { id: 'sch-3', description: 'Retention Release (5%)', amount: '$2,500', dueDate: '2024-06-30', status: 'Pending', autoReminder: false },
    ];

    const enrichedInflow = enrichData(transactions, 'Inflow');
    const enrichedOutflow = enrichData(expenses, 'Outflow');
    const allTransactions = [...enrichedInflow, ...enrichedOutflow].sort((a, b) => b.rawDate - a.rawDate);

    const filteredTransactions = allTransactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.transactionId.includes(searchTerm.toUpperCase()) ||
            t.invoiceNumber.includes(searchTerm.toUpperCase());
        const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
        const matchesMode = filterMode === 'All' || t.mode === filterMode;
        const matchesType = filterType === 'All' || t.type === filterType;
        // Date filter logic (simplified for brevity)
        return matchesSearch && matchesStatus && matchesMode && matchesType;
    });

    const totalInflow = enrichedInflow.filter(t => t.status === 'Paid').reduce((sum, t) => sum + parseAmount(t.amount), 0);
    const totalOutflow = enrichedOutflow.reduce((sum, t) => sum + parseAmount(t.amount), 0);
    const pendingAmount = enrichedInflow.filter(t => t.status === 'Pending').reduce((sum, t) => sum + parseAmount(t.amount), 0);
    const overdueAmount = enrichedInflow.filter(t => t.status === 'Overdue').reduce((sum, t) => sum + parseAmount(t.amount), 0);

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
            <div style={{
                background: '#f8fafc', width: '100%', maxWidth: '1000px', height: '90vh',
                borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e2e8f0',
                position: 'relative'
            }}>
                {/* Header Actions */}
                <div style={{ padding: '24px 32px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Financial Overview</h2>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                            <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')}>Transaction History</TabButton>
                            <TabButton active={activeTab === 'scheduled'} onClick={() => setActiveTab('scheduled')}>Scheduled & Recurring</TabButton>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button onClick={() => handleExport('PDF')} disabled={exporting} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                            <FilePdf size={20} /> PDF
                        </button>
                        <button onClick={() => handleExport('Excel')} disabled={exporting} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#16a34a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                            <FileXls size={20} /> Excel
                        </button>
                        <button onClick={onClose} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                            <X size={20} weight="bold" />
                        </button>
                    </div>
                </div>

                <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
                    {activeTab === 'history' ? (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                                <SummaryCard title="Total Inflow" amount={`$${totalInflow.toLocaleString()}`} icon={<ArrowUpRight size={24} weight="fill" color="#16a34a" />} bg="#f0fdf4" border="#dcfce7" titleColor="#15803d" />
                                <SummaryCard title="Total Outflow" amount={`$${totalOutflow.toLocaleString()}`} icon={<ArrowDownLeft size={24} weight="fill" color="#ef4444" />} bg="#fef2f2" border="#fecaca" titleColor="#b91c1c" />
                                <SummaryCard title="Pending" amount={`$${pendingAmount.toLocaleString()}`} icon={<Clock size={24} weight="fill" color="#d97706" />} bg="#fffbeb" border="#fde68a" titleColor="#b45309" />
                                <SummaryCard title="Overdue" amount={`$${overdueAmount.toLocaleString()}`} icon={<WarningCircle size={24} weight="fill" color="#ef4444" />} bg="#fef2f2" border="#fecaca" titleColor="#b91c1c" />
                            </div>

                            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {['Today', 'This Week', 'This Month', 'All Time'].map(range => (
                                                <button key={range} onClick={() => setFilterDateRange(range)} style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, border: filterDateRange === range ? '1px solid #3b82f6' : '1px solid #e2e8f0', background: filterDateRange === range ? '#eff6ff' : 'white', color: filterDateRange === range ? '#1d4ed8' : '#64748b', cursor: 'pointer' }}>{range}</button>
                                            ))}
                                        </div>
                                        <div style={{ position: 'relative', width: '300px' }}>
                                            <MagnifyingGlass size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 500, outline: 'none' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <SelectFilter value={filterStatus} onChange={setFilterStatus} options={['All', 'Paid', 'Pending', 'Overdue']} label="Status" />
                                        <SelectFilter value={filterMode} onChange={setFilterMode} options={['All', 'Bank Transfer', 'UPI', 'Cash']} label="Mode" />
                                        <SelectFilter value={filterType} onChange={setFilterType} options={['All', 'Invoice', 'Payment', 'Expense']} label="Type" />
                                    </div>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                            <th style={{ padding: '16px 24px', textAlign: 'left' }}>Date & ID</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'left' }}>Description</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'left' }}>Vendor / Client</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'left' }}>Method</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'right' }}>Amount</th>
                                            <th style={{ padding: '16px 24px', textAlign: 'center' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.map((t, idx) => (
                                            <tr key={idx} onClick={() => setSelectedTransaction(t)} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{t.formattedDate}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace' }}>#{t.transactionId}</div>
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{getTypeIcon(t.type)}<span style={{ fontWeight: 600, color: '#334155' }}>{t.description}</span></div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Inv: {t.invoiceNumber}</div>
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ fontWeight: 600, color: '#475569' }}>{t.vendor}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.projectId || 'Site A'}</div>
                                                </td>
                                                <td style={{ padding: '16px 24px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 500, color: '#475569' }}><Bank size={16} /> {t.mode}</div></td>
                                                <td style={{ padding: '16px 24px', textAlign: 'right' }}><div style={{ fontWeight: 700, color: '#0f172a' }}>{t.amount}</div></td>
                                                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: getStatusColor(t.status).bg, color: getStatusColor(t.status).text }}>
                                                        {getStatusColor(t.status).icon} {t.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>Upcoming Scheduled Payments</h3>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                {scheduledPayments.map(p => (
                                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ padding: '12px', background: '#e0f2fe', borderRadius: '12px', color: '#0284c7' }}><CalendarBlank size={24} weight="fill" /></div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{p.description}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Due: {new Date(p.dueDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                            {p.autoReminder && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#d97706', fontWeight: 600, background: '#fffbeb', padding: '6px 12px', borderRadius: '20px' }}><Clock size={16} weight="fill" /> Auto-Reminder Set</div>}
                                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{p.amount}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Overlays */}
                {selectedTransaction && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(5px)', zIndex: 20, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.2s' }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <button onClick={() => setSelectedTransaction(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowUpRight size={20} style={{ transform: 'rotate(225deg)' }} /> Back</button>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Transaction Details</h3>
                            </div>
                        </div>
                        <div style={{ overflowY: 'auto', padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a' }}>{selectedTransaction.amount}</div>
                                <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500, marginTop: '8px' }}>{selectedTransaction.description}</div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, background: getStatusColor(selectedTransaction.status).bg, color: getStatusColor(selectedTransaction.status).text, marginTop: '16px' }}>
                                    {getStatusColor(selectedTransaction.status).icon} {selectedTransaction.status}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                                <DetailGroup label="Transaction Info">
                                    <DetailRow label="Transaction ID" value={selectedTransaction.transactionId} copy />
                                    <DetailRow label="Date" value={selectedTransaction.formattedDate} />
                                    <DetailRow label="Reference #" value={selectedTransaction.referenceNumber} copy />
                                    <DetailRow label="Payment Mode" value={selectedTransaction.mode} />
                                </DetailGroup>
                                <DetailGroup label="Invoice Details">
                                    <DetailRow label="Invoice Number" value={selectedTransaction.invoiceNumber} copy />
                                    <DetailRow label="Milestone" value={selectedTransaction.milestone} />
                                    <DetailRow label="Linked Contract" value={selectedTransaction.contractId} link />
                                    <DetailRow label="Approved By" value={selectedTransaction.approvedBy} />
                                </DetailGroup>
                            </div>

                            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#475569', margin: '0 0 16px 0', textTransform: 'uppercase' }}>Payment Breakdown</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#334155' }}>
                                        <span>Base Amount</span>
                                        <span style={{ fontWeight: 600 }}>${(parseAmount(selectedTransaction.amount) - selectedTransaction.tax + selectedTransaction.deductions).toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#334155' }}>
                                        <span>Tax (GST/VAT 18%)</span>
                                        <span style={{ fontWeight: 600 }}>${selectedTransaction.tax.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#ef4444' }}>
                                        <span>Deductions / Retention (5%)</span>
                                        <span style={{ fontWeight: 600 }}>-${selectedTransaction.deductions.toFixed(2)}</span>
                                    </div>
                                    <div style={{ height: '1px', background: '#cbd5e1', margin: '8px 0' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>
                                        <span>Total Paid</span>
                                        <span>{selectedTransaction.amount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Audit Log */}
                            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#475569', margin: '0 0 16px 0', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ClockCounterClockwise size={18} /> Audit Trail
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {selectedTransaction.auditLog.map((log, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1' }}></div>
                                            <div style={{ fontWeight: 600, color: '#0f172a', minWidth: '80px' }}>{log.action}</div>
                                            <div style={{ color: '#64748b' }}>by <span style={{ color: '#334155', fontWeight: 500 }}>{log.user}</span></div>
                                            <div style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.85rem' }}>{log.date}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

const TabButton = ({ active, children, onClick }) => (
    <button onClick={onClick} style={{
        padding: '8px 0', background: 'transparent', border: 'none', cursor: 'pointer',
        fontSize: '0.95rem', fontWeight: active ? 700 : 500, color: active ? '#0f172a' : '#64748b',
        borderBottom: active ? '2px solid #0f172a' : '2px solid transparent', transition: 'all 0.2s'
    }}>
        {children}
    </button>
);

const SelectFilter = ({ value, onChange, options, label }) => (
    <div style={{ position: 'relative' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', position: 'absolute', top: '-6px', left: '10px', background: 'white', padding: '0 4px', zIndex: 2 }}>{label}</span>
        <select value={value} onChange={(e) => onChange(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, color: '#334155', fontSize: '0.9rem', outline: 'none', minWidth: '140px', cursor: 'pointer' }}>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

const SummaryCard = ({ title, amount, icon, bg, border, titleColor }) => (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: titleColor, textTransform: 'uppercase' }}>{title}</div>
            <div style={{ padding: '8px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>{icon}</div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{amount}</div>
    </div>
);

const DetailGroup = ({ label, children }) => (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', margin: '0 0 16px 0', textTransform: 'uppercase' }}>{label}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
    </div>
);

const DetailRow = ({ label, value, copy, link }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: link ? '#2563eb' : '#0f172a', fontWeight: 600, fontSize: '0.95rem', cursor: link ? 'pointer' : 'default', textDecoration: link ? 'underline' : 'none' }}>{value}</span>
            {copy && <Hash size={14} color="#94a3b8" weight="bold" style={{ cursor: 'pointer' }} onClick={() => navigator.clipboard.writeText(value)} />}
        </div>
    </div>
);

export default TransactionHistoryModal;
