"use client";

/**
 * GENTORA hero figure — a premium, faceless fashion mannequin with two complete
 * procedural outfits (casual → formal). Everything is generated in Three.js:
 * no model files to download, nothing to license, nothing to 404.
 *
 * All garments are driven by one scroll value (`prog.current`, 0 → 1).
 */
import { useMemo, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { makeDissolve, seg, type Dissolve, type DissolveOptions } from "./dissolve";
import { T } from "./stages";

/* ------------------------------------------------------------------ */
/* Profiles (radius, y) in metres — figure is ~1.86 m tall            */
/* ------------------------------------------------------------------ */
type Profile = [number, number][];

const TORSO: Profile = [
  [0.0, 0.84], [0.07, 0.85], [0.118, 0.875], [0.133, 0.915], [0.136, 0.965], [0.13, 1.02], [0.121, 1.075],
  [0.12, 1.11], [0.127, 1.18], [0.142, 1.26], [0.152, 1.33], [0.152, 1.39], [0.142, 1.44], [0.112, 1.475],
  [0.072, 1.497], [0.055, 1.505], [0.0, 1.508],
];
const TORSO_SCALE: [number, number, number] = [1.3, 1, 0.74];

const LEG: Profile = [
  [0.0, 0.05], [0.033, 0.056], [0.036, 0.09], [0.041, 0.16], [0.05, 0.26], [0.054, 0.33], [0.049, 0.42], [0.043, 0.5],
  [0.046, 0.54], [0.056, 0.62], [0.068, 0.72], [0.08, 0.82], [0.088, 0.9], [0.086, 0.95], [0.0, 0.975],
];
const LEG_X = 0.088;

const ARM_U: Profile = [[0.0, -0.3], [0.041, -0.295], [0.043, -0.25], [0.047, -0.17], [0.051, -0.09], [0.052, -0.03], [0.048, 0.0], [0.0, 0.022]];
const ARM_F: Profile = [[0.0, -0.27], [0.031, -0.265], [0.033, -0.24], [0.039, -0.18], [0.046, -0.1], [0.047, -0.04], [0.043, 0.0], [0.0, 0.018]];
const SHOULDER = { x: 0.182, y: 1.405 };
const UPPER_LEN = 0.3;

/** radius of a profile at height y (linear interpolation, profile sorted by y) */
function rAt(p: Profile, y: number) {
  if (y <= p[0][1]) return p[0][0];
  for (let i = 1; i < p.length; i++) {
    if (y <= p[i][1]) {
      const [r0, y0] = p[i - 1], [r1, y1] = p[i];
      return r0 + ((y - y0) / (y1 - y0)) * (r1 - r0);
    }
  }
  return p[p.length - 1][0];
}

/** Resamples a body profile between y0..y1 and pushes it outwards by off(y). */
function inflate(p: Profile, y0: number, y1: number, off: (y: number) => number, steps = 36): Profile {
  const out: Profile = [];
  for (let i = 0; i <= steps; i++) {
    const y = y0 + ((y1 - y0) * i) / steps;
    out.push([rAt(p, y) + off(y), y]);
  }
  return out;
}

function lathe(p: Profile, segments = 56, phiStart = 0, phiLength = Math.PI * 2) {
  return new THREE.LatheGeometry(p.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.0004), y)), segments, phiStart, phiLength);
}

/** thin ring band (belt, waistband, cuffs) */
function band(r: number, y0: number, y1: number, t = 0.004) {
  return lathe([[r, y0], [r + t, y0 + 0.004], [r + t, y1 - 0.004], [r, y1]], 64);
}

