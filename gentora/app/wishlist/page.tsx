import type { Metadata } from "next";
import WishlistClient from "./WishlistClient";
export const metadata: Metadata = { title: "Wishlist", description: "Your saved Vesture’s pieces.", robots: { index: false } };
export default function WishlistPage() { return <WishlistClient />; }
