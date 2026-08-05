import React, { useState } from 'react';
import type { Person, Encounter, NeedItem, GiftItem } from '../types';
import { generateExportData, generateTSVForClipboard, generateCSVDownloadContent } from '../utils/export';
import { Sheet, X, Copy, Download, Check, ShieldAlert, Lock } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  persons: Person[];
  encounters: Encounter[];
  needs: NeedItem[];
  gifts: GiftItem[];
  onLogExportAction: (exportType: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  persons,
  encounters,
  needs,
  gifts,
  onLogExportAction,
}) => {
  const [copied, setCopied] = useState(false);
  const [lastExportDate, setLastExportDate] = useState<string | null>(null);

  if (!isOpen) return null;

  const exportRows = generateExportData(persons, encounters, needs, gifts);
  const permittedCount = exportRows.filter((r) => r.exportPermitted).length;
  const restrictedCount = exportRows.length - permittedCount;

  const handleCopyForSheets = () => {
    const tsv = generateTSVForClipboard(exportRows);
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    const nowStr = new Date().toLocaleString();
    setLastExportDate(nowStr);
    onLogExportAction(`Copied to clipboard on ${nowStr}`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCSV = () => {
    const csv = generateCSVDownloadContent(exportRows);
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Paula_Field_Ledger_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const nowStr = new Date().toLocaleString();
    setLastExportDate(nowStr);
    onLogExportAction(`CSV Downloaded on ${nowStr}`);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-4xl w-full shadow-xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-emerald-900 text-emerald-50 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800 rounded-xl border border-emerald-700">
              <Sheet className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-emerald-100">
                Export to Google Sheets or CSV
              </h3>
              <p className="text-xs text-emerald-200/80 font-sans mt-0.5">
                Disclosure-bounded export. Preview what leaves this device before copying or downloading.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1.5 rounded-lg hover:bg-emerald-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Disclosure Boundary Audit Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-emerald-950 space-y-1">
              <span className="font-semibold text-sm block text-emerald-900">
                Pre-Export Disclosure Audit ({permittedCount} Permitted Rows, {restrictedCount} Restricted/Private)
              </span>
              <p className="text-emerald-800">
                Data is stored locally on this device. Clicking "Copy for Sheets" copies formatted tab-separated text ready to paste directly (<kbd className="bg-white px-1 py-0.5 border rounded font-mono shadow-2xs">Cmd + V</kbd> / <kbd className="bg-white px-1 py-0.5 border rounded font-mono shadow-2xs">Ctrl + V</kbd>) into Paula's Google Sheet.
              </p>
              {lastExportDate && (
                <div className="text-[11px] font-mono text-emerald-900 pt-1 font-bold">
                  Last Exported: {lastExportDate}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyForSheets}
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow transition-colors flex items-center gap-2 border border-emerald-700"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Copied! Ready to Paste</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-emerald-200" />
                    <span>Copy for Google Sheets</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadCSV}
                className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs sm:text-sm font-medium px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-stone-500" />
                <span>CSV File</span>
              </button>
            </div>
          </div>

          {/* Audit Preview Table */}
          <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-stone-100 p-2.5 border-b border-stone-200 font-semibold text-stone-700 flex justify-between items-center">
              <span>Disclosure Audit Preview</span>
              <span className="text-[11px] font-normal text-stone-500">
                Private fields strictly withheld
              </span>
            </div>

            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-stone-50 sticky top-0 border-b border-stone-200 text-stone-600 font-semibold">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Recipient Name</th>
                    <th className="p-2.5">Meals</th>
                    <th className="p-2.5">Life Event</th>
                    <th className="p-2.5">Expressed Need</th>
                    <th className="p-2.5">Offered Gift</th>
                    <th className="p-2.5">Recognition Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800 font-mono text-[11px]">
                  {exportRows.map((r, idx) => (
                    <tr
                      key={idx}
                      className={r.exportPermitted ? 'hover:bg-emerald-50/40' : 'bg-rose-50/30 text-stone-400'}
                    >
                      <td className="p-2.5 whitespace-nowrap">{r.date}</td>
                      <td className="p-2.5 font-sans font-bold">
                        {r.exportPermitted ? (
                          r.recipientName
                        ) : (
                          <span className="text-rose-800 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> [Name Withheld]
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-center font-bold text-amber-800">{r.mealsShared}</td>
                      <td className="p-2.5 font-sans text-stone-600">{r.lifeEvent || '—'}</td>
                      <td className="p-2.5 font-sans text-rose-900">{r.expressedNeed || '—'}</td>
                      <td className="p-2.5 font-sans text-emerald-900">{r.offeredGift || '—'}</td>
                      <td className="p-2.5 font-sans italic text-stone-600 max-w-xs truncate">
                        {r.recognitionNote}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500">
          <span className="font-mono">
            No automatic cloud sync claims. Export is user-initiated.
          </span>
          <button
            onClick={onClose}
            className="bg-stone-800 hover:bg-stone-900 text-white font-medium px-5 py-2 rounded-xl text-xs transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
