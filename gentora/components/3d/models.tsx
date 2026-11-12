"use client";

/**
 * GENTORA procedural 3D products — built entirely in Three.js, so there are no
 * external model files, no licensing concerns and nothing to 404.
 */
import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type PathFn = (s: number) => { pos: THREE.Vector3; normal: THREE.Vector3 };

/** Bends a box (x = length, y = width, z = thickness) along a path. */
function bentStrap(width: number, thickness: number, segments: number, path: PathFn, widthAxis = new THREE.Vector3(0, 1, 0)) {
  const g = new THREE.BoxGeometry(1, width, thickness, segments, 1, 1);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const { pos, normal } = path(x + 0.5);
    v.copy(pos).addScaledVector(normal, z).addScaledVector(widthAxis, y);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

let leatherTex: THREE.CanvasTexture | null = null;
/** Small procedural grain texture used as bump + roughness map for leather. */
function useLeatherTexture() {
  return useMemo(() => {
    if (leatherTex || typeof document === "undefined") return leatherTex;
    const size = 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 9000; i++) {
      const x = Math.random() * size, y = Math.random() * size, r = Math.random() * 1.8 + 0.4;
      const l = 100 + Math.random() * 70;
      ctx.fillStyle = `rgba(${l},${l},${l},0.35)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 3);
    leatherTex = t;
    return t;
  }, []);
}

function Leather({ color, sheen = 0.4 }: { color: string; sheen?: number }) {
  const tex = useLeatherTexture();
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.52}
      metalness={0}
      clearcoat={0.35}
      clearcoatRoughness={0.45}
      sheen={sheen}
      sheenColor={new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.35)}
      sheenRoughness={0.6}
      bumpMap={tex ?? undefined}
      bumpScale={0.6}
      roughnessMap={tex ?? undefined}
    />
  );
}

const GOLD = { color: "#C6A46A", metalness: 1, roughness: 0.28 };
const STEEL = { color: "#C9CDD1", metalness: 1, roughness: 0.22 };
const BLACK_METAL = { color: "#1d1d1f", metalness: 0.9, roughness: 0.35 };

/* ------------------------------------------------------------------ */
/* Watch                                                               */
/* ------------------------------------------------------------------ */

export type WatchVariant = "steel" | "noir" | "gold";
const WATCH: Record<WatchVariant, { case: typeof GOLD; dial: string; index: typeof GOLD; strap: string }> = {
  steel: { case: STEEL, dial: "#121418", index: STEEL, strap: "#141414" },
  noir: { case: BLACK_METAL, dial: "#0c0c0c", index: GOLD, strap: "#101010" },
  gold: { case: GOLD, dial: "#EDE6D6", index: { ...GOLD, color: "#8B7355" }, strap: "#4A2C1A" },
};

export function Watch({ variant = "steel" }: { variant?: WatchVariant }) {
  const v = WATCH[variant];
  const strapGeo = useMemo(() => {
    const c = 0.9, lug = 1.12;
    const R = Math.hypot(lug, c);
    const phi0 = Math.atan2(lug, c);
    return bentStrap(0.62, 0.07, 220, (s) => {
      const phi = phi0 + s * (Math.PI * 2 - phi0 * 2);
      const n = new THREE.Vector3(0, Math.sin(phi), Math.cos(phi));
      return { pos: new THREE.Vector3(0, R * Math.sin(phi), -c + R * Math.cos(phi)), normal: n };
    }, new THREE.Vector3(1, 0, 0));
  }, []);

  const indices = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);
  const idxColor = v.index;

  return (
    <group>
      {/* strap */}
      <mesh geometry={strapGeo} castShadow receiveShadow>
        <Leather color={v.strap} sheen={0.25} />
      </mesh>
      {/* strap keeper + buckle at the back */}
      <mesh position={[0, -0.05, -2.32]} castShadow>
        <boxGeometry args={[0.72, 0.18, 0.04]} />
        <meshStandardMaterial {...v.case} />
      </mesh>

      {/* case */}
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1, 1, 0.34, 96]} />
          <meshStandardMaterial {...v.case} />
        </mesh>
        {/* bezel */}
        <mesh position={[0, 0, 0.17]} castShadow>
          <torusGeometry args={[0.96, 0.065, 24, 96]} />
          <meshStandardMaterial {...v.case} roughness={v.case.roughness * 0.6} />
        </mesh>
        {/* lugs */}
        {[[-0.33, 0.98], [0.33, 0.98], [-0.33, -0.98], [0.33, -0.98]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, -0.02]} castShadow>
            <boxGeometry args={[0.16, 0.34, 0.24]} />
            <meshStandardMaterial {...v.case} />
          </mesh>
        ))}
        {/* crown */}
        <mesh position={[1.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.16, 24]} />
          <meshStandardMaterial {...v.case} />
        </mesh>
        {/* dial */}
        <mesh position={[0, 0, 0.176]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.02, 96]} />
          <meshPhysicalMaterial color={v.dial} roughness={0.32} metalness={0.4} clearcoat={0.6} />
        </mesh>
        {/* minute track */}
        <mesh position={[0, 0, 0.1875]}>
          <ringGeometry args={[0.8, 0.805, 96]} />
          <meshStandardMaterial {...idxColor} />
        </mesh>
        {/* indices */}
        {indices.map((i) => {
          const a = (i / 12) * Math.PI * 2;
          const r = 0.68;
          const isTwelve = i === 0;
          return (
            <group key={i} position={[Math.sin(a) * r, Math.cos(a) * r, 0.196]} rotation={[0, 0, -a]}>
              {isTwelve ? (
                <>
                  <mesh position={[-0.035, 0, 0]}><boxGeometry args={[0.035, 0.17, 0.02]} /><meshStandardMaterial {...idxColor} /></mesh>
                  <mesh position={[0.035, 0, 0]}><boxGeometry args={[0.035, 0.17, 0.02]} /><meshStandardMaterial {...idxColor} /></mesh>
                </>
              ) : (
                <mesh><boxGeometry args={[i % 3 === 0 ? 0.05 : 0.032, i % 3 === 0 ? 0.16 : 0.11, 0.02]} /><meshStandardMaterial {...idxColor} /></mesh>
              )}
            </group>
          );
        })}
        {/* hands at 10:10 */}
        <group position={[0, 0, 0.21]}>
          <group rotation={[0, 0, -(Math.PI * 2 * 10.17) / 12]}>
            <mesh position={[0, 0.2, 0]} castShadow><boxGeometry args={[0.055, 0.42, 0.018]} /><meshStandardMaterial {...idxColor} /></mesh>
          </group>
          <group rotation={[0, 0, -(Math.PI * 2 * 2) / 12]}>
            <mesh position={[0, 0.3, 0.02]} castShadow><boxGeometry args={[0.038, 0.62, 0.016]} /><meshStandardMaterial {...idxColor} /></mesh>
          </group>
          <group rotation={[0, 0, -(Math.PI * 2 * 7) / 12]}>
            <mesh position={[0, 0.28, 0.04]}><boxGeometry args={[0.012, 0.78, 0.01]} /><meshStandardMaterial color="#C6A46A" metalness={0.8} roughness={0.3} /></mesh>
          </group>
          <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.03, 24]} />
            <meshStandardMaterial {...idxColor} />
          </mesh>
        </group>
        {/* crystal */}
        <mesh position={[0, 0, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.92, 0.92, 0.02, 96]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.12} roughness={0} metalness={0} clearcoat={1} clearcoatRoughness={0} envMapIntensity={1.4} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Office bag                                                           */
/* ------------------------------------------------------------------ */

export type BagVariant = "brown" | "black" | "tan";
const BAG: Record<BagVariant, { body: string; trim: string; hw: typeof GOLD }> = {
  brown: { body: "#6B3F22", trim: "#3E2414", hw: GOLD },
  black: { body: "#17171a", trim: "#0b0b0c", hw: STEEL },
  tan: { body: "#A06A3C", trim: "#6B4527", hw: GOLD },
};

export function Bag({ variant = "brown" }: { variant?: BagVariant }) {
  const v = BAG[variant];
  const handleGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.55, 0, 0),
      new THREE.Vector3(-0.5, 0.38, 0),
      new THREE.Vector3(-0.2, 0.58, 0),
      new THREE.Vector3(0.2, 0.58, 0),
      new THREE.Vector3(0.5, 0.38, 0),
      new THREE.Vector3(0.55, 0, 0),
    ]);
    return new THREE.TubeGeometry(curve, 64, 0.075, 20, false);
  }, []);

  return (
    <group position={[0, -0.15, 0]}>
      {/* body */}
      <RoundedBox args={[3.1, 2.1, 0.8]} radius={0.16} smoothness={5} castShadow receiveShadow>
        <Leather color={v.body} />
      </RoundedBox>
      {/* side gussets */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.552, -0.02, 0]} castShadow>
          <boxGeometry args={[0.012, 1.85, 0.5]} />
          <meshStandardMaterial color={v.trim} roughness={0.7} />
        </mesh>
      ))}
      {/* flap */}
      <RoundedBox args={[3.14, 1.25, 0.07]} radius={0.03} smoothness={4} position={[0, 0.44, 0.43]} castShadow>
        <Leather color={v.body} sheen={0.55} />
      </RoundedBox>
      {/* flap piping */}
      <mesh position={[0, -0.18, 0.47]}>
        <boxGeometry args={[3.08, 0.035, 0.02]} />
        <meshStandardMaterial color={v.trim} roughness={0.6} />
      </mesh>
      {/* straps over flap */}
      {[-0.75, 0.75].map((x) => (
        <group key={x}>
          <RoundedBox args={[0.24, 1.35, 0.04]} radius={0.015} smoothness={3} position={[x, 0.38, 0.48]} castShadow>
            <Leather color={v.trim} />
          </RoundedBox>
          {/* clasp */}
          <RoundedBox args={[0.34, 0.2, 0.07]} radius={0.02} smoothness={3} position={[x, -0.28, 0.5]} castShadow>
            <meshStandardMaterial {...v.hw} />
          </RoundedBox>
          <mesh position={[x, -0.28, 0.54]}>
            <boxGeometry args={[0.2, 0.06, 0.01]} />
            <meshStandardMaterial color="#111" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}
      {/* brand plate */}
      <RoundedBox args={[0.5, 0.09, 0.02]} radius={0.008} smoothness={2} position={[0, -0.72, 0.41]}>
        <meshStandardMaterial {...v.hw} />
      </RoundedBox>
      {/* handle */}
      <group position={[0, 1.05, 0]}>
        <mesh geometry={handleGeo} castShadow>
          <Leather color={v.trim} sheen={0.5} />
        </mesh>
        {[-0.55, 0.55].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.1, 0.025, 12, 32]} />
              <meshStandardMaterial {...v.hw} />
            </mesh>
            <RoundedBox args={[0.22, 0.12, 0.2]} radius={0.03} smoothness={3} position={[0, -0.06, 0]}>
              <Leather color={v.trim} />
            </RoundedBox>
          </group>
        ))}
      </group>
      {/* D-rings for shoulder strap */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.58, 0.82, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[0.09, 0.022, 12, 32, Math.PI]} />
          <meshStandardMaterial {...v.hw} />
        </mesh>
      ))}
      {/* feet */}
      {[[-1.3, -0.25], [1.3, -0.25], [-1.3, 0.25], [1.3, 0.25]].map(([x, z], i) => (
        <mesh key={i} position={[x, -1.06, z]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          <meshStandardMaterial {...v.hw} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Belt (coiled)                                                        */
/* ------------------------------------------------------------------ */

export type BeltVariant = "brown" | "black" | "tan";
const BELT: Record<BeltVariant, { leather: string; hw: typeof GOLD }> = {
  brown: { leather: "#5E3519", hw: GOLD },
  black: { leather: "#141415", hw: STEEL },
  tan: { leather: "#9A6234", hw: GOLD },
};

export function Belt({ variant = "brown" }: { variant?: BeltVariant }) {
  const v = BELT[variant];
  const { geo, end, tangent, normal } = useMemo(() => {
    const r0 = 0.5, pitch = 0.085, turns = 3.25;
    const k = pitch / (Math.PI * 2);
    const TH = turns * Math.PI * 2;
    const a = 0.94; // portion of length used by the spiral
    const tail = 0.32;
    const at = (th: number) => {
      const r = r0 + k * th;
      return { pos: new THREE.Vector3(r * Math.cos(th), 0, r * Math.sin(th)), normal: new THREE.Vector3(Math.cos(th), 0, Math.sin(th)) };
    };
    const endS = at(TH);
    const rE = r0 + k * TH;
    const T = new THREE.Vector3(k * Math.cos(TH) - rE * Math.sin(TH), 0, k * Math.sin(TH) + rE * Math.cos(TH)).normalize();
    const path: PathFn = (s) => {
      if (s <= a) return at((s / a) * TH);
      const d = ((s - a) / (1 - a)) * tail;
      return { pos: endS.pos.clone().addScaledVector(T, d), normal: endS.normal.clone() };
    };
    const g = bentStrap(0.36, 0.05, 900, path);
    return { geo: g, end: endS.pos.clone().addScaledVector(T, tail), tangent: T, normal: endS.normal.clone() };
  }, []);

  const buckleGeo = useMemo(() => {
    const w = 0.34, h = 0.5, t = 0.05, r = 0.08;
    const rr = (s: THREE.Shape | THREE.Path, x: number, y: number, W: number, H: number, R: number) => {
      s.moveTo(x + R, y);
      s.lineTo(x + W - R, y);
      s.quadraticCurveTo(x + W, y, x + W, y + R);
      s.lineTo(x + W, y + H - R);
      s.quadraticCurveTo(x + W, y + H, x + W - R, y + H);
      s.lineTo(x + R, y + H);
      s.quadraticCurveTo(x, y + H, x, y + H - R);
      s.lineTo(x, y + R);
      s.quadraticCurveTo(x, y, x + R, y);
    };
    const shape = new THREE.Shape();
    rr(shape, -w / 2, -h / 2, w, h, r);
    const hole = new THREE.Path();
    rr(hole, -w / 2 + t, -h / 2 + t, w - 2 * t, h - 2 * t, r * 0.5);
    shape.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 4, curveSegments: 16 });
    g.translate(0, 0, -0.025);
    return g;
  }, []);

  const buckleMatrix = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const m = new THREE.Matrix4().makeBasis(tangent, up, normal);
    const q = new THREE.Quaternion().setFromRotationMatrix(m);
    const pos = end.clone().addScaledVector(tangent, 0.1).addScaledVector(normal, 0.02);
    return { q, pos };
  }, [end, tangent, normal]);

  return (
    <group rotation={[0.0, 0, 0]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <Leather color={v.leather} sheen={0.45} />
      </mesh>
      <group position={buckleMatrix.pos} quaternion={buckleMatrix.q}>
        <mesh geometry={buckleGeo} castShadow>
          <meshStandardMaterial {...v.hw} />
        </mesh>
        {/* bar + prong */}
        <mesh position={[0, 0, 0.0]}>
          <boxGeometry args={[0.03, 0.44, 0.035]} />
          <meshStandardMaterial {...v.hw} />
        </mesh>
        <mesh position={[0.08, 0, 0.035]} castShadow>
          <boxGeometry args={[0.17, 0.028, 0.022]} />
          <meshStandardMaterial {...v.hw} />
        </mesh>
      </group>
    </group>
  );
}

export type ModelKind = "watch" | "bag" | "belt";

export function ProductModel({ kind, variant }: { kind: ModelKind; variant?: string }) {
  if (kind === "watch") return <Watch variant={(variant as WatchVariant) ?? "steel"} />;
  if (kind === "bag") return <Bag variant={(variant as BagVariant) ?? "brown"} />;
  return <Belt variant={(variant as BeltVariant) ?? "brown"} />;
}

/** Default framing (scale / base rotation) per model. */
export const FRAMING: Record<ModelKind, { scale: number; rotation: [number, number, number]; y: number }> = {
  watch: { scale: 0.92, rotation: [0.15, -0.45, 0], y: 0.15 },
  bag: { scale: 0.78, rotation: [0.12, -0.5, 0], y: 0.05 },
  belt: { scale: 1.75, rotation: [0.42, 0.45, 0], y: -0.15 },
};
