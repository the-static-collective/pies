import React, { useState } from 'react';
import { Sheet, X, Copy, Check, Download } from 'lucide-react';
import type { Encounter } from '../types';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  encounters: Encounter[];
  onMarkAllSynced?: () => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  encounters,
  onMarkAllSynced,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateTabSeparatedText = () => {
    const headers = [
      'Date',
      'Recipient Name',
      'Meals Shared',
      'Life Season / Event',
      'Recognition Note',
    ];

    const rows = encounters.map((enc) => [
      enc.occurredOn,
      enc.recipientName,
      enc.mealsShared,
      enc.lifeEvent || '',
      `"${enc.recognitionNote.replace(/"/g, '""')}"`,
    ]);

    return [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
  };

  const handleCopyTSV = () => {
    const text = generateTabSeparatedText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onMarkAllSynced) onMarkAllSynced();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <Sheet className="w-5 h-5 text-emerald-700" />
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Export to Google Sheets
            </h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-600">
          Click below to copy formatted tab-separated text directly to your clipboard, then paste into Google Sheets.
        </p>

        <div className="flex justify-end gap-2 pt-3">
          <button
            onClick={handleCopyTSV}
            className="bg-emerald-800 text-white font-medium px-4 py-2 rounded-xl text-xs flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy for Google Sheets'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
