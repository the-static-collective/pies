import React, { useState, useEffect } from 'react';
import type { Encounter } from '../types';
import { X, Save, AlertTriangle, History, Trash2, EyeOff, Edit3 } from 'lucide-react';

interface EncounterEditWithdrawModalProps {
  encounter: Encounter | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCorrection: (
    encounterId: string,
    updatedValues: {
      recipientName: string;
      mealsShared: number;
      occurredOn: string;
      lifeEvent: string;
      recognitionNote: string;
    },
    reason: string
  ) => void;
  onWithdraw: (encounterId: string, reason: string) => void;
  onPermanentErase: (encounterId: string) => void;
}

export const EncounterEditWithdrawModal: React.FC<EncounterEditWithdrawModalProps> = ({
  encounter,
  isOpen,
  onClose,
  onSaveCorrection,
  onWithdraw,
  onPermanentErase,
}) => {
  if (!isOpen || !encounter) return null;

  const [mode, setMode] = useState<'correct' | 'withdraw' | 'erase' | 'history'>('correct');

  const [recipientName, setRecipientName] = useState(encounter.recipientName);
  const [mealsShared, setMealsShared] = useState(encounter.mealsShared);
  const [occurredOn, setOccurredOn] = useState(encounter.occurredOn);
  const [lifeEvent, setLifeEvent] = useState(encounter.lifeEvent || '');
  const [recognitionNote, setRecognitionNote] = useState(encounter.recognitionNote);
  const [correctionReason, setCorrectionReason] = useState('');
  const [withdrawReason, setWithdrawReason] = useState('');

  useEffect(() => {
    if (encounter) {
      setRecipientName(encounter.recipientName);
      setMealsShared(encounter.mealsShared);
      setOccurredOn(encounter.occurredOn);
      setLifeEvent(encounter.lifeEvent || '');
      setRecognitionNote(encounter.recognitionNote);
      setCorrectionReason('');
      setWithdrawReason('');
      setMode('correct');
    }
  }, [encounter, isOpen]);

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionReason.trim()) {
      alert('Please state a reason for this correction to maintain testimony lineage.');
      return;
    }
    onSaveCorrection(
      encounter.id,
      {
        recipientName: recipientName.trim(),
        mealsShared: Number(mealsShared) || 0,
        occurredOn,
        lifeEvent: lifeEvent.trim(),
        recognitionNote: recognitionNote.trim(),
      },
      correctionReason.trim()
    );
    onClose();
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onWithdraw(encounter.id, withdrawReason.trim() || 'Withdrawn by Paula');
    onClose();
  };

  const handleEraseConfirm = () => {
    onPermanentErase(encounter.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-xl w-full shadow-xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-5 flex items-center justify-between border-b border-stone-800">
          <div>
            <span className="text-amber-400 text-[11px] font-semibold tracking-wider uppercase block">
              Testimony Lineage Management
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-100 mt-0.5">
              Encounter: {encounter.recipientName} ({encounter.occurredOn})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-stone-100 p-2 border-b border-stone-200 flex items-center justify-around text-xs font-medium text-stone-700">
          <button
            onClick={() => setMode('correct')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              mode === 'correct' ? 'bg-white text-amber-900 font-bold shadow-xs' : 'hover:bg-stone-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-700" />
            <span>Append Correction</span>
          </button>

          <button
            onClick={() => setMode('history')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              mode === 'history' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'hover:bg-stone-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-stone-600" />
            <span>Revision History ({encounter.revisions.length})</span>
          </button>

          <button
            onClick={() => setMode('withdraw')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              mode === 'withdraw' ? 'bg-white text-amber-900 font-bold shadow-xs' : 'hover:bg-stone-200'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5 text-amber-700" />
            <span>Withdraw</span>
          </button>

          <button
            onClick={() => setMode('erase')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              mode === 'erase' ? 'bg-rose-100 text-rose-900 font-bold shadow-xs' : 'hover:bg-rose-50 text-rose-800'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-700" />
            <span>Erase</span>
          </button>
        </div>

        {/* Mode Content */}
        <div className="p-6">
          {mode === 'correct' && (
            <form onSubmit={handleCorrectionSubmit} className="space-y-4">
              <p className="text-xs text-stone-600 bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed">
                <strong className="text-amber-900">Law of Lineage:</strong> Editing does not rewrite history. It appends a signed correction record that supersedes prior testimony while preserving the original observation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Meals / Pies Shared
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={mealsShared}
                    onChange={(e) => setMealsShared(parseInt(e.target.value) || 0)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Occurred Date
                  </label>
                  <input
                    type="date"
                    value={occurredOn}
                    onChange={(e) => setOccurredOn(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Life Event / Season
                  </label>
                  <input
                    type="text"
                    value={lifeEvent}
                    onChange={(e) => setLifeEvent(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Recognition Note
                </label>
                <textarea
                  rows={2}
                  value={recognitionNote}
                  onChange={(e) => setRecognitionNote(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm text-stone-900 font-serif italic"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-900 mb-1">
                  Reason for Correction *
                </label>
                <input
                  type="text"
                  required
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="e.g., Spelling correction, clarified meal count"
                  className="w-full bg-amber-50/50 border border-amber-300 rounded-xl px-3 py-2 text-sm text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-medium px-4 py-2 rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Append Superseding Revision</span>
                </button>
              </div>
            </form>
          )}

          {mode === 'history' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Historical Testimony Lineage
              </h4>
              {encounter.revisions.length === 0 ? (
                <p className="text-xs text-stone-500 italic py-4 text-center bg-stone-50 rounded-xl border border-stone-200">
                  This encounter is in its original admitted form. No prior revisions exist.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {encounter.revisions.map((rev, idx) => (
                    <div key={idx} className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between text-stone-500 font-mono text-[10px]">
                        <span>Revised by {rev.revisedBy} on {new Date(rev.revisedAt).toLocaleString()}</span>
                      </div>
                      <p className="font-semibold text-stone-800">
                        Reason: <span className="font-normal italic text-stone-600">{rev.reason || 'Not specified'}</span>
                      </p>
                      <div className="text-[11px] text-stone-600 bg-white p-2 rounded border border-stone-200 space-y-0.5 mt-1 font-mono">
                        {rev.previousValue.recipientName && <div>Prior Name: {rev.previousValue.recipientName}</div>}
                        {rev.previousValue.mealsShared !== undefined && <div>Prior Meals: {rev.previousValue.mealsShared}</div>}
                        {rev.previousValue.recognitionNote && <div className="italic">"{rev.previousValue.recognitionNote}"</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {mode === 'withdraw' && (
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-950 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-amber-900">
                  <EyeOff className="w-4 h-4 text-amber-700" />
                  Withdraw from Active Testimony
                </span>
                <p>
                  Withdrawing hides this encounter from the current active ledger without erasing local testimony or violating history.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Reason for Withdrawal
                </label>
                <input
                  type="text"
                  value={withdrawReason}
                  onChange={(e) => setWithdrawReason(e.target.value)}
                  placeholder="e.g., Requested privacy, visit rescheduled"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-medium px-4 py-2 rounded-xl shadow transition-colors"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          )}

          {mode === 'erase' && (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-950 space-y-2">
                <span className="font-bold flex items-center gap-1.5 text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  Permanent Erase (Local Device Erase)
                </span>
                <p>
                  This action permanently removes this record from this device's storage. Private data will no longer exist locally.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEraseConfirm}
                  className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Permanently Erase from Device</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
