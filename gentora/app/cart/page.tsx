import type { Metadata } from "next";
import CartClient from "./CartClient";
export const metadata: Metadata = { title: "Your Cart", description: "Review the items in your GENTORA cart.", robots: { index: false } };
export default function CartPage() { return <CartClient />; }
