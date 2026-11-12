import { SITE } from "@/lib/utils";

export const HELP_PAGES: Record<string, { title: string; intro: string; sections: { h: string; p: string[]; id?: string }[] }> = {
  contact: {
    title: "Contact Us",
    intro: "Our style advisors are happy to help with sizing, orders and styling advice.",
    sections: [
      { h: "Customer care", p: [`Email: ${SITE.contact.email}`, `Phone: ${SITE.contact.phone}`, `Hours: ${SITE.contact.hours}`] },
      { h: "Visit", p: [SITE.contact.address, "These are editable demo details — replace them in lib/utils.ts before launch."] },
    ],
  },
  shipping: {
    title: "Shipping Information",
    intro: "Delivery across Bangladesh, carefully packed.",
    sections: [
      { h: "Delivery times", p: ["Inside Dhaka: 1–3 working days.", "Outside Dhaka: 3–5 working days."] },
      { h: "Delivery charges", p: [`Complimentary delivery on orders over ৳${SITE.freeShippingThreshold.toLocaleString()}.`, `Otherwise a flat ৳${SITE.shippingFee} delivery fee applies.`] },
      { h: "Demo notice", p: ["These terms are sample content for this demonstration storefront."] },
    ],
  },
  returns: {
    title: "Return Policy",
    intro: "Not quite right? We'll make it easy.",
    sections: [
      { h: "7-day returns", p: ["Unworn items with original tags and packaging can be returned within 7 days of delivery.", "Watches must be returned with protective film intact."] },
      { h: "Exchanges", p: ["Size exchanges on shirts and trousers are free of charge, subject to availability."] },
      { h: "Demo notice", p: ["These terms are sample content for this demonstration storefront."] },
    ],
  },
  faq: {
    title: "FAQs",
    intro: "Answers to the questions we hear most.",
    sections: [
      { h: "How do I find my size?", id: "sizing", p: ["Shirts: S (38), M (39–40), L (41–42), XL (43–44), XXL (45–46) collar in cm.", "Trousers and belts: choose your waist size in inches. For belts, go one size up from your trouser waist."] },
      { h: "Is my cart saved?", p: ["Yes — your cart and wishlist are saved in this browser automatically."] },
      { h: "Can I pay online?", p: ["This is a demo storefront. Checkout is simulated and no payment is processed."] },
      { h: "How should I care for leather?", p: ["Keep leather away from direct heat, wipe with a soft dry cloth and condition every few months."] },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "Sample policy for the GENTORA demo storefront.",
    sections: [
      { h: "What we store", p: ["This demo stores your cart and wishlist only in your own browser's local storage. No personal data is sent to a server."] },
      { h: "Forms", p: ["Newsletter, account and checkout forms are frontend demonstrations — submitted details are not transmitted or saved."] },
      { h: "Before launch", p: ["Replace this page with a privacy policy reviewed for your business and applicable law."] },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: "Sample terms for the GENTORA demo storefront.",
    sections: [
      { h: "Demonstration only", p: ["Products, prices and reviews on this site are illustrative. No orders are fulfilled and no payments are taken."] },
      { h: "Imagery", p: ["Lifestyle photography is sourced from Unsplash under the Unsplash License. Accessory studio renders are generated from GENTORA's own 3D models."] },
      { h: "Before launch", p: ["Replace this page with terms reviewed for your business."] },
    ],
  },
};
