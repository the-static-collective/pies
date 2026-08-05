import type { NeedItem, GiftItem, ConnectionProposal, ResourceCategory } from '../types';

export function generateConnectionProposals(
  needs: NeedItem[],
  gifts: GiftItem[],
  existingProposals: ConnectionProposal[] = []
): ConnectionProposal[] {
  const newProposals: ConnectionProposal[] = [];

  // Active needs and gifts only
  const activeNeeds = needs.filter(
    (n) => n.status === 'active' && n.disclosure !== 'private_to_paula'
  );
  const activeGifts = gifts.filter(
    (g) => g.status === 'active' && g.disclosure !== 'private_to_paula'
  );

  for (const need of activeNeeds) {
    for (const gift of activeGifts) {
      // Must be two different people
      if (need.personId === gift.personId) continue;

      // Check if proposal already exists
      const existing = existingProposals.find(
        (p) => p.needId === need.id && p.giftId === gift.id
      );
      if (existing) continue;

      // Category matching
      const sameCategory = need.category === gift.category;

      // Semantic keyword matching between need and gift
      const needText = need.description.toLowerCase();
      const giftText = gift.description.toLowerCase();

      // Category specific keywords that must match meaningfully
      const categoryKeywords: Record<ResourceCategory, string[]> = {
        transportation: ['ride', 'transport', 'doctor', 'appointment', 'rochester', 'car', 'drive'],
        food_garden: ['garden', 'basil', 'mint', 'tomatoes', 'vegetable', 'herb', 'pie', 'meal', 'food', 'sourdough', 'bread'],
        clothing_supplies: ['boots', 'coat', 'winter', 'clothing', 'mending', 'sewing', 'knit', 'fabric', 'shoes'],
        home_repair: ['repair', 'mow', 'lawn', 'woodwork', 'bench', 'laundry', 'fix', 'carpentry'],
        care_companionship: ['care', 'visit', 'bilingual', 'translate', 'talk', 'companionship'],
        general: ['help', 'support', 'share'],
      };

      const keywords = categoryKeywords[need.category] || categoryKeywords.general;

      const matchedInNeed = keywords.filter((kw) => needText.includes(kw));
      const matchedInGift = keywords.filter((kw) => giftText.includes(kw));

      // MUST have keywords present in BOTH or exact category match with at least 1 shared key
      const sharedKeywords = matchedInNeed.filter((kw) => matchedInGift.includes(kw));

      const isMatch = sameCategory && (sharedKeywords.length > 0 || need.category !== 'general');

      if (isMatch) {
        const corresponding = sharedKeywords.length > 0 ? sharedKeywords : [need.category];
        const uncertainty = sharedKeywords.length >= 2 ? 'low' : sharedKeywords.length === 1 ? 'medium' : 'high';

        newProposals.push({
          id: `conn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          needId: need.id,
          giftId: gift.id,
          needPersonId: need.personId,
          giftPersonId: gift.personId,
          reason: `Both touch upon ${need.category.replace('_', ' ')} (${corresponding.join(', ')}).`,
          matchedCategory: need.category,
          correspondingKeywords: corresponding,
          uncertainty,
          status: 'suggested',
          statusHistory: [
            {
              status: 'suggested',
              timestamp: new Date().toISOString(),
              note: 'System derived connection proposal',
            },
          ],
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  return newProposals;
}
