"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { ProductModel, FRAMING, type ModelKind } from "@/components/3d/models";
import StudioStage from "@/components/3d/StudioStage";

export default function StudioRender({ model, variant }: { model: string; variant?: string }) {
  const kind = (["watch", "bag", "belt"].includes(model) ? model : "watch") as ModelKind;
  const f = FRAMING[kind];
  return (
    <div id="studio" className="fixed inset-0 z-[300]" style={{ background: "radial-gradient(90% 70% at 50% 40%, #2a2724 0%, #161616 55%, #0e0e0e 100%)" }}>
      <Canvas shadows dpr={2} camera={{ position: [0, 0.5, 8.2], fov: 30 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={() => setTimeout(() => document.body.setAttribute("data-ready", "1"), 1200)}>
        <StudioStage />
        <group scale={f.scale} position={[0, f.y, 0]} rotation={[f.rotation[0], f.rotation[1] - 0.1, f.rotation[2]]}>
          <ProductModel kind={kind} variant={variant} />
        </group>
      </Canvas>
    </div>
  );
}
