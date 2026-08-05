import React, { useState } from 'react';
import {
  PieChart,
  Users,
  AlertCircle,
  Gift,
  Search,
  Edit,
  Trash2,
  Calendar,
  LayoutGrid,
  List,
  History,
  EyeOff,
  HeartHandshake,
  Sparkles,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Encounter, Person, NeedItem, GiftItem } from '../types';

interface LedgerTableProps {
  encounters: Encounter[];
  persons: Person[];
  needs: NeedItem[];
  gifts: GiftItem[];
  onOpenEditWithdraw: (encounter: Encounter) => void;
}

export const LedgerTable: React.FC<LedgerTableProps> = ({
  encounters,
  persons,
  needs,
  gifts,
  onOpenEditWithdraw,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'needs' | 'gifts' | 'withdrawn'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Stats Calculations
  const activeEncounters = encounters.filter((e) => !e.isWithdrawn);
  const withdrawnEncounters = encounters.filter((e) => e.isWithdrawn);
  const totalMeals = activeEncounters.reduce((sum, e) => sum + e.mealsShared, 0);

  // Distinct relationships count
  const uniquePersonIds = new Set(activeEncounters.map((e) => e.recipientRef));
  const distinctRelationshipsCount = uniquePersonIds.size;

  const activeNeedsCount = needs.filter((n) => n.status === 'active').length;
  const offeredGiftsCount = gifts.filter((g) => g.status === 'active').length;

  const getPerson = (personId: string) => persons.find((p) => p.id === personId);

  // Filter Logic
  const filteredEncounters = encounters.filter((enc) => {
    if (activeFilter === 'withdrawn' && !enc.isWithdrawn) return false;
    if (activeFilter !== 'withdrawn' && enc.isWithdrawn) return false;

    const matchesSearch =
      enc.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enc.lifeEvent && enc.lifeEvent.toLowerCase().includes(searchTerm.toLowerCase())) ||
      enc.recognitionNote.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'needs') {
      return needs.some((n) => n.personId === enc.recipientRef && n.status === 'active');
    }
    if (activeFilter === 'gifts') {
      return gifts.some((g) => g.personId === enc.recipientRef && g.status === 'active');
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Pies */}
        <div className="bg-amber-500/10 border border-amber-300/80 rounded-3xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center shrink-0 shadow-sm text-2xl">
            🥧
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-900/70 uppercase tracking-wider block">
              Pies & Meals Shared
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-serif font-extrabold text-amber-950">{totalMeals}</span>
              <span className="text-xs text-amber-800 font-semibold">hot pies</span>
            </div>
          </div>
        </div>

        {/* Neighbors Nurtured */}
        <div className="bg-orange-500/10 border border-orange-300/80 rounded-3xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-orange-950 flex items-center justify-center shrink-0 shadow-sm text-2xl">
            🤝
          </div>
          <div>
            <span className="text-[11px] font-bold text-orange-900/70 uppercase tracking-wider block">
              Relationships Mapped
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-serif font-extrabold text-orange-950">{distinctRelationshipsCount}</span>
              <span className="text-xs text-orange-800 font-semibold">neighbors</span>
            </div>
          </div>
        </div>

        {/* Expressed Needs */}
        <div className="bg-rose-500/10 border border-rose-300/80 rounded-3xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-rose-950 flex items-center justify-center shrink-0 shadow-sm text-2xl">
            ❤️
          </div>
          <div>
            <span className="text-[11px] font-bold text-rose-900/70 uppercase tracking-wider block">
              Expressed Needs
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-serif font-extrabold text-rose-950">{activeNeedsCount}</span>
              <span className="text-xs text-rose-800 font-semibold">active requests</span>
            </div>
          </div>
        </div>

        {/* Offered Gifts */}
        <div className="bg-emerald-500/10 border border-emerald-300/80 rounded-3xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-emerald-950 flex items-center justify-center shrink-0 shadow-sm text-2xl">
            🎁
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-900/70 uppercase tracking-wider block">
              Offered Gifts
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-serif font-extrabold text-emerald-950">{offeredGiftsCount}</span>
              <span className="text-xs text-emerald-800 font-semibold">offers of support</span>
            </div>
          </div>
        </div>

      </div>

      {/* Control Bar: Search & Filter Chips & View Mode Toggle */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-amber-700 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search neighbor name, note..."
            className="w-full bg-amber-50/50 border border-amber-200 rounded-xl pl-10 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-amber-950 text-amber-300 shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            All Entries ({activeEncounters.length})
          </button>

          <button
            onClick={() => setActiveFilter('needs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'needs'
                ? 'bg-rose-800 text-rose-100 shadow-xs'
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
            }`}
          >
            Has Needs
          </button>

          <button
            onClick={() => setActiveFilter('gifts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'gifts'
                ? 'bg-emerald-800 text-emerald-100 shadow-xs'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            Has Gifts
          </button>

          {withdrawnEncounters.length > 0 && (
            <button
              onClick={() => setActiveFilter('withdrawn')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'withdrawn'
                  ? 'bg-stone-800 text-stone-100 shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Withdrawn ({withdrawnEncounters.length})
            </button>
          )}
        </div>

        {/* Cards vs Table View Toggle */}
        <div className="flex items-center gap-1 bg-amber-100/80 p-1 rounded-xl border border-amber-200 shrink-0">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-amber-950 shadow-xs font-bold'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-amber-950 shadow-xs font-bold'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>

      </div>

      {/* Feed Cards Display */}
      {filteredEncounters.length === 0 ? (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-12 text-center space-y-3">
          <div className="text-4xl">🥧</div>
          <h3 className="font-serif font-bold text-lg text-amber-950">No Pie Entries Found</h3>
          <p className="text-xs text-amber-800 font-sans max-w-md mx-auto">
            Try adjusting your search filter or use the Voice Storyteller to record a new pie delivery!
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEncounters.map((enc) => {
            const pNeeds = needs.filter((n) => n.personId === enc.recipientRef && n.status === 'active');
            const pGifts = gifts.filter((g) => g.personId === enc.recipientRef && g.status === 'active');

            return (
              <motion.div
                key={enc.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border-2 rounded-3xl p-5 shadow-sm space-y-3 transition-all relative overflow-hidden ${
                  enc.isWithdrawn
                    ? 'bg-stone-100 border-stone-300 opacity-75'
                    : 'bg-white border-amber-200/90 hover:border-amber-400 hover:shadow-md'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-serif font-bold text-lg shadow-xs">
                      {enc.recipientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-stone-900 flex items-center gap-1.5">
                        {enc.recipientName}
                        {enc.isWithdrawn && (
                          <span className="bg-stone-200 text-stone-700 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
                            Withdrawn
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 font-sans mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-700" />
                          {enc.occurredOn}
                        </span>
                        <span>•</span>
                        <span>Witness: {enc.witness}</span>
                      </div>
                    </div>
                  </div>

                  {/* Slices Shared Badge */}
                  <div className="bg-amber-400 text-amber-950 border border-amber-500 font-black text-xs px-3 py-1.5 rounded-2xl shadow-xs flex items-center gap-1 shrink-0">
                    <span>🥧</span>
                    <span>{enc.mealsShared} {enc.mealsShared === 1 ? 'Pie' : 'Pies'}</span>
                  </div>
                </div>

                {/* Life Event tag if present */}
                {enc.lifeEvent && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-950 font-bold text-xs border border-amber-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Season: {enc.lifeEvent}</span>
                  </div>
                )}

                {/* Recognition Note Box */}
                <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-3.5 text-xs text-stone-800 font-serif italic leading-relaxed">
                  "{enc.recognitionNote}"
                </div>

                {/* Active Needs / Gifts Pills */}
                {(pNeeds.length > 0 || pGifts.length > 0) && (
                  <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-stone-100">
                    {pNeeds.map((n) => (
                      <span key={n.id} className="bg-rose-100 text-rose-900 border border-rose-200 px-2.5 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1">
                        <HeartHandshake className="w-3 h-3 text-rose-700" /> Need: {n.description}
                      </span>
                    ))}
                    {pGifts.map((g) => (
                      <span key={g.id} className="bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1">
                        <Gift className="w-3 h-3 text-emerald-700" /> Gift: {g.description}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer Controls & Revision History count */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <span className="text-[11px] text-stone-400 flex items-center gap-1 font-sans">
                    {enc.revisions.length > 0 && (
                      <span className="text-amber-800 font-semibold flex items-center gap-1">
                        <History className="w-3 h-3" /> {enc.revisions.length} revision(s)
                      </span>
                    )}
                  </span>

                  <button
                    onClick={() => onOpenEditWithdraw(enc)}
                    className="text-amber-900 hover:text-amber-950 font-bold text-xs bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300/80 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>{enc.isWithdrawn ? 'View Audit Record' : 'Edit / Withdraw'}</span>
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Table View Fallback */
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-950 text-amber-100 font-serif text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Pies</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Life Event</th>
                  <th className="px-4 py-3">Recognition Note</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredEncounters.map((enc) => (
                  <tr key={enc.id} className={enc.isWithdrawn ? 'bg-stone-50 opacity-60' : 'hover:bg-amber-50/30'}>
                    <td className="px-4 py-3 font-bold text-stone-900">{enc.recipientName}</td>
                    <td className="px-4 py-3 font-extrabold text-amber-800">🥧 {enc.mealsShared}</td>
                    <td className="px-4 py-3">{enc.occurredOn}</td>
                    <td className="px-4 py-3 font-semibold text-amber-900">{enc.lifeEvent || '—'}</td>
                    <td className="px-4 py-3 font-serif italic max-w-xs truncate">{enc.recognitionNote}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onOpenEditWithdraw(enc)}
                        className="text-amber-900 hover:underline font-bold"
                      >
                        Edit / Retract
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
