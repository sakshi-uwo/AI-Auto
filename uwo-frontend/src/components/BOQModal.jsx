import React, { useState } from 'react';
import { X, Package, Plus, Trash, PencilSimple, CheckCircle, CaretDown, MagnifyingGlass } from '@phosphor-icons/react';

const DEFAULT_BOQ = [
    { id: 1, item: 'Cement (Grade 53)', category: 'Binding', quantity: '500', unit: 'Bags', unitRate: '$9', budget: '$4,500', status: 'On Track', vendor: 'ACC Ltd.' },
    { id: 2, item: 'Steel Reinforcement (Fe500)', category: 'Structural', quantity: '20', unit: 'Tons', unitRate: '$900', budget: '$18,000', status: 'Review Needed', vendor: 'TATA Steel' },
    { id: 3, item: 'River Sand (M-Sand)', category: 'Aggregate', quantity: '300', unit: 'Cu.Ft', unitRate: '$2', budget: '$600', status: 'On Track', vendor: 'Local Supplier' },
    { id: 4, item: '20mm Graded Aggregate', category: 'Aggregate', quantity: '400', unit: 'Cu.Ft', unitRate: '$1.8', budget: '$720', status: 'On Track', vendor: 'Local Supplier' },
    { id: 5, item: 'Plain Concrete Blocks (6")', category: 'Masonry', quantity: '5000', unit: 'Nos', unitRate: '$0.5', budget: '$2,500', status: 'Ordered', vendor: 'Block Works Pvt.' },
    { id: 6, item: 'Waterproofing Compound', category: 'Finishing', quantity: '80', unit: 'Kgs', unitRate: '$12', budget: '$960', status: 'Pending', vendor: 'Dr. Fixit' },
];

const CATEGORIES = ['Structural', 'Binding', 'Aggregate', 'Masonry', 'Finishing', 'Electrical', 'Plumbing', 'Safety', 'Other'];
const UNITS = ['Bags', 'Tons', 'Kgs', 'Nos', 'Cu.Ft', 'Cu.M', 'Ltrs', 'Sq.Ft', 'Sq.M', 'Rmt', 'Sets'];
const STATUSES = ['On Track', 'Ordered', 'Pending', 'Review Needed', 'Delivered', 'Short Supply'];

const EMPTY_ITEM = { item: '', category: 'Structural', quantity: '', unit: 'Kgs', unitRate: '', vendor: '', status: 'Pending' };

const statusColors = {
    'On Track': { bg: '#dcfce7', color: '#15803d' },
    'Ordered': { bg: '#e0f2fe', color: '#0369a1' },
    'Pending': { bg: '#fef9c3', color: '#a16207' },
    'Review Needed': { bg: '#fee2e2', color: '#dc2626' },
    'Delivered': { bg: '#f3e8ff', color: '#7c3aed' },
    'Short Supply': { bg: '#ffedd5', color: '#ea580c' },
};

