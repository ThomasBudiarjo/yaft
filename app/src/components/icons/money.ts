import type { IconSet } from './types';

export const money: IconSet = {
  wallet: {
    label: 'Wallet',
    tags: ['purse', 'money', 'dompet'],
    svg: `<rect x="11" y="8" width="24" height="12" rx="2" fill="#2ECC71"/>
<path d="M24 8h9a2 2 0 0 1 2 2v10H24z" fill="#22A85A"/>
<rect x="6" y="15" width="34" height="26" rx="5" fill="#B9805A"/>
<path d="M24 15h11a5 5 0 0 1 5 5v16a5 5 0 0 1-5 5H24z" fill="#966143"/>
<rect x="29" y="23" width="13" height="10" rx="4" fill="#FECA57"/>
<circle cx="34" cy="28" r="2" fill="#E8862A"/>`,
  },
  cash: {
    label: 'Cash',
    tags: ['other income', 'banknote', 'money', 'uang', 'tunai'],
    svg: `<rect x="4" y="12" width="40" height="24" rx="3.5" fill="#2ECC71"/>
<path d="M24 12h16.5a3.5 3.5 0 0 1 3.5 3.5v17a3.5 3.5 0 0 1-3.5 3.5H24z" fill="#22A85A"/>
<rect x="8" y="16" width="32" height="16" rx="2" fill="#FFFFFF" fill-opacity="0.35"/>
<circle cx="24" cy="24" r="5" fill="#2ECC71"/>
<path d="M24 19a5 5 0 0 1 0 10z" fill="#22A85A"/>`,
  },
  coins: {
    label: 'Coins',
    tags: ['money', 'change', 'koin', 'receh'],
    svg: `<rect x="6" y="35" width="22" height="6" rx="3" fill="#FECA57"/>
<path d="M17 35h8a3 3 0 0 1 0 6h-8z" fill="#F0B429"/>
<rect x="8" y="28" width="22" height="6" rx="3" fill="#FECA57"/>
<path d="M19 28h8a3 3 0 0 1 0 6h-8z" fill="#F0B429"/>
<rect x="5" y="21" width="22" height="6" rx="3" fill="#FECA57"/>
<path d="M16 21h8a3 3 0 0 1 0 6h-8z" fill="#F0B429"/>
<rect x="7" y="14" width="22" height="6" rx="3" fill="#FECA57"/>
<path d="M18 14h8a3 3 0 0 1 0 6h-8z" fill="#F0B429"/>
<circle cx="32" cy="30" r="11" fill="#FECA57"/>
<path d="M32 19a11 11 0 0 1 0 22z" fill="#F0B429"/>
<circle cx="32" cy="30" r="5.5" fill="#FFFFFF" fill-opacity="0.4"/>`,
  },
  'money-bag': {
    label: 'Salary',
    tags: ['money bag', 'income', 'wage', 'gaji'],
    svg: `<path d="M17 7l4 3 3-3 3 3 4-3-3 9h-8z" fill="#DDB57E"/>
<path d="M18 17C9 22 6 30 8 35c2 6 8 7 16 7s14-1 16-7c2-5-1-13-10-18z" fill="#F3D2A2"/>
<path d="M24 17h6c9 5 12 13 10 18-2 6-8 7-16 7z" fill="#DDB57E"/>
<rect x="17" y="14.5" width="14" height="4" rx="2" fill="#966143"/>
<path d="M28.5 25.5c-1-2-8.5-2.5-8.5 1.5s8 2.5 8 6.5-7 3.5-8.5 1M24 21.5v17" fill="none" stroke="#22A85A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  card: {
    label: 'Card',
    tags: ['credit card', 'debit', 'kartu', 'kredit'],
    svg: `<rect x="5" y="11" width="38" height="26" rx="4" fill="#4A90E2"/>
<path d="M24 11h15a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H24z" fill="#2F72C4"/>
<rect x="5" y="16" width="38" height="5" fill="#3D4451"/>
<rect x="24" y="16" width="19" height="5" fill="#2B313B"/>
<rect x="10" y="25" width="8" height="6" rx="1.5" fill="#FECA57"/>
<rect x="25" y="29" width="13" height="3" rx="1.5" fill="#FFFFFF" fill-opacity="0.5"/>`,
  },
  bank: {
    label: 'Bank',
    tags: ['finance', 'building', 'bank'],
    svg: `<path d="M24 6L43 16.5H5z" fill="#4A90E2" stroke="#4A90E2" stroke-width="2" stroke-linejoin="round"/>
<path d="M24 6l19 10.5H24z" fill="#2F72C4" stroke="#2F72C4" stroke-width="2" stroke-linejoin="round"/>
<circle cx="24" cy="12.5" r="2.5" fill="#FECA57"/>
<rect x="8" y="17.5" width="32" height="3.5" fill="#A4B0BE"/>
<rect x="24" y="17.5" width="16" height="3.5" fill="#7F8C9A"/>
<rect x="10" y="21" width="5" height="14" fill="#FFFFFF"/>
<rect x="18" y="21" width="5" height="14" fill="#FFFFFF"/>
<rect x="25" y="21" width="5" height="14" fill="#E6EAF0"/>
<rect x="33" y="21" width="5" height="14" fill="#E6EAF0"/>
<rect x="6" y="35" width="36" height="6" rx="1.5" fill="#A4B0BE"/>
<rect x="24" y="35" width="18" height="6" rx="1.5" fill="#7F8C9A"/>`,
  },
  'piggy-bank': {
    label: 'Piggy bank',
    tags: ['savings', 'save', 'tabungan', 'celengan'],
    svg: `<rect x="11" y="32" width="6" height="9" rx="2" fill="#E85C99"/>
<rect x="26" y="32" width="6" height="9" rx="2" fill="#E85C99"/>
<path d="M8 25c-3 0-4-4-1-4" fill="none" stroke="#E85C99" stroke-width="2.5" stroke-linecap="round"/>
<path d="M11 19l2-9 7 5z" fill="#E85C99"/>
<ellipse cx="22" cy="26" rx="15" ry="12" fill="#FF7EB6"/>
<path d="M22 14a15 12 0 0 1 0 24z" fill="#E85C99"/>
<rect x="34" y="21" width="8" height="10" rx="3.5" fill="#FF7EB6"/>
<circle cx="37" cy="26" r="1.3" fill="#D64541"/><circle cx="40" cy="26" r="1.3" fill="#D64541"/>
<circle cx="30" cy="21.5" r="1.6" fill="#3D4451"/>
<rect x="17" y="16" width="9" height="2.5" rx="1.25" fill="#D64541"/>
<circle cx="21.5" cy="9" r="4.5" fill="#FECA57"/>
<path d="M21.5 4.5a4.5 4.5 0 0 1 0 9z" fill="#F0B429"/>`,
  },
  chart: {
    label: 'Investment',
    tags: ['chart', 'stocks', 'growth', 'investasi', 'saham'],
    svg: `<rect x="8" y="30" width="9" height="11" rx="1.5" fill="#4A90E2"/>
<rect x="12.5" y="30" width="4.5" height="11" fill="#2F72C4"/>
<rect x="19.5" y="24" width="9" height="17" rx="1.5" fill="#4A90E2"/>
<rect x="24" y="24" width="4.5" height="17" fill="#2F72C4"/>
<rect x="31" y="17" width="9" height="24" rx="1.5" fill="#4A90E2"/>
<rect x="35.5" y="17" width="4.5" height="24" fill="#2F72C4"/>
<path d="M7 24l9-8 6 4 12-10" fill="none" stroke="#2ECC71" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30 6.5h9v9z" fill="#2ECC71" stroke="#2ECC71" stroke-width="2" stroke-linejoin="round"/>`,
  },
  gold: {
    label: 'Gold',
    tags: ['gold bars', 'bullion', 'emas', 'logam mulia'],
    svg: `<path d="M8.5 28h11l3.5 13H5z" fill="#FECA57"/>
<path d="M14 28h5.5l3.5 13h-9z" fill="#F0B429"/>
<path d="M28.5 28h11l3.5 13H25z" fill="#FECA57"/>
<path d="M34 28h5.5l3.5 13h-9z" fill="#F0B429"/>
<path d="M18.5 13h11l3.5 13H15z" fill="#FECA57"/>
<path d="M24 13h5.5l3.5 13h-9z" fill="#F0B429"/>
<rect x="9.5" y="30" width="5" height="2" rx="1" fill="#FFFFFF" fill-opacity="0.5"/>
<rect x="29.5" y="30" width="5" height="2" rx="1" fill="#FFFFFF" fill-opacity="0.5"/>
<rect x="19.5" y="15" width="5" height="2" rx="1" fill="#FFFFFF" fill-opacity="0.5"/>
<path d="M38 5l1.5 3.5L43 10l-3.5 1.5L38 15l-1.5-3.5L33 10l3.5-1.5z" fill="#FF9F43"/>`,
  },
  briefcase: {
    label: 'Work',
    tags: ['briefcase', 'job', 'office', 'kerja'],
    svg: `<path d="M18 16v-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4" fill="none" stroke="#966143" stroke-width="3.5" stroke-linecap="round"/>
<rect x="6" y="16" width="36" height="24" rx="4" fill="#B9805A"/>
<path d="M24 16h14a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H24z" fill="#966143"/>
<rect x="6" y="25" width="36" height="3" fill="#FFFFFF" fill-opacity="0.35"/>
<rect x="20" y="22.5" width="8" height="8" rx="2" fill="#FECA57"/>
<rect x="24" y="22.5" width="4" height="8" rx="1" fill="#F0B429"/>`,
  },
  office: {
    label: 'Office',
    tags: ['building', 'company', 'kantor'],
    svg: `<rect x="29" y="18" width="12" height="24" rx="2" fill="#5F6CD9"/>
<rect x="35" y="18" width="6" height="24" rx="1" fill="#4651B8"/>
<rect x="7" y="6" width="24" height="36" rx="2" fill="#4A90E2"/>
<path d="M19 6h10a2 2 0 0 1 2 2v34H19z" fill="#2F72C4"/>
<rect x="11" y="10" width="5" height="4" rx="1" fill="#48DBFB"/>
<rect x="22" y="10" width="5" height="4" rx="1" fill="#22B8DB"/>
<rect x="11" y="17" width="5" height="4" rx="1" fill="#48DBFB"/>
<rect x="22" y="17" width="5" height="4" rx="1" fill="#22B8DB"/>
<rect x="11" y="24" width="5" height="4" rx="1" fill="#48DBFB"/>
<rect x="22" y="24" width="5" height="4" rx="1" fill="#22B8DB"/>
<rect x="15" y="33" width="8" height="9" rx="1" fill="#3D4451"/>
<rect x="32" y="23" width="6" height="3" rx="1" fill="#48DBFB"/>
<rect x="32" y="30" width="6" height="3" rx="1" fill="#48DBFB"/>`,
  },
  calculator: {
    label: 'Calculator',
    tags: ['math', 'accounting', 'kalkulator', 'hitung'],
    svg: `<rect x="10" y="5" width="28" height="38" rx="4" fill="#5F6CD9"/>
<path d="M24 5h10a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H24z" fill="#4651B8"/>
<rect x="14" y="9" width="20" height="8" rx="1.5" fill="#1DD1A1"/>
<rect x="24" y="9" width="10" height="8" rx="1.5" fill="#13A882"/>
<rect x="14" y="21" width="5" height="5" rx="1.5" fill="#FFFFFF"/>
<rect x="21.5" y="21" width="5" height="5" rx="1.5" fill="#FFFFFF"/>
<rect x="29" y="21" width="5" height="5" rx="1.5" fill="#E6EAF0"/>
<rect x="14" y="28.5" width="5" height="5" rx="1.5" fill="#FFFFFF"/>
<rect x="21.5" y="28.5" width="5" height="5" rx="1.5" fill="#FFFFFF"/>
<rect x="29" y="28.5" width="5" height="5" rx="1.5" fill="#E6EAF0"/>
<rect x="14" y="36" width="5" height="3.5" rx="1.5" fill="#FFFFFF"/>
<rect x="21.5" y="36" width="5" height="3.5" rx="1.5" fill="#FFFFFF"/>
<rect x="29" y="28.5" width="5" height="11" rx="1.5" fill="#FF9F43"/>`,
  },
  contract: {
    label: 'Contract',
    tags: ['document', 'agreement', 'sign', 'kontrak', 'perjanjian'],
    svg: `<path d="M8 8a3 3 0 0 1 3-3h14l7 7v26a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3z" fill="#FFFFFF"/>
<path d="M20 5h5l7 7v26a3 3 0 0 1-3 3h-9z" fill="#E6EAF0"/>
<path d="M25 5v5a2 2 0 0 0 2 2h5z" fill="#A4B0BE"/>
<rect x="12" y="15" width="14" height="2.5" rx="1.25" fill="#A4B0BE"/>
<rect x="12" y="21" width="16" height="2.5" rx="1.25" fill="#A4B0BE"/>
<rect x="12" y="27" width="10" height="2.5" rx="1.25" fill="#A4B0BE"/>
<path d="M12 35c2-3 3 1 5-1" fill="none" stroke="#4A90E2" stroke-width="2.5" stroke-linecap="round"/>
<g transform="rotate(40 34 27)">
<rect x="31" y="12" width="6" height="22" rx="1.5" fill="#FF9F43"/>
<rect x="34" y="12" width="3" height="22" rx="1" fill="#E8862A"/>
<rect x="31" y="12" width="6" height="5" rx="1.5" fill="#F25C54"/>
<path d="M31 34h6l-3 6z" fill="#F3D2A2"/>
<path d="M33 38h2l-1 2z" fill="#3D4451"/>
</g>`,
  },
  handshake: {
    label: 'Deal',
    tags: ['handshake', 'agreement', 'partner', 'kesepakatan'],
    svg: `<rect x="3" y="16" width="8" height="18" rx="2" fill="#4A90E2"/>
<rect x="3" y="26" width="8" height="8" rx="2" fill="#2F72C4"/>
<rect x="37" y="16" width="8" height="18" rx="2" fill="#FF9F43"/>
<rect x="37" y="26" width="8" height="8" rx="2" fill="#E8862A"/>
<rect x="16" y="17" width="21" height="17" rx="5" fill="#F0B47A"/>
<path d="M11 18h7l7-3.5a2.5 2.5 0 0 1 2.5 4.3L22 22v10H11z" fill="#FFCF9E"/>
<rect x="13" y="19.6" width="18" height="3.2" rx="1.6" fill="#FFCF9E"/>
<rect x="13" y="24.2" width="20" height="3.2" rx="1.6" fill="#FFCF9E"/>
<rect x="13" y="28.8" width="18" height="3.2" rx="1.6" fill="#FFCF9E"/>`,
  },
  refund: {
    label: 'Refund',
    tags: ['return', 'cashback', 'money back', 'pengembalian'],
    svg: `<path d="M8.06 19.73A16.5 16.5 0 0 1 32.25 9.71" fill="none" stroke="#2ECC71" stroke-width="3.5" stroke-linecap="round"/>
<path d="M36.15 11.96L34.25 6.25 30.25 13.17z" fill="#2ECC71" stroke="#2ECC71" stroke-width="2" stroke-linejoin="round"/>
<path d="M39.94 28.27A16.5 16.5 0 0 1 15.75 38.29" fill="none" stroke="#22A85A" stroke-width="3.5" stroke-linecap="round"/>
<path d="M11.85 36.04L13.75 41.75 17.75 34.83z" fill="#22A85A" stroke="#22A85A" stroke-width="2" stroke-linejoin="round"/>
<circle cx="24" cy="24" r="9" fill="#FECA57"/>
<path d="M24 15a9 9 0 0 1 0 18z" fill="#F0B429"/>
<circle cx="24" cy="24" r="4.5" fill="#FFFFFF" fill-opacity="0.4"/>`,
  },
  invoice: {
    label: 'Invoice',
    tags: ['bill', 'receipt', 'clipboard', 'tagihan', 'faktur'],
    svg: `<rect x="9" y="8" width="30" height="35" rx="3" fill="#B9805A"/>
<path d="M24 8h12a3 3 0 0 1 3 3v29a3 3 0 0 1-3 3H24z" fill="#966143"/>
<rect x="13" y="13" width="22" height="26" rx="1.5" fill="#FFFFFF"/>
<rect x="24" y="13" width="11" height="26" rx="1" fill="#E6EAF0"/>
<rect x="17" y="5" width="14" height="7" rx="2" fill="#A4B0BE"/>
<rect x="24" y="5" width="7" height="7" rx="2" fill="#7F8C9A"/>
<rect x="17" y="17" width="10" height="2.5" rx="1.25" fill="#4A90E2"/>
<rect x="17" y="23" width="14" height="2.5" rx="1.25" fill="#A4B0BE"/>
<rect x="17" y="29" width="14" height="2.5" rx="1.25" fill="#A4B0BE"/>
<rect x="17" y="34" width="7" height="2.5" rx="1.25" fill="#A4B0BE"/>
<rect x="27" y="34" width="4" height="2.5" rx="1.25" fill="#2ECC71"/>`,
  },
  'laptop-work': {
    label: 'Freelance',
    tags: ['laptop', 'remote work', 'online', 'kerja'],
    svg: `<rect x="9" y="10" width="30" height="21" rx="2.5" fill="#3D4451"/>
<path d="M24 10h12.5a2.5 2.5 0 0 1 2.5 2.5V31H24z" fill="#2B313B"/>
<rect x="12" y="13" width="24" height="15" rx="1" fill="#FFFFFF"/>
<rect x="24" y="13" width="12" height="15" rx="1" fill="#E6EAF0"/>
<rect x="15" y="21" width="4" height="5" rx="1" fill="#4A90E2"/>
<rect x="22" y="18" width="4" height="8" rx="1" fill="#4A90E2"/>
<rect x="29" y="15" width="4" height="11" rx="1" fill="#2ECC71"/>
<path d="M5 31h38l-2 5a3 3 0 0 1-2.8 2H9.8A3 3 0 0 1 7 36z" fill="#A4B0BE"/>
<path d="M24 31h19l-2 5a3 3 0 0 1-2.8 2H24z" fill="#7F8C9A"/>
<rect x="20" y="31" width="8" height="2.5" rx="1.25" fill="#3D4451"/>`,
  },
  donate: {
    label: 'Charity',
    tags: ['donate', 'zakat', 'give', 'sedekah', 'amal'],
    svg: `<path d="M24 27L14.8 17.6A5.6 5.6 0 0 1 24 11.4A5.6 5.6 0 0 1 33.2 17.6z" fill="#F25C54" stroke="#F25C54" stroke-width="2" stroke-linejoin="round"/>
<path d="M24 11.4A5.6 5.6 0 0 1 33.2 17.6L24 27z" fill="#D64541" stroke="#D64541" stroke-width="2" stroke-linejoin="round"/>
<rect x="4" y="28" width="8" height="13" rx="2" fill="#4A90E2"/>
<rect x="4" y="35" width="8" height="6" rx="2" fill="#2F72C4"/>
<path d="M12 30h22l3.5-4a2.5 2.5 0 0 1 4 3l-4.5 7a6 6 0 0 1-5 3H12z" fill="#FFCF9E"/>
<path d="M12 34.5h25.5l-1.5 1.5a6 6 0 0 1-5 3H12z" fill="#F0B47A"/>`,
  },
};