const sm = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ------------------------------------------------------------------ */
/* Procedural surface textures                                         */
/* ------------------------------------------------------------------ */
const texCache: Record<string, THREE.CanvasTexture> = {};
function noiseTexture(kind: "weave" | "leather" | "knit", repeat: [number, number]) {
  const key = `${kind}-${repeat.join("x")}`;
  if (texCache[key] || typeof document === "undefined") return texCache[key];
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);
  if (kind === "weave" || kind === "knit") {
    const step = kind === "weave" ? 4 : 6;
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const l = 110 + Math.random() * 40 + ((x / step + y / step) % 2 ? 18 : -18);
        ctx.fillStyle = `rgb(${l},${l},${l})`;
        ctx.fillRect(x, y, step - 1, step - 1);
      }
    }
  } else {
    for (let i = 0; i < 9000; i++) {
      const l = 100 + Math.random() * 70;
      ctx.fillStyle = `rgba(${l},${l},${l},0.35)`;
      ctx.beginPath();
      ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 1.8 + 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  texCache[key] = t;
  return t;
}

/* ------------------------------------------------------------------ */
/* Materials (+ dissolve handles per garment group)                    */
/* ------------------------------------------------------------------ */
type Group = "tee" | "shirt" | "casual" | "trouser" | "belt" | "watch" | "sneaker" | "oxford";
export type Part = "body" | Group;

const BAND_TORSO = { min: 0.86, max: 1.6 };
const BAND_LEGS = { min: 0.03, max: 1.06 };
const DISSOLVE: Record<Group, DissolveOptions> = {
  tee: { ...BAND_TORSO, invert: true },
  shirt: { ...BAND_TORSO },
  casual: { ...BAND_LEGS, invert: true },
  trouser: { ...BAND_LEGS },
  belt: { axis: 1, center: [0, 1.02, 0] },
  watch: { axis: 0, min: 0.82, max: 0.96 },
  sneaker: { axis: 2, min: -0.12, max: 0.25, invert: true },
  oxford: { axis: 2, min: -0.12, max: 0.25 },
};

function useMaterials() {
  return useMemo(() => {
    const handles: Record<Group, Dissolve[]> = { tee: [], shirt: [], casual: [], trouser: [], belt: [], watch: [], sneaker: [], oxford: [] };
    const make = (g: Group | null, m: THREE.MeshStandardMaterial) => {
      if (g) handles[g].push(makeDissolve(m, DISSOLVE[g]));
      return m;
    };
    const fabric = (g: Group, color: string, opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}, tex?: THREE.Texture) =>
      make(g, new THREE.MeshPhysicalMaterial({ color, roughness: 0.82, sheen: 0.6, sheenRoughness: 0.7, sheenColor: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.25), ...(tex ? { bumpMap: tex, bumpScale: 0.35 } : {}), ...opts }));
    const leather = (g: Group, color: string, gloss = 0.4) =>
      make(g, new THREE.MeshPhysicalMaterial({ color, roughness: 0.55 - gloss * 0.3, clearcoat: gloss, clearcoatRoughness: 0.25, bumpMap: noiseTexture("leather", [3, 3]), bumpScale: 0.25 }));
    const metal = (g: Group, color: string, roughness = 0.25) => make(g, new THREE.MeshStandardMaterial({ color, metalness: 1, roughness }));

    const weave = noiseTexture("weave", [14, 8]);
    const knit = noiseTexture("knit", [10, 6]);
    const twill = noiseTexture("weave", [8, 14]);

    return {
      handles,
      skin: new THREE.MeshPhysicalMaterial({ color: "#C2B6A6", roughness: 0.5, clearcoat: 0.2, clearcoatRoughness: 0.55 }),
      hair: new THREE.MeshPhysicalMaterial({ color: "#3A332C", roughness: 0.62, clearcoat: 0.15, clearcoatRoughness: 0.6 }),
      // casual
      tee: fabric("tee", "#3D4537", {}, knit),
      teeRib: fabric("tee", "#343B2F", {}, knit),
      chino: fabric("casual", "#A8987D", {}, twill),
      chinoDark: fabric("casual", "#958670", {}, twill),
      sneaker: leather("sneaker", "#ECE8E1", 0.15),
      sneakerSole: make("sneaker", new THREE.MeshStandardMaterial({ color: "#F4F1EA", roughness: 0.7 })),
      sneakerGum: make("sneaker", new THREE.MeshStandardMaterial({ color: "#A8744A", roughness: 0.75 })),
      sneakerAccent: leather("sneaker", "#B9905F", 0.2),
      sneakerInner: make("sneaker", new THREE.MeshStandardMaterial({ color: "#3A3530", roughness: 0.9 })),
      // formal
      shirt: fabric("shirt", "#F3F1EC", { roughness: 0.7, sheen: 0.4 }, weave),
      shirtShade: fabric("shirt", "#E9E6DF", { roughness: 0.7 }, weave),
      button: make("shirt", new THREE.MeshPhysicalMaterial({ color: "#F8F5EE", roughness: 0.2, clearcoat: 1 })),
      trouser: fabric("trouser", "#2E3034", { roughness: 0.78, sheen: 0.5 }, twill),
      crease: fabric("trouser", "#3E4146", { roughness: 0.7 }),
      belt: leather("belt", "#4A2A18", 0.45),
      buckle: metal("belt", "#CFCAC2", 0.22),
      watchSteel: metal("watch", "#D3D6DA", 0.18),
      watchDial: make("watch", new THREE.MeshPhysicalMaterial({ color: "#16191E", roughness: 0.25, clearcoat: 1 })),
      watchGold: metal("watch", "#C6A46A", 0.3),
      watchStrap: leather("watch", "#2A1A12", 0.3),
      oxford: leather("oxford", "#3B1D13", 0.95),
      oxfordSole: make("oxford", new THREE.MeshStandardMaterial({ color: "#1E140F", roughness: 0.6 })),
      oxfordLace: make("oxford", new THREE.MeshStandardMaterial({ color: "#1A100B", roughness: 0.8 })),
    };
  }, []);
}
type Mats = ReturnType<typeof useMaterials>;

