import type { Person, Encounter, NeedItem, GiftItem } from '../types';

export interface ExportPreviewRow {
  date: string;
  recipientName: string;
  mealsShared: number;
  lifeEvent: string;
  expressedNeed: string;
  offeredGift: string;
  recognitionNote: string;
  exportPermitted: boolean;
  restrictionReason?: string;
}

export function generateExportData(
  persons: Person[],
  encounters: Encounter[],
  needs: NeedItem[],
  gifts: GiftItem[]
): ExportPreviewRow[] {
  const rows: ExportPreviewRow[] = [];

  for (const enc of encounters) {
    if (enc.isWithdrawn) continue;

    const person = persons.find((p) => p.id === enc.recipientRef);
    const doNotExport = person?.doNotExport;

    // Find associated needs and gifts
    const encNeeds = needs.filter((n) => n.encounterId === enc.id && n.status !== 'withdrawn');
    const encGifts = gifts.filter((g) => g.encounterId === enc.id && g.status !== 'withdrawn');

    // Need disclosure check
    const exportableNeeds = encNeeds
      .filter((n) => n.disclosure !== 'private_to_paula')
      .map((n) =>
        n.disclosure === 'okay_to_seek_help_without_name'
          ? `[Anonymous Need]: ${n.description}`
          : n.description
      );

    // Gift disclosure check
    const exportableGifts = encGifts
      .filter((g) => g.disclosure !== 'private_to_paula')
      .map((g) => g.description);

    let exportPermitted = true;
    let restrictionReason = undefined;

    if (doNotExport) {
      exportPermitted = false;
      restrictionReason = 'Person marked "Do Not Export"';
    }

    rows.push({
      date: enc.occurredOn,
      recipientName: exportPermitted
        ? person?.name || enc.recipientName
        : '[Name Restricted]',
      mealsShared: enc.mealsShared,
      lifeEvent: enc.lifeEvent || '',
      expressedNeed: exportableNeeds.join('; ') || (encNeeds.length > 0 ? '[Private Need Withheld]' : ''),
      offeredGift: exportableGifts.join('; ') || (encGifts.length > 0 ? '[Private Gift Withheld]' : ''),
      recognitionNote: exportPermitted ? enc.recognitionNote : '[Private Reflection Withheld]',
      exportPermitted,
      restrictionReason,
    });
  }

  return rows;
}

export function generateTSVForClipboard(rows: ExportPreviewRow[]): string {
  const exportable = rows.filter((r) => r.exportPermitted);
  const headers = [
    'Date',
    'Recipient Name',
    'Meals Shared',
    'Life Event',
    'Expressed Need',
    'Offered Gift',
    'Recognition Note',
  ];

  const dataRows = exportable.map((r) => [
    r.date,
    r.recipientName,
    r.mealsShared,
    r.lifeEvent,
    r.expressedNeed,
    r.offeredGift,
    r.recognitionNote,
  ]);

  return [headers.join('\t'), ...dataRows.map((dr) => dr.join('\t'))].join('\n');
}

export function generateCSVDownloadContent(rows: ExportPreviewRow[]): string {
  const exportable = rows.filter((r) => r.exportPermitted);
  const headers = [
    'Date',
    'Recipient Name',
    'Meals Shared',
    'Life Event',
    'Expressed Need',
    'Offered Gift',
    'Recognition Note',
  ];

  const dataRows = exportable.map((r) => [
    `"${r.date}"`,
    `"${r.recipientName.replace(/"/g, '""')}"`,
    r.mealsShared,
    `"${r.lifeEvent.replace(/"/g, '""')}"`,
    `"${r.expressedNeed.replace(/"/g, '""')}"`,
    `"${r.offeredGift.replace(/"/g, '""')}"`,
    `"${r.recognitionNote.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...dataRows.map((dr) => dr.join(','))].join('\n');
}
