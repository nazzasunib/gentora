import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";
export const metadata: Metadata = { title: "Checkout (Demo)", description: "Demo checkout for the Vesture’s storefront.", robots: { index: false } };
export default function CheckoutPage() { return <CheckoutClient />; }
