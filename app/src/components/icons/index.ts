import { food } from './food';
import { fun } from './fun';
import { health } from './health';
import { home } from './home';
import { life } from './life';
import { money } from './money';
import { shopping } from './shopping';
import { transport } from './transport';
import type { IconSet } from './types';

/** The icon picker's sections, in order. */
export const ICON_GROUPS: { title: string; icons: IconSet }[] = [
  { title: 'Food & drink', icons: food },
  { title: 'Shopping', icons: shopping },
  { title: 'Transport & travel', icons: transport },
  { title: 'Home & bills', icons: home },
  { title: 'Health & care', icons: health },
  { title: 'Fun & hobbies', icons: fun },
  { title: 'Money & work', icons: money },
  { title: 'Life & learning', icons: life },
];

export const ICONS: IconSet = Object.assign({}, ...ICON_GROUPS.map((g) => g.icons));

/** Shown for transfers, which have no category. Not offered in the picker. */
export const TRANSFER_ICON = `<path d="M10 17h24" fill="none" stroke="#4A90E2" stroke-width="4" stroke-linecap="round"/>
<path d="M29 10l7 7-7 7" fill="none" stroke="#4A90E2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M38 31H14" fill="none" stroke="#1DD1A1" stroke-width="4" stroke-linecap="round"/>
<path d="M19 24l-7 7 7 7" fill="none" stroke="#1DD1A1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
