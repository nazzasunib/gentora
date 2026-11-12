/**
 * Central image registry.
 * Remote photography is sourced from Unsplash (free to use under the Unsplash License:
 * https://unsplash.com/license). Swap any URL here and it updates everywhere.
 * Local /images/studio/* files are studio renders generated from GENTORA's own
 * procedural 3D models (see components/3d) — no third-party licence required.
 */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMG = {
  hero: u("photo-1617137968427-85924c800a22", 2400),
  heroAlt: u("photo-1507679799987-c73779587ccf", 2000),
  intro: u("photo-1593030761757-71fae45fa0e7", 1600),
  introDetail: u("photo-1516826957135-700dedea698c", 1000),
  lookbook: u("photo-1519085360753-af0119f7cbe7", 1600),
  meeting: u("photo-1556761175-5973dc0f32e7", 2000),
  offers: u("photo-1490578474895-699cd4e2cf59", 2000),
  about: u("photo-1488161628813-04466f872be2", 1600),

  shirtWhite: u("photo-1602810318383-e386cc2a3ccf"),
  shirtWhiteAlt: u("photo-1596755094514-f87e34085b2c"),
  shirtNavy: u("photo-1603252109303-2751441dd157"),
  shirtBlack: u("photo-1598033129183-c4f50c736f10"),
  shirtBlue: u("photo-1621072156002-e2fccdc0b176"),
  shirtStack: u("photo-1620012253295-c15cc3e65df4"),

  pants1: u("photo-1473966968600-fa801b869a1a"),
  pants2: u("photo-1624378439575-d8705ad7ae80"),
  pants3: u("photo-1594633312681-425c7b97ccd1"),
  pants4: u("photo-1506629082955-511b1aa562c8"),

  watch1: u("photo-1523170335258-f5ed11844a49"),
  watch2: u("photo-1524592094714-0f0654e20314"),
  watch3: u("photo-1522312346375-d1a52e2b99b3"),

  bag1: u("photo-1548036328-c9fa89d128fa"),
  bag2: u("photo-1590874103328-eac38a683ce7"),

  // Local studio renders (always available)
  studio: {
    watchSteel: "/images/studio/watch-steel.jpg",
    watchNoir: "/images/studio/watch-noir.jpg",
    watchGold: "/images/studio/watch-gold.jpg",
    bagBrown: "/images/studio/bag-brown.jpg",
    bagBlack: "/images/studio/bag-black.jpg",
    bagTan: "/images/studio/bag-tan.jpg",
    beltBlack: "/images/studio/belt-black.jpg",
    beltBrown: "/images/studio/belt-brown.jpg",
    beltTan: "/images/studio/belt-tan.jpg",
  },
} as const;
