"use client";

import { Canvas } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import { ProductModel, FRAMING, type ModelKind } from "./models";
import StudioStage from "./StudioStage";

/** Small drag-to-rotate viewer used on product detail pages. */
export default function MiniViewer({ kind, variant }: { kind: ModelKind; variant?: string }) {
  const f = FRAMING[kind];
  return (
    <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 0.4, 6.4], fov: 32 }} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}>
      <StudioStage />
      <PresentationControls global={false} cursor snap={false} speed={1.4} polar={[-0.4, 0.4]} azimuth={[-Infinity, Infinity]}>
        <group scale={f.scale} position={[0, f.y, 0]} rotation={f.rotation}>
          <ProductModel kind={kind} variant={variant} />
        </group>
      </PresentationControls>
    </Canvas>
  );
}
