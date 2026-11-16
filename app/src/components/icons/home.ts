import type { IconSet } from './types';

export const home: IconSet = {
  house: {
    label: 'House',
    tags: ['home', 'mortgage', 'rumah'],
    svg: `<rect x="30" y="8" width="5" height="11" rx="1" fill="#966143"/>
<path d="M11 22h26v17a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3z" fill="#F3D2A2"/>
<path d="M24 22h13v17a3 3 0 0 1-3 3H24z" fill="#DDB57E"/>
<path d="M22.1 7.5a3 3 0 0 1 3.8 0L42 21a2 2 0 0 1-1.3 3.5H7.3A2 2 0 0 1 6 21z" fill="#F25C54"/>
<path d="M24 6.8a3 3 0 0 1 1.9.7L42 21a2 2 0 0 1-1.3 3.5H24z" fill="#D64541"/>
<path d="M19 42V32a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10z" fill="#B9805A"/>
<path d="M24 30h3a2 2 0 0 1 2 2v10h-5z" fill="#966143"/>`,
  },
  key: {
    label: 'Rent',
    tags: ['key', 'rent', 'lease', 'sewa', 'kos'],
    svg: `<g transform="rotate(-45 24 24)">
<path d="M5 24a9 9 0 1 0 18 0a9 9 0 1 0-18 0zM10.5 24a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0z" fill="#FECA57" fill-rule="evenodd"/>
<path d="M5 24a9 9 0 0 0 18 0h-5.5a3.5 3.5 0 0 1-7 0z" fill="#F0B429"/>
<rect x="21" y="21" width="22" height="6" rx="2" fill="#FECA57"/>
<rect x="21" y="24" width="22" height="3" fill="#F0B429"/>
<rect x="31" y="25" width="4.5" height="8" rx="1.5" fill="#F0B429"/>
<rect x="38" y="25" width="4.5" height="6" rx="1.5" fill="#F0B429"/>
</g>`,
  },
  bolt: {
    label: 'Electricity',
    tags: ['power', 'electric', 'listrik', 'pln', 'token'],
    svg: `<polygon points="26,4 34,4 27,19 37,19 19,44 22,27 11,27" fill="#FECA57"/>
<polygon points="30,4 34,4 27,19 37,19 19,44" fill="#F0B429"/>`,
  },
  water: {
    label: 'Water',
    tags: ['water bill', 'pdam', 'air'],
    svg: `<path d="M24 5C24 5 10 21 10 30a14 14 0 0 0 28 0C38 21 24 5 24 5z" fill="#4A90E2"/>
<path d="M24 5C24 5 38 21 38 30a14 14 0 0 1-14 14z" fill="#2F72C4"/>
<ellipse cx="17.5" cy="31" rx="2.2" ry="4.5" fill="#FFFFFF" fill-opacity="0.45"/>`,
  },
  wifi: {
    label: 'Internet',
    tags: ['wifi', 'router', 'internet', 'broadband'],
    svg: `<path d="M11 24V12M37 24V12" fill="none" stroke="#3D4451" stroke-width="3" stroke-linecap="round"/>
<path d="M20.5 15.5a5 5 0 0 1 7 0M16.9 11.9a10 10 0 0 1 14.2 0" fill="none" stroke="#22B8DB" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="24" cy="19.5" r="2.2" fill="#22B8DB"/>
<rect x="6" y="24" width="36" height="13" rx="4" fill="#5F6CD9"/>
<path d="M24 24h14a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H24z" fill="#4651B8"/>
<circle cx="13" cy="30.5" r="2" fill="#2ECC71"/><circle cx="19.5" cy="30.5" r="2" fill="#2ECC71"/><circle cx="26" cy="30.5" r="2" fill="#FECA57"/>
<rect x="10" y="37" width="5" height="3" rx="1" fill="#3D4451"/><rect x="33" y="37" width="5" height="3" rx="1" fill="#3D4451"/>`,
  },
  gas: {
    label: 'Gas',
    tags: ['lpg', 'cooking gas', 'elpiji', 'gas melon'],
    svg: `<path d="M15.5 17v-7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v7" fill="none" stroke="#22A85A" stroke-width="3.5" stroke-linecap="round"/>
<rect x="20.5" y="9.5" width="7" height="7" rx="1.5" fill="#A4B0BE"/>
<path d="M24 9.5h2a1.5 1.5 0 0 1 1.5 1.5v5.5H24z" fill="#7F8C9A"/>
<rect x="14" y="38" width="20" height="5" rx="1.5" fill="#22A85A"/>
<rect x="8" y="15" width="32" height="26" rx="11" fill="#2ECC71"/>
<path d="M24 15h5a11 11 0 0 1 11 11v4a11 11 0 0 1-11 11h-5z" fill="#22A85A"/>
<rect x="8" y="26" width="32" height="4" fill="#FFFFFF"/>
<rect x="24" y="26" width="16" height="4" fill="#E6EAF0"/>`,
  },
  receipt: {
    label: 'Bills & Fees',
    tags: ['bill', 'invoice', 'fee', 'tagihan', 'biaya'],
    svg: `<path d="M12 6h24a2 2 0 0 1 2 2v34l-4.67-3-4.67 3-4.67-3-4.67 3-4.67-3L10 42V8a2 2 0 0 1 2-2z" fill="#FFFFFF"/>
<path d="M24 6h12a2 2 0 0 1 2 2v34l-4.67-3-4.67 3L24 39z" fill="#E6EAF0"/>
<rect x="14.5" y="11" width="13" height="4" rx="2" fill="#FF9F43"/>
<rect x="14.5" y="19" width="19" height="3" rx="1.5" fill="#A4B0BE"/>
<rect x="14.5" y="25" width="19" height="3" rx="1.5" fill="#A4B0BE"/>
<rect x="14.5" y="31" width="9" height="3" rx="1.5" fill="#A4B0BE"/>
<rect x="26.5" y="31" width="7" height="3" rx="1.5" fill="#2ECC71"/>`,
  },
  trash: {
    label: 'Trash',
    tags: ['garbage', 'waste', 'bin', 'sampah', 'iuran sampah'],
    svg: `<path d="M20 11V9a2.5 2.5 0 0 1 2.5-2.5h3A2.5 2.5 0 0 1 28 9v2" fill="none" stroke="#7F8C9A" stroke-width="3" stroke-linecap="round"/>
<path d="M11 16h26l-2.2 23.3a3 3 0 0 1-3 2.7H16.2a3 3 0 0 1-3-2.7z" fill="#2ECC71"/>
<path d="M24 16h13l-2.2 23.3a3 3 0 0 1-3 2.7H24z" fill="#22A85A"/>
<path d="M19 22v14M24 22v14M29 22v14" fill="none" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="2.5" stroke-linecap="round"/>
<rect x="8" y="10.5" width="32" height="6" rx="3" fill="#A4B0BE"/>
<path d="M24 10.5h13a3 3 0 0 1 0 6H24z" fill="#7F8C9A"/>`,
  },
  tools: {
    label: 'Repairs',
    tags: ['tools', 'maintenance', 'fix', 'perbaikan', 'servis'],
    svg: `<g transform="rotate(45 24 24)">
<path d="M21.5 5.5A7 7 0 1 0 26.5 5.5V11H21.5z" fill="#A4B0BE"/>
<path d="M24 19a7 7 0 0 0 2.5-13.5V11H24z" fill="#7F8C9A"/>
<rect x="21.5" y="16" width="5" height="26" rx="2.5" fill="#A4B0BE"/>
<path d="M24 16h.1a2.4 2.4 0 0 1 2.4 2.4v21.2a2.4 2.4 0 0 1-2.4 2.4H24z" fill="#7F8C9A"/>
</g>
<g transform="rotate(-45 24 24)">
<rect x="22.5" y="6" width="3" height="20" rx="1" fill="#A4B0BE"/>
<rect x="22.5" y="6" width="1.5" height="20" fill="#7F8C9A"/>
<rect x="19" y="24" width="10" height="18" rx="4" fill="#F25C54"/>
<path d="M23 24h-0a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h1V24z" fill="#D64541"/>
<rect x="20" y="23" width="8" height="3.5" rx="1" fill="#3D4451"/>
</g>`,
  },
  plant: {
    label: 'Plants',
    tags: ['garden', 'plant', 'tanaman', 'kebun'],
    svg: `<g transform="rotate(-55 24 28)"><path d="M24 28C18 23 19 14 24 9C29 14 30 23 24 28z" fill="#1DD1A1"/><path d="M24 9C29 14 30 23 24 28z" fill="#13A882"/></g>
<g transform="rotate(55 24 28)"><path d="M24 28C18 23 19 14 24 9C29 14 30 23 24 28z" fill="#1DD1A1"/><path d="M24 9C29 14 30 23 24 28z" fill="#13A882"/></g>
<path d="M24 28C17 21 18 11 24 5C30 11 31 21 24 28z" fill="#2ECC71"/>
<path d="M24 5C30 11 31 21 24 28z" fill="#22A85A"/>
<path d="M14 31h20l-2.6 9.4a2 2 0 0 1-1.9 1.6H18.5a2 2 0 0 1-1.9-1.6z" fill="#FF9F43"/>
<path d="M24 31h10l-2.6 9.4a2 2 0 0 1-1.9 1.6H24z" fill="#E8862A"/>
<rect x="12" y="26" width="24" height="6" rx="2" fill="#B9805A"/>
<path d="M24 26h10a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H24z" fill="#966143"/>`,
  },
  laundry: {
    label: 'Laundry',
    tags: ['washing machine', 'laundry', 'cucian', 'laundri'],
    svg: `<rect x="9" y="6" width="30" height="36" rx="4" fill="#FFFFFF"/>
<path d="M24 6h11a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H24z" fill="#E6EAF0"/>
<path d="M13 6h22a4 4 0 0 1 4 4v4H9v-4a4 4 0 0 1 4-4z" fill="#4A90E2"/>
<path d="M24 6h11a4 4 0 0 1 4 4v4H24z" fill="#2F72C4"/>
<circle cx="14" cy="10" r="2" fill="#FECA57"/>
<rect x="27" y="8.5" width="8" height="3" rx="1.5" fill="#48DBFB"/>
<circle cx="24" cy="28" r="10" fill="#A4B0BE"/>
<path d="M24 18a10 10 0 0 1 0 20z" fill="#7F8C9A"/>
<circle cx="24" cy="28" r="7" fill="#48DBFB"/>
<path d="M17 28a7 7 0 0 0 14 0c-3.5-2-7 2-10.5 0z" fill="#22B8DB"/>`,
  },
  cleaning: {
    label: 'Cleaning',
    tags: ['cleaning', 'spray', 'household', 'kebersihan', 'sabun'],
    svg: `<circle cx="7" cy="7.5" r="2" fill="#48DBFB"/><circle cx="5.5" cy="13" r="2" fill="#48DBFB"/><circle cx="7" cy="18.5" r="2" fill="#48DBFB"/>
<path d="M20 16v5a3 3 0 0 1-3 3h-1" fill="none" stroke="#7F8C9A" stroke-width="3" stroke-linecap="round"/>
<rect x="22" y="14" width="8" height="6" fill="#E6EAF0"/>
<path d="M28 8a4 4 0 0 1 4 4v4H18l-7-2.5v-3.5a2 2 0 0 1 2-2z" fill="#FFFFFF"/>
<path d="M26 8h2a4 4 0 0 1 4 4v4h-6z" fill="#E6EAF0"/>
<path d="M20 20h12l3 6v13a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3V26z" fill="#1DD1A1"/>
<path d="M26 20h6l3 6v13a3 3 0 0 1-3 3h-6z" fill="#13A882"/>
<rect x="20" y="28" width="12" height="8" rx="1.5" fill="#FFFFFF"/>
<rect x="26" y="28" width="6" height="8" rx="1.5" fill="#E6EAF0"/>`,
  },
  sofa: {
    label: 'Furniture',
    tags: ['sofa', 'couch', 'furniture', 'perabot', 'mebel'],
    svg: `<rect x="10" y="12" width="28" height="20" rx="5" fill="#4A90E2"/>
<path d="M24 12h9a5 5 0 0 1 5 5v15H24z" fill="#2F72C4"/>
<rect x="8" y="30" width="32" height="8" rx="2" fill="#4A90E2"/>
<rect x="24" y="30" width="16" height="8" rx="2" fill="#2F72C4"/>
<rect x="5" y="22" width="9" height="16" rx="4.5" fill="#4A90E2"/>
<rect x="34" y="22" width="9" height="16" rx="4.5" fill="#2F72C4"/>
<rect x="14.5" y="16" width="9" height="11" rx="2.5" fill="#48DBFB"/>
<rect x="24.5" y="16" width="9" height="11" rx="2.5" fill="#22B8DB"/>
<rect x="14" y="27" width="9.5" height="6" rx="2" fill="#48DBFB"/>
<rect x="24.5" y="27" width="9.5" height="6" rx="2" fill="#22B8DB"/>
<rect x="9" y="38" width="4" height="4" rx="1" fill="#3D4451"/><rect x="35" y="38" width="4" height="4" rx="1" fill="#3D4451"/>`,
  },
  bed: {
    label: 'Bedroom',
    tags: ['bed', 'mattress', 'kasur', 'tempat tidur'],
    svg: `<rect x="5" y="10" width="6" height="32" rx="2" fill="#B9805A"/>
<rect x="37" y="22" width="6" height="20" rx="2" fill="#966143"/>
<rect x="9" y="25" width="30" height="8" rx="2" fill="#FFFFFF"/>
<rect x="9" y="29" width="30" height="4" fill="#E6EAF0"/>
<rect x="11" y="18" width="10" height="7" rx="3" fill="#FFFFFF"/>
<path d="M11 22h10v.5a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 11 22.5z" fill="#E6EAF0"/>
<path d="M27 21h11a1 1 0 0 1 1 1v11H22v-7a5 5 0 0 1 5-5z" fill="#A66CFF"/>
<path d="M30.5 21H38a1 1 0 0 1 1 1v11h-8.5z" fill="#8A4FE6"/>
<rect x="5" y="33" width="38" height="5" rx="1" fill="#B9805A"/>
<rect x="24" y="33" width="19" height="5" rx="1" fill="#966143"/>`,
  },
  lamp: {
    label: 'Lamp',
    tags: ['lamp', 'light', 'lampu'],
    svg: `<rect x="22" y="26" width="4" height="12" fill="#A4B0BE"/>
<rect x="24" y="26" width="2" height="12" fill="#7F8C9A"/>
<path d="M15 41a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1H15z" fill="#B9805A"/>
<path d="M24 38h6a3 3 0 0 1 3 3v1h-9z" fill="#966143"/>
<path d="M18 6h12a2 2 0 0 1 1.9 1.4l5.4 16.6a1.5 1.5 0 0 1-1.4 2H12.1a1.5 1.5 0 0 1-1.4-2l5.4-16.6A2 2 0 0 1 18 6z" fill="#FECA57"/>
<path d="M24 6h6a2 2 0 0 1 1.9 1.4l5.4 16.6a1.5 1.5 0 0 1-1.4 2H24z" fill="#F0B429"/>
<path d="M30 26v5" fill="none" stroke="#7F8C9A" stroke-width="2.5" stroke-linecap="round"/>`,
  },
  shield: {
    label: 'Insurance',
    tags: ['insurance', 'protection', 'asuransi', 'bpjs'],
    svg: `<path d="M24 5l15 5v11c0 10-6.5 17.5-15 21C15.5 38.5 9 31 9 21V10z" fill="#4A90E2"/>
<path d="M24 5l15 5v11c0 10-6.5 17.5-15 21z" fill="#2F72C4"/>
<path d="M17 23.5l5 5 9-10" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  tax: {
    label: 'Tax',
    tags: ['tax', 'pajak', 'pbb', 'pph'],
    svg: `<path d="M14 5h16l8 8v27a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z" fill="#FFFFFF"/>
<path d="M24 5h6l8 8v27a3 3 0 0 1-3 3H24z" fill="#E6EAF0"/>
<path d="M30 5v6a2 2 0 0 0 2 2h6z" fill="#A4B0BE"/>
<path d="M30 18L18 37" fill="none" stroke="#F25C54" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="18.5" cy="21" r="3.5" fill="#F25C54"/>
<circle cx="29.5" cy="34" r="3.5" fill="#D64541"/>`,
  },
  calendar: {
    label: 'Subscriptions',
    tags: ['subscription', 'monthly', 'calendar', 'langganan', 'bulanan'],
    svg: `<rect x="7" y="10" width="34" height="32" rx="4" fill="#FFFFFF"/>
<path d="M24 10h13a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H24z" fill="#E6EAF0"/>
<path d="M11 10h26a4 4 0 0 1 4 4v5H7v-5a4 4 0 0 1 4-4z" fill="#F25C54"/>
<path d="M24 10h13a4 4 0 0 1 4 4v5H24z" fill="#D64541"/>
<rect x="14" y="6" width="4" height="8" rx="2" fill="#3D4451"/><rect x="30" y="6" width="4" height="8" rx="2" fill="#3D4451"/>
<rect x="11.5" y="23" width="6" height="5" rx="1.5" fill="#A4B0BE"/><rect x="21" y="23" width="6" height="5" rx="1.5" fill="#A4B0BE"/><rect x="30.5" y="23" width="6" height="5" rx="1.5" fill="#A4B0BE"/>
<rect x="11.5" y="32" width="6" height="5" rx="1.5" fill="#A4B0BE"/><rect x="21" y="32" width="6" height="5" rx="1.5" fill="#FF9F43"/><rect x="30.5" y="32" width="6" height="5" rx="1.5" fill="#A4B0BE"/>`,
  },
};