/* ------------------------------------------------------------------ */
/* Shoes                                                               */
/* ------------------------------------------------------------------ */
interface ShoeSpec { heel: number; toe: number; wh: number; wb: number; h0: number; h1: number; toeH: number; sole: number; point: number }
const SNEAKER: ShoeSpec = { heel: -0.09, toe: 0.2, wh: 0.039, wb: 0.054, h0: 0.078, h1: 0.046, toeH: 0.03, sole: 0.032, point: 1 };
const OXFORD: ShoeSpec = { heel: -0.088, toe: 0.218, wh: 0.035, wb: 0.048, h0: 0.064, h1: 0.04, toeH: 0.026, sole: 0.02, point: 1.35 };

function halfWidth(s: ShoeSpec, t: number) {
  let w = s.wh + (s.wb - s.wh) * sm(0.1, 0.68, t);
  if (t < 0.12) w *= Math.sqrt(Math.max(0, 1 - (1 - t / 0.12) ** 2));
  if (t > 0.7) w *= Math.pow(Math.max(0, 1 - ((t - 0.7) / 0.3) ** 2), 0.5 * s.point);
  return w;
}
function height(s: ShoeSpec, t: number) {
  let h = s.h0 + (s.h1 - s.h0) * sm(0.32, 0.8, t);
  if (t > 0.8) h = s.h1 + (s.toeH - s.h1) * sm(0.8, 1, t);
  if (t < 0.06) h *= 0.8 + 0.2 * Math.sqrt(t / 0.06);
  return h;
}

function footprint(s: ShoeSpec, grow: number, t0 = 0, t1 = 1) {
  const pts: THREE.Vector2[] = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const t = t0 + ((t1 - t0) * i) / N;
    pts.push(new THREE.Vector2(halfWidth(s, t) * grow + 0.0005, s.heel + (s.toe - s.heel) * t));
  }
  for (let i = N; i >= 0; i--) {
    const t = t0 + ((t1 - t0) * i) / N;
    pts.push(new THREE.Vector2(-halfWidth(s, t) * grow - 0.0005, s.heel + (s.toe - s.heel) * t));
  }
  return new THREE.Shape(pts);
}

function slab(shape: THREE.Shape, y: number, depth: number) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2, curveSegments: 4 });
  g.rotateX(Math.PI / 2); // shape y → +z (toe forward); extrusion goes downwards
  g.translate(0, y + depth, 0);
  return g;
}

function upperGeometry(s: ShoeSpec) {
  const g = new THREE.SphereGeometry(1, 64, 32);
  g.rotateX(Math.PI / 2); // poles along z
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const t = (z + 1) / 2;
    const rho = Math.hypot(x, y) || 1e-6;
    const nx = x / rho, ny = y / rho;
    p.setXYZ(i, halfWidth(s, t) * nx, s.sole + Math.max(0, ny) * height(s, t), s.heel + (s.toe - s.heel) * t);
  }
  g.computeVertexNormals();
  return g;
}

