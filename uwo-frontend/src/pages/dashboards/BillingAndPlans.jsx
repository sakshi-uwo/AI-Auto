import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft, Crown, CheckCircle, Warning, Lock as LockIcon, CreditCard,
    TrendUp, Users, HardHat, Robot, CloudArrowUp, FileText,
    Receipt, Clock, Bell, CurrencyDollar, ShieldCheck,
    Download, CaretDown, Plus, Minus, Gear
} from '@phosphor-icons/react';

const BillingAndPlans = ({ setCurrentPage }) => {
    const [billingData, setBillingData] = useState(null);
    const [activeTab, setActiveTab] = useState('payment');
    const [loading, setLoading] = useState(true);
    const [previewPlan, setPreviewPlan] = useState(null);

    const [activeAddons, setActiveAddons] = useState([
        { name: 'Extra Users (+5)', price: '₹999/mo', quantity: 0, enabled: false },
        { name: 'Extra Projects (+2)', price: '₹1,499/mo', quantity: 0, enabled: false },
        { name: 'Additional Storage (50GB)', price: '₹499/mo', quantity: 0, enabled: false },
        { name: 'Advanced AI Insights', price: '₹2,499/mo', quantity: 0, enabled: false },
    ]);

    const [activeAlerts, setActiveAlerts] = useState([
        { label: 'Plan expiry alerts', enabled: true },
        { label: 'Usage limit alerts', enabled: true },
        { label: 'Payment failure alerts', enabled: true }
    ]);

    const userId = "65ca9f56e9c123456789abcd"; // Mocked for demo; in real app, get from Auth context

    const fetchBilling = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/billing/${userId}`);
            setBillingData(res.data);
            setPreviewPlan(res.data.plan);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch billing:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBilling();

        const socket = socketService.getSocket();
        if (socket) {
            socket.on('billingUpdated', (data) => {
                if (data.userId === userId) {
                    setBillingData(data);
                    if (!previewPlan) setPreviewPlan(data.plan);
                    toast.success("Billing data updated in real-time!");
                }
            });

            // Refresh if usage changes via other events
            socket.on('newUser', fetchBilling);
            socket.on('paymentUpdated', fetchBilling);
        }

        return () => {
            if (socket) {
                socket.off('billingUpdated');
                socket.off('newUser');
                socket.off('paymentUpdated');
            }
        };
    }, []);

    const toggleAutoRenew = async () => {
        try {
            const newStatus = !billingData.autoRenew;
            const res = await axios.patch(`${API_BASE_URL}/billing/${userId}`, { autoRenew: newStatus });
            setBillingData(res.data);
            toast.success(`Auto-renew ${newStatus ? 'enabled' : 'disabled'}`);
        } catch (err) {
            toast.error("Failed to update settings");
        }
    };

    const handlePlanUpgrade = async (planName) => {
        try {
            const res = await axios.patch(`${API_BASE_URL}/billing/${userId}`, { plan: planName });
            setBillingData(res.data);
            toast.success(`Successfully switched to ${planName} plan!`);
        } catch (err) {
            toast.error("Plan upgrade failed");
        }
    };

    if (loading || !billingData) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--pivot-blue)', fontWeight: 800 }}>Loading live metrics...</div>;
    }

    const usageStats = [
        { label: 'Projects', used: billingData.usage.projects.used, total: billingData.usage.projects.limit, color: '#10b981' },
        { label: 'Users', used: billingData.usage.users.used, total: billingData.usage.users.limit, color: '#f59e0b' },
        { label: 'Automation', used: billingData.usage.automationRuns.used, total: billingData.usage.automationRuns.limit, color: '#3b82f6' },
        { label: 'AI Predicts', used: billingData.usage.aiPredictions.used, total: billingData.usage.aiPredictions.limit, color: '#8b5cf6' },
        { label: 'Storage', used: billingData.usage.storageGB.used, total: billingData.usage.storageGB.limit, unit: 'GB', color: '#ec4899' }
    ];

    const plans = [
        { name: 'Basic', price: '₹2,999', period: 'mo', features: ['5 Projects', '10 Users', 'Basic Reports', 'Community Support'] },
        { name: 'Pro', price: '₹7,999', period: 'mo', features: ['10 Projects', '20 Users', 'Advanced AI', 'Priority Support', 'Data Export'] },
        { name: 'Enterprise', price: '₹19,999', period: 'mo', features: ['Unlimited Projects', 'Unlimited Users', 'Elite AI', '24/7 Support', 'Custom API'] }
    ];

    const planDetails = {
        'Basic': [
            { name: 'Projects', limit: '5', status: 'active' },
            { name: 'Users', limit: '10', status: 'active' },
            { name: 'Global Reports', limit: 'Basic', status: 'warning' },
            { name: 'AI Insights', limit: 'Basic', status: 'warning' },
            { name: 'Data Export', limit: 'No', status: 'locked' },
            { name: 'Custom API', limit: 'Locked', status: 'locked' },
        ],
        'Pro': [
            { name: 'Projects', limit: '10', status: 'active' },
            { name: 'Users', limit: '20', status: 'active' },
            { name: 'Global Reports', limit: 'Advanced', status: 'active' },
            { name: 'AI Insights', limit: 'Pro', status: 'active' },
            { name: 'Data Export', limit: 'Yes', status: 'active' },
            { name: 'Custom API', limit: 'Locked', status: 'locked' },
        ],
        'Enterprise': [
            { name: 'Projects', limit: 'Unlimited', status: 'active' },
            { name: 'Users', limit: 'Unlimited', status: 'active' },
            { name: 'Global Reports', limit: 'Custom', status: 'active' },
            { name: 'AI Insights', limit: 'Elite', status: 'active' },
            { name: 'Data Export', limit: 'Yes', status: 'active' },
            { name: 'Custom API', limit: 'Unlimited', status: 'active' },
        ]
    };



    const handleDownloadInvoice = (invoice = null) => {
        // If specific invoice provided, we could customize the print content
        // For now, we'll use a generic "Current Statement" or the provided one
        try {
            toast.loading("Preparing invoice...");
            setTimeout(() => {
                window.print();
                toast.dismiss();
            }, 500);
        } catch (error) {
            toast.error("Failed to generate invoice");
        }
    };

    const handleAddonQuantityChange = (index, delta) => {
        const newAddons = [...activeAddons];
        const newQuantity = Math.max(0, newAddons[index].quantity + delta);
        newAddons[index].quantity = newQuantity;
        if (newQuantity > 0 && !newAddons[index].enabled) {
            newAddons[index].enabled = true;
        } else if (newQuantity === 0) {
            newAddons[index].enabled = false;
        }
        setActiveAddons(newAddons);
    };

    const toggleAddon = (index) => {
        const newAddons = [...activeAddons];
        newAddons[index].enabled = !newAddons[index].enabled;
        if (newAddons[index].enabled && newAddons[index].quantity === 0) {
            newAddons[index].quantity = 1;
        } else if (!newAddons[index].enabled) {
            newAddons[index].quantity = 0;
        }
        setActiveAddons(newAddons);
    };

    const toggleAlert = (index) => {
        const newAlerts = [...activeAlerts];
        newAlerts[index].enabled = !newAlerts[index].enabled;
        setActiveAlerts(newAlerts);
    };

    const invoices = [
        { id: 'INV-2024-001', date: 'Feb 01, 2026', amount: '₹7,999', status: 'Paid' },
        { id: 'INV-2024-002', date: 'Jan 01, 2026', amount: '₹7,999', status: 'Paid' },
        { id: 'INV-2023-012', date: 'Dec 01, 2025', amount: '₹7,999', status: 'Paid' },
    ];

    const history = [
        { date: '12 Jan 2026', action: 'Upgrade', detail: 'Basic → Pro', user: 'Admin' },
        { date: '15 Dec 2025', action: 'Add-on', detail: 'Extra Users (+5)', user: 'Admin' },
        { date: '01 Nov 2025', action: 'Billing Update', detail: 'Credit card ending in 4242', user: 'Admin' },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>

            {/* 1. Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => setCurrentPage('dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowLeft size={24} color="#64748b" />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>Billing & Plans</h1>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Manage your subscription, usage limits, and invoices</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '6px 12px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div> Active
                    </div>
                    <button
                        onClick={() => handleDownloadInvoice()}
                        style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#1e293b', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={18} weight="bold" /> Download Invoice
                    </button>
                    <button
                        onClick={() => document.getElementById('plans-selection')?.scrollIntoView({ behavior: 'smooth' })}
                        style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: 'var(--pivot-blue)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 71, 171, 0.2)' }}>
                        Upgrade Plan
                    </button>
                </div>
            </div>

            {/* 2. Current Plan Summary */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, white 0%, #f8fafc 100%)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--pivot-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 25px -5px rgba(0, 71, 171, 0.4)' }}>
                        <Crown size={32} weight="fill" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Plan</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>{billingData.plan} Plan</div>
                        <div style={{ fontSize: '0.9rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700 }}>{plans.find(p => p.name === billingData.plan)?.price || '₹0'}</span> / month • {billingData.billingCycle} billing
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Renewal Date: <span style={{ fontWeight: 700, color: '#1e293b' }}>{new Date(billingData.nextBillingDate).toLocaleDateString()}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Auto-Renew</span>
                        <div
                            onClick={toggleAutoRenew}
                            style={{
                                width: '40px', height: '20px',
                                background: billingData.autoRenew ? '#10b981' : '#e2e8f0',
                                borderRadius: '20px', position: 'relative', cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                right: billingData.autoRenew ? '2px' : '22px',
                                top: '2px', width: '16px', height: '16px',
                                background: 'white', borderRadius: '50%',
                                transition: 'all 0.2s'
                            }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Usage Overview */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>Automated Live Usage</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {usageStats.map((stat, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>
                            <span>{stat.label}</span>
                            <span>{Math.round((stat.used / stat.total) * 100)}%</span>
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                            {stat.used} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>/ {stat.total} {stat.unit}</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${Math.min(100, (stat.used / stat.total) * 100)}%`,
                                height: '100%',
                                background: stat.used >= stat.total ? '#ef4444' : stat.color,
                                borderRadius: '4px',
                                transition: 'width 1s ease-in-out'
                            }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* 4. Plan Features & Limits */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>
                        Live Plan Entitlements <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginLeft: '10px' }}>({previewPlan || billingData.plan})</span>
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '0.85rem', color: '#64748b' }}>FEATURE</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '0.85rem', color: '#64748b' }}>LIMIT</th>
                                <th style={{ textAlign: 'right', padding: '12px', fontSize: '0.85rem', color: '#64748b' }}>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {planDetails[previewPlan || billingData.plan].map((feature, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px', fontWeight: 600, color: '#334155' }}>{feature.name}</td>
                                    <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>{feature.limit}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        {feature.status === 'active' && <CheckCircle size={20} weight="fill" color="#10b981" />}
                                        {feature.status === 'warning' && <Warning size={20} weight="fill" color="#f59e0b" />}
                                        {feature.status === 'locked' && <LockIcon size={20} weight="fill" color="#cbd5e1" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 5. Upgrade / Downgrade Section */}
                <div id="plans-selection" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            onClick={() => setPreviewPlan(plan.name)}
                            className="card"
                            style={{
                                padding: '1.5rem',
                                border: previewPlan === plan.name ? '2px solid var(--pivot-blue)' : (billingData.plan === plan.name ? '1.5px solid #cbd5e1' : '1px solid #e2e8f0'),
                                background: previewPlan === plan.name ? '#f0f7ff' : (billingData.plan === plan.name ? '#f8fafc' : 'white'),
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                transform: previewPlan === plan.name ? 'scale(1.02)' : 'scale(1)'
                            }}
                        >
                            {billingData.plan === plan.name && <div style={{ position: 'absolute', top: '-10px', right: '20px', background: 'var(--pivot-blue)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700 }}>CURRENT</div>}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{plan.name}</div>
                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{plan.price}<span style={{ fontSize: '0.7rem', color: '#64748b' }}>/{plan.period}</span></div>
                            </div>
                            <ul style={{ padding: 0, listStyle: 'none', margin: '0 0 1rem 0' }}>
                                {plan.features.slice(0, 2).map((f, j) => (
                                    <li key={j} style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>• {f}</li>
                                ))}
                            </ul>
                            {billingData.plan !== plan.name && (
                                <button
                                    onClick={() => handlePlanUpgrade(plan.name)}
                                    style={{ width: '100%', padding: '8px', border: 'none', background: 'var(--pivot-blue)', color: 'white', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                    Switch to {plan.name}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 6. Add-Ons Section */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>Available Add-Ons</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {activeAddons.map((addon, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>{addon.name}</div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--pivot-blue)' }}>{addon.price}</div>
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
                                <button
                                    onClick={() => handleAddonQuantityChange(i, -1)}
                                    style={{ border: 'none', background: 'white', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Minus size={12} />
                                </button>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{addon.quantity}</span>
                                <button
                                    onClick={() => handleAddonQuantityChange(i, 1)}
                                    style={{ border: 'none', background: 'white', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                            <div
                                onClick={() => toggleAddon(i)}
                                style={{ width: '36px', height: '20px', background: addon.enabled ? '#10b981' : '#e2e8f0', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}
                            >
                                <div style={{ position: 'absolute', left: addon.enabled ? '18px' : '2px', top: '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'left 0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* 7. Payment & Invoices */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Receipt size={24} color="var(--pivot-blue)" /> Payment & Invoices
                    </h3>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                        <div style={{ paddingBottom: '10px', borderBottom: '2px solid var(--pivot-blue)', fontWeight: 700, color: 'var(--pivot-blue)', cursor: 'pointer' }}>Invoices</div>
                        <div style={{ paddingBottom: '10px', fontWeight: 600, color: '#94a3b8', cursor: 'pointer' }}>Payment Methods</div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', fontSize: '0.8rem', color: '#64748b' }}>
                                <th style={{ padding: '10px' }}>INVOICE ID</th>
                                <th style={{ padding: '10px' }}>DATE</th>
                                <th style={{ padding: '10px' }}>AMOUNT</th>
                                <th style={{ padding: '10px' }}>STATUS</th>
                                <th style={{ padding: '10px', textAlign: 'right' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '12px', fontWeight: 600, color: '#334155' }}>{inv.id}</td>
                                    <td style={{ padding: '12px', color: '#64748b' }}>{inv.date}</td>
                                    <td style={{ padding: '12px', fontWeight: 700 }}>{inv.amount}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '12px', background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 700 }}>{inv.status}</span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleDownloadInvoice(inv)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pivot-blue)' }}><Download size={18} weight="bold" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 8. Billing Settings & 9. Alerts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Gear size={24} color="var(--pivot-blue)" /> Billing Settings
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Billing Email</span>
                                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>admin@reality-os.com</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Currency</span>
                                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>INR (₹)</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Invoice Frequency</span>
                                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Monthly</span>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Bell size={24} color="var(--pivot-blue)" /> Alerts & Notifications
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {activeAlerts.map((alert, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>{alert.label}</span>
                                    <div
                                        onClick={() => toggleAlert(i)}
                                        style={{ width: '36px', height: '20px', background: alert.enabled ? '#10b981' : '#e2e8f0', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}
                                    >
                                        <div style={{ position: 'absolute', right: alert.enabled ? '2px' : '18px', top: '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'right 0.2s' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 10. Audit Log */}
            <div className="card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Plan History & Audit Log</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', opacity: 0.9 }}>
                    <tbody>
                        {history.map((h, i) => (
                            <tr key={i} style={{ fontSize: '0.85rem', borderBottom: i < history.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                <td style={{ padding: '12px 0', width: '140px', color: '#64748b' }}>{h.date}</td>
                                <td style={{ padding: '12px 0', fontWeight: 700, color: '#334155' }}>{h.action}</td>
                                <td style={{ padding: '12px 0', color: '#475569' }}>{h.detail}</td>
                                <td style={{ padding: '12px 0', textAlign: 'right', color: '#94a3b8' }}>Changed by {h.user}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 11. Hidden Printable Invoice Template */}
            <div className="print-only-invoice" style={{ display: 'none' }}>
                <div style={{ padding: '40px', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '30px' }}>
                        <div>
                            <h1 style={{ color: '#0047AB', margin: 0, fontSize: '24px', fontWeight: 900 }}>AI_AUTO</h1>
                            <p style={{ margin: '5px 0', fontSize: '14px', color: '#64748b' }}>Enterprise SaaS Infrastructure</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ margin: 0, fontSize: '20px' }}>INVOICE</h2>
                            <p style={{ margin: '5px 0', fontSize: '14px', color: '#475569' }}>#INV-{new Date().getFullYear()}-001</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <div>
                            <p style={{ fontWeight: 700, margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>BILL TO:</p>
                            <p style={{ fontWeight: 800, margin: 0 }}>Client Organisation</p>
                            <p style={{ margin: '5px 0', fontSize: '14px' }}>admin@reality-os.com</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontWeight: 700, margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>DATE ISSUED:</p>
                            <p style={{ fontWeight: 800, margin: 0 }}>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#64748b' }}>DESCRIPTION</th>
                                <th style={{ textAlign: 'right', padding: '12px', fontSize: '12px', color: '#64748b' }}>STATUS</th>
                                <th style={{ textAlign: 'right', padding: '12px', fontSize: '12px', color: '#64748b' }}>AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px 12px' }}>
                                    <p style={{ fontWeight: 700, margin: 0 }}>{billingData.plan} Plan Subscription</p>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>Monthly usage fee & automated infrastructure</p>
                                </td>
                                <td style={{ textAlign: 'right', padding: '15px 12px', fontWeight: 700, color: '#16a34a' }}>Paid</td>
                                <td style={{ textAlign: 'right', padding: '15px 12px', fontWeight: 800 }}>{plans.find(p => p.name === billingData.plan)?.price}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ width: '250px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>Subtotal</span>
                                <span style={{ fontWeight: 700 }}>{plans.find(p => p.name === billingData.plan)?.price}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>Tax (0%)</span>
                                <span style={{ fontWeight: 700 }}>₹0</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #e2e8f0', paddingTop: '10px', marginTop: '10px' }}>
                                <span style={{ fontWeight: 900, fontSize: '16px' }}>Total Amount</span>
                                <span style={{ fontWeight: 900, fontSize: '18px', color: '#0047AB' }}>{plans.find(p => p.name === billingData.plan)?.price}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '100px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                        <p>This is a computer-generated document. No signature is required.</p>
                        <p>© {new Date().getFullYear()} AI_AUTO Infrastructure. All rights reserved.</p>
                    </div>
                </div>
            </div>

            <style>{`
                @media screen {
                    .print-only-invoice { 
                        display: none !important; 
                    }
                }
                @media print {
                    body * { 
                        visibility: hidden; 
                    }
                    .print-only-invoice, .print-only-invoice * { 
                        visibility: visible; 
                    }
                    .print-only-invoice {
                        display: block !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    @page { 
                        margin: 1.5cm; 
                        size: auto; 
                    }
                }
            `}</style>

        </div>
    );
};

export default BillingAndPlans;
