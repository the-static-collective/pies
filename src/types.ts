export type ConfidenceLevel = 'explicit' | 'inferred' | 'unknown';

export interface ProposedField<T> {
  proposedValue: T;
  sourceExcerpt?: string;
  confidence: ConfidenceLevel;
}

export interface ExtractionProposal {
  proposalId: string;
  recipient_name: ProposedField<string>;
  meals_shared: ProposedField<number>;
  occurredOn: ProposedField<string>;
  life_event?: ProposedField<string>;
  expressed_need?: ProposedField<string>;
  offered_gift?: ProposedField<string>;
  recognition_note: ProposedField<string>;
  rawTranscript: string;
  createdAt: string;
  confirmationText?: string;
}

export type DisclosureLevel =
  | 'private_to_paula'
  | 'okay_to_seek_help_without_name'
  | 'okay_to_share_with_named_person'
  | 'public';

export type NeedGiftStatus =
  | 'heard'
  | 'confirmed'
  | 'active'
  | 'fulfilled'
  | 'withdrawn'
  | 'expired';

export interface Person {
  id: string;
  name: string;
  contactPreference?: string;
  doNotMatch?: boolean;
  doNotExport?: boolean;
  createdAt: string;
}

export interface RevisionRecord {
  revisedAt: string;
  revisedBy: string;
  previousValue: {
    recipientName?: string;
    mealsShared?: number;
    occurredOn?: string;
    recognitionNote?: string;
    life_event?: string;
  };
  reason?: string;
}

export interface Encounter {
  id: string;
  witness: 'Paula';
  occurredOn: string;
  recordedAt: string;
  sourceReflectionId?: string;
  sourceTranscript?: string;
  admittedFromProposalId?: string; // or 'manual'
  recipientRef: string; // Person ID
  recipientName: string; // Cached display name
  mealsShared: number;
  recognitionNote: string;
  lifeEvent?: string;
  revisions: RevisionRecord[];
  isWithdrawn?: boolean;
  withdrawnAt?: string;
  withdrawnReason?: string;
}

export type ResourceCategory =
  | 'transportation'
  | 'food_garden'
  | 'clothing_supplies'
  | 'home_repair'
  | 'care_companionship'
  | 'general';

export interface NeedItem {
  id: string;
  personId: string;
  encounterId?: string;
  description: string;
  category: ResourceCategory;
  status: NeedGiftStatus;
  disclosure: DisclosureLevel;
  permissionConfirmed: boolean;
  createdAt: string;
}

export interface GiftItem {
  id: string;
  personId: string;
  encounterId?: string;
  description: string;
  category: ResourceCategory;
  status: NeedGiftStatus;
  disclosure: DisclosureLevel;
  permissionConfirmed: boolean;
  createdAt: string;
}

export type ConnectionStatus =
  | 'suggested'
  | 'reviewed_by_paula'
  | 'permission_requested'
  | 'accepted_by_both'
  | 'introduced'
  | 'completed'
  | 'declined'
  | 'withdrawn';

export interface ConnectionStatusHistoryItem {
  status: ConnectionStatus;
  timestamp: string;
  note?: string;
}

export interface ConnectionProposal {
  id: string;
  needId: string;
  giftId: string;
  needPersonId: string;
  giftPersonId: string;
  reason: string;
  matchedCategory: ResourceCategory;
  correspondingKeywords: string[];
  uncertainty: 'low' | 'medium' | 'high';
  paulaPrivateNote?: string;
  status: ConnectionStatus;
  statusHistory: ConnectionStatusHistoryItem[];
  createdAt: string;
}

export interface UnprocessedReflection {
  id: string;
  transcript: string;
  createdAt: string;
}

export interface ProcessReflectionResponse {
  success: boolean;
  proposal?: ExtractionProposal;
  rawTranscript: string;
  error?: string;
}

export interface AcceptanceTestResult {
  id: string;
  title: string;
  passed: boolean;
  details: string;
}
