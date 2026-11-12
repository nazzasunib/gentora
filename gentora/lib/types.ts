export type CategoryId = "shirts" | "pants" | "belts" | "watches" | "bags";

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  price: number;
  compareAt?: number;
  badge?: "New Arrival" | "Sale" | "Best Seller";
  isNew?: boolean;
  isBestSeller?: boolean;
  images: string[];
  colors: ColorOption[];
  sizes?: string[];
  short: string;
  description: string;
  specs: { label: string; value: string }[];
  rating: number;
}

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  description: string;
  image: string;
  group: "apparel" | "accessories";
}

export interface CartItem {
  key: string; // productId|size|color
  productId: string;
  size?: string;
  color?: string;
  qty: number;
}