function useShoeGeometry(s: ShoeSpec) {
  return useMemo(() => {
    const top = (t: number) => s.sole + height(s, t) * 0.985;
    const zAt = (t: number) => s.heel + (s.toe - s.heel) * t;
    return {
      upper: upperGeometry(s),
      sole: slab(footprint(s, 1.08), 0, s.sole - 0.003),
      gum: slab(footprint(s, 1.1), 0, 0.007),
      heel: slab(footprint(s, 1.06, 0, 0.3), 0, 0.012),
      laces: [0.42, 0.5, 0.58, 0.66].map((t) => ({ y: top(t), z: zAt(t), w: halfWidth(s, t) * 1.1 })),
      collar: { y: top(0.2) + 0.002, z: zAt(0.2), r: halfWidth(s, 0.2) * 0.62 },
    };
  }, [s]);
}

function Sneaker({ m }: { m: Mats }) {
  const g = useShoeGeometry(SNEAKER);
  return (
    <group>
      <mesh geometry={g.upper} material={m.sneaker} />
      <mesh geometry={g.sole} material={m.sneakerSole} />
      <mesh geometry={g.gum} material={m.sneakerGum} />
      <mesh position={[0, g.collar.y - 0.004, g.collar.z]} rotation={[-Math.PI / 2 + 0.12, 0, 0]} scale={[0.75, 1.35, 1]} material={m.sneakerInner}>
        <circleGeometry args={[g.collar.r, 32]} />
      </mesh>
      <mesh position={[0, SNEAKER.sole + 0.05, SNEAKER.heel - 0.004]} material={m.sneakerAccent}>
        <boxGeometry args={[0.03, 0.05, 0.008]} />
      </mesh>
      {g.laces.map((l, i) => (
        <mesh key={i} position={[0, l.y + 0.002, l.z]} rotation={[0.35, 0, 0]} material={m.sneakerSole}>
          <boxGeometry args={[l.w * 0.95, 0.004, 0.008]} />
        </mesh>
      ))}
    </group>
  );
}

