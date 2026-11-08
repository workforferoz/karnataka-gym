'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OwnerBottomNav } from '@/components/OwnerBottomNav';
import { AddOn, AddOnType } from '@/types/database';
import {
  ArrowLeft,
  Package,
  Dumbbell,
  Salad,
  Plus,
  Minus,
  CheckCircle,
  Edit2,
  Save,
  Trash2,
  X,
  Sparkles,
  Filter,
  ShieldCheck,
  Eye,
  AlertCircle
} from 'lucide-react';

export default function ManageAddOnsPage() {
  const { addOns, updateAddon, createAddon, deleteAddon } = useGym();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pt' | 'diet' | 'supplement'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Edit item form state
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editType, setEditType] = useState<AddOnType>('pt');
  const [editValidity, setEditValidity] = useState<number>(30);
  const [editTrainer, setEditTrainer] = useState('');
  const [editStock, setEditStock] = useState<number>(0);
  const [editCategoryLabel, setEditCategoryLabel] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsAvailable, setEditIsAvailable] = useState<boolean>(true);

  // New item modal / form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState<number>(1500);
  const [newType, setNewType] = useState<AddOnType>('pt');
  const [newValidity, setNewValidity] = useState<number>(30);
  const [newTrainer, setNewTrainer] = useState('Vikram');
  const [newStock, setNewStock] = useState<number>(20);
  const [newCategoryLabel, setNewCategoryLabel] = useState('Personal Training');
  const [newDescription, setNewDescription] = useState('');

  // Start editing a card
  const handleStartEdit = (item: AddOn) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price);
    setEditType(item.type);
    setEditValidity(item.validity_days);
    setEditTrainer(item.trainer_name || '');
    setEditStock(item.stock);
    setEditCategoryLabel(item.category_label || (item.type === 'pt' ? 'Personal Training' : item.type === 'diet' ? 'Nutrition & Diet' : 'Supplements'));
    setEditDescription(item.description || '');
    setEditIsAvailable(item.is_available ?? true);
  };

  // Save edits
  const handleSaveEdit = async (id: string) => {
    await updateAddon(id, {
      name: editName.trim(),
      price: Number(editPrice),
      type: editType,
      validity_days: Number(editValidity),
      trainer_name: editTrainer.trim() || undefined,
      stock: Number(editStock),
      category_label: editCategoryLabel.trim(),
      description: editDescription.trim(),
      is_available: editIsAvailable
    });

    setEditingId(null);
    setStatusMsg(`"${editName}" updated successfully in Member App!`);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  // Delete item
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the Karnataka Gym store?`)) {
      await deleteAddon(id);
      setEditingId(null);
      setStatusMsg(`"${name}" has been deleted.`);
      setTimeout(() => setStatusMsg(null), 3500);
    }
  };

  // Quick Stock increment / decrement
  const updateStock = async (id: string, delta: number) => {
    const item = addOns.find((a) => a.id === id);
    if (!item) return;
    const newStock = Math.max(0, item.stock + delta);
    await updateAddon(id, { stock: newStock });
    setStatusMsg(`Stock for "${item.name}" updated to ${newStock}!`);
    setTimeout(() => setStatusMsg(null), 2500);
  };

  // Create new item
  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    await createAddon({
      name: newName.trim(),
      type: newType,
      price: Number(newPrice),
      validity_days: Number(newValidity),
      trainer_name: newType !== 'supplement' ? newTrainer.trim() : undefined,
      stock: Number(newStock),
      category_label: newCategoryLabel.trim(),
      description: newDescription.trim() || `${newName} offered by Karnataka Gym Hubballi.`,
      is_available: true
    });

    setShowAddModal(false);
    setNewName('');
    setNewDescription('');
    setStatusMsg(`New package "${newName}" added successfully to Member Store!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Filter items
  const filteredItems = addOns.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Top Navigation & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/owner/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-950/40 border border-purple-800 px-2.5 py-0.5 rounded-full">
                Store & Inventory Manager
              </span>
              <span className="text-xs text-slate-400">Total: {addOns.length} Services</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              Manage Add-Ons, PT & Supplements
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Owner control panel to edit pricing, coach assignments, stock counts, descriptions, and availability for all member store services.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-[#E5A93C]/20 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Service / Product</span>
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-[#E5A93C] text-slate-950 shadow-md'
                : 'bg-[#121622] text-slate-400 hover:text-white border border-[#232B3E]'
            }`}
          >
            <span>All Services</span>
            <span className="text-[10px] px-1.5 rounded-full bg-slate-950/20 font-mono">
              {addOns.length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('pt')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'pt'
                ? 'bg-[#E5A93C] text-slate-950 shadow-md'
                : 'bg-[#121622] text-slate-400 hover:text-white border border-[#232B3E]'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>PT Packages</span>
            <span className="text-[10px] px-1.5 rounded-full bg-slate-950/20 font-mono">
              {addOns.filter((a) => a.type === 'pt').length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('diet')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'diet'
                ? 'bg-[#E5A93C] text-slate-950 shadow-md'
                : 'bg-[#121622] text-slate-400 hover:text-white border border-[#232B3E]'
            }`}
          >
            <Salad className="w-3.5 h-3.5" />
            <span>Diet Plans</span>
            <span className="text-[10px] px-1.5 rounded-full bg-slate-950/20 font-mono">
              {addOns.filter((a) => a.type === 'diet').length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('supplement')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'supplement'
                ? 'bg-[#E5A93C] text-slate-950 shadow-md'
                : 'bg-[#121622] text-slate-400 hover:text-white border border-[#232B3E]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Supplements</span>
            <span className="text-[10px] px-1.5 rounded-full bg-slate-950/20 font-mono">
              {addOns.filter((a) => a.type === 'supplement').length}
            </span>
          </button>
        </div>

        {/* Services & Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isEditing = editingId === item.id;
            const isSupp = item.type === 'supplement';
            const isPT = item.type === 'pt';

            if (isEditing) {
              return (
                /* INLINE EDIT MODE FORM */
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#141A28] border-2 border-[#E5A93C] space-y-4 shadow-2xl animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-[#243046] pb-2.5">
                    <span className="text-xs font-extrabold text-[#E5A93C] uppercase tracking-wider flex items-center gap-1.5">
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Service Details</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Item Name */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Service / Product Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-[#182133] border border-[#2D3C57] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs font-bold text-white focus:outline-none"
                        required
                      />
                    </div>

                    {/* Price and Validity */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-full bg-[#182133] border border-[#2D3C57] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs font-mono font-bold text-[#E5A93C] focus:outline-none"
                          min={0}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Validity (Days)
                        </label>
                        <input
                          type="number"
                          value={editValidity}
                          onChange={(e) => setEditValidity(Number(e.target.value))}
                          className="w-full bg-[#182133] border border-[#2D3C57] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                          min={1}
                          required
                        />
                      </div>
                    </div>

                    {/* Category Type & Trainer / Stock */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Category Type
                        </label>
                        <select
                          value={editType}
                          onChange={(e) => {
                            const val = e.target.value as AddOnType;
                            setEditType(val);
                            if (val === 'pt') setEditCategoryLabel('Personal Training');
                            else if (val === 'diet') setEditCategoryLabel('Nutrition & Diet');
                            else setEditCategoryLabel('Supplements');
                          }}
                          className="w-full bg-[#182133] border border-[#2D3C57] focus:border-[#E5A93C] rounded-xl py-2 px-2.5 text-xs text-white focus:outline-none"
                        >
                          <option value="pt">Personal Training</option>
                          <option value="diet">Nutrition & Diet</option>
                          <option value="supplement">Supplement</option>
                        </select>
                      </div>

                      {editType === 'supplement' ? (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                            Physical Stock
                          </label>
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="w-full bg-[#182133] border border-[#2D3C57] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                            min={0}
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                            Assigned Coach
                          </label>
                          <input
                            type="text"
                            value={editTrainer}
                            onChange={(e) => setEditTrainer(e.target.value)}
                            placeholder="e.g. Vikram, Pooja"
                            className="w-full bg-[#182133] border border-[#2D3C57] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Service Description (Visible on Member Store)
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        placeholder="Detailed description of training protocol, diet chart, or supplement specs..."
                        className="w-full bg-[#182133] border border-[#2D3C57] focus:border-[#E5A93C] rounded-xl p-2.5 text-xs text-white focus:outline-none leading-relaxed"
                      />
                    </div>

                    {/* Available in Member Store Toggle */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#243046]">
                      <span className="text-xs text-slate-300 font-medium">
                        Active in Member Store:
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editIsAvailable}
                          onChange={(e) => setEditIsAvailable(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-[#253046] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-[#2C3852] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(item.id)}
                        className="bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-[#E5A93C]/20 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            /* STANDARD VIEW CARD */
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-[#2C3852] transition-colors space-y-3.5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-[#1F2739] text-[#E5A93C] flex-shrink-0">
                        {isSupp ? (
                          <Package className="w-5 h-5" />
                        ) : isPT ? (
                          <Dumbbell className="w-5 h-5" />
                        ) : (
                          <Salad className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white leading-tight">
                          {item.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Category: {item.category_label || (isPT ? 'Personal Training' : isSupp ? 'Supplements' : 'Nutrition & Diet')} • Validity: {item.validity_days}d
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end flex-shrink-0">
                      <span className="text-base font-black text-[#E5A93C] font-mono">
                        ₹{item.price}
                      </span>
                      {item.is_available === false && (
                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">
                          Paused
                        </span>
                      )}
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-[#1C2333] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    {item.trainer_name ? (
                      <span className="text-slate-300">
                        Trainer: <strong className="text-white">{item.trainer_name}</strong>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">
                        Karnataka Gym Floor Verified
                      </span>
                    )}

                    {/* Stock controller for supplements */}
                    {isSupp && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px]">
                          Stock:{' '}
                          <strong
                            className={
                              item.stock > 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'
                            }
                          >
                            {item.stock} Units
                          </strong>
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateStock(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-[#1F2739] hover:bg-[#28324A] text-slate-300 flex items-center justify-center font-bold text-xs cursor-pointer"
                            title="Decrement stock"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => updateStock(item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 flex items-center justify-center font-bold text-xs cursor-pointer"
                            title="Increment stock"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Owner Edit Action Bar */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#19202E]">
                    <span className="text-[10px] text-slate-500 font-mono">
                      ID: {item.id}
                    </span>

                    <button
                      onClick={() => handleStartEdit(item)}
                      className="bg-[#182133] hover:bg-[#212C44] border border-[#2D3C57] text-[#E5A93C] hover:text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Service</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CREATE NEW ADD-ON MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#121622] border-2 border-[#E5A93C] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#E5A93C]/15 text-[#E5A93C]">
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white">Add New Service or Product</h2>
                    <p className="text-xs text-slate-400">Creates an instant listing in the Member App store</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNew} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Service / Product Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Strength & Conditioning 10 Sessions"
                    className="w-full bg-[#171D2B] border border-[#28354A] focus:border-[#E5A93C] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full bg-[#171D2B] border border-[#28354A] focus:border-[#E5A93C] rounded-xl py-2.5 px-3 text-xs font-mono font-bold text-[#E5A93C] focus:outline-none"
                      min={0}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Validity (Days)
                    </label>
                    <input
                      type="number"
                      value={newValidity}
                      onChange={(e) => setNewValidity(Number(e.target.value))}
                      className="w-full bg-[#171D2B] border border-[#28354A] focus:border-[#E5A93C] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                      min={1}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Category Type
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => {
                        const val = e.target.value as AddOnType;
                        setNewType(val);
                        if (val === 'pt') setNewCategoryLabel('Personal Training');
                        else if (val === 'diet') setNewCategoryLabel('Nutrition & Diet');
                        else setNewCategoryLabel('Supplements');
                      }}
                      className="w-full bg-[#171D2B] border border-[#28354A] focus:border-[#E5A93C] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                    >
                      <option value="pt">Personal Training</option>
                      <option value="diet">Nutrition & Diet</option>
                      <option value="supplement">Supplement</option>
                    </select>
                  </div>

                  {newType === 'supplement' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Initial Stock Count
                      </label>
                      <input
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(Number(e.target.value))}
                        className="w-full bg-[#171D2B] border border-[#28354A] focus:border-[#E5A93C] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                        min={0}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Assigned Coach
                      </label>
                      <input
                        type="text"
                        value={newTrainer}
                        onChange={(e) => setNewTrainer(e.target.value)}
                        placeholder="e.g. Vikram, Pooja"
                        className="w-full bg-[#171D2B] border border-[#28354A] focus:border-[#E5A93C] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Service Description
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2}
                    placeholder="Details about sessions, brand, flavor, or protocol..."
                    className="w-full bg-[#171D2B] border border-[#28354A] focus:border-[#E5A93C] rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="text-xs text-slate-400 hover:text-white px-4 py-2 rounded-xl border border-[#28354A] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-[#E5A93C]/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Create & Publish Listing</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <OwnerBottomNav />
    </div>
  );
}
