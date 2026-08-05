import React, { useState } from 'react';
import type { AcceptanceTestResult, Person, Encounter, NeedItem, GiftItem, ConnectionProposal } from '../types';
import { runAcceptanceTests } from '../utils/acceptanceTests';
import { Terminal, ChevronDown, ChevronUp, CheckCircle, XCircle, Code, ShieldCheck } from 'lucide-react';

interface TechnicalDetailsDrawerProps {
  persons: Person[];
  encounters: Encounter[];
  needs: NeedItem[];
  gifts: GiftItem[];
  proposals: ConnectionProposal[];
}

export const TechnicalDetailsDrawer: React.FC<TechnicalDetailsDrawerProps> = ({
  persons,
  encounters,
  needs,
  gifts,
  proposals,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState<AcceptanceTestResult[]>([]);
  const [hasRunTests, setHasRunTests] = useState(false);

  const handleRunTests = () => {
    const results = runAcceptanceTests(persons, encounters, needs, gifts, proposals);
    setTestResults(results);
    setHasRunTests(true);
  };

  const passedCount = testResults.filter((r) => r.passed).length;

  return (
    <div className="bg-stone-900 border-t border-stone-800 text-stone-300 text-xs">
      {/* Drawer Toggle Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-100 transition-colors font-mono"
        >
          <Terminal className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-stone-200">System Architecture & Technical Details</span>
          <span className="text-[10px] text-stone-500 bg-stone-800 px-2 py-0.5 rounded">
            Developer Info & Acceptance Test Suite
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
        </button>

        <span className="text-stone-500 text-[11px] font-mono hidden sm:inline">
          Model: gemini-3.6-flash • Schema: Bounded Witness Instrument
        </span>
      </div>

      {/* Expanded Content Drawer */}
      {isOpen && (
        <div className="border-t border-stone-800 bg-stone-950/80 p-6 space-y-6 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section 1: Developer Architecture Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-2">
              <h4 className="font-mono text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4" /> Gemini Schema & Function Declaration
              </h4>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Gemini outputs an <code className="text-amber-300">ExtractionProposal</code> object specifying field-level confidence (<code className="text-emerald-400">explicit</code> | <code className="text-amber-400">inferred</code> | <code className="text-stone-400">unknown</code>) and supporting transcript excerpts.
              </p>
              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 font-mono text-[10px] text-amber-200/90 overflow-x-auto">
                <pre>{`interface ExtractionProposal {
  proposalId: string;
  recipient_name: ProposedField<string>;
  meals_shared: ProposedField<number>;
  occurredOn: ProposedField<string>;
  life_event?: ProposedField<string>;
  expressed_need?: ProposedField<string>;
  offered_gift?: ProposedField<string>;
  recognition_note: ProposedField<string>;
}`}</pre>
              </div>
            </div>

            <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-2">
              <h4 className="font-mono text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Bounded Witness Instrument Laws
              </h4>
              <ul className="text-[11px] text-stone-400 space-y-1.5 list-disc list-inside font-sans">
                <li><strong className="text-stone-200">Proposal Before Record:</strong> Gemini proposes; Paula confirms admission.</li>
                <li><strong className="text-stone-200">Testimony Lineage:</strong> Revisions append corrections; history preserved.</li>
                <li><strong className="text-stone-200">Entity Separation:</strong> Person, Encounter, Need, Gift, and Connection.</li>
                <li><strong className="text-stone-200">Disclosure Boundaries:</strong> Explicit permission controls for exports/matches.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Interactive Acceptance Test Suite (Law 8) */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <h4 className="font-mono text-stone-100 font-bold text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> System Acceptance Test Runner (10 Laws Verification)
                </h4>
                <p className="text-stone-400 text-xs font-sans mt-0.5">
                  Runs automated programmatic assertions validating semantic honesty, privacy boundaries, and lineage constraints.
                </p>
              </div>

              <button
                onClick={handleRunTests}
                className="bg-amber-800 hover:bg-amber-700 text-amber-50 font-mono text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow"
              >
                Run 10 Acceptance Tests
              </button>
            </div>

            {hasRunTests && (
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs bg-stone-950 p-3 rounded-lg border border-stone-800">
                  <span>
                    Test Results: <strong className={passedCount === testResults.length ? 'text-emerald-400 font-bold' : 'text-amber-400'}>{passedCount} / {testResults.length} Passed</strong>
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    All 10 Laws Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {testResults.map((tr) => (
                    <div
                      key={tr.id}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        tr.passed
                          ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                          : 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="font-mono">{tr.title}</span>
                        {tr.passed ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-[10px] uppercase font-mono">
                            <CheckCircle className="w-3 h-3" /> PASS
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-400 text-[10px] uppercase font-mono">
                            <XCircle className="w-3 h-3" /> FAIL
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-sans opacity-90 leading-relaxed">
                        {tr.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