function Oxford({ m }: { m: Mats }) {
  const g = useShoeGeometry(OXFORD);
  return (
    <group>
      <mesh geometry={g.upper} material={m.oxford} />
      <mesh geometry={g.sole} material={m.oxfordSole} />
      <mesh geometry={g.heel} material={m.oxfordSole} position={[0, -0.002, 0]} />
      {g.laces.slice(0, 3).map((l, i) => (
        <mesh key={i} position={[0, l.y + 0.001, l.z]} rotation={[0.45, 0, 0]} material={m.oxfordLace}>
          <boxGeometry args={[l.w * 0.6, 0.003, 0.005]} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Arms (built per side; side = 1 → figure's left, screen right)       */
/* ------------------------------------------------------------------ */
function Arm({ side, m, vis }: { side: 1 | -1; m: Mats; vis: (p: Part) => boolean }) {
  const geo = useMemo(() => ({
    upper: lathe(ARM_U, 40),
    fore: lathe(ARM_F, 40),
    teeSleeve: lathe(inflate(ARM_U, -0.165, 0.0, (y) => 0.011 + 0.005 * sm(-0.05, -0.16, y)), 40),
    teeHem: band(rAt(ARM_U, -0.165) + 0.017, -0.172, -0.156, 0.003),
    shirtUpper: lathe(inflate(ARM_U, -0.31, 0.0, (y) => 0.009 + 0.003 * sm(-0.1, -0.3, y)), 40),
    shirtFore: lathe(inflate(ARM_F, -0.222, 0.03, (y) => 0.009 + 0.004 * sm(-0.05, -0.2, y)), 40),
    cuff: band(rAt(ARM_F, -0.21) + 0.013, -0.232, -0.19, 0.003),
  }), []);

  return (
    <group position={[side * SHOULDER.x, SHOULDER.y, 0]} rotation={[0.04, 0, side * 0.11]}>
      {vis("body") && (
        <>
          <mesh material={m.skin} scale={[1, 0.85, 1]}><sphereGeometry args={[0.049, 32, 20]} /></mesh>
          <mesh geometry={geo.upper} material={m.skin} />
        </>
      )}
      {vis("tee") && (
        <>
          <mesh geometry={geo.teeSleeve} material={m.tee} />
          <mesh geometry={geo.teeHem} material={m.teeRib} />
          <mesh material={m.tee} scale={[1, 0.82, 1.02]}><sphereGeometry args={[0.062, 32, 20]} /></mesh>
        </>
      )}
      {vis("shirt") && (
        <>
          <mesh geometry={geo.shirtUpper} material={m.shirt} />
          <mesh material={m.shirt} scale={[1, 0.82, 1.02]}><sphereGeometry args={[0.06, 32, 20]} /></mesh>
        </>
      )}

      {/* elbow → forearm */}
      <group position={[0, -UPPER_LEN, 0]} rotation={[-0.16, 0, side * 0.02]}>
        {vis("body") && (
          <>
            <mesh material={m.skin}><sphereGeometry args={[0.045, 24, 16]} /></mesh>
            <mesh geometry={geo.fore} material={m.skin} />
            {/* hand: palm faces the thigh */}
            <group position={[0, -0.255, 0]} rotation={[0, 0, -side * 0.05]}>
              <mesh material={m.skin} position={[0, -0.075, 0.004]} scale={[0.5, 1, 1.25]}><capsuleGeometry args={[0.031, 0.095, 8, 20]} /></mesh>
              <mesh material={m.skin} position={[-side * 0.008, -0.045, 0.032]} rotation={[0.55, 0, 0]}><capsuleGeometry args={[0.011, 0.04, 6, 12]} /></mesh>
            </group>
          </>
        )}
        {vis("shirt") && (
          <>
            <mesh material={m.shirt}><sphereGeometry args={[0.05, 24, 16]} /></mesh>
            <mesh geometry={geo.shirtFore} material={m.shirt} />
            <mesh geometry={geo.cuff} material={m.shirtShade} />
          </>
        )}
        {side === 1 && vis("watch") && <WatchOnWrist m={m} />}
      </group>
    </group>
  );
}

function WatchOnWrist({ m }: { m: Mats }) {
  const y = -0.247;
  return (
    <group position={[0, y, 0]}>
      <mesh material={m.watchStrap} rotation={[Math.PI / 2, 0, 0]} scale={[0.95, 1.08, 1]}><torusGeometry args={[0.0335, 0.0062, 12, 48]} /></mesh>
      <group position={[0.034, 0, 0.002]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh material={m.watchSteel}><cylinderGeometry args={[0.0205, 0.0205, 0.011, 40]} /></mesh>
        <mesh material={m.watchDial} position={[0, 0.0058, 0]}><cylinderGeometry args={[0.0168, 0.0168, 0.0015, 40]} /></mesh>
        <mesh material={m.watchSteel} position={[0, 0.0062, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.0178, 0.0019, 10, 40]} /></mesh>
        {/* hands + 12 o'clock index */}
        <group rotation={[0, 0.7, 0]}><mesh material={m.watchGold} position={[0.0045, 0.0072, 0]}><boxGeometry args={[0.009, 0.0007, 0.0016]} /></mesh></group>
        <group rotation={[0, 2.6, 0]}><mesh material={m.watchGold} position={[0.0062, 0.0074, 0]}><boxGeometry args={[0.0124, 0.0007, 0.0011]} /></mesh></group>
        <mesh material={m.watchGold} position={[0.0135, 0.0068, 0]}><boxGeometry args={[0.004, 0.0008, 0.0018]} /></mesh>
        <mesh material={m.watchSteel} position={[0, -0.0005, 0.0225]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.0026, 0.0026, 0.004, 12]} /></mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Figure                                                              */
/* ------------------------------------------------------------------ */
export default function Figure({ prog, show }: { prog: MutableRefObject<number>; show?: Part[] }) {
  const m = useMaterials();
  const vis = (p: Part) => !show || show.includes(p);

  const geo = useMemo(() => {
    const waist = rAt(TORSO, 1.02);
    const shirtOff = (y: number) => 0.011 + 0.006 * sm(1.4, 1.2, y) * sm(1.0, 1.15, y);
    const beltR = waist + 0.026;
    return {
      torso: lathe(TORSO),
      leg: lathe(LEG, 40),
      neck: lathe([[0.06, 1.46], [0.057, 1.52], [0.053, 1.565], [0.051, 1.6], [0.0, 1.61]], 40),
      // casual
      tee: lathe(inflate(TORSO, 0.875, 1.5, (y) => 0.012 + 0.036 * sm(1.18, 0.98, y))),
      teeCollar: band(rAt(TORSO, 1.497) + 0.009, 1.489, 1.509, 0.003),
      teeHem: band(rAt(TORSO, 0.88) + 0.048, 0.872, 0.888, 0.002),
      chinoSeat: lathe([[0, 0.83], ...inflate(TORSO, 0.86, 1.02, () => 0.022)]),
      chinoBand: band(rAt(TORSO, 1.005) + 0.022, 0.99, 1.027, 0.003),
      chinoLeg: lathe(inflate(LEG, 0.115, 0.93, (y) => 0.018 + 0.013 * sm(0.62, 0.2, y) - 0.012 * sm(0.84, 0.93, y)), 40),
      chinoCuff: band(rAt(LEG, 0.125) + 0.034, 0.108, 0.142, 0.006),
      // formal
      shirt: lathe(inflate(TORSO, 0.955, 1.502, shirtOff)),
      placket: lathe(inflate(TORSO, 0.99, 1.47, (y) => shirtOff(y) + 0.0025), 6, -0.075, 0.15),
      buttons: [1.43, 1.35, 1.27, 1.19, 1.11, 1.035].map((y) => ({ y, z: (rAt(TORSO, y) + shirtOff(y) + 0.004) * TORSO_SCALE[2] })),
      collarStand: lathe([[0.063, 1.492], [0.066, 1.52], [0.063, 1.566], [0.061, 1.572]], 56, 0.14, Math.PI * 2 - 0.28),
      collarFall: lathe([[0.09, 1.508], [0.08, 1.532], [0.069, 1.558], [0.0665, 1.574]], 56, 0.5, Math.PI * 2 - 1.0),
      trouserSeat: lathe([[0, 0.83], ...inflate(TORSO, 0.86, 1.035, () => 0.019)]),
      trouserBand: band(rAt(TORSO, 1.02) + 0.021, 0.998, 1.045, 0.003),
      trouserLeg: lathe(
        Array.from({ length: 41 }, (_, i) => {
          const y = 0.058 + ((0.955 - 0.058) * i) / 40;
          const straight = 0.066 + (y < 0.13 ? (0.13 - y) * 0.11 : 0);
          return [Math.max(rAt(LEG, y) + 0.016, straight), y] as [number, number];
        }),
        40
      ),
      crease: lathe(
        Array.from({ length: 31 }, (_, i) => {
          const y = 0.075 + ((0.88 - 0.075) * i) / 30;
          return [Math.max(rAt(LEG, y) + 0.016, 0.066 + (y < 0.13 ? (0.13 - y) * 0.11 : 0)) + 0.0012, y] as [number, number];
        }),
        4, -0.018, 0.036
      ),
      belt: band(beltR, 1.004, 1.038, 0.004),
      beltFront: beltR * TORSO_SCALE[2] + 0.004,
    };
  }, []);

  // sculpted head: an egg that narrows into a defined jaw and chin
  const headGeo = useMemo(() => {
    const g = new THREE.SphereGeometry(0.1, 64, 48);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const ny = y / 0.1;
      const low = Math.max(0, -ny);
      x *= 0.86 * (1 - 0.3 * low * low);
      z *= 0.97 * (1 - 0.12 * low * low);
      z += 0.012 * low * Math.max(0, z / 0.1); // jaw slightly forward
      y *= 1.1;
      p.setXYZ(i, x, y, z);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  // collar points (flat triangles lying on the chest)
  const collarPoint = useMemo(() => {
    const s = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(0.036, 0.004), new THREE.Vector2(0.012, -0.062)]);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.0035, bevelEnabled: false });
    return g;
  }, []);

  // scroll → dissolve progress
  useFrame(() => {
    const p = prog.current;
    const set = (g: Group, v: number) => m.handles[g].forEach((h) => (h.progress.value = v));
    const shirt = seg(p, ...T.shirt);
    const trouser = seg(p, ...T.trouser);
    const shoes = seg(p, ...T.shoes);
    set("tee", shirt); set("shirt", shirt);
    set("casual", trouser); set("trouser", trouser);
    set("belt", seg(p, ...T.belt));
    set("watch", seg(p, ...T.watch));
    set("sneaker", shoes); set("oxford", shoes);
  });

  const legs = (render: (side: 1 | -1) => React.ReactNode) =>
    ([1, -1] as const).map((side) => (
      <group key={side} position={[side * LEG_X, 0, 0]}>{render(side)}</group>
    ));

  return (
    <group>
      {/* ---------- body ---------- */}
      {vis("body") && (
        <group>
          <mesh geometry={geo.torso} material={m.skin} scale={TORSO_SCALE} />
          <mesh geometry={geo.neck} material={m.skin} />
          {legs(() => <mesh geometry={geo.leg} material={m.skin} />)}
          {/* head: sculpted, faceless */}
          <group position={[0, 1.695, 0.006]} rotation={[0.05, 0, 0]}>
            <mesh material={m.skin} geometry={headGeo} />
            <mesh material={m.hair} position={[0, 0.004, -0.01]} rotation={[-0.62, 0, 0]} scale={[0.905, 1.08, 1.02]}><sphereGeometry args={[0.105, 48, 24, 0, Math.PI * 2, 0, 1.5]} /></mesh>
            <mesh material={m.hair} position={[0, 0.082, 0.046]} rotation={[-0.5, 0, 0]} scale={[1.32, 0.55, 1.05]}><sphereGeometry args={[0.052, 32, 16]} /></mesh>
            {([1, -1] as const).map((s) => (
              <mesh key={s} material={m.skin} position={[s * 0.083, -0.004, -0.004]} scale={[0.45, 1, 0.75]}><sphereGeometry args={[0.022, 16, 12]} /></mesh>
            ))}
          </group>
        </group>
      )}
      <Arm side={1} m={m} vis={vis} />
      <Arm side={-1} m={m} vis={vis} />

      {/* ---------- casual: tee ---------- */}
      {vis("tee") && (
        <group scale={TORSO_SCALE}>
          <mesh geometry={geo.tee} material={m.tee} />
          <mesh geometry={geo.teeCollar} material={m.teeRib} />
          <mesh geometry={geo.teeHem} material={m.teeRib} />
        </group>
      )}

      {/* ---------- formal: shirt ---------- */}
      {vis("shirt") && (
        <group>
          <group scale={TORSO_SCALE}>
            <mesh geometry={geo.shirt} material={m.shirt} />
            <mesh geometry={geo.placket} material={m.shirtShade} />
          </group>
          <mesh geometry={geo.collarStand} material={m.shirt} />
          <mesh geometry={geo.collarFall} material={m.shirtShade} />
          {([1, -1] as const).map((s) => (
            <mesh key={s} geometry={collarPoint} material={m.shirt} position={[s * 0.012, 1.553, 0.064]} rotation={[-0.32, s === 1 ? 0 : Math.PI, s * 0.08]} scale={[1, 1, s]} />
          ))}
          {geo.buttons.map((b) => (
            <mesh key={b.y} material={m.button} position={[0, b.y, b.z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.0062, 0.0062, 0.0028, 16]} /></mesh>
          ))}
        </group>
      )}

      {/* ---------- casual: chinos ---------- */}
      {vis("casual") && (
        <group>
          <group scale={TORSO_SCALE}>
            <mesh geometry={geo.chinoSeat} material={m.chino} />
            <mesh geometry={geo.chinoBand} material={m.chinoDark} />
          </group>
          {legs(() => (<><mesh geometry={geo.chinoLeg} material={m.chino} /><mesh geometry={geo.chinoCuff} material={m.chinoDark} /></>))}
        </group>
      )}

      {/* ---------- formal: trousers ---------- */}
      {vis("trouser") && (
        <group>
          <group scale={TORSO_SCALE}>
            <mesh geometry={geo.trouserSeat} material={m.trouser} />
            <mesh geometry={geo.trouserBand} material={m.trouser} />
          </group>
          {legs(() => (<><mesh geometry={geo.trouserLeg} material={m.trouser} /><mesh geometry={geo.crease} material={m.crease} /></>))}
        </group>
      )}

      {/* ---------- belt ---------- */}
      {vis("belt") && (
        <group>
          <group scale={TORSO_SCALE}><mesh geometry={geo.belt} material={m.belt} /></group>
          <group position={[0, 1.021, geo.beltFront]}>
            <RoundedBox args={[0.05, 0.04, 0.007]} radius={0.003} smoothness={3} material={m.buckle} />
            <mesh material={m.belt} position={[0, 0, 0.002]}><boxGeometry args={[0.036, 0.026, 0.006]} /></mesh>
            <mesh material={m.buckle} position={[0.004, 0, 0.0055]}><boxGeometry args={[0.0028, 0.03, 0.0024]} /></mesh>
          </group>
        </group>
      )}

      {/* ---------- shoes ---------- */}
      {legs((side) => (
        <group position={[side * 0.006, 0, 0]} rotation={[0, side * 0.1, 0]}>
          {vis("sneaker") && <Sneaker m={m} />}
          {vis("oxford") && <Oxford m={m} />}
        </group>
      ))}
    </group>
  );
}
