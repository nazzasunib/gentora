import { IMG } from "./images";
import type { Category, CategoryId, Product } from "@/lib/types";

/* All prices are demo prices in BDT (৳) and can be edited freely. */

const SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"];
const PANT_SIZES = ["30", "32", "34", "36", "38"];
const BELT_SIZES = ["32", "34", "36", "38", "40"];

export const categories: Category[] = [
  {
    id: "shirts",
    name: "Formal Shirts",
    short: "Shirts",
    description: "Crisp cotton poplin and Oxford weaves, cut for a clean silhouette.",
    image: IMG.shirtStack,
    group: "apparel",
  },
  {
    id: "pants",
    name: "Formal Pants",
    short: "Pants",
    description: "Tailored trousers with a sharp drape from boardroom to evening.",
    image: IMG.pants1,
    group: "apparel",
  },
  {
    id: "belts",
    name: "Leather Belts",
    short: "Belts",
    description: "Full-grain leather with brushed and polished hardware.",
    image: IMG.studio.beltBrown,
    group: "accessories",
  },
  {
    id: "watches",
    name: "Wrist Watches",
    short: "Watches",
    description: "Considered timepieces with sapphire glass and steel cases.",
    image: IMG.watch2,
    group: "accessories",
  },
  {
    id: "bags",
    name: "Office Bags",
    short: "Bags",
    description: "Structured briefcases and laptop bags built to carry the day.",
    image: IMG.bag1,
    group: "accessories",
  },
];

