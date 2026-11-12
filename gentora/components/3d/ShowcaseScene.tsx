"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { ProductModel, FRAMING, type ModelKind } from "./models";
import StudioStage from "./StudioStage";

export interface SceneControl {
  active: number;
  local: number; // 0..1 progress within the active product
  dragX: number;
  dragY: number;
  dragging: boolean;
}

const KINDS: ModelKind[] = ["watch", "bag", "belt"];

function Rig({ ctrl }: { ctrl: MutableRefObject<SceneControl> }) {
  const { camera, size } = useThree();
  const look = useRef(new THREE.Vector3());
  useFrame((_, dt) => {
    const c = ctrl.current;
    const mobile = size.width < 768;
    // scroll-driven dolly: approach & rise a little through each product
    const z = (mobile ? 9.6 : 8.2) - c.local * 0.8;
    const y = 0.6 - c.local * 0.5;
    const x = mobile ? 0 : -0.15 + c.local * 0.3;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 3, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 3, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 3, dt);
    look.current.set(0, mobile ? 0.35 : 0, 0);
    camera.lookAt(look.current);
  });
  return null;
}

function Item({ kind, index, ctrl }: { kind: ModelKind; index: number; ctrl: MutableRefObject<SceneControl> }) {
  const outer = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const auto = useRef(0);
  const f = FRAMING[kind];

  useFrame((state, dt) => {
    const c = ctrl.current;
    const g = outer.current, s = spin.current;
    if (!g || !s) return;
    const isActive = c.active === index;
    const target = isActive ? f.scale : 0.0001;
    const sc = THREE.MathUtils.damp(g.scale.x, target, isActive ? 4 : 7, dt);
    g.scale.setScalar(sc);
    g.visible = sc > 0.002;
    // arrive from below / leave upward
    const ty = isActive ? f.y : c.active > index ? f.y + 1.6 : f.y - 1.6;
    g.position.y = THREE.MathUtils.damp(g.position.y, ty, 4, dt);
    if (!g.visible) return;

    if (!c.dragging) auto.current += dt * 0.25;
    const scrollTurn = c.local * Math.PI * 0.9;
    const targetY = f.rotation[1] + auto.current + c.dragX + (isActive ? scrollTurn : 0);
    const targetX = f.rotation[0] + c.dragY;
    s.rotation.y = THREE.MathUtils.damp(s.rotation.y, targetY, 5, dt);
    s.rotation.x = THREE.MathUtils.damp(s.rotation.x, targetX, 5, dt);
    s.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
  });

  return (
    <group ref={outer} scale={index === 0 ? f.scale : 0.0001}>
      <group ref={spin} rotation={f.rotation}>
        <ProductModel kind={kind} />
      </group>
    </group>
  );
}

export default function ShowcaseScene({ ctrl, active, lowPower }: { ctrl: MutableRefObject<SceneControl>; active: boolean; lowPower?: boolean }) {
  return (
    <Canvas
      shadows={!lowPower}
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.6, 8.2], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Rig ctrl={ctrl} />
      <StudioStage quality={lowPower ? "low" : "high"} />
      {KINDS.map((k, i) => (
        <Item key={k} kind={k} index={i} ctrl={ctrl} />
      ))}
    </Canvas>
  );
}
