import React from 'react';
import { PieChart, Heart, Sheet, Sparkles, Plus, Users, Gift, Shield, HardDrive, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  totalMeals: number;
  goalMeals: number;
  totalRelationships: number;
  activeNeedsCount: number;
  activeConnectionsCount: number;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenExportModal: () => void;
  onOpenManualModal: () => void;
  onScrollToVoice: () => void;
  onOpenTechDrawer?: () => void;
  onSelectTab: (tab: 'ledger' | 'needs-gifts' | 'possible-connections') => void;
  activeTab: 'ledger' | 'needs-gifts' | 'possible-connections';
}

export const Navbar: React.FC<NavbarProps> = ({
  totalMeals,
  goalMeals,
  totalRelationships,
  activeNeedsCount,
  activeConnectionsCount,
  isDemoMode,
  onToggleDemoMode,
  onOpenExportModal,
  onOpenManualModal,
  onScrollToVoice,
  onOpenTechDrawer,
  onSelectTab,
  activeTab,
}) => {
  const percentage = Math.min(Math.round((totalMeals / goalMeals) * 100), 100);

  return (
    <header className="bg-amber-950/95 backdrop-blur-md text-amber-50 border-b border-amber-800/80 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.08 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-900/40 flex items-center justify-center cursor-pointer"
              onClick={onScrollToVoice}
            >
              <div className="w-full h-full bg-amber-950 rounded-[14px] flex items-center justify-center text-amber-300">
                <span className="text-2xl leading-none">🥧</span>
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-amber-100 tracking-tight font-serif flex items-center gap-1.5">
                  Pies
                  <span className="text-amber-400 text-xs font-sans font-semibold bg-amber-900/90 border border-amber-700/60 px-2 py-0.5 rounded-full">
                    A Simpler Pie Ledger
                  </span>
                </h1>
              </div>
              <p className="text-xs text-amber-200/80 italic font-serif">
                Paula's mutual aid notebook • Preserving relationship memory with care
              </p>
            </div>
          </div>

          {/* Goal Milestone Widget */}
          <div className="bg-amber-900/50 border border-amber-700/50 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-inner">
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="rgba(217, 119, 6, 0.2)" strokeWidth="4" fill="transparent" />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="100"
                  strokeDashoffset={100 - percentage}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-amber-300">{percentage}%</span>
            </div>
            <div className="flex-1 min-w-[130px]">
              <div className="flex justify-between items-center text-xs mb-0.5">
                <span className="font-semibold text-amber-100 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  Pies Shared
                </span>
                <span className="font-extrabold text-amber-300">
                  {totalMeals} / {goalMeals}
                </span>
              </div>
              <div className="w-full bg-amber-950 rounded-full h-2 overflow-hidden border border-amber-800/80">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 h-2 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons & Mode Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Demo / Real Switch */}
            <div className="bg-amber-900/60 border border-amber-800 rounded-xl p-1 px-2 flex items-center gap-2 text-xs">
              <span className="text-amber-300/80 text-[11px] font-medium hidden sm:inline">Data:</span>
              <button
                onClick={onToggleDemoMode}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer shadow-xs ${
                  isDemoMode
                    ? 'bg-amber-400 text-amber-950 hover:bg-amber-300'
                    : 'bg-emerald-600 text-emerald-50 hover:bg-emerald-500'
                }`}
              >
                {isDemoMode ? '✨ Demo Mode' : '🥧 Paula Real'}
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onScrollToVoice}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-amber-950 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-950" />
              <span>Voice Story</span>
            </motion.button>

            <button
              onClick={onOpenExportModal}
              className="bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 font-medium text-xs sm:text-sm px-3 py-2 rounded-xl border border-emerald-600/50 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Export to Sheets or CSV"
            >
              <Sheet className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={onOpenManualModal}
              className="bg-amber-900 hover:bg-amber-800 text-amber-200 font-medium text-xs sm:text-sm px-3 py-2 rounded-xl transition-colors flex items-center gap-1 border border-amber-700/60 cursor-pointer"
              title="Record pie encounter manually"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Add Pie</span>
            </button>

            {onOpenTechDrawer && (
              <button
                onClick={onOpenTechDrawer}
                className="bg-amber-900/40 hover:bg-amber-800 text-amber-300/90 p-2 rounded-xl transition-colors border border-amber-700/40 cursor-pointer"
                title="Philosophy & Field Notes"
              >
                <Info className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-amber-800/60">
          <div className="flex items-center gap-1.5 bg-amber-900/60 p-1 rounded-2xl border border-amber-800/80 overflow-x-auto w-full sm:w-auto">
            
            {/* Ledger Tab */}
            <button
              onClick={() => onSelectTab('ledger')}
              className={`relative px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'ledger'
                  ? 'bg-amber-400 text-amber-950 shadow-md font-bold'
                  : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Pie Journal</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'ledger' ? 'bg-amber-950/20 text-amber-950' : 'bg-amber-800 text-amber-200'
              }`}>
                {totalRelationships}
              </span>
            </button>

            {/* Needs & Gifts Tab */}
            <button
              onClick={() => onSelectTab('needs-gifts')}
              className={`relative px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'needs-gifts'
                  ? 'bg-amber-400 text-amber-950 shadow-md font-bold'
                  : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-800/50'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Needs & Gifts</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'needs-gifts' ? 'bg-amber-950/20 text-amber-950' : 'bg-amber-800 text-amber-200'
              }`}>
                {activeNeedsCount}
              </span>
            </button>

            {/* Magic Connections Tab */}
            <button
              onClick={() => onSelectTab('possible-connections')}
              className={`relative px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'possible-connections'
                  ? 'bg-amber-400 text-amber-950 shadow-md font-bold'
                  : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Magic Matcher</span>
              {activeConnectionsCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500 text-white animate-pulse">
                  {activeConnectionsCount}
                </span>
              )}
            </button>

          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-amber-300/70 font-medium">
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span>Encrypted locally • Consent-first mutual aid</span>
          </div>
        </div>

      </div>
    </header>
  );
};
