import type { IconSet } from './types';

export const shopping: IconSet = {
  cart: {
    label: 'Groceries',
    tags: ['cart', 'supermarket', 'grocery', 'belanja', 'sembako'],
    svg: `<rect x="16" y="8" width="9" height="11" rx="1.5" fill="#FF9F43"/>
<path d="M20.5 8H23.5A1.5 1.5 0 0 1 25 9.5V19H20.5z" fill="#E8862A"/>
<circle cx="31" cy="13" r="5" fill="#2ECC71"/>
<path d="M31 8a5 5 0 0 1 0 10z" fill="#22A85A"/>
<path d="M5 9h4.5l4.5 24h22" fill="none" stroke="#3D4451" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.5 16H42l-3.2 13a3 3 0 0 1-2.9 2.3H15.3z" fill="#4A90E2"/>
<path d="M28 16H42l-3.2 13a3 3 0 0 1-2.9 2.3H28z" fill="#2F72C4"/>
<circle cx="17" cy="38" r="3.5" fill="#3D4451"/><circle cx="33" cy="38" r="3.5" fill="#3D4451"/>
<circle cx="17" cy="38" r="1.3" fill="#A4B0BE"/><circle cx="33" cy="38" r="1.3" fill="#A4B0BE"/>`,
  },
  bag: {
    label: 'Shopping bag',
    tags: ['shop', 'store', 'mall', 'belanja'],
    svg: `<path d="M17 17v-3a7 7 0 0 1 14 0v3" fill="none" stroke="#8A4FE6" stroke-width="3.5" stroke-linecap="round"/>
<path d="M10 17h28l-2 22a4 4 0 0 1-4 3.6H16a4 4 0 0 1-4-3.6z" fill="#FF7EB6"/>
<path d="M27 17h11l-2 22a4 4 0 0 1-4 3.6h-5z" fill="#E85C99"/>
<circle cx="18" cy="23" r="2" fill="#8A4FE6"/><circle cx="30" cy="23" r="2" fill="#8A4FE6"/>`,
  },
  shirt: {
    label: 'Clothes',
    tags: ['shirt', 't-shirt', 'clothing', 'fashion', 'baju', 'kaos'],
    svg: `<path d="M17 8C19 12 29 12 31 8L40 12L44 21L37 24L36 22V40a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V22L11 24L4 21L8 12z" fill="#4A90E2"/>
<path d="M24 11C28 11 30 9.5 31 8L40 12L44 21L37 24L36 22V40a2 2 0 0 1-2 2H24z" fill="#2F72C4"/>
<path d="M17 8C19 12 29 12 31 8" fill="none" stroke="#FECA57" stroke-width="2.5" stroke-linecap="round"/>`,
  },
  dress: {
    label: 'Dress',
    tags: ['clothing', 'fashion', 'skirt', 'gaun', 'baju'],
    svg: `<path d="M19 6v6M29 6v6" fill="none" stroke="#D64541" stroke-width="2.5" stroke-linecap="round"/>
<path d="M16 12H32L30 22H18z" fill="#F25C54"/>
<path d="M24 12H32L30 22H24z" fill="#D64541"/>
<path d="M18 22H30L39 38a3 3 0 0 1-2.6 4.4H11.6A3 3 0 0 1 9 38z" fill="#F25C54"/>
<path d="M24 22H30L39 38a3 3 0 0 1-2.6 4.4H24z" fill="#D64541"/>
<rect x="17" y="20" width="14" height="4" rx="1.5" fill="#FECA57"/>
<path d="M24 20h5.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5H24z" fill="#F0B429"/>`,
  },
  shoe: {
    label: 'Shoes',
    tags: ['sneaker', 'footwear', 'sepatu'],
    svg: `<path d="M6 31L7 14Q7 11 10 11H15Q17 11 18 13L21 18L32 21.5C38 23 42 25.5 43 31z" fill="#FF9F43"/>
<path d="M26 19.6L32 21.5C38 23 42 25.5 43 31H26z" fill="#E8862A"/>
<path d="M18.5 19.5l3-2.5M22.5 22l3-2.5" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
<path d="M10 25.5C16 27 23 25.5 29 22.5" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
<path d="M4 30h40v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="#FFFFFF"/>
<path d="M24 30h20v3a4 4 0 0 1-4 4H24z" fill="#E6EAF0"/>
<path d="M4 33h40" fill="none" stroke="#A4B0BE" stroke-width="2.5" stroke-linecap="round"/>`,
  },
  glasses: {
    label: 'Glasses',
    tags: ['eyeglasses', 'spectacles', 'optical', 'kacamata'],
    svg: `<path d="M20 21Q24 18 28 21M6 21L4 18M42 21L44 18" fill="none" stroke="#8A4FE6" stroke-width="3" stroke-linecap="round"/>
<circle cx="14" cy="25" r="9" fill="#A66CFF"/><path d="M14 16a9 9 0 0 1 0 18z" fill="#8A4FE6"/>
<circle cx="34" cy="25" r="9" fill="#A66CFF"/><path d="M34 16a9 9 0 0 1 0 18z" fill="#8A4FE6"/>
<circle cx="14" cy="25" r="6" fill="#48DBFB"/><path d="M14 19a6 6 0 0 1 0 12z" fill="#22B8DB"/>
<circle cx="34" cy="25" r="6" fill="#48DBFB"/><path d="M34 19a6 6 0 0 1 0 12z" fill="#22B8DB"/>
<circle cx="11.5" cy="22.5" r="1.6" fill="#FFFFFF" fill-opacity="0.5"/><circle cx="31.5" cy="22.5" r="1.6" fill="#FFFFFF" fill-opacity="0.5"/>`,
  },
  watch: {
    label: 'Watch',
    tags: ['wristwatch', 'clock', 'accessory', 'jam tangan'],
    svg: `<rect x="17" y="4" width="14" height="40" rx="4" fill="#5F6CD9"/>
<path d="M24 4h3a4 4 0 0 1 4 4v32a4 4 0 0 1-4 4h-3z" fill="#4651B8"/>
<rect x="33.5" y="21.5" width="4" height="5" rx="1.5" fill="#F0B429"/>
<circle cx="24" cy="24" r="11" fill="#FECA57"/><path d="M24 13a11 11 0 0 1 0 22z" fill="#F0B429"/>
<circle cx="24" cy="24" r="8" fill="#FFFFFF"/><path d="M24 16a8 8 0 0 1 0 16z" fill="#E6EAF0"/>
<path d="M24 24v-5M24 24l3.5 2" fill="none" stroke="#3D4451" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  ring: {
    label: 'Jewelry',
    tags: ['ring', 'diamond', 'wedding', 'cincin', 'perhiasan'],
    svg: `<path d="M24 17.5a13 13 0 1 1 0 26a13 13 0 1 1 0-26zM24 22a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17z" fill="#FECA57" fill-rule="evenodd"/>
<path d="M24 17.5a13 13 0 0 1 0 26V39a8.5 8.5 0 0 0 0-17z" fill="#F0B429"/>
<polygon points="14,11 19,4.5 29,4.5 34,11 24,21" fill="#48DBFB"/>
<polygon points="24,4.5 29,4.5 34,11 24,21" fill="#22B8DB"/>
<polygon points="17.5,10 20.5,6 24,6 21.5,10" fill="#FFFFFF" fill-opacity="0.5"/>`,
  },
  lipstick: {
    label: 'Makeup',
    tags: ['lipstick', 'cosmetics', 'beauty', 'kosmetik', 'lipstik'],
    svg: `<path d="M17.5 21V12Q17.5 10.5 19 9.8L30.5 5V21z" fill="#F25C54"/>
<path d="M24 21V7.3L30.5 5V21z" fill="#D64541"/>
<rect x="19.5" y="12.5" width="2.5" height="7" rx="1.25" fill="#FFFFFF" fill-opacity="0.45"/>
<rect x="15" y="20" width="18" height="8" rx="1.5" fill="#FECA57"/>
<path d="M24 20h7.5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H24z" fill="#F0B429"/>
<rect x="13" y="27" width="22" height="16" rx="3" fill="#A66CFF"/>
<path d="M24 27h8a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-8z" fill="#8A4FE6"/>`,
  },
  perfume: {
    label: 'Perfume',
    tags: ['fragrance', 'cologne', 'beauty', 'parfum', 'wangi'],
    svg: `<rect x="20" y="13" width="8" height="8" fill="#A4B0BE"/>
<path d="M24 13h4v8h-4z" fill="#7F8C9A"/>
<rect x="17" y="5" width="14" height="9" rx="2" fill="#FECA57"/>
<path d="M24 5h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5z" fill="#F0B429"/>
<rect x="10" y="19" width="28" height="23" rx="6" fill="#FF7EB6"/>
<path d="M24 19h8a6 6 0 0 1 6 6v11a6 6 0 0 1-6 6h-8z" fill="#E85C99"/>
<rect x="16" y="26" width="16" height="9" rx="2" fill="#FFFFFF"/>
<path d="M24 26h6a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-6z" fill="#E6EAF0"/>
<rect x="13" y="22" width="3" height="6" rx="1.5" fill="#FFFFFF" fill-opacity="0.45"/>`,
  },
  gift: {
    label: 'Gifts',
    tags: ['present', 'gift', 'birthday', 'hadiah', 'kado'],
    svg: `<path d="M24 16C16 3 7 7 12.5 16z" fill="#FECA57"/>
<path d="M24 16C32 3 41 7 35.5 16z" fill="#F0B429"/>
<rect x="9" y="22" width="30" height="20" rx="2" fill="#F25C54"/>
<path d="M24 22h15v18a2 2 0 0 1-2 2H24z" fill="#D64541"/>
<rect x="7" y="15" width="34" height="8" rx="2" fill="#F25C54"/>
<path d="M24 15h15a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H24z" fill="#D64541"/>
<rect x="21" y="15" width="6" height="27" fill="#FECA57"/>
<path d="M24 15h3v27h-3z" fill="#F0B429"/>`,
  },
  phone: {
    label: 'Phone',
    tags: ['smartphone', 'mobile', 'gadget', 'hp', 'ponsel'],
    svg: `<rect x="13" y="4" width="22" height="40" rx="5" fill="#5F6CD9"/>
<path d="M24 4h6a5 5 0 0 1 5 5v30a5 5 0 0 1-5 5h-6z" fill="#4651B8"/>
<rect x="16.5" y="9" width="15" height="27" rx="2" fill="#48DBFB"/>
<path d="M24 9h5.5a2 2 0 0 1 2 2v23a2 2 0 0 1-2 2H24z" fill="#22B8DB"/>
<polygon points="16.5,19 26.5,9 30.5,9 16.5,23" fill="#FFFFFF" fill-opacity="0.4"/>
<rect x="20.5" y="38.5" width="7" height="2.5" rx="1.25" fill="#A4B0BE"/>`,
  },
  laptop: {
    label: 'Laptop',
    tags: ['computer', 'notebook', 'electronics', 'komputer'],
    svg: `<path d="M10.5 8h27A2.5 2.5 0 0 1 40 10.5V31H8V10.5A2.5 2.5 0 0 1 10.5 8z" fill="#3D4451"/>
<path d="M24 8h13.5A2.5 2.5 0 0 1 40 10.5V31H24z" fill="#2B313B"/>
<rect x="11" y="11" width="26" height="17" rx="1" fill="#48DBFB"/>
<path d="M24 11h12a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H24z" fill="#22B8DB"/>
<polygon points="11,20 20,11 24.5,11 11,24.5" fill="#FFFFFF" fill-opacity="0.4"/>
<path d="M4 30h40v4a3.5 3.5 0 0 1-3.5 3.5h-33A3.5 3.5 0 0 1 4 34z" fill="#A4B0BE"/>
<path d="M24 30h20v4a3.5 3.5 0 0 1-3.5 3.5H24z" fill="#7F8C9A"/>
<rect x="19" y="30" width="10" height="3" rx="1.5" fill="#7F8C9A"/>`,
  },
  headphones: {
    label: 'Headphones',
    tags: ['audio', 'music', 'earphones', 'headset'],
    svg: `<path d="M11 28V22a13 13 0 0 1 26 0v6" fill="none" stroke="#7F8C9A" stroke-width="3.5" stroke-linecap="round"/>
<rect x="13" y="24" width="6" height="13" rx="2.5" fill="#3D4451"/>
<rect x="29" y="24" width="6" height="13" rx="2.5" fill="#3D4451"/>
<rect x="6" y="22" width="10" height="17" rx="4" fill="#F25C54"/>
<path d="M11 22h1a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-1z" fill="#D64541"/>
<rect x="32" y="22" width="10" height="17" rx="4" fill="#F25C54"/>
<path d="M37 22h1a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-1z" fill="#D64541"/>`,
  },
  tv: {
    label: 'TV',
    tags: ['television', 'electronics', 'entertainment', 'televisi'],
    svg: `<path d="M18 6l6 7.5L30 6" fill="none" stroke="#7F8C9A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 39l-1.5 3.5M36 39l1.5 3.5" fill="none" stroke="#966143" stroke-width="3" stroke-linecap="round"/>
<rect x="5" y="13" width="38" height="27" rx="5" fill="#B9805A"/>
<path d="M24 13h14a5 5 0 0 1 5 5v17a5 5 0 0 1-5 5H24z" fill="#966143"/>
<rect x="9" y="17" width="23" height="19" rx="3" fill="#48DBFB"/>
<path d="M24 17h5a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3h-5z" fill="#22B8DB"/>
<polygon points="9,25 17,17 21.5,17 9,29.5" fill="#FFFFFF" fill-opacity="0.4"/>
<circle cx="37.5" cy="22.5" r="2.2" fill="#FECA57"/><circle cx="37.5" cy="30.5" r="2.2" fill="#FECA57"/>`,
  },
  camera: {
    label: 'Camera',
    tags: ['photo', 'photography', 'kamera', 'foto'],
    svg: `<path d="M16 15l2.5-5h11l2.5 5z" fill="#3D4451"/>
<rect x="8.5" y="10" width="6" height="4" rx="1.5" fill="#F25C54"/>
<rect x="5" y="14" width="38" height="26" rx="5" fill="#A4B0BE"/>
<path d="M24 14h14a5 5 0 0 1 5 5v16a5 5 0 0 1-5 5H24z" fill="#7F8C9A"/>
<circle cx="24" cy="27" r="9.5" fill="#3D4451"/>
<circle cx="24" cy="27" r="6" fill="#48DBFB"/><path d="M24 21a6 6 0 0 1 0 12z" fill="#22B8DB"/>
<circle cx="21.5" cy="24.5" r="1.8" fill="#FFFFFF" fill-opacity="0.5"/>
<rect x="34" y="17.5" width="5" height="3" rx="1.5" fill="#FECA57"/>`,
  },
  tag: {
    label: 'Sale',
    tags: ['price tag', 'discount', 'deal', 'diskon', 'harga'],
    svg: `<g transform="rotate(45 24 24)">
<path d="M24 2L33 11V35a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V11z" fill="#FF9F43"/>
<path d="M24 2L33 11V35a3 3 0 0 1-3 3H24z" fill="#E8862A"/>
<circle cx="24" cy="12" r="3" fill="#FFFFFF"/>
<path d="M19.5 22h9M19.5 28h6" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
</g>`,
  },
  package: {
    label: 'Online shopping',
    tags: ['package', 'delivery', 'box', 'parcel', 'paket', 'kiriman'],
    svg: `<polygon points="24,6 41,14 24,22 7,14" fill="#F3D2A2"/>
<polygon points="7,14 24,22 24,42 7,34" fill="#B9805A"/>
<polygon points="24,22 41,14 41,34 24,42" fill="#966143"/>
<polygon points="13.4,11 17.6,9 34.6,17 30.4,19" fill="#DDB57E"/>
<polygon points="30.4,19 34.6,17 34.6,25 30.4,27" fill="#DDB57E"/>
<polygon points="10,21.5 17,24.8 17,30.8 10,27.5" fill="#FFFFFF"/>`,
  },
};
