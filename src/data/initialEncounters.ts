import type { Person, Encounter, NeedItem, GiftItem, ConnectionProposal } from '../types';

export const DEMO_PERSONS: Person[] = [
  {
    id: 'demo-person-1',
    name: 'The Johnson Family',
    contactPreference: 'Phone call in afternoons',
    doNotMatch: false,
    doNotExport: false,
    createdAt: '2026-08-04T16:30:00Z',
  },
  {
    id: 'demo-person-2',
    name: 'Marcus Vance',
    contactPreference: 'In-person visits at garden',
    doNotMatch: false,
    doNotExport: false,
    createdAt: '2026-08-03T14:15:00Z',
  },
  {
    id: 'demo-person-3',
    name: 'Elena & Mateo',
    contactPreference: 'Text message',
    doNotMatch: false,
    doNotExport: false,
    createdAt: '2026-08-02T11:00:00Z',
  },
  {
    id: 'demo-person-4',
    name: 'Clara Jenkins',
    contactPreference: 'House visit',
    doNotMatch: false,
    doNotExport: false,
    createdAt: '2026-08-01T17:45:00Z',
  },
];

export const DEMO_ENCOUNTERS: Encounter[] = [
  {
    id: 'demo-enc-1',
    witness: 'Paula',
    occurredOn: '2026-08-04',
    recordedAt: '2026-08-04T16:30:00Z',
    admittedFromProposalId: 'demo-prop-1',
    recipientRef: 'demo-person-1',
    recipientName: 'The Johnson Family',
    mealsShared: 4,
    lifeEvent: 'Expecting a baby girl',
    recognitionNote: 'Welcomed baby Maya last week! Dropped off chicken pot pies. So full of joy and eager to give back to neighbors.',
    revisions: [],
  },
  {
    id: 'demo-enc-2',
    witness: 'Paula',
    occurredOn: '2026-08-03',
    recordedAt: '2026-08-03T14:15:00Z',
    admittedFromProposalId: 'demo-prop-2',
    recipientRef: 'demo-person-2',
    recipientName: 'Marcus Vance',
    mealsShared: 2,
    lifeEvent: 'Grieving family loss',
    recognitionNote: 'Shared a long quiet moment near the garden gazebo over warm beef pies. Skilled hands and deep dignity.',
    revisions: [],
  },
  {
    id: 'demo-enc-3',
    witness: 'Paula',
    occurredOn: '2026-08-02',
    recordedAt: '2026-08-02T11:00:00Z',
    admittedFromProposalId: 'demo-prop-3',
    recipientRef: 'demo-person-3',
    recipientName: 'Elena & Mateo',
    mealsShared: 3,
    lifeEvent: 'Recovering from surgery',
    recognitionNote: 'Elena is walking well after knee replacement. Shared spinach ricotta pies. Mateo showed me their grape arbors.',
    revisions: [],
  },
  {
    id: 'demo-enc-4',
    witness: 'Paula',
    occurredOn: '2026-08-01',
    recordedAt: '2026-08-01T17:45:00Z',
    admittedFromProposalId: 'demo-prop-4',
    recipientRef: 'demo-person-4',
    recipientName: 'Clara Jenkins',
    mealsShared: 2,
    lifeEvent: 'New resident on Pine St',
    recognitionNote: 'Clara moved in last month. Handed her apple pot pies. Her face lit up talking about her quilt collection.',
    revisions: [],
  },
];

export const DEMO_NEEDS: NeedItem[] = [
  {
    id: 'demo-need-1',
    personId: 'demo-person-1',
    encounterId: 'demo-enc-1',
    description: 'Needs a ride to physical therapy appointments in Rochester on Tuesdays',
    category: 'transportation',
    status: 'active',
    disclosure: 'okay_to_share_with_named_person',
    permissionConfirmed: true,
    createdAt: '2026-08-04T16:30:00Z',
  },
  {
    id: 'demo-need-2',
    personId: 'demo-person-2',
    encounterId: 'demo-enc-2',
    description: 'Needs warm winter boots (size 11)',
    category: 'clothing_supplies',
    status: 'active',
    disclosure: 'okay_to_seek_help_without_name',
    permissionConfirmed: true,
    createdAt: '2026-08-03T14:15:00Z',
  },
  {
    id: 'demo-need-3',
    personId: 'demo-person-3',
    encounterId: 'demo-enc-3',
    description: 'Help with heavy lawn mowing for the month',
    category: 'home_repair',
    status: 'active',
    disclosure: 'okay_to_share_with_named_person',
    permissionConfirmed: true,
    createdAt: '2026-08-02T11:00:00Z',
  },
];

