import React, { useState } from 'react';
import type { ConnectionProposal, NeedItem, GiftItem, Person, ConnectionStatus } from '../types';
import { HeartHandshake, Sparkles, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2, XCircle, Clock, Lock, MessageSquare, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fireMatchConfetti } from '../utils/confetti';

interface PossibleConnectionsProps {
  proposals: ConnectionProposal[];
  needs: NeedItem[];
  gifts: GiftItem[];
  persons: Person[];
  onUpdateProposalStatus: (proposalId: string, newStatus: ConnectionStatus, note?: string) => void;
  onUpdatePrivateNote: (proposalId: string, note: string) => void;
}

export const PossibleConnections: React.FC<PossibleConnectionsProps> = ({
  proposals,
  needs,
  gifts,
  persons,
  onUpdateProposalStatus,
  onUpdatePrivateNote,
}) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  const getPerson = (personId: string) => persons.find((p) => p.id === personId);
  const getNeed = (needId: string) => needs.find((n) => n.id === needId);
  const getGift = (giftId: string) => gifts.find((g) => g.id === giftId);

  // Status badge helper
  const renderStatusBadge = (status: ConnectionStatus) => {
    switch (status) {
      case 'suggested':
        return <span className="bg-amber-100 text-amber-950 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-700" /> System Suggested</span>;
      case 'reviewed_by_paula':
        return <span className="bg-stone-200 text-stone-800 border border-stone-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-stone-600" /> Reviewed by Paula</span>;
      case 'permission_requested':
        return <span className="bg-amber-200 text-amber-950 border border-amber-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-amber-800" /> Consent Requested</span>;
      case 'accepted_by_both':
        return <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Mutual Consent Given</span>;
      case 'introduced':
        return <span className="bg-emerald-200 text-emerald-950 border border-emerald-400 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> Introduction Facilitated</span>;
      case 'completed':
        return <span className="bg-emerald-900 text-emerald-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><HeartHandshake className="w-3.5 h-3.5 text-emerald-300" /> Support Completed 🎉</span>;
      case 'declined':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-rose-600" /> Connection Declined</span>;
      case 'withdrawn':
        return <span className="bg-stone-100 text-stone-500 border border-stone-200 px-3 py-1 rounded-full text-xs font-bold">Withdrawn</span>;
    }
  };

  const getNextStatusAction = (currentStatus: ConnectionStatus) => {
    switch (currentStatus) {
      case 'suggested':
        return {
          nextStatus: 'reviewed_by_paula' as ConnectionStatus,
          label: 'Step 1: Mark Reviewed by Paula',
          description: 'Acknowledge potential match',
        };
      case 'reviewed_by_paula':
        return {
          nextStatus: 'permission_requested' as ConnectionStatus,
          label: 'Step 2: Ask Consent of Both Parties',
          description: 'Inquire privately if both wish to connect',
        };
      case 'permission_requested':
        return {
          nextStatus: 'accepted_by_both' as ConnectionStatus,
          label: 'Step 3: Confirm Mutual Consent Received',
          description: 'Both neighbors agreed to an introduction',
        };
      case 'accepted_by_both':
        return {
          nextStatus: 'introduced' as ConnectionStatus,
          label: 'Step 4: Facilitate Introduction ✨',
          description: 'Connect neighbors warm & safely',
        };
      case 'introduced':
        return {
          nextStatus: 'completed' as ConnectionStatus,
          label: 'Step 5: Mark Support Completed 🎉',
          description: 'Mutual aid complete!',
        };
      default:
        return null;
    }
  };

  const handleStepClick = (proposalId: string, nextStatus: ConnectionStatus) => {
    if (nextStatus === 'introduced' || nextStatus === 'completed' || nextStatus === 'accepted_by_both') {
      fireMatchConfetti();
    }
    onUpdateProposalStatus(proposalId, nextStatus);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 to-orange-500/15 border-2 border-amber-300 rounded-3xl p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center font-bold text-xl shadow-xs">
            🪄
          </div>
          <div>
            <h3 className="font-serif font-extrabold text-2xl text-amber-950">
              Magic Mutual Aid Matcher
            </h3>
            <p className="text-xs text-amber-900 font-sans">
              Matches neighbor Needs & Gifts through a 5-step consent pipeline. No forced intros — every connection requires permission.
            </p>
          </div>
        </div>
      </div>

      {proposals.length === 0 ? (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-12 text-center space-y-3">
          <div className="text-4xl">🪄</div>
          <h3 className="font-serif font-bold text-lg text-amber-950">No Connection Proposals Yet</h3>
          <p className="text-xs text-amber-800 font-sans max-w-md mx-auto">
            When neighbors express Needs and offer Gifts in their pie encounters, Gemini match algorithms propose potential connections here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((prop) => {
            const needPerson = getPerson(prop.needPersonId);
            const giftPerson = getPerson(prop.giftPersonId);
            const need = getNeed(prop.needId);
            const gift = getGift(prop.giftId);

            const nextStep = getNextStatusAction(prop.status);

            return (
              <motion.div
                key={prop.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-amber-300/80 rounded-3xl p-6 shadow-sm space-y-4 relative overflow-hidden"
              >
                {/* Status & Category Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {renderStatusBadge(prop.status)}
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-amber-200">
                      Category: {prop.matchedCategory}
                    </span>
                  </div>

                  <span className="text-[11px] text-stone-400 font-sans italic">
                    Match Reason: "{prop.reason}"
                  </span>
                </div>

                {/* Connection Bridge: Need Person <===> Gift Person */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                  
                  {/* Need Side */}
                  <div className="bg-rose-50/70 border-2 border-rose-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5 font-serif">
                        <HeartHandshake className="w-4 h-4 text-rose-600" />
                        {needPerson?.name || 'Neighbor needing support'}
                      </span>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-200/80 px-2 py-0.5 rounded-md uppercase">
                        EXPRESSED NEED
                      </span>
                    </div>
                    <p className="text-xs font-medium text-stone-800 leading-relaxed">
                      "{need?.description || 'Expressed need item'}"
                    </p>
                  </div>

                  {/* Gift Side */}
                  <div className="bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 font-serif">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        {giftPerson?.name || 'Neighbor offering gift'}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/80 px-2 py-0.5 rounded-md uppercase">
                        OFFERED GIFT
                      </span>
                    </div>
                    <p className="text-xs font-medium text-stone-800 leading-relaxed">
                      "{gift?.description || 'Offered gift item'}"
                    </p>
                  </div>

                </div>

                {/* Paula Private Notes */}
                <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-800" />
                      Paula's Mediation Note:
                    </span>
                    {editingNoteId !== prop.id && (
                      <button
                        onClick={() => {
                          setEditingNoteId(prop.id);
                          setTempNoteText(prop.paulaPrivateNote || '');
                        }}
                        className="text-amber-800 hover:underline text-[11px] font-semibold"
                      >
                        Edit Note
                      </button>
                    )}
                  </div>

                  {editingNoteId === prop.id ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={tempNoteText}
                        onChange={(e) => setTempNoteText(e.target.value)}
                        className="flex-1 bg-white border border-amber-300 rounded-xl px-2.5 py-1 text-xs text-stone-900"
                        placeholder="Private note regarding consent or progress..."
                      />
                      <button
                        onClick={() => {
                          onUpdatePrivateNote(prop.id, tempNoteText);
                          setEditingNoteId(null);
                        }}
                        className="bg-amber-900 text-amber-100 font-bold px-3 py-1 rounded-xl text-xs"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p className="text-stone-700 font-serif italic text-xs">
                      {prop.paulaPrivateNote || 'No private note recorded.'}
                    </p>
                  )}
                </div>

                {/* Consent Action Bar */}
                <div className="pt-2 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-stone-500 font-medium">
                    Consent Step Pipeline
                  </span>

                  <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
                    {prop.status !== 'declined' && prop.status !== 'withdrawn' && prop.status !== 'completed' && (
                      <button
                        onClick={() => onUpdateProposalStatus(prop.id, 'declined')}
                        className="text-xs text-rose-700 hover:text-rose-900 font-semibold px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors"
                      >
                        Decline Match
                      </button>
                    )}

                    {nextStep && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleStepClick(prop.id, nextStep.nextStatus)}
                        className="bg-amber-950 hover:bg-amber-900 text-amber-300 font-bold px-4 py-2 rounded-2xl text-xs shadow transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{nextStep.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                      </motion.button>
                    )}
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};
