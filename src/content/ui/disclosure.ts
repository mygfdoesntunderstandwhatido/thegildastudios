// Trigger labels for the "What is included" disclosure. {n} is the item count.
// The single forms apply when a list has exactly one item.
export const disclosureLabels = {
  show: 'SHOW ALL {n} ITEMS',
  hide: 'HIDE THE {n} ITEMS',
  compact: 'WHAT IS INCLUDED · {n} ITEMS',
  showOne: 'SHOW THE {n} ITEM',
  hideOne: 'HIDE THE {n} ITEM',
  compactOne: 'WHAT IS INCLUDED · {n} ITEM',
  open: '−',
  closed: '+',
} as const;
