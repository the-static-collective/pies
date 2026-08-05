import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VoiceInputCard } from './components/VoiceInputCard';
import { ProposalConfirmationModal } from './components/ProposalConfirmationModal';
import { EncounterEditWithdrawModal } from './components/EncounterEditWithdrawModal';
import { LedgerTable } from './components/LedgerTable';
import { NeedsGiftsManager } from './components/NeedsGiftsManager';
import { PossibleConnections } from './components/PossibleConnections';
import { ExportModal } from './components/ExportModal';
import { AddEncounterModal } from './components/AddEncounterModal';
import { TechnicalDetailsDrawer } from './components/TechnicalDetailsDrawer';

import { INITIAL_DEMO_DATA } from './data/initialEncounters';
import { sendReflectionToGemini } from './services/api';
import { generateConnectionProposals } from './utils/matching';
import type {
  Person,
  Encounter,
  NeedItem,
  GiftItem,
  ConnectionProposal,
  ExtractionProposal,
  NeedGiftStatus,
  DisclosureLevel,
  ConnectionStatus,
  ResourceCategory,
} from './types';
import { Heart, Sparkles, ShieldCheck, PieChart, Lock, HardDrive } from 'lucide-react';

const REAL_STORAGE_KEY_PERSONS = 'paula_real_persons_v2';
const REAL_STORAGE_KEY_ENCOUNTERS = 'paula_real_encounters_v2';
const REAL_STORAGE_KEY_NEEDS = 'paula_real_needs_v2';
const REAL_STORAGE_KEY_GIFTS = 'paula_real_gifts_v2';
const REAL_STORAGE_KEY_PROPOSALS = 'paula_real_proposals_v2';

const GOAL_MEALS_MILESTONE = 100;

