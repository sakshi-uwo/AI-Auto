import React, { useState } from 'react';
import { X, CheckCircle, Circle, Plus, Trash, ClipboardText, Warning, CaretDown } from '@phosphor-icons/react';

const DEFAULT_ITEMS = [
    { id: 1, label: 'Curing Checklist - Block A', category: 'Curing', dueDate: '2026-02-21', done: false, urgent: true },
    { id: 2, label: 'Concrete Mix Design Verification (M25)', category: 'Materials', dueDate: '2026-02-22', done: false, urgent: false },
    { id: 3, label: 'Reinforcement Cover Check - Slab 2', category: 'Structural', dueDate: '2026-02-20', done: true, urgent: false },
    { id: 4, label: 'Column Verticality Inspection - Block B', category: 'Structural', dueDate: '2026-02-23', done: false, urgent: true },
    { id: 5, label: 'Formwork Removal Sign-off', category: 'Safety', dueDate: '2026-02-24', done: false, urgent: false },
    { id: 6, label: 'Site Cleanliness Audit', category: 'Safety', dueDate: '2026-02-25', done: true, urgent: false },
];

const CATEGORIES = ['Structural', 'Curing', 'Materials', 'Safety', 'Electrical', 'Waterproofing', 'Finishing'];

const QualityChecklistModal = ({ onClose }) => {
    const [items, setItems] = useState(DEFAULT_ITEMS);
    const [filter, setFilter] = useState('All');
    const [addingNew, setAddingNew] = useState(false);
    const [newItem, setNewItem] = useState({ label: '', category: 'Structural', dueDate: '', urgent: false });
    const [saved, setSaved] = useState(false);

    const toggleDone = (id) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
    };

    const removeItem = (id) => setItems(prev => prev.filter(item => item.id !== id));

    const addItem = () => {
        if (!newItem.label.trim()) return;
        setItems(prev => [...prev, { ...newItem, id: Date.now(), done: false }]);
        setNewItem({ label: '', category: 'Structural', dueDate: '', urgent: false });
        setAddingNew(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => { setSaved(false); onClose(); }, 1500);
    };

    const allCategories = ['All', ...new Set(items.map(i => i.category))];
    const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);
    const done = items.filter(i => i.done).length;
    const pct = items.length ? Math.round((done / items.length) * 100) : 0;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(6px)' }}>
            <div style={{ width: '680px', maxHeight: '90vh', background: 'white', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 64px -12px rgba(0,0,0,0.3)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <ClipboardText size={22} weight="fill" />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>Quality Checklist</h2>
                            <p style={{ margin: '2px 0 0', fontSize: '0.77rem', color: '#64748b' }}>Change Requests & Quality Control</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                        <X size={17} weight="bold" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div style={{ padding: '1rem 1.75rem', background: '#faf5ff', borderBottom: '1px solid #ede9fe', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#7c3aed' }}>Overall Progress</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#6d28d9' }}>{done}/{items.length} Complete ({pct}%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#ede9fe', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
                    </div>
                </div>

                {/* Filters */}
                <div style={{ padding: '0.75rem 1.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '8px', overflowX: 'auto', flexShrink: 0 }}>
                    {allCategories.map(cat => (
                        <button key={cat} onClick={() => setFilter(cat)}
                            style={{
                                padding: '5px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap', transition: 'all 0.15s',
                                background: filter === cat ? '#7c3aed' : '#f1f5f9',
                                color: filter === cat ? 'white' : '#475569'
                            }}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Checklist Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filtered.map(item => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', border: `1px solid ${item.done ? '#dcfce7' : item.urgent ? '#fecaca' : '#e2e8f0'}`, background: item.done ? '#f0fdf4' : item.urgent ? '#fff8f8' : '#f8fafc', transition: 'all 0.2s' }}>
                            <button onClick={() => toggleDone(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
                                {item.done
                                    ? <CheckCircle size={24} color="#16a34a" weight="fill" />
                                    : <Circle size={24} color={item.urgent ? '#dc2626' : '#94a3b8'} weight="regular" />
                                }
                            </button>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: item.done ? '#64748b' : '#1e293b', textDecoration: item.done ? 'line-through' : 'none' }}>
                                    {item.label}
                                    {item.urgent && !item.done && <span style={{ marginLeft: '8px', fontSize: '0.68rem', fontWeight: 800, color: '#dc2626', background: '#fef2f2', padding: '2px 6px', borderRadius: '6px' }}>URGENT</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '3px' }}>
                                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{item.category}</span>
                                    {item.dueDate && <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Due: {item.dueDate}</span>}
                                </div>
                            </div>
                            <span style={{
                                fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', flexShrink: 0,
                                background: item.done ? '#dcfce7' : '#f1f5f9',
                                color: item.done ? '#15803d' : '#64748b'
                            }}>{item.done ? 'Done' : 'Pending'}</span>
                            <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '4px', display: 'flex' }}>
                                <Trash size={15} weight="bold" />
                            </button>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                            <ClipboardText size={36} weight="duotone" color="#e2e8f0" />
                            <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>No items in this category.</p>
                        </div>
                    )}

                    {/* Add New Item Row */}
                    {addingNew ? (
                        <div style={{ padding: '14px', borderRadius: '12px', border: '2px dashed #a78bfa', background: '#faf5ff', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Checklist item description..."
                                value={newItem.label}
                                onChange={e => setNewItem(p => ({ ...p, label: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && addItem()}
                                style={{ padding: '9px 12px', borderRadius: '10px', border: '1px solid #ddd6fe', fontSize: '0.88rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                                <div style={{ position: 'relative' }}>
                                    <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #ddd6fe', fontSize: '0.82rem', outline: 'none', appearance: 'none', background: 'white' }}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <CaretDown size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#7c3aed' }} />
                                </div>
                                <input type="date" value={newItem.dueDate} onChange={e => setNewItem(p => ({ ...p, dueDate: e.target.value }))}
                                    style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #ddd6fe', fontSize: '0.82rem', outline: 'none' }} />
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#7c3aed', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                    <input type="checkbox" checked={newItem.urgent} onChange={e => setNewItem(p => ({ ...p, urgent: e.target.checked }))} />
                                    Urgent
                                </label>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setAddingNew(false)} style={{ padding: '7px 16px', borderRadius: '9px', background: '#f1f5f9', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem', color: '#475569' }}>Cancel</button>
                                <button onClick={addItem} style={{ padding: '7px 16px', borderRadius: '9px', background: '#7c3aed', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', color: 'white' }}>Add Item</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setAddingNew(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px', borderRadius: '12px', border: '1.5px dashed #c4b5fd', background: 'transparent', color: '#7c3aed', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}>
                            <Plus size={18} weight="bold" /> Add Checklist Item
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{items.filter(i => i.urgent && !i.done).length} urgent items pending</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '11px', background: 'white', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>Close</button>
                        <button onClick={handleSave}
                            style={{ padding: '10px 22px', borderRadius: '11px', background: saved ? '#15803d' : '#7c3aed', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', transition: 'background 0.3s' }}>
                            {saved ? <><CheckCircle size={18} weight="fill" /> Saved!</> : 'Save Checklist'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QualityChecklistModal;
