import type { IconSet } from './types';

export const life: IconSet = {
  graduation: {
    label: 'Education',
    tags: ['school', 'university', 'graduation', 'pendidikan', 'kuliah'],
    svg: `<path d="M12 20v11c0 3.5 5.4 6 12 6s12-2.5 12-6V20z" fill="#3D4451"/>
<path d="M24 20h12v11c0 3.5-5.4 6-12 6z" fill="#2B313B"/>
<polygon points="4,18 24,9 44,18 24,27" fill="#5F6CD9"/>
<polygon points="24,9 44,18 24,27" fill="#4651B8"/>
<path d="M24 18l14 4.5V31" fill="none" stroke="#FECA57" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="24" cy="18" r="2.5" fill="#FECA57"/>
<rect x="36" y="30" width="4" height="7" rx="2" fill="#F0B429"/>`,
  },
  book: {
    label: 'Books',
    tags: ['reading', 'study', 'buku'],
    svg: `<rect x="10" y="6" width="28" height="36" rx="4" fill="#4A90E2"/>
<path d="M24 6h10a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H24z" fill="#2F72C4"/>
<path d="M15 33h21v6H15z" fill="#FFFFFF"/>
<path d="M26 33h10v6H26z" fill="#E6EAF0"/>
<rect x="13" y="6" width="3" height="27" fill="#2F72C4"/>
<rect x="19" y="12" width="14" height="6" rx="2" fill="#FECA57"/>`,
  },
  backpack: {
    label: 'School',
    tags: ['backpack', 'bag', 'school supplies', 'tas', 'sekolah'],
    svg: `<path d="M19 13v-3a5 5 0 0 1 10 0v3" fill="none" stroke="#E8862A" stroke-width="3" stroke-linecap="round"/>
<rect x="7" y="20" width="6" height="17" rx="3" fill="#B9805A"/>
<rect x="35" y="20" width="6" height="17" rx="3" fill="#966143"/>
<rect x="10" y="12" width="28" height="30" rx="8" fill="#FF9F43"/>
<path d="M24 12h6a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8h-6z" fill="#E8862A"/>
<rect x="14" y="27" width="20" height="11" rx="4" fill="#FECA57"/>
<path d="M24 27h6a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4h-6z" fill="#F0B429"/>
<rect x="14" y="20" width="20" height="3" rx="1.5" fill="#E8862A"/>`,
  },
  pencil: {
    label: 'Stationery',
    tags: ['pencil', 'write', 'supplies', 'pensil', 'alat tulis'],
    svg: `<g transform="rotate(45 24 24)">
<path d="M18 11V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3z" fill="#FF7EB6"/>
<path d="M24 5h3a3 3 0 0 1 3 3v3h-6z" fill="#E85C99"/>
<rect x="18" y="11" width="12" height="4" fill="#A4B0BE"/>
<rect x="24" y="11" width="6" height="4" fill="#7F8C9A"/>
<rect x="18" y="15" width="12" height="18" fill="#FECA57"/>
<rect x="24" y="15" width="6" height="18" fill="#F0B429"/>
<polygon points="18,33 30,33 24,43" fill="#F3D2A2"/>
<polygon points="24,33 30,33 24,43" fill="#DDB57E"/>
<polygon points="21.3,38.5 26.7,38.5 24,43" fill="#3D4451"/>
</g>`,
  },
  globe: {
    label: 'World',
    tags: ['globe', 'earth', 'travel', 'international', 'dunia'],
    svg: `<circle cx="24" cy="24" r="18" fill="#48DBFB"/>
<path d="M24 6a18 18 0 0 1 0 36z" fill="#22B8DB"/>
<path d="M13 12c2.5-2 6-2.5 8-1 2 1.5 1 4-1 5s-1.5 3.5 0 5.5c1.5 2 0 5-2.5 5.5-2 .5-2.5-2-3.5-4s-3.5-3-4-6c-.4-2.5 1-4 3-5.5z" fill="#2ECC71"/>
<path d="M28 10c3 0 6 1.5 8 4 .5 1.5-1 2.5-3 2.5s-3 1.5-2 3.5c1 2 4 2 5 4.5 1 3-1 6-3 8.5s-4 3-5 1c-1-2 0-4-1-6s-3.5-2-4-4.5c-.5-2.5 1.5-4 2-6s-1-3 0-5c.5-1.5 1.5-2.5 3-2.5z" fill="#22A85A"/>
<ellipse cx="17" cy="34" rx="3.5" ry="2.5" fill="#2ECC71"/>`,
  },
  family: {
    label: 'Family',
    tags: ['parents', 'kids', 'children', 'keluarga'],
    svg: `<path d="M5 28a7 7 0 0 1 14 0v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" fill="#4A90E2"/>
<path d="M12 21a7 7 0 0 1 7 7v7a2 2 0 0 1-2 2h-5z" fill="#2F72C4"/>
<path d="M29 28a7 7 0 0 1 14 0v7a2 2 0 0 1-2 2H31a2 2 0 0 1-2-2z" fill="#FF7EB6"/>
<path d="M36 21a7 7 0 0 1 7 7v7a2 2 0 0 1-2 2h-5z" fill="#E85C99"/>
<circle cx="12" cy="13" r="5" fill="#FFCF9E"/><path d="M12 8a5 5 0 0 1 0 10z" fill="#F0B47A"/>
<circle cx="36" cy="13" r="5" fill="#FFCF9E"/><path d="M36 8a5 5 0 0 1 0 10z" fill="#F0B47A"/>
<path d="M18 36a6 6 0 0 1 12 0v3a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z" fill="#FECA57"/>
<path d="M24 30a6 6 0 0 1 6 6v3a2 2 0 0 1-2 2h-4z" fill="#F0B429"/>
<circle cx="24" cy="24.5" r="4" fill="#FFCF9E"/><path d="M24 20.5a4 4 0 0 1 0 8z" fill="#F0B47A"/>`,
  },
  baby: {
    label: 'Baby',
    tags: ['kids', 'child', 'diapers', 'bayi', 'anak'],
    svg: `<circle cx="9.5" cy="26" r="3.5" fill="#FFCF9E"/>
<circle cx="38.5" cy="26" r="3.5" fill="#F0B47A"/>
<circle cx="24" cy="25" r="15" fill="#FFCF9E"/>
<path d="M24 10a15 15 0 0 1 0 30z" fill="#F0B47A"/>
<path d="M24 10c-3.5-1-5.5 2-3.5 4" fill="none" stroke="#966143" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="18" cy="23" r="2" fill="#3D4451"/><circle cx="30" cy="23" r="2" fill="#3D4451"/>
<circle cx="14.5" cy="29" r="2.5" fill="#FF7EB6"/><circle cx="33.5" cy="29" r="2.5" fill="#E85C99"/>
<ellipse cx="24" cy="32" rx="5.5" ry="3.5" fill="#48DBFB"/>
<circle cx="24" cy="32" r="2" fill="#22B8DB"/>`,
  },
  mosque: {
    label: 'Mosque',
    tags: ['zakat', 'religion', 'charity', 'masjid', 'sedekah'],
    svg: `<rect x="5" y="18" width="6" height="24" fill="#FFFFFF"/>
<polygon points="4.5,18.5 11.5,18.5 8,10" fill="#2ECC71"/>
<rect x="37" y="18" width="6" height="24" fill="#E6EAF0"/>
<polygon points="36.5,18.5 43.5,18.5 40,10" fill="#22A85A"/>
<rect x="12" y="26" width="24" height="16" fill="#FFFFFF"/>
<path d="M24 26h12v16H24z" fill="#E6EAF0"/>
<rect x="23" y="10" width="2" height="4" fill="#F0B429"/>
<path d="M11 29c0-8 6-12.5 13-16 7 3.5 13 8 13 16z" fill="#2ECC71"/>
<path d="M24 13c7 3.5 13 8 13 16H24z" fill="#22A85A"/>
<path d="M24.37 4.02A4 4 0 1 0 27.41 10.09A3.4 3.4 0 0 1 24.37 4.02z" fill="#FECA57"/>
<path d="M20 42v-6a4 4 0 0 1 8 0v6z" fill="#22A85A"/>`,
  },
  church: {
    label: 'Church',
    tags: ['tithe', 'religion', 'charity', 'gereja', 'persembahan'],
    svg: `<rect x="10" y="24" width="28" height="18" fill="#FFFFFF"/>
<path d="M24 24h14v18H24z" fill="#E6EAF0"/>
<polygon points="7,27 24,14 41,27" fill="#F25C54"/>
<polygon points="24,14 41,27 24,27" fill="#D64541"/>
<rect x="22.75" y="4" width="2.5" height="11" rx="1" fill="#F0B429"/>
<rect x="19.5" y="6.5" width="9" height="2.5" rx="1" fill="#F0B429"/>
<circle cx="24" cy="23" r="2.5" fill="#48DBFB"/>
<path d="M20 42v-7a4 4 0 0 1 8 0v7z" fill="#B9805A"/>
<path d="M24 31a4 4 0 0 1 4 4v7h-4z" fill="#966143"/>`,
  },
  'heart-hands': {
    label: 'Charity',
    tags: ['donation', 'give', 'love', 'donasi', 'amal'],
    svg: `<path d="M24 27c-6-4-10-7.5-10-12a5 5 0 0 1 10-1.5 5 5 0 0 1 10 1.5c0 4.5-4 8-10 12z" fill="#F25C54"/>
<path d="M24 13.5a5 5 0 0 1 10 1.5c0 4.5-4 8-10 12z" fill="#D64541"/>
<path d="M7 17a2.5 2.5 0 0 1 5 0v6c0 3 2 5 5 6l7 2v8H15c-4 0-8-3-8-8z" fill="#FFCF9E"/>
<path d="M41 17a2.5 2.5 0 0 0-5 0v6c0 3-2 5-5 6l-7 2v8h9c4 0 8-3 8-8z" fill="#F0B47A"/>`,
  },
  bell: {
    label: 'Subscriptions',
    tags: ['notification', 'reminder', 'bills', 'langganan'],
    svg: `<circle cx="24" cy="36" r="4.5" fill="#FF9F43"/>
<circle cx="24" cy="7" r="2.5" fill="#F0B429"/>
<path d="M24 8c-7 0-11 5-11 11v8l-4 6h30l-4-6v-8c0-6-4-11-11-11z" fill="#FECA57"/>
<path d="M24 8c7 0 11 5 11 11v8l4 6H24z" fill="#F0B429"/>
<path d="M17 20c0-3 1.5-5.5 4-6.5" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="2.5" stroke-linecap="round"/>`,
  },
  cloud: {
    label: 'Cloud storage',
    tags: ['storage', 'backup', 'online', 'penyimpanan'],
    svg: `<circle cx="17" cy="27" r="8" fill="#4A90E2"/>
<circle cx="26" cy="21" r="10" fill="#4A90E2"/>
<circle cx="34" cy="28" r="7" fill="#4A90E2"/>
<rect x="17" y="27" width="17" height="8" fill="#4A90E2"/>
<path d="M26 11a10 10 0 0 1 10 10.3a7 7 0 0 1-2 13.7H26z" fill="#2F72C4"/>
<path d="M25 32v-9M21 26.5l4-4 4 4" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  lightbulb: {
    label: 'Ideas',
    tags: ['idea', 'light', 'lampu', 'ide'],
    svg: `<path d="M24 6a12 12 0 0 0-7 21.7c1.3 1 2 2.4 2 4V33h10v-1.3c0-1.6.7-3 2-4A12 12 0 0 0 24 6z" fill="#FECA57"/>
<path d="M24 6a12 12 0 0 1 7 21.7c-1.3 1-2 2.4-2 4V33h-5z" fill="#F0B429"/>
<path d="M17 18a7 7 0 0 1 5-6.5" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="2.5" stroke-linecap="round"/>
<rect x="18" y="32" width="12" height="8" rx="2" fill="#A4B0BE"/>
<path d="M24 32h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4z" fill="#7F8C9A"/>
<rect x="21" y="39" width="6" height="4" rx="2" fill="#3D4451"/>`,
  },
  flower: {
    label: 'Flowers',
    tags: ['bouquet', 'gift', 'bunga'],
    svg: `<line x1="24" y1="24" x2="24" y2="42" stroke="#22A85A" stroke-width="3.5" stroke-linecap="round"/>
<path d="M24 37c-1-5-5-8-10-8 0 5 4 8 10 8z" fill="#2ECC71"/>
<path d="M24 34c1-4 4-6 8-6 0 4-3 6-8 6z" fill="#22A85A"/>
<circle cx="24" cy="10" r="5" fill="#FF7EB6"/>
<circle cx="17.94" cy="13.5" r="5" fill="#FF7EB6"/>
<circle cx="17.94" cy="20.5" r="5" fill="#FF7EB6"/>
<circle cx="30.06" cy="13.5" r="5" fill="#E85C99"/>
<circle cx="30.06" cy="20.5" r="5" fill="#E85C99"/>
<circle cx="24" cy="24" r="5" fill="#E85C99"/>
<circle cx="24" cy="17" r="5" fill="#FECA57"/>
<path d="M24 12a5 5 0 0 1 0 10z" fill="#F0B429"/>`,
  },
  sparkles: {
    label: 'Self care',
    tags: ['misc', 'beauty', 'wellness', 'perawatan'],
    svg: `<path d="M20 11Q22.5 23.5 35 26Q22.5 28.5 20 41Q17.5 28.5 5 26Q17.5 23.5 20 11z" fill="#FECA57"/>
<path d="M20 11Q22.5 23.5 35 26Q22.5 28.5 20 41z" fill="#F0B429"/>
<path d="M35 4Q36.2 9.8 42 11Q36.2 12.2 35 18Q33.8 12.2 28 11Q33.8 9.8 35 4z" fill="#FF7EB6"/>
<path d="M35 4Q36.2 9.8 42 11Q36.2 12.2 35 18z" fill="#E85C99"/>
<path d="M37 30Q37.9 34.1 42 35Q37.9 35.9 37 40Q36.1 35.9 32 35Q36.1 34.1 37 30z" fill="#A66CFF"/>
<path d="M37 30Q37.9 34.1 42 35Q37.9 35.9 37 40z" fill="#8A4FE6"/>`,
  },
  umbrella: {
    label: 'Umbrella',
    tags: ['insurance', 'rain', 'protection', 'asuransi', 'payung'],
    svg: `<path d="M24 22v14a4 4 0 0 1-8 0" fill="none" stroke="#966143" stroke-width="3" stroke-linecap="round"/>
<circle cx="24" cy="5" r="2" fill="#2F72C4"/>
<path d="M6 24A18 18 0 0 1 42 24a8 8 0 0 0-12 0a8 8 0 0 0-12 0a8 8 0 0 0-12 0z" fill="#4A90E2"/>
<path d="M24 6a18 18 0 0 1 18 18a8 8 0 0 0-12 0a8 8 0 0 0-6-2.7z" fill="#2F72C4"/>`,
  },
  'phone-topup': {
    label: 'Phone credit',
    tags: ['pulsa', 'mobile', 'top up', 'data', 'kuota'],
    svg: `<rect x="13" y="5" width="22" height="38" rx="5" fill="#5F6CD9"/>
<path d="M24 5h6a5 5 0 0 1 5 5v28a5 5 0 0 1-5 5h-6z" fill="#4651B8"/>
<rect x="16" y="10" width="16" height="26" rx="2" fill="#FFFFFF"/>
<path d="M24 10h6a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2h-6z" fill="#E6EAF0"/>
<rect x="22.5" y="17" width="3" height="12" rx="1.5" fill="#2ECC71"/>
<rect x="18" y="21.5" width="12" height="3" rx="1.5" fill="#2ECC71"/>
<rect x="21" y="38.5" width="6" height="2" rx="1" fill="#A4B0BE"/>`,
  },
  other: {
    label: 'Other',
    tags: ['misc', 'general', 'lainnya'],
    svg: `<rect x="7" y="11" width="34" height="26" rx="8" fill="#A4B0BE"/>
<path d="M24 11h9a8 8 0 0 1 8 8v10a8 8 0 0 1-8 8h-9z" fill="#7F8C9A"/>
<circle cx="16" cy="24" r="3" fill="#FFFFFF"/>
<circle cx="24" cy="24" r="3" fill="#FFFFFF"/>
<circle cx="32" cy="24" r="3" fill="#E6EAF0"/>`,
  },
};