export const products: Product[] = [
  // ---------------- SHIRTS ----------------
  {
    id: "p01",
    slug: "signature-white-formal-shirt",
    name: "Signature White Formal Shirt",
    category: "shirts",
    price: 1850,
    badge: "New Arrival",
    isNew: true,
    isBestSeller: true,
    images: [IMG.shirtWhite, IMG.shirtWhiteAlt, IMG.shirtStack],
    colors: [
      { name: "White", hex: "#F7F7F5" },
      { name: "Light Blue", hex: "#B9CCE0" },
    ],
    sizes: SHIRT_SIZES,
    short: "Two-ply cotton poplin with a semi-spread collar.",
    description:
      "The foundation of every professional wardrobe. Woven from two-ply long-staple cotton poplin with a soft sheen, finished with a semi-spread collar, mother-of-pearl effect buttons and a tailored slim fit that stays sharp from the first meeting to the last.",
    specs: [
      { label: "Fabric", value: "100% two-ply cotton poplin" },
      { label: "Fit", value: "Tailored slim fit" },
      { label: "Collar", value: "Semi-spread, removable stays" },
      { label: "Cuff", value: "Single button, angled" },
      { label: "Care", value: "Machine wash 30°C, iron medium" },
    ],
    rating: 4.8,
  },
  {
    id: "p02",
    slug: "executive-navy-shirt",
    name: "Executive Navy Shirt",
    category: "shirts",
    price: 2100,
    badge: "New Arrival",
    isNew: true,
    images: [IMG.shirtNavy, IMG.shirtStack, IMG.shirtBlue],
    colors: [
      { name: "Navy", hex: "#1E2A44" },
      { name: "Charcoal", hex: "#3A3A3C" },
    ],
    sizes: SHIRT_SIZES,
    short: "Deep navy twill with a refined, low-sheen finish.",
    description:
      "A confident alternative to white. Fine cotton twill in a deep navy tone that pairs as easily with charcoal trousers as it does with a grey suit. Cut with a slightly longer tail to stay tucked through the working day.",
    specs: [
      { label: "Fabric", value: "Cotton twill, 120s" },
      { label: "Fit", value: "Tailored slim fit" },
      { label: "Collar", value: "Cutaway" },
      { label: "Cuff", value: "Convertible (button / cufflink)" },
      { label: "Care", value: "Machine wash 30°C" },
    ],
    rating: 4.7,
  },
  {
    id: "p03",
    slug: "midnight-black-dress-shirt",
    name: "Midnight Black Dress Shirt",
    category: "shirts",
    price: 2250,
    compareAt: 2600,
    badge: "Sale",
    isBestSeller: true,
    images: [IMG.shirtBlack, IMG.shirtStack, IMG.shirtNavy],
    colors: [{ name: "Black", hex: "#111111" }],
    sizes: SHIRT_SIZES,
    short: "Satin-finish cotton for evening and occasion wear.",
    description:
      "From late meetings to formal dinners. A satin-finish cotton that holds its deep black tone wash after wash, with a concealed placket for a cleaner line.",
    specs: [
      { label: "Fabric", value: "Cotton satin" },
      { label: "Fit", value: "Slim fit" },
      { label: "Placket", value: "Concealed" },
      { label: "Care", value: "Wash inside out, 30°C" },
    ],
    rating: 4.6,
  },
  {
    id: "p04",
    slug: "oxford-light-blue-shirt",
    name: "Oxford Light Blue Shirt",
    category: "shirts",
    price: 1950,
    isBestSeller: true,
    badge: "Best Seller",
    images: [IMG.shirtBlue, IMG.shirtWhiteAlt, IMG.shirtStack],
    colors: [
      { name: "Light Blue", hex: "#B9CCE0" },
      { name: "White", hex: "#F7F7F5" },
    ],
    sizes: SHIRT_SIZES,
    short: "Royal Oxford weave — softer texture, smart finish.",
    description:
      "Royal Oxford cloth gives this shirt a subtle texture and breathable hand-feel. A versatile light blue that works with every shade of suiting.",
    specs: [
      { label: "Fabric", value: "Royal Oxford cotton" },
      { label: "Fit", value: "Regular tailored" },
      { label: "Collar", value: "Classic point" },
      { label: "Care", value: "Machine wash 30°C" },
    ],
    rating: 4.9,
  },

  // ---------------- PANTS ----------------
  {
    id: "p05",
    slug: "classic-slim-fit-trouser",
    name: "Classic Slim Fit Trouser",
    category: "pants",
    price: 2450,
    badge: "New Arrival",
    isNew: true,
    isBestSeller: true,
    images: [IMG.pants1, IMG.pants2, IMG.pants3],
    colors: [
      { name: "Charcoal", hex: "#36383B" },
      { name: "Navy", hex: "#1E2A44" },
      { name: "Black", hex: "#141414" },
    ],
    sizes: PANT_SIZES,
    short: "Flat-front, tapered leg, with a clean pressed crease.",
    description:
      "Our signature office trouser. A wool-touch stretch blend with a flat front, slanted pockets and a tapered leg that finishes cleanly above the shoe.",
    specs: [
      { label: "Fabric", value: "Poly-viscose with 2% stretch" },
      { label: "Fit", value: "Slim, tapered" },
      { label: "Rise", value: "Mid rise" },
      { label: "Waist", value: "Adjustable side tabs" },
      { label: "Care", value: "Dry clean or gentle wash" },
    ],
    rating: 4.8,
  },
  {
    id: "p06",
    slug: "charcoal-wool-blend-trouser",
    name: "Charcoal Wool-Blend Trouser",
    category: "pants",
    price: 2950,
    isBestSeller: true,
    badge: "Best Seller",
    images: [IMG.pants3, IMG.pants1, IMG.pants4],
    colors: [
      { name: "Charcoal", hex: "#36383B" },
      { name: "Grey", hex: "#6E6F72" },
    ],
    sizes: PANT_SIZES,
    short: "Fine wool blend with a natural drape.",
    description:
      "A refined wool blend that drapes naturally and resists creasing. Half-lined to the knee for comfort, with a hook-and-bar closure.",
    specs: [
      { label: "Fabric", value: "60% wool, 40% polyester" },
      { label: "Fit", value: "Tailored" },
      { label: "Lining", value: "Half-lined to knee" },
      { label: "Care", value: "Dry clean only" },
    ],
    rating: 4.7,
  },
  {
    id: "p07",
    slug: "navy-pleated-trouser",
    name: "Navy Single-Pleat Trouser",
    category: "pants",
    price: 2750,
    compareAt: 3100,
    badge: "Sale",
    isNew: true,
    images: [IMG.pants2, IMG.pants4, IMG.pants1],
    colors: [{ name: "Navy", hex: "#1E2A44" }],
    sizes: PANT_SIZES,
    short: "A modern single pleat for a relaxed, elegant line.",
    description:
      "A single forward pleat adds room through the thigh while keeping a sharp, contemporary line. Pairs perfectly with the Executive Navy or Signature White shirts.",
    specs: [
      { label: "Fabric", value: "Wool-touch twill" },
      { label: "Fit", value: "Relaxed tapered" },
      { label: "Pleat", value: "Single forward pleat" },
      { label: "Care", value: "Dry clean recommended" },
    ],
    rating: 4.6,
  },
  {
    id: "p08",
    slug: "stone-chino-trouser",
    name: "Stone Smart Chino",
    category: "pants",
    price: 2200,
    images: [IMG.pants4, IMG.pants2, IMG.pants3],
    colors: [
      { name: "Stone", hex: "#BFB29A" },
      { name: "Olive", hex: "#5B5B45" },
    ],
    sizes: PANT_SIZES,
    short: "Smart-casual cotton chino for business-casual days.",
    description:
      "For relaxed Fridays and client lunches. Brushed cotton twill with a touch of stretch, finished with a clean front and jetted back pockets.",
    specs: [
      { label: "Fabric", value: "98% cotton, 2% elastane" },
      { label: "Fit", value: "Slim" },
      { label: "Care", value: "Machine wash 30°C" },
    ],
    rating: 4.5,
  },

  // ---------------- BELTS ----------------
  {
    id: "p09",
    slug: "premium-leather-belt",
    name: "Premium Leather Belt",
    category: "belts",
    price: 1250,
    badge: "New Arrival",
    isNew: true,
    isBestSeller: true,
    images: [IMG.studio.beltBrown, IMG.studio.beltBlack, IMG.studio.beltTan],
    colors: [
      { name: "Cognac", hex: "#7A4A2A" },
      { name: "Black", hex: "#141414" },
      { name: "Tan", hex: "#A87445" },
    ],
    sizes: BELT_SIZES,
    short: "Full-grain leather with a brushed gold-tone buckle.",
    description:
      "Cut from a single strip of vegetable-tanned full-grain leather, hand-edged and burnished. The brushed champagne-tone buckle is a quiet signature of GENTORA.",
    specs: [
      { label: "Material", value: "Full-grain cowhide leather" },
      { label: "Width", value: "35 mm" },
      { label: "Buckle", value: "Brushed brass, champagne finish" },
      { label: "Edges", value: "Hand-burnished" },
    ],
    rating: 4.8,
  },
  {
    id: "p10",
    slug: "reversible-executive-belt",
    name: "Reversible Executive Belt",
    category: "belts",
    price: 1650,
    isBestSeller: true,
    badge: "Best Seller",
    images: [IMG.studio.beltBlack, IMG.studio.beltBrown],
    colors: [{ name: "Black / Brown", hex: "#2A1C14" }],
    sizes: BELT_SIZES,
    short: "Black on one side, brown on the other. One buckle.",
    description:
      "Two belts in one. A rotating polished buckle lets you switch between black and brown in seconds — ideal for travel and busy weeks.",
    specs: [
      { label: "Material", value: "Smooth calf leather" },
      { label: "Width", value: "32 mm" },
      { label: "Buckle", value: "Rotating, polished steel" },
    ],
    rating: 4.7,
  },
  {
    id: "p11",
    slug: "heritage-tan-belt",
    name: "Heritage Tan Belt",
    category: "belts",
    price: 1450,
    images: [IMG.studio.beltTan, IMG.studio.beltBrown],
    colors: [{ name: "Tan", hex: "#A87445" }],
    sizes: BELT_SIZES,
    short: "Warm tan leather that ages beautifully.",
    description:
      "A warm tan leather that develops a rich patina over time. Made for chinos, lighter suiting and weekend wear.",
    specs: [
      { label: "Material", value: "Vegetable-tanned leather" },
      { label: "Width", value: "35 mm" },
      { label: "Buckle", value: "Brushed brass" },
    ],
    rating: 4.6,
  },

  // ---------------- WATCHES ----------------
  {
    id: "p12",
    slug: "heritage-steel-watch",
    name: "Heritage Steel Watch",
    category: "watches",
    price: 4500,
    badge: "New Arrival",
    isNew: true,
    isBestSeller: true,
    images: [IMG.studio.watchSteel, IMG.watch1, IMG.watch3],
    colors: [
      { name: "Steel / Black Dial", hex: "#9EA3A8" },
      { name: "Gold / Ivory Dial", hex: "#C6A46A" },
    ],
    short: "40 mm steel case, sapphire-coated glass, leather strap.",
    description:
      "Clean proportions and a quiet, confident dial. The 40 mm brushed-steel case sits comfortably under a shirt cuff, while the leather strap softens the look for everyday office wear.",
    specs: [
      { label: "Case", value: "40 mm brushed stainless steel" },
      { label: "Movement", value: "Japanese quartz" },
      { label: "Glass", value: "Sapphire-coated mineral" },
      { label: "Water resistance", value: "5 ATM" },
      { label: "Strap", value: "Genuine leather, 20 mm" },
    ],
    rating: 4.9,
  },
  {
    id: "p13",
    slug: "noir-chronograph",
    name: "Noir Chronograph",
    category: "watches",
    price: 6800,
    compareAt: 7500,
    badge: "Sale",
    isNew: true,
    images: [IMG.studio.watchNoir, IMG.watch2, IMG.studio.watchSteel],
    colors: [{ name: "Black", hex: "#1B1B1B" }],
    short: "Black-on-black chronograph with gold accents.",
    description:
      "A statement piece with restraint. Matte black case, sunray black dial and champagne-gold indices — a chronograph that reads as precise rather than loud.",
    specs: [
      { label: "Case", value: "42 mm, black IP steel" },
      { label: "Movement", value: "Quartz chronograph" },
      { label: "Glass", value: "Sapphire-coated mineral" },
      { label: "Water resistance", value: "10 ATM" },
    ],
    rating: 4.8,
  },
  {
    id: "p14",
    slug: "classic-gold-dress-watch",
    name: "Classic Gold Dress Watch",
    category: "watches",
    price: 5200,
    images: [IMG.studio.watchGold, IMG.watch3, IMG.watch1],
    colors: [{ name: "Gold / Ivory", hex: "#C6A46A" }],
    short: "Slim gold-tone dress watch with an ivory dial.",
    description:
      "An heirloom-inspired dress watch. Slim 38 mm gold-tone case, ivory dial and dark brown leather strap for formal occasions.",
    specs: [
      { label: "Case", value: "38 mm gold-tone steel" },
      { label: "Movement", value: "Japanese quartz" },
      { label: "Thickness", value: "7.8 mm" },
      { label: "Water resistance", value: "3 ATM" },
    ],
    rating: 4.7,
  },

  // ---------------- BAGS ----------------
  {
    id: "p15",
    slug: "executive-leather-office-bag",
    name: "Executive Leather Office Bag",
    category: "bags",
    price: 5900,
    badge: "New Arrival",
    isNew: true,
    isBestSeller: true,
    images: [IMG.studio.bagBrown, IMG.bag1, IMG.studio.bagBlack],
    colors: [
      { name: "Cognac", hex: "#7A4A2A" },
      { name: "Black", hex: "#141414" },
    ],
    short: "Fits a 15\" laptop. Full-grain leather, brass hardware.",
    description:
      "Structured yet light. A padded 15-inch laptop compartment, organiser pockets and a detachable shoulder strap make this the bag for every working day.",
    specs: [
      { label: "Material", value: "Full-grain leather" },
      { label: "Dimensions", value: "40 × 29 × 9 cm" },
      { label: "Laptop", value: "Up to 15.6\"" },
      { label: "Hardware", value: "Solid brass, champagne finish" },
    ],
    rating: 4.9,
  },
  {
    id: "p16",
    slug: "heritage-briefcase",
    name: "Heritage Briefcase",
    category: "bags",
    price: 7200,
    images: [IMG.studio.bagBlack, IMG.bag2, IMG.studio.bagBrown],
    colors: [{ name: "Black", hex: "#141414" }],
    short: "Classic double-gusset briefcase in black leather.",
    description:
      "A classic briefcase with double gussets, a lockable flap closure and a suede-lined interior. Built for documents, tablets and a laptop.",
    specs: [
      { label: "Material", value: "Smooth calf leather" },
      { label: "Dimensions", value: "41 × 30 × 11 cm" },
      { label: "Interior", value: "Suede-lined, 3 compartments" },
    ],
    rating: 4.8,
  },
  {
    id: "p17",
    slug: "slim-laptop-messenger",
    name: "Slim Laptop Messenger",
    category: "bags",
    price: 3800,
    compareAt: 4300,
    badge: "Sale",
    isNew: true,
    images: [IMG.studio.bagTan, IMG.bag2, IMG.studio.bagBrown],
    colors: [{ name: "Tan", hex: "#A87445" }],
    short: "Minimal, lightweight messenger for 14\" laptops.",
    description:
      "For the lighter commute. A slim tan leather messenger with a magnetic flap, padded laptop sleeve and adjustable strap.",
    specs: [
      { label: "Material", value: "Top-grain leather" },
      { label: "Dimensions", value: "37 × 27 × 6 cm" },
      { label: "Laptop", value: "Up to 14\"" },
    ],
    rating: 4.6,
  },
];

