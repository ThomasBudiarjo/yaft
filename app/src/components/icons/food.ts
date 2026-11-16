import type { IconSet } from './types';

export const food: IconSet = {
  utensils: {
    label: 'Dining',
    tags: ['restaurant', 'eat', 'meal', 'makan', 'restoran'],
    svg: `<circle cx="24" cy="24" r="11.5" fill="#48DBFB"/>
<path d="M24 12.5a11.5 11.5 0 0 1 0 23z" fill="#22B8DB"/>
<circle cx="24" cy="24" r="7.5" fill="#FFFFFF"/>
<path d="M24 16.5a7.5 7.5 0 0 1 0 15z" fill="#E6EAF0"/>
<path d="M4 7.5a1 1 0 0 1 2 0V14h1V7.5a1 1 0 0 1 2 0V14h1V7.5a1 1 0 0 1 2 0V16a4 4 0 0 1-2.5 3.7V39.5a1.5 1.5 0 0 1-3 0V19.7A4 4 0 0 1 4 16z" fill="#A4B0BE"/>
<path d="M8 14h2V7.5a1 1 0 0 1 2 0V16a4 4 0 0 1-2.5 3.7V39.5A1.5 1.5 0 0 1 8 41z" fill="#7F8C9A"/>
<path d="M37 9c4 1.5 6 6.5 6 13.5h-1.5v17a2 2 0 0 1-4 0V22.5H37z" fill="#A4B0BE"/>
<path d="M39.5 10.2c2.4 2.2 3.5 6.3 3.5 12.3h-1.5v17a2 2 0 0 1-2 2z" fill="#7F8C9A"/>`,
  },
  burger: {
    label: 'Burger',
    tags: ['fast food', 'hamburger', 'meal', 'makan'],
    svg: `<path d="M9 32h30v3a5 5 0 0 1-5 5H14a5 5 0 0 1-5-5z" fill="#FF9F43"/>
<path d="M24 32h15v3a5 5 0 0 1-5 5H24z" fill="#E8862A"/>
<rect x="7" y="26.5" width="34" height="7" rx="3.5" fill="#B9805A"/>
<path d="M24 26.5h13.5a3.5 3.5 0 0 1 0 7H24z" fill="#966143"/>
<path d="M8 23.5h32v4l-4 4-4-4H8z" fill="#FECA57"/>
<path d="M24 23.5h16v4l-4 4-4-4h-8z" fill="#F0B429"/>
<rect x="7" y="20.5" width="34" height="4.5" rx="2.25" fill="#2ECC71"/>
<path d="M24 20.5h14.75a2.25 2.25 0 0 1 0 4.5H24z" fill="#22A85A"/>
<path d="M8 20c0-6.5 7-11.5 16-11.5S40 13.5 40 20a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" fill="#FF9F43"/>
<path d="M24 8.5c9 0 16 5 16 11.5a2 2 0 0 1-2 2H24z" fill="#E8862A"/>
<ellipse cx="17" cy="14.5" rx="1.6" ry="1" fill="#FFFFFF"/><ellipse cx="24" cy="12.5" rx="1.6" ry="1" fill="#FFFFFF"/><ellipse cx="31" cy="14.5" rx="1.6" ry="1" fill="#FFFFFF"/>`,
  },
  pizza: {
    label: 'Pizza',
    tags: ['slice', 'fast food', 'makan'],
    svg: `<path d="M8.5 15c10-4.5 21-4.5 31 0L25.6 41a1.8 1.8 0 0 1-3.2 0z" fill="#FECA57"/>
<path d="M24 11.6c5.3 0 10.5 1.1 15.5 3.4L25.6 41a1.8 1.8 0 0 1-1.6 1z" fill="#F0B429"/>
<path d="M6.3 11.5c11.5-5.5 23.9-5.5 35.4 0a1.5 1.5 0 0 1 .7 2l-1.2 2.6a1.5 1.5 0 0 1-2 .7c-10-4.6-20.4-4.6-30.4 0a1.5 1.5 0 0 1-2-.7l-1.2-2.6a1.5 1.5 0 0 1 .7-2z" fill="#FF9F43"/>
<path d="M24 7.4c6 0 12 1.4 17.7 4.1a1.5 1.5 0 0 1 .7 2l-1.2 2.6a1.5 1.5 0 0 1-2 .7C34.2 14.5 29.1 13.4 24 13.4z" fill="#E8862A"/>
<circle cx="19" cy="20" r="3.2" fill="#F25C54"/><circle cx="29" cy="21" r="3.2" fill="#D64541"/><circle cx="24" cy="29.5" r="2.8" fill="#F25C54"/>`,
  },
  noodles: {
    label: 'Noodles',
    tags: ['ramen', 'bowl', 'mie', 'bakmi', 'makan'],
    svg: `<path d="M27 21L38 6M31 22l11-13" fill="none" stroke="#966143" stroke-width="3" stroke-linecap="round"/>
<path d="M9 23c1-7 8-11.5 15-11.5S38 16 39 23z" fill="#FECA57"/>
<path d="M24 11.5c7 0 14 4.5 15 11.5H24z" fill="#F0B429"/>
<path d="M12 20c2-3 4 0 6-3s4 0 6-3M19 22c2-3 4 0 6-3s4 0 6-3" fill="none" stroke="#E8862A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 22h36c0 9.5-8 17-18 17S6 31.5 6 22z" fill="#F25C54"/>
<path d="M24 22h18c0 9.5-8 17-18 17z" fill="#D64541"/>
<rect x="17" y="37" width="14" height="4" rx="2" fill="#D64541"/>
<circle cx="14" cy="28" r="1.8" fill="#FFFFFF"/><circle cx="24" cy="30" r="1.8" fill="#FFFFFF"/><circle cx="34" cy="28" r="1.8" fill="#E6EAF0"/>`,
  },
  'rice-bowl': {
    label: 'Rice',
    tags: ['bowl', 'meal', 'nasi', 'makan'],
    svg: `<path d="M8 23c0-6.5 7-11 16-11s16 4.5 16 11z" fill="#FFFFFF"/>
<path d="M24 12c9 0 16 4.5 16 11H24z" fill="#E6EAF0"/>
<ellipse cx="15" cy="19" rx="1.6" ry="1" fill="#E6EAF0"/><ellipse cx="19" cy="16" rx="1.6" ry="1" fill="#E6EAF0"/>
<ellipse cx="29.5" cy="11.5" rx="4.5" ry="2.2" transform="rotate(-30 29.5 11.5)" fill="#2ECC71"/>
<circle cx="25" cy="15" r="3.6" fill="#F25C54"/>
<path d="M25 11.4a3.6 3.6 0 0 1 0 7.2z" fill="#D64541"/>
<path d="M6 22h36c0 9.5-8 17-18 17S6 31.5 6 22z" fill="#4A90E2"/>
<path d="M24 22h18c0 9.5-8 17-18 17z" fill="#2F72C4"/>
<rect x="17" y="37" width="14" height="4" rx="2" fill="#2F72C4"/>
<circle cx="15" cy="29" r="1.8" fill="#FFFFFF"/><circle cx="24" cy="31" r="1.8" fill="#FFFFFF"/><circle cx="33" cy="29" r="1.8" fill="#E6EAF0"/>`,
  },
  satay: {
    label: 'Satay',
    tags: ['skewer', 'grill', 'sate', 'makan'],
    svg: `<g transform="rotate(35 24 24)">
<path d="M18.5 8v35M29.5 8v35" fill="none" stroke="#F0B429" stroke-width="3" stroke-linecap="round"/>
<rect x="13.5" y="6" width="10" height="7" rx="3" fill="#B9805A"/><path d="M18.5 6h2a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-2z" fill="#966143"/>
<rect x="13.5" y="15" width="10" height="7" rx="3" fill="#B9805A"/><path d="M18.5 15h2a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-2z" fill="#966143"/>
<rect x="13.5" y="24" width="10" height="7" rx="3" fill="#B9805A"/><path d="M18.5 24h2a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-2z" fill="#966143"/>
<rect x="24.5" y="6" width="10" height="7" rx="3" fill="#B9805A"/><path d="M29.5 6h2a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-2z" fill="#966143"/>
<rect x="24.5" y="15" width="10" height="7" rx="3" fill="#B9805A"/><path d="M29.5 15h2a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-2z" fill="#966143"/>
<rect x="24.5" y="24" width="10" height="7" rx="3" fill="#B9805A"/><path d="M29.5 24h2a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-2z" fill="#966143"/>
</g>`,
  },
  coffee: {
    label: 'Coffee',
    tags: ['cafe', 'drink', 'kopi', 'minuman'],
    svg: `<path d="M30 21h4a6 6 0 0 1 0 12h-3" fill="none" stroke="#966143" stroke-width="3.5" stroke-linecap="round"/>
<path d="M9 18h24v13a10 10 0 0 1-10 10h-4A10 10 0 0 1 9 31z" fill="#FFFFFF"/>
<path d="M21 18h12v13a10 10 0 0 1-10 10h-2z" fill="#E6EAF0"/>
<path d="M11 20h20v2H11z" fill="#B9805A"/>
<path d="M16 7c-2 2.5 2 4 0 7M23 6c-2 2.5 2 4 0 7" fill="none" stroke="#A4B0BE" stroke-width="2.5" stroke-linecap="round"/>`,
  },
  tea: {
    label: 'Tea',
    tags: ['drink', 'cup', 'teh', 'minuman'],
    svg: `<path d="M32 22h3a5 5 0 0 1 0 10h-3" fill="none" stroke="#22A85A" stroke-width="3.5" stroke-linecap="round"/>
<path d="M8 19h26v9a10 10 0 0 1-10 10h-6A10 10 0 0 1 8 28z" fill="#2ECC71"/>
<path d="M21 19h13v9a10 10 0 0 1-10 10h-3z" fill="#22A85A"/>
<rect x="5" y="37" width="34" height="4" rx="2" fill="#A4B0BE"/>
<path d="M22 37h15a2 2 0 0 1 0 4H22z" fill="#7F8C9A"/>
<path d="M15 19v9" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
<rect x="11" y="27" width="8" height="7" rx="1.5" fill="#FECA57"/>
<path d="M15 27h2.5a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5H15z" fill="#F0B429"/>
<path d="M17 6c-2 2.5 2 4 0 7M25 6c-2 2.5 2 4 0 7" fill="none" stroke="#A4B0BE" stroke-width="2.5" stroke-linecap="round"/>`,
  },
  boba: {
    label: 'Bubble tea',
    tags: ['boba', 'milk tea', 'drink', 'minuman'],
    svg: `<path d="M25 15L31 4" fill="none" stroke="#A66CFF" stroke-width="3.5" stroke-linecap="round"/>
<path d="M12 16h24l-2.6 23.4a3 3 0 0 1-3 2.6H17.6a3 3 0 0 1-3-2.6z" fill="#F3D2A2"/>
<path d="M24 16h12l-2.6 23.4a3 3 0 0 1-3 2.6H24z" fill="#DDB57E"/>
<rect x="10" y="12" width="28" height="5" rx="2.5" fill="#FF7EB6"/>
<path d="M24 12h11.5a2.5 2.5 0 0 1 0 5H24z" fill="#E85C99"/>
<circle cx="19" cy="37" r="2.4" fill="#3D4451"/><circle cx="24.5" cy="38" r="2.4" fill="#2B313B"/><circle cx="30" cy="36.5" r="2.4" fill="#2B313B"/>
<circle cx="21.5" cy="32.5" r="2.4" fill="#3D4451"/><circle cx="27.5" cy="32" r="2.4" fill="#2B313B"/>`,
  },
  cake: {
    label: 'Cake',
    tags: ['dessert', 'sweet', 'birthday', 'kue'],
    svg: `<path d="M9 21h30v15a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3z" fill="#FF7EB6"/>
<path d="M24 21h15v15a3 3 0 0 1-3 3H24z" fill="#E85C99"/>
<rect x="9" y="31" width="30" height="3" fill="#FECA57"/>
<rect x="24" y="31" width="15" height="3" fill="#F0B429"/>
<path d="M8 21a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0a4 4 0 0 1-8 0a4 4 0 0 1-8 0a4 4 0 0 1-8 0z" fill="#FFFFFF"/>
<path d="M24 17h12a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0a4 4 0 0 1-8 0z" fill="#E6EAF0"/>
<path d="M25 9.5c0-2.5 1.5-4.5 4-5.5" fill="none" stroke="#22A85A" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="24" cy="13" r="4" fill="#F25C54"/>
<path d="M24 9a4 4 0 0 1 0 8z" fill="#D64541"/>
<rect x="5" y="38.5" width="38" height="3" rx="1.5" fill="#A4B0BE"/>`,
  },
  'ice-cream': {
    label: 'Ice cream',
    tags: ['dessert', 'cone', 'sweet', 'es krim'],
    svg: `<path d="M14 24h20l-8.6 17.4a1.6 1.6 0 0 1-2.8 0z" fill="#FF9F43"/>
<path d="M24 24h10l-8.6 17.4a1.6 1.6 0 0 1-1.4.8z" fill="#E8862A"/>
<circle cx="24" cy="15" r="10" fill="#FF7EB6"/>
<path d="M24 5a10 10 0 0 1 0 20z" fill="#E85C99"/>
<rect x="12" y="20" width="24" height="6" rx="3" fill="#FF7EB6"/>
<path d="M24 20h9a3 3 0 0 1 0 6h-9z" fill="#E85C99"/>
<circle cx="19" cy="12" r="1.3" fill="#FECA57"/><circle cx="25" cy="10" r="1.3" fill="#48DBFB"/><circle cx="28" cy="15" r="1.3" fill="#FFFFFF"/><circle cx="21" cy="17" r="1.3" fill="#48DBFB"/>`,
  },
  donut: {
    label: 'Donut',
    tags: ['doughnut', 'dessert', 'sweet', 'donat'],
    svg: `<path d="M8 24a16 16 0 1 0 32 0a16 16 0 1 0-32 0zM19 24a5 5 0 1 0 10 0a5 5 0 1 0-10 0z" fill="#FF9F43" fill-rule="evenodd"/>
<path d="M24 8a16 16 0 0 1 0 32v-11a5 5 0 0 0 0-10z" fill="#E8862A"/>
<path d="M10.5 24a13.5 13.5 0 1 0 27 0a13.5 13.5 0 1 0-27 0zM17.5 24a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0-13 0z" fill="#FF7EB6" fill-rule="evenodd"/>
<path d="M24 10.5a13.5 13.5 0 0 1 0 27v-7a6.5 6.5 0 0 0 0-13z" fill="#E85C99"/>
<rect x="15" y="15.5" width="4" height="2" rx="1" transform="rotate(-35 17 16.5)" fill="#FECA57"/>
<rect x="27" y="13.5" width="4" height="2" rx="1" transform="rotate(25 29 14.5)" fill="#FFFFFF"/>
<rect x="31" y="25" width="4" height="2" rx="1" transform="rotate(-60 33 26)" fill="#48DBFB"/>
<rect x="13" y="27" width="4" height="2" rx="1" transform="rotate(50 15 28)" fill="#48DBFB"/>
<rect x="22" y="32" width="4" height="2" rx="1" transform="rotate(-10 24 33)" fill="#FECA57"/>`,
  },
  apple: {
    label: 'Fruit',
    tags: ['apple', 'fruit', 'healthy', 'buah'],
    svg: `<path d="M24 15c0-3 1-6 3.5-8.5" fill="none" stroke="#966143" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="32" cy="9.5" rx="5" ry="2.5" transform="rotate(-25 32 9.5)" fill="#2ECC71"/>
<path d="M24 16c-3-2-6-2.5-9-1.5C9 16.5 7.5 23 9 29c1.7 7 6.5 12 11 12 1.8 0 2.8-.8 4-.8s2.2.8 4 .8c4.5 0 9.3-5 11-12 1.5-6 0-12.5-6-14.5-3-1-6-.5-9 1.5z" fill="#F25C54"/>
<path d="M24 16c3-2 6-2.5 9-1.5 6 2 7.5 8.5 6 14.5-1.7 7-6.5 12-11 12-1.8 0-2.8-.8-4-.8z" fill="#D64541"/>
<ellipse cx="15" cy="23" rx="2" ry="4" transform="rotate(20 15 23)" fill="#FFFFFF" fill-opacity="0.45"/>`,
  },
  bread: {
    label: 'Bread',
    tags: ['bakery', 'loaf', 'roti'],
    svg: `<path d="M6 24c0-8 8-13 18-13s18 5 18 13v8a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="#FF9F43"/>
<path d="M24 11c10 0 18 5 18 13v8a5 5 0 0 1-5 5H24z" fill="#E8862A"/>
<path d="M14 18l4 5M21.5 16.5l4 5M29 18l4 5" fill="none" stroke="#F3D2A2" stroke-width="3" stroke-linecap="round"/>`,
  },
  drumstick: {
    label: 'Chicken',
    tags: ['drumstick', 'fried chicken', 'meat', 'ayam'],
    svg: `<g transform="rotate(40 24 24)">
<rect x="21.5" y="31" width="5" height="11" fill="#F3D2A2"/>
<rect x="24" y="31" width="2.5" height="11" fill="#DDB57E"/>
<circle cx="20.8" cy="42.5" r="3.4" fill="#F3D2A2"/><circle cx="27.2" cy="42.5" r="3.4" fill="#F3D2A2"/>
<path d="M27.2 39.1a3.4 3.4 0 0 1 0 6.8z" fill="#DDB57E"/>
<path d="M24 5c8 0 13.5 6 13.5 13.5 0 5.5-3 9.5-6.5 12L28 35h-8l-3-4.5c-3.5-2.5-6.5-6.5-6.5-12C10.5 11 16 5 24 5z" fill="#FF9F43"/>
<path d="M24 5c8 0 13.5 6 13.5 13.5 0 5.5-3 9.5-6.5 12L28 35h-4z" fill="#E8862A"/>
<ellipse cx="17.5" cy="14" rx="2" ry="3.5" transform="rotate(25 17.5 14)" fill="#FFFFFF" fill-opacity="0.4"/>
</g>`,
  },
  fish: {
    label: 'Fish',
    tags: ['seafood', 'ikan'],
    svg: `<path d="M17 15l4-5.5a2 2 0 0 1 1.6-.8H28l-2 6.3z" fill="#2F72C4"/>
<path d="M33 24l8.3-8.4a1.5 1.5 0 0 1 2.7 1v14.8a1.5 1.5 0 0 1-2.7 1z" fill="#4A90E2"/>
<path d="M33 24h11v8.4a1.5 1.5 0 0 1-2.7 1z" fill="#2F72C4"/>
<path d="M4 24c4-7 10-11 17-11s12 4 15 11c-3 7-8 11-15 11S8 31 4 24z" fill="#4A90E2"/>
<path d="M4 24h32c-3 7-8 11-15 11S8 31 4 24z" fill="#2F72C4"/>
<circle cx="12" cy="22" r="2.8" fill="#FFFFFF"/><circle cx="12" cy="22" r="1.4" fill="#3D4451"/>
<path d="M18 17.5c1.8 4 1.8 9 0 13" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.45"/>`,
  },
  beer: {
    label: 'Beer',
    tags: ['drink', 'bar', 'alcohol', 'bir', 'minuman'],
    svg: `<path d="M33 20h3a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4h-3" fill="none" stroke="#F0B429" stroke-width="3.5" stroke-linecap="round"/>
<path d="M9 16h24v22a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3z" fill="#FECA57"/>
<path d="M22 16h11v22a3 3 0 0 1-3 3h-8z" fill="#F0B429"/>
<rect x="13.5" y="23" width="3" height="13" rx="1.5" fill="#FFFFFF" fill-opacity="0.45"/>
<circle cx="13" cy="15" r="5" fill="#FFFFFF"/><circle cx="20" cy="12" r="5.5" fill="#FFFFFF"/>
<circle cx="27" cy="12.5" r="5" fill="#E6EAF0"/><circle cx="31.5" cy="16" r="4" fill="#E6EAF0"/>
<rect x="8" y="15" width="26" height="5" rx="2.5" fill="#FFFFFF"/>
<path d="M22 15h9.5a2.5 2.5 0 0 1 0 5H22z" fill="#E6EAF0"/>`,
  },
  wine: {
    label: 'Wine',
    tags: ['drink', 'glass', 'alcohol', 'anggur', 'minuman'],
    svg: `<rect x="22.5" y="26" width="3" height="13" fill="#A4B0BE"/>
<rect x="24" y="26" width="1.5" height="13" fill="#7F8C9A"/>
<rect x="14" y="38" width="20" height="3.5" rx="1.75" fill="#A4B0BE"/>
<path d="M24 38h8.25a1.75 1.75 0 0 1 0 3.5H24z" fill="#7F8C9A"/>
<path d="M13 6h22c1.5 10-1 20.5-11 21.5C14 26.5 11.5 16 13 6z" fill="#FFFFFF"/>
<path d="M24 6h11c1.5 10-1 20.5-11 21.5z" fill="#E6EAF0"/>
<path d="M12.6 14h22.8c-.3 6.5-3.5 12.8-11.4 13.5C16 26.8 12.9 20.5 12.6 14z" fill="#F25C54"/>
<path d="M24 14h11.4c-.3 6.5-3.5 12.8-11.4 13.5z" fill="#D64541"/>`,
  },
  snack: {
    label: 'Snacks',
    tags: ['chips', 'crisps', 'camilan', 'jajan'],
    svg: `<path d="M12 10h24c2 4.5 2.5 9.5 2.5 14S38 33.5 36 38H12c-2-4.5-2.5-9.5-2.5-14S10 14.5 12 10z" fill="#F25C54"/>
<path d="M24 10h12c2 4.5 2.5 9.5 2.5 14S38 33.5 36 38H24z" fill="#D64541"/>
<rect x="10" y="6" width="28" height="6" rx="1.5" fill="#FECA57"/>
<path d="M24 6h12.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5H24z" fill="#F0B429"/>
<rect x="10" y="36" width="28" height="6" rx="1.5" fill="#FECA57"/>
<path d="M24 36h12.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5H24z" fill="#F0B429"/>
<circle cx="24" cy="24" r="7.5" fill="#FFFFFF"/>
<path d="M24 16.5a7.5 7.5 0 0 1 0 15z" fill="#E6EAF0"/>
<ellipse cx="24" cy="24" rx="4.5" ry="3.2" transform="rotate(-25 24 24)" fill="#FF9F43"/>`,
  },
};
