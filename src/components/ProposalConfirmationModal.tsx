import React, { useState } from 'react';
import type { ExtractionProposal, DisclosureLevel } from '../types';
import { Sparkles, Check, X, HelpCircle, FileText, Calendar, User, PieChart, HeartHandshake, Eye, Lock, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface ProposalConfirmationModalProps {
  proposal: ExtractionProposal | null;
  isOpen: boolean;
  onConfirm: (finalData: {
    recipientName: string;
    mealsShared: number;
    occurredOn: string;
    lifeEvent: string;
    expressedNeed: string;
    needDisclosure: DisclosureLevel;
    needPermissionConfirmed: boolean;
    offeredGift: string;
    giftDisclosure: DisclosureLevel;
    giftPermissionConfirmed: boolean;
    recognitionNote: string;
  }) => void;
  onSaveUnprocessed: (transcript: string) => void;
  onDiscard: () => void;
}

export const ProposalConfirmationModal: React.FC<ProposalConfirmationModalProps> = ({
  proposal,
  isOpen,
  onConfirm,
  onSaveUnprocessed,
  onDiscard,
}) => {
  if (!isOpen || !proposal) return null;

  const [recipientName, setRecipientName] = useState(proposal.recipient_name.proposedValue);
  const [mealsShared, setMealsShared] = useState(proposal.meals_shared.proposedValue || 2);
  const [occurredOn, setOccurredOn] = useState(proposal.occurredOn.proposedValue || new Date().toISOString().split('T')[0]);
  const [lifeEvent, setLifeEvent] = useState(proposal.life_event?.proposedValue || '');
  const [expressedNeed, setExpressedNeed] = useState(proposal.expressed_need?.proposedValue || '');
  const [needDisclosure, setNeedDisclosure] = useState<DisclosureLevel>('okay_to_seek_help_without_name');
  const [needPermissionConfirmed, setNeedPermissionConfirmed] = useState(true);

  const [offeredGift, setOfferedGift] = useState(proposal.offered_gift?.proposedValue || '');
  const [giftDisclosure, setGiftDisclosure] = useState<DisclosureLevel>('okay_to_share_with_named_person');
  const [giftPermissionConfirmed, setGiftPermissionConfirmed] = useState(true);

  const [recognitionNote, setRecognitionNote] = useState(proposal.recognition_note.proposedValue);
  const [showTranscript, setShowTranscript] = useState(false);

  // Confidence badge helper
  const renderConfidenceBadge = (confidence: 'explicit' | 'inferred' | 'unknown', excerpt?: string) => {
    if (confidence === 'explicit') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300" title={excerpt ? `Explicit: "${excerpt}"` : 'Explicitly stated'}>
          <Check className="w-2.5 h-2.5" /> Explicit
        </span>
      );
    }
    if (confidence === 'inferred') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300" title={excerpt ? `Inferred: "${excerpt}"` : 'Inferred by AI'}>
          <Sparkles className="w-2.5 h-2.5 text-amber-700" /> Inferred
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
        <HelpCircle className="w-2.5 h-2.5" /> Unstated
      </span>
    );
  };

  const handleConfirmSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    fireCelebrationConfetti();
    onConfirm({
      recipientName: recipientName.trim() || 'Community Neighbor',
      mealsShared: Number(mealsShared) || 1,
      occurredOn: occurredOn || new Date().toISOString().split('T')[0],
      lifeEvent: lifeEvent.trim(),
      expressedNeed: expressedNeed.trim(),
      needDisclosure,
      needPermissionConfirmed,
      offeredGift: offeredGift.trim(),
      giftDisclosure,
      giftPermissionConfirmed,
      recognitionNote: recognitionNote.trim() || proposal.rawTranscript,
    });
  };

  return (
    <div className="fixed inset-0 bg-amber-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white border-2 border-amber-300 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="bg-amber-950 text-amber-50 p-5 flex items-center justify-between border-b border-amber-800">
          <div>
            <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider block">
              Gemini AI Structured Reflection
            </span>
            <h3 className="font-serif font-extrabold text-xl text-amber-100 mt-0.5 flex items-center gap-2">
              <span>Review & Confirm Pie Story</span>
              <span className="text-lg">🥧</span>
            </h3>
            <p className="text-xs text-amber-300/80 font-sans">
              Verify Gemini's extracted details before admitting this entry to Paula's field ledger.
            </p>
          </div>
          <button
            onClick={onDiscard}
            className="text-amber-300 hover:text-white p-1.5 rounded-xl hover:bg-amber-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmSubmission} className="p-6 space-y-4 text-xs">
          
          {/* Transcript Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-amber-900">
                <FileText className="w-4 h-4 text-amber-800" />
                Original Spoken Reflection
              </span>
              <button
                type="button"
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-amber-900 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                {showTranscript ? 'Hide' : 'View Full Story'}
              </button>
            </div>
            {showTranscript && (
              <p className="mt-2.5 pt-2 border-t border-amber-200 font-serif italic text-stone-800 leading-relaxed max-h-36 overflow-y-auto">
                "{proposal.rawTranscript}"
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Recipient Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-800" />
                  Neighbor Name
                </label>
                {renderConfidenceBadge(proposal.recipient_name.confidence, proposal.recipient_name.sourceExcerpt)}
              </div>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-amber-50/50 border border-amber-300 rounded-xl px-3 py-2 text-sm text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Meals Shared */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-800 flex items-center gap-1">
                  <PieChart className="w-3.5 h-3.5 text-amber-800" />
                  Pies Shared
                </label>
                {renderConfidenceBadge(proposal.meals_shared.confidence, proposal.meals_shared.sourceExcerpt)}
              </div>
              <input
                type="number"
                min={1}
                value={mealsShared}
                onChange={(e) => setMealsShared(parseInt(e.target.value) || 1)}
                className="w-full bg-amber-50/50 border border-amber-300 rounded-xl px-3 py-2 text-sm text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-800" />
                  Date Occurred
                </label>
                {renderConfidenceBadge(proposal.occurredOn.confidence, proposal.occurredOn.sourceExcerpt)}
              </div>
              <input
                type="date"
                value={occurredOn}
                onChange={(e) => setOccurredOn(e.target.value)}
                className="w-full bg-amber-50/50 border border-amber-300 rounded-xl px-3 py-2 text-sm text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Life Event */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-800">Season of Life / Event</label>
                {proposal.life_event && renderConfidenceBadge(proposal.life_event.confidence, proposal.life_event.sourceExcerpt)}
              </div>
              <input
                type="text"
                value={lifeEvent}
                onChange={(e) => setLifeEvent(e.target.value)}
                placeholder="e.g. Expecting baby, recovering"
                className="w-full bg-amber-50/50 border border-amber-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Need */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-rose-950 flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                Expressed Need Detected
              </label>
              {proposal.expressed_need
                ? renderConfidenceBadge(proposal.expressed_need.confidence, proposal.expressed_need.sourceExcerpt)
                : <span className="text-[10px] text-stone-400">None detected</span>}
            </div>
            <input
              type="text"
              value={expressedNeed}
              onChange={(e) => setExpressedNeed(e.target.value)}
              placeholder="Leave blank if no need was expressed"
              className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-sm text-rose-950 focus:outline-none"
            />
            {expressedNeed.trim() && (
              <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                <span className="font-bold text-rose-900">Disclosure:</span>
                <select
                  value={needDisclosure}
                  onChange={(e) => setNeedDisclosure(e.target.value as DisclosureLevel)}
                  className="bg-white border border-rose-300 rounded-lg px-2 py-1 text-xs font-semibold text-rose-950"
                >
                  <option value="okay_to_seek_help_without_name">Anonymous Seeking</option>
                  <option value="okay_to_share_with_named_person">Named Share Allowed</option>
                  <option value="public">Public Board</option>
                  <option value="private_to_paula">Private to Paula</option>
                </select>
              </div>
            )}
          </div>

          {/* Gift */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-emerald-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Offered Gift Detected
              </label>
              {proposal.offered_gift
                ? renderConfidenceBadge(proposal.offered_gift.confidence, proposal.offered_gift.sourceExcerpt)
                : <span className="text-[10px] text-stone-400">None detected</span>}
            </div>
            <input
              type="text"
              value={offeredGift}
              onChange={(e) => setOfferedGift(e.target.value)}
              placeholder="Leave blank if no gift was offered"
              className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-sm text-emerald-950 focus:outline-none"
            />
            {offeredGift.trim() && (
              <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                <span className="font-bold text-emerald-900">Disclosure:</span>
                <select
                  value={giftDisclosure}
                  onChange={(e) => setGiftDisclosure(e.target.value as DisclosureLevel)}
                  className="bg-white border border-emerald-300 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-950"
                >
                  <option value="okay_to_share_with_named_person">Named Share Allowed</option>
                  <option value="public">Public Board</option>
                  <option value="okay_to_seek_help_without_name">Anonymous Seeking</option>
                  <option value="private_to_paula">Private to Paula</option>
                </select>
              </div>
            )}
          </div>

          {/* Recognition Note */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-800">
                Human Witness Recognition Note *
              </label>
              {renderConfidenceBadge(proposal.recognition_note.confidence, proposal.recognition_note.sourceExcerpt)}
            </div>
            <textarea
              required
              rows={3}
              value={recognitionNote}
              onChange={(e) => setRecognitionNote(e.target.value)}
              className="w-full bg-amber-50/50 border border-amber-300 rounded-xl p-3 text-sm text-stone-900 font-serif italic focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onSaveUnprocessed(proposal.rawTranscript)}
              className="text-stone-600 hover:text-stone-900 text-xs underline font-medium"
            >
              Save raw transcript locally
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDiscard}
                className="px-4 py-2 font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                className="bg-amber-950 hover:bg-amber-900 text-amber-300 font-extrabold px-6 py-2.5 rounded-2xl shadow transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-amber-400" />
                <span>Admit Story to Ledger 🥧</span>
              </button>
            </div>
          </div>

        </form>
      </motion.div>
    </div>
  );
};
