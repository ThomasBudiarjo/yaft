import type { IconSet } from './types';

export const transport: IconSet = {
  car: {
    label: 'Car',
    tags: ['vehicle', 'drive', 'transport', 'mobil'],
    svg: `<path d="M12 22l3.5-8.5A4 4 0 0 1 19.2 11h9.6a4 4 0 0 1 3.7 2.5L36 22z" fill="#48DBFB"/>
<path d="M24 11h4.8a4 4 0 0 1 3.7 2.5L36 22H24z" fill="#22B8DB"/>
<rect x="6" y="21" width="36" height="13" rx="5" fill="#F25C54"/>
<path d="M24 21h13a5 5 0 0 1 5 5v3a5 5 0 0 1-5 5H24z" fill="#D64541"/>
<circle cx="14" cy="34" r="5" fill="#3D4451"/><circle cx="34" cy="34" r="5" fill="#3D4451"/>
<circle cx="14" cy="34" r="2" fill="#A4B0BE"/><circle cx="34" cy="34" r="2" fill="#A4B0BE"/>
<rect x="8" y="25" width="5" height="3" rx="1.5" fill="#FECA57"/><rect x="35" y="25" width="5" height="3" rx="1.5" fill="#FECA57"/>`,
  },
  bus: {
    label: 'Transit',
    tags: ['bus', 'public transport', 'commute', 'bis'],
    svg: `<rect x="12" y="36" width="6" height="7" rx="2" fill="#3D4451"/><rect x="30" y="36" width="6" height="7" rx="2" fill="#3D4451"/>
<rect x="10" y="5" width="28" height="33" rx="6" fill="#4A90E2"/>
<path d="M24 5h8a6 6 0 0 1 6 6v21a6 6 0 0 1-6 6h-8z" fill="#2F72C4"/>
<rect x="13" y="13" width="22" height="12" rx="2.5" fill="#48DBFB"/>
<path d="M24 13h8.5a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5H24z" fill="#22B8DB"/>
<rect x="17" y="8" width="14" height="3" rx="1.5" fill="#FECA57"/>
<circle cx="16" cy="31" r="2.5" fill="#FECA57"/><circle cx="32" cy="31" r="2.5" fill="#FECA57"/>`,
  },
  train: {
    label: 'Train',
    tags: ['rail', 'commuter', 'krl', 'kereta'],
    svg: `<path d="M18 37l-4 6M30 37l4 6" fill="none" stroke="#3D4451" stroke-width="3" stroke-linecap="round"/>
<path d="M12 33V16A10 10 0 0 1 22 6h4a10 10 0 0 1 10 10v17a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5z" fill="#5F6CD9"/>
<path d="M24 6h2a10 10 0 0 1 10 10v17a5 5 0 0 1-5 5h-7z" fill="#4651B8"/>
<rect x="15" y="12" width="18" height="11" rx="3" fill="#48DBFB"/>
<path d="M24 12h6a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-6z" fill="#22B8DB"/>
<circle cx="18" cy="30" r="2.5" fill="#FECA57"/><circle cx="30" cy="30" r="2.5" fill="#FECA57"/>`,
  },
  motorbike: {
    label: 'Motorbike',
    tags: ['motorcycle', 'scooter', 'ojek', 'motor'],
    svg: `<path d="M36 31l-4.5-17M28.5 13.5H34" fill="none" stroke="#3D4451" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="17" y="23" width="10" height="9" rx="2" fill="#A4B0BE"/>
<path d="M22 23h3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-3z" fill="#7F8C9A"/>
<circle cx="12" cy="31" r="6.5" fill="#3D4451"/><circle cx="36" cy="31" r="6.5" fill="#3D4451"/>
<circle cx="12" cy="31" r="2.5" fill="#A4B0BE"/><circle cx="36" cy="31" r="2.5" fill="#A4B0BE"/>
<path d="M8 23a4 4 0 0 1 4-4h8l2-2.5h7.5l2.5 3V24a3 3 0 0 1-3 3H12a4 4 0 0 1-4-4z" fill="#F25C54"/>
<path d="M8 23h24v1a3 3 0 0 1-3 3H12a4 4 0 0 1-4-4z" fill="#D64541"/>
<rect x="10" y="15" width="11" height="4.5" rx="2.25" fill="#3D4451"/>
<circle cx="34.5" cy="19" r="2.5" fill="#FECA57"/>`,
  },
  bicycle: {
    label: 'Bicycle',
    tags: ['bike', 'cycling', 'sepeda'],
    svg: `<circle cx="13" cy="31" r="7.5" fill="none" stroke="#3D4451" stroke-width="3.5"/>
<circle cx="35" cy="31" r="7.5" fill="none" stroke="#3D4451" stroke-width="3.5"/>
<path d="M13 31l7-12h12l3 12M20 19l4 12H13M24 31l8-12M31 19l-1.5-5H34" fill="none" stroke="#2ECC71" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="15" y="13.5" width="9" height="3.5" rx="1.75" fill="#B9805A"/>
<circle cx="24" cy="31" r="2.5" fill="#A4B0BE"/>`,
  },
  taxi: {
    label: 'Taxi',
    tags: ['cab', 'ride', 'taksi'],
    svg: `<rect x="18" y="6" width="12" height="6" rx="2" fill="#3D4451"/>
<rect x="21" y="8" width="6" height="2" rx="1" fill="#FECA57"/>
<path d="M12 23l3.5-8.5A4 4 0 0 1 19.2 12h9.6a4 4 0 0 1 3.7 2.5L36 23z" fill="#48DBFB"/>
<path d="M24 12h4.8a4 4 0 0 1 3.7 2.5L36 23H24z" fill="#22B8DB"/>
<rect x="6" y="22" width="36" height="13" rx="5" fill="#FECA57"/>
<path d="M24 22h13a5 5 0 0 1 5 5v3a5 5 0 0 1-5 5H24z" fill="#F0B429"/>
<rect x="15" y="27" width="18" height="3" fill="#3D4451"/>
<circle cx="14" cy="35" r="5" fill="#3D4451"/><circle cx="34" cy="35" r="5" fill="#3D4451"/>
<circle cx="14" cy="35" r="2" fill="#A4B0BE"/><circle cx="34" cy="35" r="2" fill="#A4B0BE"/>
<rect x="8" y="26" width="5" height="3" rx="1.5" fill="#FFFFFF"/><rect x="35" y="26" width="5" height="3" rx="1.5" fill="#FFFFFF"/>`,
  },
  plane: {
    label: 'Travel',
    tags: ['plane', 'flight', 'airport', 'trip', 'pesawat'],
    svg: `<g transform="rotate(45 24 24)">
<polygon points="21,17 5,27 5,31 21,26" fill="#4A90E2"/>
<polygon points="27,17 43,27 43,31 27,26" fill="#2F72C4"/>
<polygon points="21,34 14,39 14,42 21,40" fill="#4A90E2"/>
<polygon points="27,34 34,39 34,42 27,40" fill="#2F72C4"/>
<rect x="20" y="4" width="8" height="38" rx="4" fill="#FFFFFF"/>
<path d="M24 4a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4z" fill="#E6EAF0"/>
<path d="M21.5 10a2.5 2.5 0 0 1 5 0v2h-5z" fill="#48DBFB"/>
</g>`,
  },
  ship: {
    label: 'Ship',
    tags: ['boat', 'ferry', 'cruise', 'kapal'],
    svg: `<rect x="20" y="6" width="6" height="7" rx="1.5" fill="#FF9F43"/>
<rect x="16" y="11" width="16" height="9" rx="2" fill="#FFFFFF"/>
<path d="M24 11h6a2 2 0 0 1 2 2v7h-8z" fill="#E6EAF0"/>
<rect x="11" y="18" width="26" height="11" rx="2" fill="#FFFFFF"/>
<path d="M24 18h11a2 2 0 0 1 2 2v9H24z" fill="#E6EAF0"/>
<circle cx="17" cy="23.5" r="2" fill="#4A90E2"/><circle cx="24" cy="23.5" r="2" fill="#4A90E2"/><circle cx="31" cy="23.5" r="2" fill="#4A90E2"/>
<path d="M5 28h38l-4.2 9.5A4 4 0 0 1 35.1 40H12.9a4 4 0 0 1-3.7-2.5z" fill="#F25C54"/>
<path d="M24 28h19l-4.2 9.5A4 4 0 0 1 35.1 40H24z" fill="#D64541"/>`,
  },
  fuel: {
    label: 'Fuel',
    tags: ['gas', 'petrol', 'gas station', 'bensin', 'spbu'],
    svg: `<path d="M30 20h2a3 3 0 0 1 3 3v9a3 3 0 0 0 6 0V18l-4-5" fill="none" stroke="#3D4451" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="9" y="7" width="22" height="34" rx="4" fill="#F25C54"/>
<path d="M20 7h7a4 4 0 0 1 4 4v30H20z" fill="#D64541"/>
<rect x="13" y="11" width="14" height="9" rx="2" fill="#FFFFFF"/>
<path d="M20 11h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5z" fill="#E6EAF0"/>
<path d="M20 25c-2.5 3-4 5-4 7a4 4 0 0 0 8 0c0-2-1.5-4-4-7z" fill="#FECA57"/>
<rect x="7" y="39" width="26" height="4" rx="2" fill="#3D4451"/>`,
  },
  parking: {
    label: 'Parking',
    tags: ['park', 'garage', 'parkir'],
    svg: `<rect x="7" y="7" width="34" height="34" rx="8" fill="#4A90E2"/>
<path d="M24 7h9a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8h-9z" fill="#2F72C4"/>
<path d="M18 14h7.5a6.5 6.5 0 0 1 0 13H22.5v5.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5V15.5A1.5 1.5 0 0 1 18 14zM22.5 18.5v4h3a2 2 0 0 0 0-4z" fill="#FFFFFF" fill-rule="evenodd"/>`,
  },
  'ev-charge': {
    label: 'EV charging',
    tags: ['electric', 'charger', 'ev', 'charging', 'listrik'],
    svg: `<path d="M30 30h2a3 3 0 0 0 3-3V18" fill="none" stroke="#3D4451" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M33 11v-3M37 11v-3" fill="none" stroke="#7F8C9A" stroke-width="2.5" stroke-linecap="round"/>
<rect x="31" y="10" width="8" height="8" rx="2" fill="#3D4451"/>
<rect x="9" y="7" width="22" height="34" rx="4" fill="#2ECC71"/>
<path d="M20 7h7a4 4 0 0 1 4 4v30H20z" fill="#22A85A"/>
<polygon points="22,12 14,26 19.5,26 17.5,36 26,22 20.5,22" fill="#FECA57"/>
<rect x="7" y="39" width="26" height="4" rx="2" fill="#3D4451"/>`,
  },
  road: {
    label: 'Toll road',
    tags: ['road', 'toll', 'highway', 'tol', 'jalan'],
    svg: `<polygon points="18,6 30,6 43,42 5,42" fill="#3D4451"/>
<polygon points="24,6 30,6 43,42 24,42" fill="#2B313B"/>
<path d="M18 6L5 42M30 6l13 36" fill="none" stroke="#A4B0BE" stroke-width="2.5" stroke-linecap="round"/>
<polygon points="23.2,9 24.8,9 25.1,13 22.9,13" fill="#FECA57"/>
<polygon points="22.6,18 25.4,18 25.9,24 22.1,24" fill="#FECA57"/>
<polygon points="21.8,29 26.2,29 26.9,38 21.1,38" fill="#FECA57"/>`,
  },
  'map-pin': {
    label: 'Location',
    tags: ['map', 'pin', 'place', 'lokasi'],
    svg: `<path d="M24 43S11 29.5 11 19a13 13 0 0 1 26 0c0 10.5-13 24-13 24z" fill="#F25C54"/>
<path d="M24 6a13 13 0 0 1 13 13c0 10.5-13 24-13 24z" fill="#D64541"/>
<circle cx="24" cy="19" r="5.5" fill="#FFFFFF"/>`,
  },
  suitcase: {
    label: 'Luggage',
    tags: ['suitcase', 'baggage', 'travel', 'koper'],
    svg: `<path d="M19 12V7h10v5" fill="none" stroke="#7F8C9A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="17" cy="41" r="2.5" fill="#3D4451"/><circle cx="31" cy="41" r="2.5" fill="#3D4451"/>
<rect x="11" y="12" width="26" height="28" rx="5" fill="#FF9F43"/>
<path d="M24 12h8a5 5 0 0 1 5 5v18a5 5 0 0 1-5 5h-8z" fill="#E8862A"/>
<rect x="16.5" y="17" width="3" height="18" rx="1.5" fill="#E8862A"/>
<rect x="28.5" y="17" width="3" height="18" rx="1.5" fill="#B9805A"/>`,
  },
  passport: {
    label: 'Passport',
    tags: ['visa', 'immigration', 'paspor'],
    svg: `<rect x="13" y="7" width="25" height="35" rx="3" fill="#E6EAF0"/>
<rect x="10" y="6" width="25" height="35" rx="3" fill="#2ECC71"/>
<path d="M22.5 6H32a3 3 0 0 1 3 3v29a3 3 0 0 1-3 3h-9.5z" fill="#22A85A"/>
<circle cx="22.5" cy="20" r="6.5" fill="#FECA57"/>
<path d="M22.5 20h6.5a6.5 6.5 0 0 1-6.5 6.5z" fill="#F0B429"/>
<path d="M16 20h13M22.5 13.5c-3.5 4-3.5 9 0 13M22.5 13.5c3.5 4 3.5 9 0 13" fill="none" stroke="#22A85A" stroke-width="2"/>
<rect x="16" y="32" width="13" height="3" rx="1.5" fill="#FECA57"/>`,
  },
  hotel: {
    label: 'Hotel',
    tags: ['bed', 'stay', 'lodging', 'penginapan', 'hotel'],
    svg: `<rect x="37" y="31" width="4.5" height="9" rx="2" fill="#966143"/>
<rect x="6" y="9" width="6.5" height="31" rx="3.25" fill="#B9805A"/>
<path d="M9.25 9a3.25 3.25 0 0 1 3.25 3.25v24.5A3.25 3.25 0 0 1 9.25 40z" fill="#966143"/>
<rect x="11" y="26" width="31" height="8" rx="2.5" fill="#B9805A"/>
<path d="M11 30h31v1.5a2.5 2.5 0 0 1-2.5 2.5H11z" fill="#966143"/>
<rect x="13.5" y="18" width="10" height="8" rx="3.5" fill="#FFFFFF"/>
<path d="M18.5 18h1.5a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1-3.5 3.5h-1.5z" fill="#E6EAF0"/>
<rect x="24.5" y="18" width="17.5" height="10" rx="3" fill="#A66CFF"/>
<path d="M24.5 23h17.5v2a3 3 0 0 1-3 3H27.5a3 3 0 0 1-3-3z" fill="#8A4FE6"/>`,
  },
  beach: {
    label: 'Beach',
    tags: ['vacation', 'holiday', 'sea', 'pantai', 'liburan'],
    svg: `<path d="M24 19v19" fill="none" stroke="#966143" stroke-width="3" stroke-linecap="round"/>
<path d="M9 20a15 15 0 0 1 30 0z" fill="#F25C54"/>
<path d="M24 5a15 15 0 0 1 15 15H24z" fill="#D64541"/>
<path d="M24 5c-4 3-6 9-6 15h12c0-6-2-12-6-15z" fill="#FFFFFF"/>
<path d="M24 5c4 3 6 9 6 15h-6z" fill="#E6EAF0"/>
<path d="M5 41c3-5 35-5 38 0a2 2 0 0 1-1.8 2.5H6.8A2 2 0 0 1 5 41z" fill="#F3D2A2"/>
<path d="M24 37.3c8 0 17 1.2 19 3.7a2 2 0 0 1-1.8 2.5H24z" fill="#DDB57E"/>`,
  },
  mountain: {
    label: 'Mountain',
    tags: ['hiking', 'nature', 'outdoor', 'gunung'],
    svg: `<polygon points="19,7 34,41 4,41" fill="#5F6CD9"/>
<polygon points="19,7 34,41 19,41" fill="#4651B8"/>
<polygon points="19,7 23.85,18 21.5,16.5 19,19 16.5,16.5 14.15,18" fill="#FFFFFF"/>
<polygon points="19,7 23.85,18 21.5,16.5 19,19" fill="#E6EAF0"/>
<polygon points="31,18 44,41 18,41" fill="#4A90E2"/>
<polygon points="31,18 44,41 31,41" fill="#2F72C4"/>
<polygon points="31,18 34.96,25 33,23.5 31,25.5 29,23.5 27.04,25" fill="#FFFFFF"/>
<polygon points="31,18 34.96,25 33,23.5 31,25.5" fill="#E6EAF0"/>`,
  },
};
