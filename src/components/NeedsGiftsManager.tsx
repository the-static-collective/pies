import React, { useState } from 'react';
import type { NeedItem, GiftItem, Person, NeedGiftStatus, DisclosureLevel, ResourceCategory } from '../types';
import { HeartHandshake, Sparkles, Lock, ShieldCheck, Check, Plus, Filter, Tag, Eye, Globe, UserCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NeedsGiftsManagerProps {
  needs: NeedItem[];
  gifts: GiftItem[];
  persons: Person[];
  onUpdateNeedStatus: (needId: string, status: NeedGiftStatus) => void;
  onUpdateNeedDisclosure: (needId: string, disclosure: DisclosureLevel, permissionConfirmed: boolean) => void;
  onUpdateGiftStatus: (giftId: string, status: NeedGiftStatus) => void;
  onUpdateGiftDisclosure: (giftId: string, disclosure: DisclosureLevel, permissionConfirmed: boolean) => void;
  onAddNeed: (newNeed: Partial<NeedItem>) => void;
  onAddGift: (newGift: Partial<GiftItem>) => void;
}

export const NeedsGiftsManager: React.FC<NeedsGiftsManagerProps> = ({
  needs,
  gifts,
  persons,
  onUpdateNeedStatus,
  onUpdateNeedDisclosure,
  onUpdateGiftStatus,
  onUpdateGiftDisclosure,
  onAddNeed,
  onAddGift,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'needs' | 'gifts'>('needs');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [selectedPersonId, setSelectedPersonId] = useState(persons[0]?.id || '');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('general');
  const [disclosure, setDisclosure] = useState<DisclosureLevel>('private_to_paula');
  const [permissionConfirmed, setPermissionConfirmed] = useState(false);

  const getPersonName = (personId: string) => {
    const p = persons.find((item) => item.id === personId);
    return p ? p.name : 'Community Neighbor';
  };

  const filteredNeeds = needs.filter((n) => statusFilter === 'all' || n.status === statusFilter);
  const filteredGifts = gifts.filter((g) => statusFilter === 'all' || g.status === statusFilter);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !selectedPersonId) {
      alert('Please select a person and enter a description.');
      return;
    }

    if (activeSubTab === 'needs') {
      onAddNeed({
        personId: selectedPersonId,
        description: description.trim(),
        category,
        status: 'active',
        disclosure,
        permissionConfirmed,
      });
    } else {
      onAddGift({
        personId: selectedPersonId,
        description: description.trim(),
        category,
        status: 'active',
        disclosure,
        permissionConfirmed,
      });
    }

    setIsAddModalOpen(false);
    setDescription('');
  };

  // Disclosure Icon & Badge Helper
  const renderDisclosureBadge = (disclosure: DisclosureLevel, permissionConfirmed: boolean) => {
    switch (disclosure) {
      case 'private_to_paula':
        return (
          <span className="bg-stone-100 text-stone-800 border border-stone-300 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1">
            <Lock className="w-3 h-3 text-stone-600" /> Private to Paula
          </span>
        );
      case 'okay_to_seek_help_without_name':
        return (
          <span className="bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1">
            <Eye className="w-3 h-3 text-amber-800" /> Anonymous Seeking
          </span>
        );
      case 'okay_to_share_with_named_person':
        return (
          <span className="bg-blue-100 text-blue-950 border border-blue-300 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-blue-800" /> Named Share Approved
          </span>
        );
      case 'public':
        return (
          <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1">
            <Globe className="w-3 h-3 text-emerald-800" /> Public Community Board
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Subtabs */}
      <div className="bg-white border-2 border-amber-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
          <div>
            <h3 className="font-serif font-extrabold text-2xl text-amber-950 flex items-center gap-2">
              <span>{activeSubTab === 'needs' ? '❤️ Expressed Needs' : '🎁 Offered Gifts'}</span>
            </h3>
            <p className="text-xs text-stone-600 mt-1 font-sans">
              Track lifecycle support items and respect privacy boundaries. Every item requires consent before matching.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-amber-950 hover:bg-amber-900 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-2xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add {activeSubTab === 'needs' ? 'Need' : 'Gift'} Directly</span>
          </button>
        </div>

        {/* Toggle Pills */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-amber-100/80 p-1 rounded-2xl border border-amber-200">
            <button
              onClick={() => setActiveSubTab('needs')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'needs'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-amber-950 hover:bg-amber-200/60'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Expressed Needs ({needs.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('gifts')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'gifts'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-amber-950 hover:bg-amber-200/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Offered Gifts ({gifts.length})</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-amber-50 border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="confirmed">Confirmed</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeSubTab === 'needs'
          ? filteredNeeds.map((need) => (
              <motion.div
                key={need.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-rose-200 rounded-3xl p-5 shadow-xs space-y-3 relative overflow-hidden flex flex-col justify-between hover:border-rose-400 hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-rose-600" />
                      {getPersonName(need.personId)}
                    </span>
                    <span className="bg-rose-100 text-rose-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-rose-300">
                      Need
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-stone-800 leading-snug">
                    {need.description}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-stone-200 uppercase">
                      Category: {need.category}
                    </span>
                    {renderDisclosureBadge(need.disclosure, need.permissionConfirmed)}
                  </div>
                </div>

                <div className="pt-3 border-t border-rose-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-stone-500 font-medium">Status:</span>
                    <select
                      value={need.status}
                      onChange={(e) => onUpdateNeedStatus(need.id, e.target.value as NeedGiftStatus)}
                      className="bg-rose-50 border border-rose-300 rounded-lg px-2 py-1 text-xs font-bold text-rose-950 focus:outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="fulfilled">Fulfilled 🎉</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))
          : filteredGifts.map((gift) => (
              <motion.div
                key={gift.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-emerald-200 rounded-3xl p-5 shadow-xs space-y-3 relative overflow-hidden flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      {getPersonName(gift.personId)}
                    </span>
                    <span className="bg-emerald-100 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-emerald-300">
                      Gift
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-stone-800 leading-snug">
                    {gift.description}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-stone-200 uppercase">
                      Category: {gift.category}
                    </span>
                    {renderDisclosureBadge(gift.disclosure, gift.permissionConfirmed)}
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-stone-500 font-medium">Status:</span>
                    <select
                      value={gift.status}
                      onChange={(e) => onUpdateGiftStatus(gift.id, e.target.value as NeedGiftStatus)}
                      className="bg-emerald-50 border border-emerald-300 rounded-lg px-2 py-1 text-xs font-bold text-emerald-950 focus:outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="fulfilled">Fulfilled 🎉</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-2 border-amber-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <h3 className="font-serif font-extrabold text-xl text-amber-950 flex items-center gap-2">
                  <span>Add New {activeSubTab === 'needs' ? 'Need' : 'Gift'}</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Select Neighbor:</label>
                  <select
                    value={selectedPersonId}
                    onChange={(e) => setSelectedPersonId(e.target.value)}
                    className="w-full bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-sm text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {persons.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Description:</label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      activeSubTab === 'needs'
                        ? 'e.g. Needs ride to appointment'
                        : 'e.g. Offers woodworking & bench repair'
                    }
                    className="w-full bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-800 block mb-1">Category:</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                      className="w-full bg-amber-50 border border-amber-300 rounded-xl px-2.5 py-2 text-xs text-stone-900 focus:outline-none"
                    >
                      <option value="general">General</option>
                      <option value="transportation">Transportation</option>
                      <option value="food_garden">Food & Garden</option>
                      <option value="clothing_supplies">Clothing & Supplies</option>
                      <option value="home_repair">Home Repair</option>
                      <option value="care_companionship">Care & Companionship</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-800 block mb-1">Disclosure Boundary:</label>
                    <select
                      value={disclosure}
                      onChange={(e) => setDisclosure(e.target.value as DisclosureLevel)}
                      className="w-full bg-amber-50 border border-amber-300 rounded-xl px-2.5 py-2 text-xs text-stone-900 focus:outline-none"
                    >
                      <option value="private_to_paula">Private to Paula</option>
                      <option value="okay_to_seek_help_without_name">Anonymous Seeking</option>
                      <option value="okay_to_share_with_named_person">Named Share Allowed</option>
                      <option value="public">Public Board</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    id="permCheck"
                    checked={permissionConfirmed}
                    onChange={(e) => setPermissionConfirmed(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <label htmlFor="permCheck" className="text-amber-950 font-semibold cursor-pointer">
                    Explicit consent received from neighbor to record this item.
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-stone-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-950 text-amber-300 font-bold px-5 py-2 rounded-xl shadow cursor-pointer hover:bg-amber-900"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
