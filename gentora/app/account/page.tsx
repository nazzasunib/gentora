import type { Metadata } from "next";
import AccountClient from "./AccountClient";
export const metadata: Metadata = { title: "Account (Demo)", robots: { index: false } };
export default function AccountPage() { return <AccountClient />; }