export const CATEGORY_IDS: CategoryId[] = ["shirts", "pants", "belts", "watches", "bags"];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const newArrivals = products.filter((p) => p.isNew);
export const bestSellers = products.filter((p) => p.isBestSeller);

/** Section G — The Complete Office Look */
export const officeLook = {
  title: "The Complete Office Look",
  image: IMG.lookbook,
  items: [
    { productId: "p01", size: "M", color: "White" },
    { productId: "p05", size: "32", color: "Charcoal" },
    { productId: "p09", size: "34", color: "Cognac" },
    { productId: "p12", color: "Steel / Black Dial" },
    { productId: "p15", color: "Cognac" },
  ],
};

/** Section F — 3D showcase line-up */
export const showcase = [
  {
    model: "watch" as const,
    productId: "p12",
    eyebrow: "Timepieces",
    detail: "40 mm brushed steel · sapphire-coated glass · Japanese quartz",
    fallback: IMG.studio.watchSteel,
  },
  {
    model: "bag" as const,
    productId: "p15",
    eyebrow: "Office Bags",
    detail: "Full-grain leather · 15.6\" laptop sleeve · solid brass hardware",
    fallback: IMG.studio.bagBrown,
  },
  {
    model: "belt" as const,
    productId: "p09",
    eyebrow: "Leather Goods",
    detail: "Vegetable-tanned leather · hand-burnished edges · 35 mm",
    fallback: IMG.studio.beltBrown,
  },
];

/** Section K — clearly fictional demo reviews */
export const demoReviews = [
  {
    name: "Arif R. (demo)",
    role: "Product Manager",
    rating: 5,
    product: "Signature White Formal Shirt",
    text: "The collar holds its shape all day and the fit is sharp without feeling tight. It has become my default for client meetings.",
  },
  {
    name: "Tanvir H. (demo)",
    role: "Entrepreneur",
    rating: 5,
    product: "Executive Leather Office Bag",
    text: "Fits my laptop, charger and documents with room to spare. The leather looks even better after a few weeks of daily use.",
  },
  {
    name: "Nafis K. (demo)",
    role: "Bank Officer",
    rating: 4,
    product: "Heritage Steel Watch",
    text: "Clean, understated and sits well under a cuff. Exactly the kind of watch I wanted for the office.",
  },
  {
    name: "Samiul A. (demo)",
    role: "Consultant",
    rating: 5,
    product: "Classic Slim Fit Trouser",
    text: "The taper is perfect and the fabric barely creases on long commutes. I ordered a second colour within a week.",
  },
];
