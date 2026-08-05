import React, { useState, useEffect } from 'react';
import { X, Save, PieChart, Sparkles, HeartHandshake, Calendar, User, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { fireCelebrationConfetti } from '../utils/confetti';

export interface ManualEncounterData {
  id?: string;
  recipient_name: string;
  meals_shared: number;
  date: string;
  life_event?: string;
  expressed_need?: string;
  offered_gift?: string;
  recognition_note: string;
}

interface AddEncounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ManualEncounterData) => void;
  editingEncounter?: any;
}

export const AddEncounterModal: React.FC<AddEncounterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingEncounter,
}) => {
  const [recipientName, setRecipientName] = useState('');
  const [mealsShared, setMealsShared] = useState(2);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [lifeEvent, setLifeEvent] = useState('');
  const [expressedNeed, setExpressedNeed] = useState('');
  const [offeredGift, setOfferedGift] = useState('');
  const [recognitionNote, setRecognitionNote] = useState('');

  useEffect(() => {
    if (editingEncounter) {
      setRecipientName(editingEncounter.recipient_name || editingEncounter.recipientName || '');
      setMealsShared(editingEncounter.meals_shared || editingEncounter.mealsShared || 2);
      setDate(editingEncounter.date || editingEncounter.occurredOn || new Date().toISOString().split('T')[0]);
      setLifeEvent(editingEncounter.life_event || editingEncounter.lifeEvent || '');
      setExpressedNeed(editingEncounter.expressed_need || '');
      setOfferedGift(editingEncounter.offered_gift || '');
      setRecognitionNote(editingEncounter.recognition_note || editingEncounter.recognitionNote || '');
    } else {
      setRecipientName('');
      setMealsShared(2);
      setDate(new Date().toISOString().split('T')[0]);
      setLifeEvent('');
      setExpressedNeed('');
      setOfferedGift('');
      setRecognitionNote('');
    }
  }, [editingEncounter, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recognitionNote.trim()) {
      alert('Please fill out the Neighbor Name and Recognition Note.');
      return;
    }

    fireCelebrationConfetti();

    onSave({
      id: editingEncounter?.id,
      recipient_name: recipientName.trim(),
      meals_shared: Number(mealsShared) || 1,
      date,
      life_event: lifeEvent.trim(),
      expressed_need: expressedNeed.trim(),
      offered_gift: offeredGift.trim(),
      recognition_note: recognitionNote.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-amber-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white border-2 border-amber-300 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-amber-950 text-amber-50 p-5 flex items-center justify-between border-b border-amber-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center text-xl font-bold">
              🥧
            </div>
            <div>
              <h3 className="font-serif font-extrabold text-xl text-amber-100">
                {editingEncounter ? 'Edit Pie Encounter' : 'Record Pie Encounter'}
              </h3>
              <p className="text-xs text-amber-300/80 font-sans">
                Paula's Mutual Aid Field Notebook
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-300 hover:text-white p-1.5 rounded-xl hover:bg-amber-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Neighbor Name */}
            <div>
              <label className="font-bold text-stone-800 block mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-800" />
                Neighbor / Family Name
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Mrs. Gable, The Johnson Family"
                className="w-full bg-amber-50/50 border border-amber-300 rounded-xl px-3 py-2 text-sm text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Pie Slice Counter */}
            <div>
              <label className="font-bold text-stone-800 block mb-1 flex items-center gap-1">
                🥧 Pies / Slices Shared
              </label>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setMealsShared(Math.max(1, mealsShared - 1))}
                  className="w-8 h-8 rounded-lg bg-amber-200 text-amber-950 font-bold flex items-center justify-center hover:bg-amber-300 text-sm cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 text-center font-extrabold text-sm text-amber-950">
                  🥧 x {mealsShared}
                </div>
                <button
                  type="button"
                  onClick={() => setMealsShared(mealsShared + 1)}
                  className="w-8 h-8 rounded-lg bg-amber-400 text-amber-950 font-bold flex items-center justify-center hover:bg-amber-300 text-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="font-bold text-stone-800 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-800" />
                Date Occurred
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-amber-50/50 border border-amber-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Life Event */}
            <div>
              <label className="font-bold text-stone-800 block mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                Season of Life / Event
              </label>
              <input
                type="text"
                value={lifeEvent}
                onChange={(e) => setLifeEvent(e.target.value)}
                placeholder="e.g. Recovering, new baby, grieving"
                className="w-full bg-amber-50/50 border border-amber-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Need */}
          <div>
            <label className="font-bold text-rose-950 block mb-1 flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
              Expressed Need (Optional)
            </label>
            <input
              type="text"
              value={expressedNeed}
              onChange={(e) => setExpressedNeed(e.target.value)}
              placeholder="e.g. Needs ride to appointment on Tuesdays"
              className="w-full bg-rose-50/40 border border-rose-200 rounded-xl px-3 py-2 text-sm text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Gift */}
          <div>
            <label className="font-bold text-emerald-950 block mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Offered Gift (Optional)
            </label>
            <input
              type="text"
              value={offeredGift}
              onChange={(e) => setOfferedGift(e.target.value)}
              placeholder="e.g. Offers woodworking & sourdough starter"
              className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Recognition Note */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Human Witness Recognition Note *
            </label>
            <textarea
              required
              rows={3}
              value={recognitionNote}
              onChange={(e) => setRecognitionNote(e.target.value)}
              placeholder="Record the warm moment, conversation, and memories shared over pie..."
              className="w-full bg-amber-50/50 border border-amber-300 rounded-xl p-3 text-sm text-stone-900 font-serif italic focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-amber-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-950 hover:bg-amber-900 text-amber-300 font-extrabold px-6 py-2.5 rounded-2xl shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Save Pie Entry 🥧</span>
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};
