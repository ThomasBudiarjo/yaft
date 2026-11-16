import type { IconSet } from './types';

export const health: IconSet = {
  pill: {
    label: 'Health',
    tags: ['pill', 'capsule', 'medicine', 'kesehatan', 'obat'],
    svg: `<g transform="rotate(-45 24 24)">
<path d="M14 16h10v16H14a8 8 0 0 1 0-16z" fill="#F25C54"/>
<path d="M6 24h18v8H14a8 8 0 0 1-8-8z" fill="#D64541"/>
<path d="M24 16h10a8 8 0 0 1 0 16H24z" fill="#FFFFFF"/>
<path d="M24 24h18a8 8 0 0 1-8 8H24z" fill="#E6EAF0"/>
<rect x="11" y="19" width="8" height="2.5" rx="1.25" fill="#FFFFFF" fill-opacity="0.45"/>
</g>`,
  },
  'first-aid': {
    label: 'First aid',
    tags: ['first aid', 'kit', 'emergency', 'p3k'],
    svg: `<path d="M18 14v-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" fill="none" stroke="#7F8C9A" stroke-width="3.5" stroke-linecap="round"/>
<rect x="6" y="14" width="36" height="26" rx="5" fill="#F25C54"/>
<path d="M24 14h13a5 5 0 0 1 5 5v16a5 5 0 0 1-5 5H24z" fill="#D64541"/>
<path d="M21 20h6v5h5v6h-5v5h-6v-5h-5v-6h5z" fill="#FFFFFF"/>
<path d="M24 20h3v5h5v6h-5v5h-3z" fill="#E6EAF0"/>`,
  },
  hospital: {
    label: 'Hospital',
    tags: ['clinic', 'doctor', 'rumah sakit', 'klinik'],
    svg: `<path d="M6 21a3 3 0 0 1 3-3h6V9a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9h6a3 3 0 0 1 3 3v21H6z" fill="#FFFFFF"/>
<path d="M24 6h6a3 3 0 0 1 3 3v9h6a3 3 0 0 1 3 3v21H24z" fill="#E6EAF0"/>
<path d="M22 10h4v3h3v4h-3v3h-4v-3h-3v-4h3z" fill="#F25C54"/>
<rect x="9" y="23" width="4" height="4" rx="1" fill="#4A90E2"/><rect x="9" y="31" width="4" height="4" rx="1" fill="#4A90E2"/>
<rect x="35" y="23" width="4" height="4" rx="1" fill="#2F72C4"/><rect x="35" y="31" width="4" height="4" rx="1" fill="#2F72C4"/>
<path d="M20 42v-7a4 4 0 0 1 4-4v11z" fill="#4A90E2"/>
<path d="M24 31a4 4 0 0 1 4 4v7h-4z" fill="#2F72C4"/>`,
  },
  tooth: {
    label: 'Dentist',
    tags: ['tooth', 'dental', 'dokter gigi', 'gigi'],
    svg: `<path d="M15 7c-5 0-8 4-8 10 0 5 2 8 3 12 1 5 2 12 6 12 3 0 3-5 4-9 1-3 2-4 4-4s3 1 4 4c1 4 1 9 4 9 4 0 5-7 6-12 1-4 3-7 3-12 0-6-3-10-8-10-4 0-5 2-9 2s-5-2-9-2z" fill="#FFFFFF"/>
<path d="M24 9c4 0 5-2 9-2 5 0 8 4 8 10 0 5-2 8-3 12-1 5-2 12-6 12-3 0-3-5-4-9-1-3-2-4-4-4z" fill="#E6EAF0"/>
<path d="M14 11l1.5 3.5L19 16l-3.5 1.5L14 21l-1.5-3.5L9 16l3.5-1.5z" fill="#48DBFB"/>`,
  },
  stethoscope: {
    label: 'Doctor',
    tags: ['stethoscope', 'checkup', 'dokter', 'periksa'],
    svg: `<path d="M11 10v8a8 8 0 0 0 16 0v-8" fill="none" stroke="#5F6CD9" stroke-width="3.5" stroke-linecap="round"/>
<path d="M19 26v5a7.5 7.5 0 0 0 15 0" fill="none" stroke="#4651B8" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="11" cy="9" r="3" fill="#3D4451"/><circle cx="27" cy="9" r="3" fill="#3D4451"/>
<circle cx="34" cy="24" r="6.5" fill="#A4B0BE"/>
<path d="M34 17.5a6.5 6.5 0 0 1 0 13z" fill="#7F8C9A"/>
<circle cx="34" cy="24" r="3" fill="#FFFFFF"/>`,
  },
  heart: {
    label: 'Heart',
    tags: ['love', 'cardio', 'jantung'],
    svg: `<path d="M24 40c-1 0-2-.5-3-1.4C12 31 6 25 6 17.5 6 12 10 8 15 8c4 0 7 2 9 5 2-3 5-5 9-5 5 0 9 4 9 9.5 0 7.5-6 13.5-15 21.1-1 .9-2 1.4-3 1.4z" fill="#F25C54"/>
<path d="M24 13c2-3 5-5 9-5 5 0 9 4 9 9.5 0 7.5-6 13.5-15 21.1-1 .9-2 1.4-3 1.4z" fill="#D64541"/>
<ellipse cx="14" cy="16" rx="3.5" ry="2.2" transform="rotate(-45 14 16)" fill="#FFFFFF" fill-opacity="0.45"/>`,
  },
  dumbbell: {
    label: 'Gym',
    tags: ['dumbbell', 'fitness', 'workout', 'olahraga'],
    svg: `<rect x="5" y="22" width="38" height="4" rx="2" fill="#A4B0BE"/>
<path d="M5 24h38a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" fill="#7F8C9A"/>
<rect x="8" y="16" width="6" height="16" rx="2" fill="#4A90E2"/><rect x="34" y="16" width="6" height="16" rx="2" fill="#4A90E2"/>
<path d="M8 24h6v6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z M34 24h6v6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" fill="#2F72C4"/>
<rect x="13" y="11" width="7" height="26" rx="2.5" fill="#5F6CD9"/><rect x="28" y="11" width="7" height="26" rx="2.5" fill="#5F6CD9"/>
<path d="M13 24h7v10.5a2.5 2.5 0 0 1-2.5 2.5h-2a2.5 2.5 0 0 1-2.5-2.5z M28 24h7v10.5a2.5 2.5 0 0 1-2.5 2.5h-2a2.5 2.5 0 0 1-2.5-2.5z" fill="#4651B8"/>`,
  },
  yoga: {
    label: 'Yoga',
    tags: ['meditation', 'exercise', 'meditasi'],
    svg: `<path d="M17.5 23l-6.5 9M30.5 23l6.5 9" fill="none" stroke="#F0B47A" stroke-width="3.5" stroke-linecap="round"/>
<path d="M17 31v-7a7 7 0 0 1 14 0v7z" fill="#A66CFF"/>
<path d="M24 17a7 7 0 0 1 7 7v7h-7z" fill="#8A4FE6"/>
<rect x="7" y="30" width="34" height="10" rx="5" fill="#5F6CD9"/>
<path d="M24 30h12a5 5 0 0 1 0 10H24z" fill="#4651B8"/>
<circle cx="24" cy="10.5" r="6" fill="#FFCF9E"/>
<path d="M24 4.5a6 6 0 0 1 0 12z" fill="#F0B47A"/>`,
  },
  scissors: {
    label: 'Haircut',
    tags: ['scissors', 'barber', 'salon', 'potong rambut', 'cukur'],
    svg: `<path d="M22 25l-4 6M26 25l4 6" fill="none" stroke="#F25C54" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="16" cy="35" r="5.5" fill="none" stroke="#F25C54" stroke-width="3.5"/>
<circle cx="32" cy="35" r="5.5" fill="none" stroke="#D64541" stroke-width="3.5"/>
<polygon points="32,5 24,24 20.3,22.3" fill="#A4B0BE"/><polygon points="32,5 27.7,25.7 24,24" fill="#7F8C9A"/>
<polygon points="16,5 20.3,25.7 24,24" fill="#A4B0BE"/><polygon points="16,5 24,24 27.7,22.3" fill="#7F8C9A"/>
<circle cx="24" cy="24" r="2" fill="#3D4451"/>`,
  },
  lotus: {
    label: 'Spa',
    tags: ['lotus', 'relax', 'massage', 'pijat'],
    svg: `<ellipse cx="24" cy="36.5" rx="15" ry="4" fill="#2ECC71"/>
<path d="M24 36.5h15a15 4 0 0 1-15 4z" fill="#22A85A"/>
<path d="M24 16c6 4 6 12 0 18-6-6-6-14 0-18z" transform="rotate(-70 24 34)" fill="#A66CFF"/>
<path d="M24 16c6 4 6 12 0 18-6-6-6-14 0-18z" transform="rotate(70 24 34)" fill="#8A4FE6"/>
<path d="M24 10c7 5 7 17 0 24-7-7-7-19 0-24z" transform="rotate(-38 24 34)" fill="#FF7EB6"/>
<path d="M24 10c7 5 7 17 0 24-7-7-7-19 0-24z" transform="rotate(38 24 34)" fill="#E85C99"/>
<path d="M24 8c8 6 8 18 0 26-8-8-8-20 0-26z" fill="#FF7EB6"/>
<path d="M24 8c8 6 8 18 0 26z" fill="#E85C99"/>`,
  },
  makeup: {
    label: 'Makeup',
    tags: ['cosmetics', 'beauty', 'powder', 'kosmetik', 'bedak'],
    svg: `<rect x="20" y="22" width="8" height="5" rx="2" fill="#E85C99"/>
<circle cx="24" cy="14" r="11" fill="#FF7EB6"/>
<path d="M24 3a11 11 0 0 1 0 22z" fill="#E85C99"/>
<circle cx="24" cy="14" r="8" fill="#48DBFB"/>
<path d="M24 6a8 8 0 0 1 0 16z" fill="#22B8DB"/>
<ellipse cx="21" cy="11" rx="3" ry="1.6" transform="rotate(-45 21 11)" fill="#FFFFFF" fill-opacity="0.5"/>
<ellipse cx="24" cy="35.5" rx="17" ry="7.5" fill="#E85C99"/>
<ellipse cx="24" cy="32.5" rx="17" ry="7.5" fill="#FF7EB6"/>
<ellipse cx="24" cy="32.5" rx="11" ry="4.5" fill="#FFCF9E"/>
<path d="M35 32.5a11 4.5 0 0 1-22 0z" fill="#F0B47A"/>`,
  },
  'baby-bottle': {
    label: 'Baby',
    tags: ['baby bottle', 'milk', 'infant', 'bayi', 'susu'],
    svg: `<path d="M19 14c0-3 2-4 2.5-6a2.5 2.5 0 0 1 5 0c.5 2 2.5 3 2.5 6z" fill="#FECA57"/>
<path d="M24 5.5a2.5 2.5 0 0 1 2.5 2.5c.5 2 2.5 3 2.5 6h-5z" fill="#F0B429"/>
<path d="M14 19h20v18a5 5 0 0 1-5 5H19a5 5 0 0 1-5-5z" fill="#FFFFFF"/>
<path d="M24 19h10v18a5 5 0 0 1-5 5h-5z" fill="#E6EAF0"/>
<rect x="13" y="13" width="22" height="7" rx="2.5" fill="#4A90E2"/>
<path d="M24 13h8.5a2.5 2.5 0 0 1 2.5 2.5v2a2.5 2.5 0 0 1-2.5 2.5H24z" fill="#2F72C4"/>
<rect x="17" y="25" width="6" height="2.5" rx="1.25" fill="#4A90E2"/><rect x="17" y="30" width="4" height="2.5" rx="1.25" fill="#4A90E2"/><rect x="17" y="35" width="6" height="2.5" rx="1.25" fill="#4A90E2"/>`,
  },
  toy: {
    label: 'Toys',
    tags: ['teddy bear', 'kids', 'mainan', 'boneka'],
    svg: `<circle cx="15.5" cy="8.5" r="4.5" fill="#B9805A"/><circle cx="32.5" cy="8.5" r="4.5" fill="#966143"/>
<circle cx="15.5" cy="8.5" r="2" fill="#F3D2A2"/><circle cx="32.5" cy="8.5" r="2" fill="#DDB57E"/>
<circle cx="13" cy="30" r="4" fill="#B9805A"/><circle cx="35" cy="30" r="4" fill="#966143"/>
<circle cx="16.5" cy="40" r="4" fill="#B9805A"/><circle cx="31.5" cy="40" r="4" fill="#966143"/>
<ellipse cx="24" cy="33" rx="11" ry="9" fill="#B9805A"/>
<path d="M24 24a11 9 0 0 1 0 18z" fill="#966143"/>
<circle cx="24" cy="16" r="10" fill="#B9805A"/>
<path d="M24 6a10 10 0 0 1 0 20z" fill="#966143"/>
<ellipse cx="24" cy="20" rx="4.5" ry="3.5" fill="#F3D2A2"/>
<ellipse cx="24" cy="18.5" rx="2" ry="1.5" fill="#3D4451"/>
<circle cx="20" cy="14" r="1.5" fill="#3D4451"/><circle cx="28" cy="14" r="1.5" fill="#3D4451"/>
<path d="M24 27l-5-3v6zM24 27l5-3v6z" fill="#F25C54"/>`,
  },
  paw: {
    label: 'Pets',
    tags: ['paw', 'pet', 'animal', 'hewan peliharaan'],
    svg: `<path d="M24 23c-6 0-12 7-12 12 0 4 3 6 6 6 2.5 0 4-1.5 6-1.5s3.5 1.5 6 1.5c3 0 6-2 6-6 0-5-6-12-12-12z" fill="#B9805A"/>
<path d="M24 23c6 0 12 7 12 12 0 4-3 6-6 6-2.5 0-4-1.5-6-1.5z" fill="#966143"/>
<ellipse cx="9.5" cy="21" rx="4" ry="5" transform="rotate(-20 9.5 21)" fill="#B9805A"/>
<ellipse cx="18" cy="12" rx="4.5" ry="5.5" transform="rotate(-10 18 12)" fill="#B9805A"/>
<ellipse cx="30" cy="12" rx="4.5" ry="5.5" transform="rotate(10 30 12)" fill="#966143"/>
<ellipse cx="38.5" cy="21" rx="4" ry="5" transform="rotate(20 38.5 21)" fill="#966143"/>`,
  },
  dog: {
    label: 'Dog',
    tags: ['pet', 'puppy', 'anjing'],
    svg: `<path d="M15 11c-5-1-10 2-10 9 0 5 2 9 5 9 3 0 5-5 6-9z" fill="#B9805A"/>
<path d="M33 11c5-1 10 2 10 9 0 5-2 9-5 9-3 0-5-5-6-9z" fill="#966143"/>
<ellipse cx="24" cy="24" rx="12" ry="14" fill="#F3D2A2"/>
<path d="M24 10a12 14 0 0 1 0 28z" fill="#DDB57E"/>
<ellipse cx="24" cy="32" rx="7" ry="5" fill="#FFFFFF"/>
<path d="M24 27a7 5 0 0 1 0 10z" fill="#E6EAF0"/>
<ellipse cx="24" cy="29" rx="3" ry="2.2" fill="#3D4451"/>
<circle cx="19.5" cy="21" r="1.8" fill="#3D4451"/><circle cx="28.5" cy="21" r="1.8" fill="#3D4451"/>`,
  },
  cat: {
    label: 'Cat',
    tags: ['pet', 'kitten', 'kucing'],
    svg: `<polygon points="8,6 21,14 9,24" fill="#FF9F43"/><polygon points="40,6 27,14 39,24" fill="#E8862A"/>
<polygon points="10.5,10.5 17,14.5 11,19.5" fill="#FF7EB6"/><polygon points="37.5,10.5 31,14.5 37,19.5" fill="#E85C99"/>
<ellipse cx="24" cy="27" rx="15" ry="13" fill="#FF9F43"/>
<path d="M24 14a15 13 0 0 1 0 26z" fill="#E8862A"/>
<circle cx="21.5" cy="33.5" r="3.5" fill="#FFFFFF"/><circle cx="26.5" cy="33.5" r="3.5" fill="#E6EAF0"/>
<ellipse cx="18.5" cy="26" rx="2" ry="2.5" fill="#3D4451"/><ellipse cx="29.5" cy="26" rx="2" ry="2.5" fill="#3D4451"/>
<path d="M21.5 30.5h5l-2.5 3z" fill="#FF7EB6"/>`,
  },
  'sneaker-run': {
    label: 'Sports',
    tags: ['running', 'shoe', 'sport', 'lari', 'olahraga'],
    svg: `<path d="M4 18h6M3 24h7M5 30h5" fill="none" stroke="#A4B0BE" stroke-width="3" stroke-linecap="round"/>
<path d="M14 14a2 2 0 0 1 2-2h5a2 2 0 0 1 2 1.5l1 3.5c.5 2 2 3 4 3.5l8 2c4 1 7 4 7 8v1H14z" fill="#4A90E2"/>
<path d="M28 20.5l8 2c4 1 7 4 7 8v1H28z" fill="#2F72C4"/>
<path d="M17 27c6 1 12-1 17-5" fill="none" stroke="#FECA57" stroke-width="3" stroke-linecap="round"/>
<rect x="12" y="31" width="32" height="6" rx="3" fill="#FFFFFF"/>
<path d="M12 34h32a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3z" fill="#E6EAF0"/>`,
  },
  medicine: {
    label: 'Medicine',
    tags: ['pill bottle', 'pharmacy', 'drugs', 'obat', 'apotek'],
    svg: `<path d="M14 14h20v24a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z" fill="#FF9F43"/>
<path d="M24 14h10v24a4 4 0 0 1-4 4h-6z" fill="#E8862A"/>
<rect x="12" y="6" width="24" height="9" rx="2.5" fill="#FFFFFF"/>
<path d="M24 6h9.5a2.5 2.5 0 0 1 2.5 2.5v4a2.5 2.5 0 0 1-2.5 2.5H24z" fill="#E6EAF0"/>
<rect x="14" y="21" width="20" height="14" fill="#FFFFFF"/>
<rect x="24" y="21" width="10" height="14" fill="#E6EAF0"/>
<path d="M22.5 23.5h3v3h3v3h-3v3h-3v-3h-3v-3h3z" fill="#F25C54"/>`,
  },
};