const BOQModal = ({ onClose, initialItems }) => {
    const [items, setItems] = useState(initialItems?.length ? initialItems : DEFAULT_BOQ);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newItem, setNewItem] = useState(EMPTY_ITEM);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('All');
    const [saved, setSaved] = useState(false);

    const totalBudget = items.reduce((sum, i) => {
        const val = parseFloat(String(i.budget || '').replace(/[^0-9.]/g, '')) || 0;
        return sum + val;
    }, 0);

    const computedBudget = (qty, rate) => {
        const q = parseFloat(qty) || 0;
        const r = parseFloat(String(rate).replace(/[^0-9.]/g, '')) || 0;
        return q && r ? `$${(q * r).toLocaleString()}` : '';
    };

    const handleAdd = () => {
        if (!newItem.item.trim() || !newItem.quantity) return;
        const budget = computedBudget(newItem.quantity, newItem.unitRate);
        setItems(prev => [...prev, { ...newItem, id: Date.now(), budget }]);
        setNewItem(EMPTY_ITEM);
        setShowAddForm(false);
    };

    const handleDelete = (id) => setItems(prev => prev.filter(i => i.id !== id));

    const startEdit = (item) => { setEditId(item.id); setNewItem({ ...item }); setShowAddForm(false); };

    const handleSaveEdit = () => {
        const budget = computedBudget(newItem.quantity, newItem.unitRate) || newItem.budget;
        setItems(prev => prev.map(i => i.id === editId ? { ...newItem, budget } : i));
        setEditId(null);
        setNewItem(EMPTY_ITEM);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => { setSaved(false); onClose(); }, 1500);
    };

    const cats = ['All', ...new Set(items.map(i => i.category))];
    const filtered = items.filter(i => {
        const matchSearch = i.item.toLowerCase().includes(search.toLowerCase()) || (i.vendor || '').toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === 'All' || i.category === filterCat;
        return matchSearch && matchCat;
    });

    const inputSt = { padding: '7px 10px', borderRadius: '8px', border: '1px solid #d1fae5', fontSize: '0.82rem', outline: 'none', background: 'white', width: '100%', boxSizing: 'border-box' };
    const selectSt = { ...inputSt, appearance: 'none' };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(6px)' }}>
            <div style={{ width: '920px', maxHeight: '92vh', background: 'white', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 64px -12px rgba(0,0,0,0.3)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Package size={22} weight="fill" />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>Bill of Quantities (BOQ)</h2>
                            <p style={{ margin: '2px 0 0', fontSize: '0.77rem', color: '#64748b' }}>Full material specifications & cost breakdown</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Total Budget</div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>${totalBudget.toLocaleString()}</div>
                        </div>
                        <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                            <X size={17} weight="bold" />
                        </button>
                    </div>
                </div>

                {/* Search + Filter + Add */}
                <div style={{ padding: '0.9rem 1.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                        <MagnifyingGlass size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input type="text" placeholder="Search item or vendor..." value={search} onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.83rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {cats.map(c => (
                            <button key={c} onClick={() => setFilterCat(c)}
                                style={{
                                    padding: '5px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.77rem', whiteSpace: 'nowrap',
                                    background: filterCat === c ? '#059669' : '#f1f5f9',
                                    color: filterCat === c ? 'white' : '#475569'
                                }}>{c}</button>
                        ))}
                    </div>
                    <button onClick={() => { setShowAddForm(p => !p); setEditId(null); setNewItem(EMPTY_ITEM); }}
                        style={{ padding: '8px 16px', borderRadius: '10px', background: showAddForm ? '#f1f5f9' : '#059669', color: showAddForm ? '#475569' : 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.83rem', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        <Plus size={15} weight="bold" /> {showAddForm ? 'Cancel' : 'Add Item'}
                    </button>
                </div>

                {/* Add / Edit Form */}
                {(showAddForm || editId) && (
                    <div style={{ padding: '1rem 1.75rem', background: '#f0fdf4', borderBottom: '2px dashed #86efac', flexShrink: 0 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                            <input placeholder="Item / Material Name *" value={newItem.item} onChange={e => setNewItem(p => ({ ...p, item: e.target.value }))}
                                style={inputSt} autoFocus />
                            <div style={{ position: 'relative' }}>
                                <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))} style={selectSt}>
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                                <CaretDown size={12} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#059669' }} />
                            </div>
                            <input placeholder="Quantity *" type="number" value={newItem.quantity} onChange={e => setNewItem(p => ({ ...p, quantity: e.target.value }))} style={inputSt} />
                            <div style={{ position: 'relative' }}>
                                <select value={newItem.unit} onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))} style={selectSt}>
                                    {UNITS.map(u => <option key={u}>{u}</option>)}
                                </select>
                                <CaretDown size={12} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#059669' }} />
                            </div>
                            <input placeholder="Unit Rate ($)" value={newItem.unitRate} onChange={e => setNewItem(p => ({ ...p, unitRate: e.target.value }))} style={inputSt} />
                            <input placeholder="Vendor / Supplier" value={newItem.vendor} onChange={e => setNewItem(p => ({ ...p, vendor: e.target.value }))} style={inputSt} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div style={{ position: 'relative' }}>
                                <select value={newItem.status} onChange={e => setNewItem(p => ({ ...p, status: e.target.value }))} style={{ ...selectSt, width: 'auto', paddingRight: '28px' }}>
                                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                                </select>
                                <CaretDown size={12} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#059669' }} />
                            </div>
                            {newItem.quantity && newItem.unitRate && (
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#065f46' }}>
                                    Budget: {computedBudget(newItem.quantity, newItem.unitRate)}
                                </span>
                            )}
                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                                <button onClick={editId ? handleSaveEdit : handleAdd}
                                    style={{ padding: '7px 18px', borderRadius: '9px', background: '#059669', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.83rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CheckCircle size={15} weight="fill" /> {editId ? 'Save Changes' : 'Add to BOQ'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                        <thead>
                            <tr style={{ background: '#f0fdf4', borderBottom: '2px solid #d1fae5', position: 'sticky', top: 0 }}>
                                {['Item / Material', 'Category', 'Quantity', 'Unit Rate', 'Budget', 'Vendor', 'Status', ''].map(h => (
                                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontWeight: 700, color: '#065f46', whiteSpace: 'nowrap', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item, idx) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fafff9' }}>
                                    <td style={{ padding: '11px 14px', fontWeight: 700, color: '#065f46', maxWidth: '200px' }}>
                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.item}</div>
                                    </td>
                                    <td style={{ padding: '11px 14px', color: '#475569' }}>{item.category}</td>
                                    <td style={{ padding: '11px 14px', color: '#334155', fontWeight: 600 }}>{item.quantity} {item.unit}</td>
                                    <td style={{ padding: '11px 14px', color: '#475569' }}>{item.unitRate}</td>
                                    <td style={{ padding: '11px 14px', fontWeight: 700, color: '#059669' }}>{item.budget}</td>
                                    <td style={{ padding: '11px 14px', color: '#64748b', fontSize: '0.8rem' }}>{item.vendor || '—'}</td>
                                    <td style={{ padding: '11px 14px' }}>
                                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.73rem', fontWeight: 700, background: statusColors[item.status]?.bg || '#f1f5f9', color: statusColors[item.status]?.color || '#64748b' }}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '11px 14px' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button onClick={() => startEdit(item)} style={{ background: '#f0fdf4', border: 'none', borderRadius: '7px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#059669' }}>
                                                <PencilSimple size={14} weight="bold" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} style={{ background: '#fef2f2', border: 'none', borderRadius: '7px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#dc2626' }}>
                                                <Trash size={14} weight="bold" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                        <Package size={36} weight="duotone" color="#d1fae5" />
                                        <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>No items found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{filtered.length} of {items.length} item{items.length !== 1 ? 's' : ''} shown</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '11px', background: 'white', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>Close</button>
                        <button onClick={handleSave}
                            style={{ padding: '10px 22px', borderRadius: '11px', background: saved ? '#065f46' : '#059669', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', transition: 'background 0.3s' }}>
                            {saved ? <><CheckCircle size={17} weight="fill" /> Saved!</> : 'Save BOQ'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BOQModal;
