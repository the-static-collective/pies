import React from 'react';
import type { Encounter } from '../types';
import { HeartHandshake } from 'lucide-react';

interface MutualAidMatcherProps {
  encounters: Encounter[];
}

export const MutualAidMatcher: React.FC<MutualAidMatcherProps> = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-xs text-amber-950 space-y-2">
      <h3 className="font-serif font-bold text-base flex items-center gap-2 text-amber-900">
        <HeartHandshake className="w-5 h-5 text-amber-800" />
        Consent-Based Possible Connections
      </h3>
      <p>
        Please use the "Possible Connections" tab in the main navigation above for consent-mediated mutual aid suggestions.
      </p>
    </div>
  );
};
