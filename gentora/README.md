# GENTORA — Premium Men's Fashion E-commerce (Demo)

*Dress Sharp. Lead with Confidence.*

A working frontend e-commerce demo built with **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Three.js / React Three Fiber / Drei · GSAP ScrollTrigger · Framer Motion · Lenis · Zustand · Lucide**.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
npm run typecheck
```

Node 18.18+ (Node 20/22 recommended).

## What's inside

| Area | Where |
|---|---|
| Home (sections A–M) | `app/page.tsx`, `components/home/*` |
| Shop – filter, search, sort | `app/shop/ShopClient.tsx` (`/shop?category=shirts`, `?group=accessories`, `?filter=new|best|sale`, `?sort=price-asc`, `?q=navy`) |
| Product details + 3D view | `app/product/[slug]/*` |
| Cart drawer / cart page | `components/cart/CartDrawer.tsx`, `app/cart` |
| Wishlist | `app/wishlist` |
| Demo checkout + confirmation | `app/checkout` |
| Account (demo), About, Help pages | `app/account`, `app/about`, `app/help/[slug]` |
| Product & content data | `data/products.ts`, `data/help.ts`, `data/images.ts` |
| Global state (persisted cart + wishlist) | `lib/store.ts` (localStorage key `gentora-shop`) |
| Procedural 3D models | `components/3d/models.tsx` |

### Editing
- **Prices / products / sizes / colours** – `data/products.ts` (all prices are demo BDT values).
- **Images** – every remote image URL lives in `data/images.ts`. Swap any URL and it updates site-wide.
- **Contact details, free-delivery threshold, delivery fee** – `SITE` in `lib/utils.ts` (contact details are placeholders).

## Imagery & 3D – licensing
- **Lifestyle, shirts, trousers, watch & bag photography**: Unsplash, loaded remotely under the [Unsplash License](https://unsplash.com/license). Review each image before launch and replace any you don't like in `data/images.ts`.
- **If a remote image fails**, `components/ui/SmartImage.tsx` falls back to a local image (where provided) and then to an on-brand GENTORA panel — no broken-image icons.
- **Watch, office bag and belt 3D models are GENTORA's own procedural Three.js models** — no third-party model files or licences needed. The studio stills in `public/images/studio/` are renders of these models.
- To re-render stills after changing a model: `npm i -D playwright && npx playwright install chromium`, run `npm run dev`, then `npm run render:stills`.

## 3D performance & fallbacks
- The WebGL canvas is lazy-loaded and only mounts when the showcase section approaches the viewport; it stops rendering when off-screen.
- Static studio images are shown instead of WebGL when: WebGL is unavailable, `prefers-reduced-motion` is on, Data Saver is on, or the device reports low memory/CPU. A React error boundary also falls back to images if the scene throws.
- No HDR files are downloaded — reflections use local Drei `Lightformer`s.

## Demo-only functionality (clearly labelled in the UI)
- Checkout does **not** process payments or place orders.
- Newsletter and account forms do **not** send or store data.
- Customer reviews are **fictional** and marked "(demo)".

## Notes
- `motion-dom` / `motion-utils` are pinned to match `framer-motion@12.23.22`.
- `/studio` is an internal, `noindex` route used for rendering stills.
