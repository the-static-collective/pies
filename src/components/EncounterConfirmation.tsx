import React from 'react';
import { Heart, CheckCircle, PieChart, Sparkles } from 'lucide-react';

interface SimpleEncounterArgs {
  recipient_name: string;
  meals_shared: number;
  date?: string;
  life_event?: string;
  expressed_need?: string;
  offered_gift?: string;
  recognition_note: string;
}

interface EncounterConfirmationProps {
  confirmationText: string;
  encounters: SimpleEncounterArgs[];
  onConfirmAll: () => void;
  onEditEncounter: (index: number) => void;
  onDiscard: () => void;
}

export const EncounterConfirmation: React.FC<EncounterConfirmationProps> = ({
  confirmationText,
  encounters,
  onConfirmAll,
  onDiscard,
}) => {
  return (
    <div className="bg-amber-50 border-2 border-amber-500/40 rounded-2xl p-5 md:p-6 shadow-xs my-6 transition-all animate-fadeIn">
      <div className="bg-amber-900/10 border border-amber-800/20 rounded-xl p-4 mb-5 flex items-start gap-3">
        <div className="p-2 bg-amber-700 text-amber-100 rounded-full shrink-0 shadow-xs mt-0.5">
          <Heart className="w-5 h-5 fill-amber-200 text-amber-200" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider font-sans">
            Witnessing Proposal Review
          </h3>
          <p className="text-base md:text-lg font-serif italic text-amber-900 font-medium leading-snug mt-1">
            "{confirmationText}"
          </p>
        </div>
      </div>

      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-amber-700" />
        Proposed Community Encounter Details ({encounters.length})
      </h4>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {encounters.map((enc, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-amber-200 shadow-xs p-4 relative"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold font-serif flex items-center gap-1 justify-center text-sm">
                  {idx + 1}
                </span>
                <div>
                  <h5 className="font-serif font-bold text-lg text-stone-900">
                    {enc.recipient_name}
                  </h5>
                  <span className="text-xs text-stone-500 font-sans">
                    Date: {enc.date || 'Today'}
                  </span>
                </div>
              </div>

              <span className="bg-amber-700 text-amber-50 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-amber-600">
                <PieChart className="w-3.5 h-3.5 text-amber-200" />
                {enc.meals_shared} {enc.meals_shared === 1 ? 'Pie' : 'Pies'}
              </span>
            </div>

            <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200/80">
              <span className="font-semibold text-amber-900 block uppercase text-[10px] tracking-wider mb-1">
                Reflection Note
              </span>
              <p className="text-stone-800 font-serif italic text-sm">
                "{enc.recognition_note}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-200">
        <button
          onClick={onDiscard}
          className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-medium"
        >
          Discard
        </button>
        <button
          onClick={onConfirmAll}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-5 py-2.5 rounded-xl shadow transition-colors flex items-center justify-center gap-2 text-xs border border-emerald-600"
        >
          <CheckCircle className="w-4 h-4 text-emerald-200" />
          <span>Confirm & Record in Ledger</span>
        </button>
      </div>
    </div>
  );
};
