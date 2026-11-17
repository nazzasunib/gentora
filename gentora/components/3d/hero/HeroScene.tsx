"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import Figure, { type Part } from "./Figure";
import { seg } from "./dissolve";
import { T } from "./stages";

export interface Frame { pos: [number, number, number]; look: [number, number, number]; rot?: number; fov?: number }

export interface HeroControl {
  /** raw scroll progress 0..1 (set by GSAP) */
  target: number;
  /** pointer parallax −1..1 */
  px: number;
}

function Rig({ ctrl, smooth, still, figure, frame }: { ctrl: MutableRefObject<HeroControl>; smooth: MutableRefObject<number>; still?: boolean; figure: MutableRefObject<THREE.Group | null>; frame?: Frame }) {
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const c = ctrl.current;
    // cinematic smoothing of the scroll value (scrub on top of scrub)
    smooth.current = still ? c.target : THREE.MathUtils.damp(smooth.current, c.target, 6, Math.min(dt, 0.05));
    const p = smooth.current;
    if (frame) {
      camera.position.set(...frame.pos);
      if (frame.fov && (camera as THREE.PerspectiveCamera).fov !== frame.fov) {
        (camera as THREE.PerspectiveCamera).fov = frame.fov;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      }
      camera.lookAt(look.set(...frame.look));
      if (figure.current) figure.current.rotation.y = frame.rot ?? -0.14;
      return;
    }
    const mobile = size.width / size.height < 0.8;

    // camera: fixed framing, a gentle push-in for the final look
    const fin = seg(p, ...T.final);
    const wide = size.width / size.height > 1.2;
    const z = (mobile ? 7.6 : 5.7) - fin * 0.3;
    const y = (mobile ? 0.9 : 1.02) - fin * 0.03;
    const shift = wide ? -0.34 : 0; // desktop: figure sits right of centre, copy on the left
    camera.position.x = THREE.MathUtils.damp(camera.position.x, shift + (mobile ? 0 : c.px * 0.12), 3, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 3, dt);
    camera.position.z = still ? z : THREE.MathUtils.damp(camera.position.z, z, 3, dt);
    look.set(shift, mobile ? 0.64 : 1.03, 0);
    camera.lookAt(look);

    // the figure keeps its pose; it only turns slightly to present the watch, then settles
    const g = figure.current;
    if (g) {
      const watch = seg(p, T.watch[0] - 0.04, T.watch[1]) - seg(p, T.shoes[0] - 0.02, T.shoes[0] + 0.06);
      const idle = still ? 0 : Math.sin(state.clock.elapsedTime * 0.35) * 0.015;
      const target = -0.14 - watch * 0.34 + fin * 0.06 + c.px * 0.06 + idle;
      g.rotation.y = still ? target : THREE.MathUtils.damp(g.rotation.y, target, 4, dt);
    }
  });

  return null;
}

/** Soft radial floor glow (canvas texture, no external files). */
function Floor() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(58,52,44,0.9)");
    g.addColorStop(0.45, "rgba(30,28,25,0.55)");
    g.addColorStop(1, "rgba(14,14,14,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
      <circleGeometry args={[1.7, 64]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

function Stage({ ctrl, quality, still, show, frame }: { ctrl: MutableRefObject<HeroControl>; quality: "high" | "low"; still?: boolean; show?: Part[]; frame?: Frame }) {
  const smooth = useRef(ctrl.current.target);
  const holder = useRef<THREE.Group | null>(null);

  return (
    <>
      <Rig ctrl={ctrl} smooth={smooth} still={still} figure={holder} frame={frame} />
      <ambientLight intensity={0.16} />
      {/* key: warm, high front-left */}
      <spotLight position={[-3.2, 4.4, 3.4]} angle={0.42} penumbra={0.85} intensity={85} color="#FFF3E2" />
      {/* rim: gold, behind right — outlines the silhouette */}
      <spotLight position={[2.6, 3.4, -2.6]} angle={0.5} penumbra={0.9} intensity={80} color="#E3CDA6" />
      <spotLight position={[-2.4, 2.6, -2.4]} angle={0.5} penumbra={0.9} intensity={45} color="#E8DCC8" />
      {/* cool fill from the right */}
      <pointLight position={[3, 1.4, 2.5]} intensity={6} color="#C9D3E0" />
      <Environment resolution={quality === "high" ? 256 : 128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#F1E3C8" position={[-4, 2, 2]} scale={[3, 5, 1]} rotation-y={Math.PI / 2.6} />
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[3, 3, 3]} scale={[2, 4, 1]} rotation-y={-Math.PI / 3} />
        <Lightformer form="ring" intensity={1.1} color="#C6A46A" position={[0, 2, -5]} scale={3} />
      </Environment>

      <group ref={holder}>
        <Figure prog={smooth} show={show} />
      </group>
      <Floor />
      <ContactShadows position={[0, 0, 0]} opacity={0.75} scale={2.6} blur={2.4} far={1.2} resolution={quality === "high" ? 512 : 256} color="#000000" frames={still ? 1 : Infinity} />
    </>
  );
}

export default function HeroScene({
  ctrl, active = true, quality = "high", still, show, frame, onReady,
}: {
  frame?: Frame;
  ctrl: MutableRefObject<HeroControl>;
  active?: boolean;
  quality?: "high" | "low";
  still?: boolean;
  show?: Part[];
  onReady?: () => void;
}) {
  return (
    <Canvas
      dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 1, 5.7], fov: 28, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, preserveDrawingBuffer: !!still }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.05;
        setTimeout(() => onReady?.(), 250);
      }}
    >
      <Stage ctrl={ctrl} quality={quality} still={still} show={show} frame={frame} />
    </Canvas>
  );
}