export default function App() {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Real Ledger State vs Demo Mode State
  const [realPersons, setRealPersons] = useState<Person[]>(() => {
    try {
      const saved = localStorage.getItem(REAL_STORAGE_KEY_PERSONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return [];
  });

  const [realEncounters, setRealEncounters] = useState<Encounter[]>(() => {
    try {
      const saved = localStorage.getItem(REAL_STORAGE_KEY_ENCOUNTERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return [];
  });

  const [realNeeds, setRealNeeds] = useState<NeedItem[]>(() => {
    try {
      const saved = localStorage.getItem(REAL_STORAGE_KEY_NEEDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return [];
  });

  const [realGifts, setRealGifts] = useState<GiftItem[]>(() => {
    try {
      const saved = localStorage.getItem(REAL_STORAGE_KEY_GIFTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return [];
  });

  const [realProposals, setRealProposals] = useState<ConnectionProposal[]>(() => {
    try {
      const saved = localStorage.getItem(REAL_STORAGE_KEY_PROPOSALS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return [];
  });

  // Active view states depending on Demo vs Real
  const persons = isDemoMode ? INITIAL_DEMO_DATA.persons : realPersons;
  const encounters = isDemoMode ? INITIAL_DEMO_DATA.encounters : realEncounters;
  const needs = isDemoMode ? INITIAL_DEMO_DATA.needs : realNeeds;
  const gifts = isDemoMode ? INITIAL_DEMO_DATA.gifts : realGifts;
  const proposals = isDemoMode ? INITIAL_DEMO_DATA.proposals : realProposals;

  const [isLoading, setIsLoading] = useState(false);
  const [pendingProposal, setPendingProposal] = useState<ExtractionProposal | null>(null);

  const [activeTab, setActiveTab] = useState<'ledger' | 'needs-gifts' | 'possible-connections'>('ledger');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedEncounterForEdit, setSelectedEncounterForEdit] = useState<Encounter | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync real ledger to local storage
  useEffect(() => {
    if (!isDemoMode) {
      try {
        localStorage.setItem(REAL_STORAGE_KEY_PERSONS, JSON.stringify(realPersons));
        localStorage.setItem(REAL_STORAGE_KEY_ENCOUNTERS, JSON.stringify(realEncounters));
        localStorage.setItem(REAL_STORAGE_KEY_NEEDS, JSON.stringify(realNeeds));
        localStorage.setItem(REAL_STORAGE_KEY_GIFTS, JSON.stringify(realGifts));
        localStorage.setItem(REAL_STORAGE_KEY_PROPOSALS, JSON.stringify(realProposals));
      } catch (e) {
        console.warn('Failed to save real ledger to localStorage:', e);
      }
    }
  }, [isDemoMode, realPersons, realEncounters, realNeeds, realGifts, realProposals]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Process Reflection via Gemini
  const handleProcessReflection = async (
    transcript: string,
    audioBase64?: string,
    mimeType?: string
  ) => {
    setIsLoading(true);
    setPendingProposal(null);

    try {
      const proposal = await sendReflectionToGemini(transcript, audioBase64, mimeType);
      setPendingProposal(proposal);
    } catch (err: any) {
      console.error('Error in reflection processing:', err);
      // Graceful error handling: preserve Paula's exact transcript without inventing data
      showNotification('Gemini extraction failed. Your transcript is preserved. You can edit or record manually.');
      setPendingProposal({
        proposalId: `prop-fail-${Date.now()}`,
        recipient_name: { value: 'Community Neighbor', confidence: 'unknown', sourceExcerpt: '' },
        meals_shared: { value: 1, confidence: 'unknown', sourceExcerpt: '' },
        occurredOn: { value: new Date().toISOString().split('T')[0], confidence: 'explicit', sourceExcerpt: '' },
        life_event: { value: '', confidence: 'unknown', sourceExcerpt: '' },
        expressed_need: { value: '', confidence: 'unknown', sourceExcerpt: '' },
        offered_gift: { value: '', confidence: 'unknown', sourceExcerpt: '' },
        recognition_note: { value: transcript.trim() || 'Spoken reflection', confidence: 'explicit', sourceExcerpt: transcript },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm Proposal in Modal (Admission Step)
  const handleConfirmProposal = (finalData: {
    recipientName: string;
    mealsShared: number;
    occurredOn: string;
    lifeEvent: string;
    recognitionNote: string;
    expressedNeed?: string;
    needDisclosure: DisclosureLevel;
    needPermissionConfirmed: boolean;
    offeredGift?: string;
    giftDisclosure: DisclosureLevel;
    giftPermissionConfirmed: boolean;
  }) => {
    // 1. Find or create Person
    let targetPerson = persons.find(
      (p) => p.name.toLowerCase() === finalData.recipientName.trim().toLowerCase()
    );

    if (!targetPerson) {
      targetPerson = {
        id: `person-${Date.now()}`,
        name: finalData.recipientName.trim(),
        firstMetOn: finalData.occurredOn,
        relationshipNotes: 'Met during pie delivery & community encounter.',
        contactPreference: 'In-person / Paula',
      };
      if (isDemoMode) {
        INITIAL_DEMO_DATA.persons.unshift(targetPerson);
      } else {
        setRealPersons((prev) => [targetPerson!, ...prev]);
      }
    }

    // 2. Admit Encounter
    const newEncounter: Encounter = {
      id: `enc-${Date.now()}`,
      witness: 'Paula',
      recipientRef: targetPerson.id,
      recipientName: targetPerson.name,
      mealsShared: finalData.mealsShared,
      occurredOn: finalData.occurredOn,
      recordedAt: new Date().toISOString(),
      lifeEvent: finalData.lifeEvent,
      recognitionNote: finalData.recognitionNote,
      revisions: [],
    };

    if (isDemoMode) {
      INITIAL_DEMO_DATA.encounters.unshift(newEncounter);
    } else {
      setRealEncounters((prev) => [newEncounter, ...prev]);
    }

    // 3. Create Need if present
    let newNeed: NeedItem | null = null;
    if (finalData.expressedNeed && finalData.expressedNeed.trim()) {
      newNeed = {
        id: `need-${Date.now()}`,
        personId: targetPerson.id,
        encounterId: newEncounter.id,
        description: finalData.expressedNeed.trim(),
        category: 'general',
        status: 'active',
        disclosure: finalData.needDisclosure,
        permissionConfirmed: finalData.needPermissionConfirmed,
        createdAt: new Date().toISOString(),
      };
      if (isDemoMode) {
        INITIAL_DEMO_DATA.needs.unshift(newNeed);
      } else {
        setRealNeeds((prev) => [newNeed!, ...prev]);
      }
    }

    // 4. Create Gift if present
    let newGift: GiftItem | null = null;
    if (finalData.offeredGift && finalData.offeredGift.trim()) {
      newGift = {
        id: `gift-${Date.now()}`,
        personId: targetPerson.id,
        encounterId: newEncounter.id,
        description: finalData.offeredGift.trim(),
        category: 'general',
        status: 'active',
        disclosure: finalData.giftDisclosure,
        permissionConfirmed: finalData.giftPermissionConfirmed,
        createdAt: new Date().toISOString(),
      };
      if (isDemoMode) {
        INITIAL_DEMO_DATA.gifts.unshift(newGift);
      } else {
        setRealGifts((prev) => [newGift!, ...prev]);
      }
    }

    // 5. Re-evaluate connection possibilities
    const updatedNeeds = [...needs, ...(newNeed ? [newNeed] : [])];
    const updatedGifts = [...gifts, ...(newGift ? [newGift] : [])];
    const newProposals = generateConnectionProposals(updatedNeeds, updatedGifts, persons);

    if (isDemoMode) {
      INITIAL_DEMO_DATA.proposals = newProposals;
    } else {
      setRealProposals(newProposals);
    }

    showNotification(`Encounter admitted into ledger for ${targetPerson.name}.`);
    setPendingProposal(null);
  };

  // Revision / Correction Logic
  const handleSaveCorrection = (
    encounterId: string,
    updatedValues: {
      recipientName: string;
      mealsShared: number;
      occurredOn: string;
      lifeEvent: string;
      recognitionNote: string;
    },
    reason: string
  ) => {
    const updateFn = (prev: Encounter[]) =>
      prev.map((e) => {
        if (e.id === encounterId) {
          const revRecord = {
            revisedAt: new Date().toISOString(),
            revisedBy: 'Paula',
            previousValue: {
              recipientName: e.recipientName,
              mealsShared: e.mealsShared,
              occurredOn: e.occurredOn,
              lifeEvent: e.lifeEvent,
              recognitionNote: e.recognitionNote,
            },
            reason,
          };
          return {
            ...e,
            recipientName: updatedValues.recipientName,
            mealsShared: updatedValues.mealsShared,
            occurredOn: updatedValues.occurredOn,
            lifeEvent: updatedValues.lifeEvent,
            recognitionNote: updatedValues.recognitionNote,
            revisions: [...e.revisions, revRecord],
          };
        }
        return e;
      });

    if (isDemoMode) {
      INITIAL_DEMO_DATA.encounters = updateFn(INITIAL_DEMO_DATA.encounters);
    } else {
      setRealEncounters(updateFn);
    }

    showNotification('Superseding revision appended into testimony lineage.');
  };

  // Withdraw Logic
  const handleWithdrawEncounter = (encounterId: string, reason: string) => {
    const withdrawFn = (prev: Encounter[]) =>
      prev.map((e) => (e.id === encounterId ? { ...e, isWithdrawn: true } : e));

    if (isDemoMode) {
      INITIAL_DEMO_DATA.encounters = withdrawFn(INITIAL_DEMO_DATA.encounters);
    } else {
      setRealEncounters(withdrawFn);
    }

    showNotification('Encounter withdrawn from active view.');
  };

  // Permanent Device Erase
  const handlePermanentEraseEncounter = (encounterId: string) => {
    const eraseFn = (prev: Encounter[]) => prev.filter((e) => e.id !== encounterId);

    if (isDemoMode) {
      INITIAL_DEMO_DATA.encounters = eraseFn(INITIAL_DEMO_DATA.encounters);
    } else {
      setRealEncounters(eraseFn);
    }

    showNotification('Encounter erased from local device.');
  };

  // Needs & Gifts state updates
  const handleUpdateNeedStatus = (needId: string, status: NeedGiftStatus) => {
    const updateFn = (prev: NeedItem[]) =>
      prev.map((n) => (n.id === needId ? { ...n, status } : n));

    if (isDemoMode) {
      INITIAL_DEMO_DATA.needs = updateFn(INITIAL_DEMO_DATA.needs);
    } else {
      setRealNeeds(updateFn);
    }
  };

  const handleUpdateNeedDisclosure = (
    needId: string,
    disclosure: DisclosureLevel,
    permissionConfirmed: boolean
  ) => {
    const updateFn = (prev: NeedItem[]) =>
      prev.map((n) => (n.id === needId ? { ...n, disclosure, permissionConfirmed } : n));

    if (isDemoMode) {
      INITIAL_DEMO_DATA.needs = updateFn(INITIAL_DEMO_DATA.needs);
    } else {
      setRealNeeds(updateFn);
    }
  };

  const handleUpdateGiftStatus = (giftId: string, status: NeedGiftStatus) => {
    const updateFn = (prev: GiftItem[]) =>
      prev.map((g) => (g.id === giftId ? { ...g, status } : g));

    if (isDemoMode) {
      INITIAL_DEMO_DATA.gifts = updateFn(INITIAL_DEMO_DATA.gifts);
    } else {
      setRealGifts(updateFn);
    }
  };

  const handleUpdateGiftDisclosure = (
    giftId: string,
    disclosure: DisclosureLevel,
    permissionConfirmed: boolean
  ) => {
    const updateFn = (prev: GiftItem[]) =>
      prev.map((g) => (g.id === giftId ? { ...g, disclosure, permissionConfirmed } : g));

    if (isDemoMode) {
      INITIAL_DEMO_DATA.gifts = updateFn(INITIAL_DEMO_DATA.gifts);
    } else {
      setRealGifts(updateFn);
    }
  };

  // Direct Add Need / Gift
  const handleAddNeed = (newNeed: Partial<NeedItem>) => {
    const item: NeedItem = {
      id: `need-${Date.now()}`,
      personId: newNeed.personId || persons[0]?.id || 'person-1',
      description: newNeed.description || '',
      category: newNeed.category || 'general',
      status: 'active',
      disclosure: newNeed.disclosure || 'private_to_paula',
      permissionConfirmed: Boolean(newNeed.permissionConfirmed),
      createdAt: new Date().toISOString(),
    };

    if (isDemoMode) {
      INITIAL_DEMO_DATA.needs.unshift(item);
    } else {
      setRealNeeds((prev) => [item, ...prev]);
    }
    showNotification('Need added.');
  };

  const handleAddGift = (newGift: Partial<GiftItem>) => {
    const item: GiftItem = {
      id: `gift-${Date.now()}`,
      personId: newGift.personId || persons[0]?.id || 'person-1',
      description: newGift.description || '',
      category: newGift.category || 'general',
      status: 'active',
      disclosure: newGift.disclosure || 'private_to_paula',
      permissionConfirmed: Boolean(newGift.permissionConfirmed),
      createdAt: new Date().toISOString(),
    };

    if (isDemoMode) {
      INITIAL_DEMO_DATA.gifts.unshift(item);
    } else {
      setRealGifts((prev) => [item, ...prev]);
    }
    showNotification('Gift offer added.');
  };

  // Connection Proposal Lifecycle Updates
  const handleUpdateProposalStatus = (
    proposalId: string,
    newStatus: ConnectionStatus,
    note?: string
  ) => {
    const updateFn = (prev: ConnectionProposal[]) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          const newHistory = [...p.statusHistory, { status: newStatus, timestamp: new Date().toISOString(), note }];
          return { ...p, status: newStatus, statusHistory: newHistory };
        }
        return p;
      });

    if (isDemoMode) {
      INITIAL_DEMO_DATA.proposals = updateFn(INITIAL_DEMO_DATA.proposals);
    } else {
      setRealProposals(updateFn);
    }
    showNotification(`Connection status updated to ${newStatus.replace('_', ' ')}.`);
  };

  const handleUpdatePrivateNote = (proposalId: string, note: string) => {
    const updateFn = (prev: ConnectionProposal[]) =>
      prev.map((p) => (p.id === proposalId ? { ...p, paulaPrivateNote: note } : p));

    if (isDemoMode) {
      INITIAL_DEMO_DATA.proposals = updateFn(INITIAL_DEMO_DATA.proposals);
    } else {
      setRealProposals(updateFn);
    }
  };

  const totalMeals = encounters
    .filter((e) => !e.isWithdrawn)
    .reduce((sum, e) => sum + e.mealsShared, 0);

  const activeNeeds = needs.filter((n) => n.status === 'active');
  const activeProposals = proposals.filter((p) => p.status !== 'declined' && p.status !== 'withdrawn');

  const scrollToVoiceSection = () => {
    const el = document.getElementById('voice-reflection-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col">
      {/* Top Navbar */}
      <Navbar
        totalMeals={totalMeals}
        goalMeals={GOAL_MEALS_MILESTONE}
        totalRelationships={persons.length}
        activeNeedsCount={activeNeeds.length}
        activeConnectionsCount={activeProposals.length}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenManualModal={() => setIsManualModalOpen(true)}
        onScrollToVoice={scrollToVoiceSection}
        onSelectTab={setActiveTab}
        activeTab={activeTab}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-amber-900 text-amber-100 px-4 py-3 rounded-xl shadow-lg border border-amber-700 flex items-center gap-2 text-xs sm:text-sm animate-fadeIn">
          <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
          <span className="font-serif italic">{notification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Ethic Banner */}
        <div className="bg-amber-900 text-amber-50 rounded-2xl p-6 shadow-xs border border-amber-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none p-4 flex items-center justify-center">
            <PieChart className="w-64 h-64 text-amber-200" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-300 text-xs font-semibold uppercase tracking-widest">
                Bounded Witness Instrument
              </span>
              {isDemoMode ? (
                <span className="bg-amber-400 text-amber-950 font-bold text-[10px] px-2 py-0.5 rounded">
                  Demo Mode (Sample Data)
                </span>
              ) : (
                <span className="bg-emerald-700 text-emerald-100 font-bold text-[10px] px-2 py-0.5 rounded">
                  Paula's Real Empty Ledger
                </span>
              )}
            </div>

            <h2 className="text-2xl font-serif font-bold text-amber-100">
              The Hundred Pies Ledger
            </h2>
            <p className="text-sm text-amber-200/90 font-sans leading-relaxed mt-2">
              A stewardship instrument designed for non-extractive community witnessing. Speak spoken reflections naturally. Gemini suggests proposed extractions, which remain explicit proposals until Paula confirms admission into her bounded ledger.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-amber-800/80 text-xs text-amber-200/80">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                Dignity-centered & zero-fabrication
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-300" />
                Granular disclosure permission controls
              </span>
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-amber-300" />
                Local device persistence
              </span>
            </div>
          </div>
        </div>

        {/* Voice Reflection Notebook */}
        <VoiceInputCard
          onProcessReflection={handleProcessReflection}
          isLoading={isLoading}
          onSaveUnprocessedLocally={(text) => {
            showNotification('Reflection saved locally as unprocessed transcript.');
          }}
          onOpenManualEntry={() => setIsManualModalOpen(true)}
        />

        {/* Main Tab Content */}
        {activeTab === 'ledger' && (
          <LedgerTable
            encounters={encounters}
            persons={persons}
            needs={needs}
            gifts={gifts}
            onOpenEditWithdraw={(enc) => setSelectedEncounterForEdit(enc)}
          />
        )}

        {activeTab === 'needs-gifts' && (
          <NeedsGiftsManager
            needs={needs}
            gifts={gifts}
            persons={persons}
            onUpdateNeedStatus={handleUpdateNeedStatus}
            onUpdateNeedDisclosure={handleUpdateNeedDisclosure}
            onUpdateGiftStatus={handleUpdateGiftStatus}
            onUpdateGiftDisclosure={handleUpdateGiftDisclosure}
            onAddNeed={handleAddNeed}
            onAddGift={handleAddGift}
          />
        )}

        {activeTab === 'possible-connections' && (
          <PossibleConnections
            proposals={proposals}
            needs={needs}
            gifts={gifts}
            persons={persons}
            onUpdateProposalStatus={handleUpdateProposalStatus}
            onUpdatePrivateNote={handleUpdatePrivateNote}
          />
        )}
      </main>

      {/* Modals */}
      <ProposalConfirmationModal
        proposal={pendingProposal}
        isOpen={Boolean(pendingProposal)}
        onConfirm={handleConfirmProposal}
        onDiscard={() => setPendingProposal(null)}
      />

      <EncounterEditWithdrawModal
        encounter={selectedEncounterForEdit}
        isOpen={Boolean(selectedEncounterForEdit)}
        onClose={() => setSelectedEncounterForEdit(null)}
        onSaveCorrection={handleSaveCorrection}
        onWithdraw={handleWithdrawEncounter}
        onPermanentErase={handlePermanentEraseEncounter}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        persons={persons}
        encounters={encounters}
        needs={needs}
        gifts={gifts}
        onLogExportAction={(action) => showNotification(action)}
      />

      <AddEncounterModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSave={(data) => {
          handleConfirmProposal({
            recipientName: data.recipient_name || 'Community Member',
            mealsShared: Number(data.meals_shared) || 1,
            occurredOn: data.date || new Date().toISOString().split('T')[0],
            lifeEvent: data.life_event || '',
            recognitionNote: data.recognition_note || 'Manual entry recorded.',
            expressedNeed: data.expressed_need,
            needDisclosure: 'private_to_paula',
            needPermissionConfirmed: false,
            offeredGift: data.offered_gift,
            giftDisclosure: 'private_to_paula',
            giftPermissionConfirmed: false,
          });
          setIsManualModalOpen(false);
        }}
        editingEncounter={null}
      />

      {/* Technical Details & Interactive Acceptance Test Suite Drawer (Law 7 & Law 8) */}
      <TechnicalDetailsDrawer
        persons={persons}
        encounters={encounters}
        needs={needs}
        gifts={gifts}
        proposals={proposals}
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-6 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-500" />
            <span className="font-serif font-semibold text-stone-200">The Hundred Pies Ledger</span>
            <span>— Bounded Witness Instrument</span>
          </div>
          <p className="text-stone-500">
            Dignity-first design for community builders & stewards.
          </p>
        </div>
      </footer>
    </div>
  );
}