export const DEMO_GIFTS: GiftItem[] = [
  {
    id: 'demo-gift-1',
    personId: 'demo-person-1',
    encounterId: 'demo-enc-1',
    description: 'Has an abundance of fresh garden basil and mint to share',
    category: 'food_garden',
    status: 'active',
    disclosure: 'public',
    permissionConfirmed: true,
    createdAt: '2026-08-04T16:30:00Z',
  },
  {
    id: 'demo-gift-2',
    personId: 'demo-person-2',
    encounterId: 'demo-enc-2',
    description: 'Skilled woodworker; offered to restore broken bench at community garden',
    category: 'home_repair',
    status: 'active',
    disclosure: 'okay_to_share_with_named_person',
    permissionConfirmed: true,
    createdAt: '2026-08-03T14:15:00Z',
  },
  {
    id: 'demo-gift-3',
    personId: 'demo-person-4',
    encounterId: 'demo-enc-4',
    description: 'Has extra sewing machine and offers free mending for neighbors',
    category: 'clothing_supplies',
    status: 'active',
    disclosure: 'okay_to_seek_help_without_name',
    permissionConfirmed: true,
    createdAt: '2026-08-01T17:45:00Z',
  },
];

export const DEMO_CONNECTIONS: ConnectionProposal[] = [
  {
    id: 'demo-conn-1',
    needId: 'demo-need-3', // Lawn mowing (home_repair)
    giftId: 'demo-gift-2', // Woodworker/repair (home_repair)
    needPersonId: 'demo-person-3', // Elena & Mateo
    giftPersonId: 'demo-person-2', // Marcus Vance
    reason: 'Both involve hands-on yard & home repair support.',
    matchedCategory: 'home_repair',
    correspondingKeywords: ['repair', 'lawn', 'bench'],
    uncertainty: 'medium',
    paulaPrivateNote: 'Marcus mentioned wanting to stay busy outdoors. Check with Elena first.',
    status: 'suggested',
    statusHistory: [
      { status: 'suggested', timestamp: '2026-08-03T15:00:00Z', note: 'System suggested connection' },
    ],
    createdAt: '2026-08-03T15:00:00Z',
  },
  {
    id: 'demo-conn-2',
    needId: 'demo-need-2', // Winter boots (clothing_supplies)
    giftId: 'demo-gift-3', // Sewing/mending (clothing_supplies)
    needPersonId: 'demo-person-2', // Marcus
    giftPersonId: 'demo-person-4', // Clara
    reason: 'Shared clothing & material support category.',
    matchedCategory: 'clothing_supplies',
    correspondingKeywords: ['clothing', 'mending'],
    uncertainty: 'low',
    paulaPrivateNote: 'Clara has extra heavy fabrics and contact with warm gear drives.',
    status: 'reviewed_by_paula',
    statusHistory: [
      { status: 'suggested', timestamp: '2026-08-03T16:00:00Z' },
      { status: 'reviewed_by_paula', timestamp: '2026-08-04T09:00:00Z', note: 'Paula reviewed' },
    ],
    createdAt: '2026-08-03T16:00:00Z',
  },
];

export const SAMPLE_REFLECTIONS = [
  {
    title: 'Visit with the Johnsons',
    text: 'Today I visited the Johnson family on Oak Street and brought over 4 hot chicken pot pies. They just welcomed baby Maya last week! They were so happy, but Mrs. Johnson mentioned Mr. Johnson is having trouble finding a ride to his physical therapy appointments in Rochester on Tuesdays. She also mentioned they have a massive patch of fresh basil and mint in their backyard and would love to share with anyone in the neighborhood who needs herbs.',
  },
  {
    title: 'Gathering at Garden with Marcus',
    text: 'Met with Marcus near the community garden gazebo this afternoon. Handed him 2 hot beef pies. He is still grieving the recent loss of his brother and feeling a bit lonely. He expressed a tangible need for warm winter boots size 11. Marcus is an incredible woodworker and offered to fix up the weathered wooden bench at the garden shelter.',
  },
  {
    title: 'Stopping by Mrs. Gable',
    text: 'Stopped by Mrs. Gable on 5th Avenue and gave her 3 turkey and vegetable pies. She is recovering from a recent fall and mentioned she needs help lifting heavy laundry baskets up from her basement. She offered to teach anyone how to bake sourdough bread from her 40-year-old starter culture.',
  },
];

export const INITIAL_DEMO_DATA = {
  persons: DEMO_PERSONS,
  encounters: DEMO_ENCOUNTERS,
  needs: DEMO_NEEDS,
  gifts: DEMO_GIFTS,
  proposals: DEMO_CONNECTIONS,
};

