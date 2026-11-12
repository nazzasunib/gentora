import { clsx, type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const formatBDT = (n: number) => `৳${n.toLocaleString("en-US")}`;

export const discountPct = (price: number, compareAt?: number) =>
  compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

export const SITE = {
  name: "GENTORA",
  tagline: "Dress Sharp. Lead with Confidence.",
  description:
    "GENTORA — premium men's formal shirts, trousers, leather belts, wristwatches and office bags for the modern professional.",
  url: "https://gentora.example.com",
  // Editable demo contact details — replace before going live.
  contact: {
    email: "hello@gentora.example",
    phone: "+880 1XXX-XXXXXX",
    address: "Your Store Address, Dhaka (demo)",
    hours: "Sat–Thu · 10:00–20:00",
  },
  freeShippingThreshold: 5000,
  shippingFee: 120,
};
