"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

/** Dark luxury studio: soft key, gold rim, local light-formers (no HDR downloads). */
export default function StudioStage({ shadowY = -1.55, quality = "high" }: { shadowY?: number; quality?: "high" | "low" }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <spotLight position={[4, 6, 5]} angle={0.45} penumbra={0.9} intensity={60} castShadow={quality === "high"} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} shadow-normalBias={0.03} color="#fff6ea" />
      <pointLight position={[-5, 2, -3]} intensity={25} color="#C6A46A" />
      <pointLight position={[0, -2, 4]} intensity={4} color="#ffffff" />
      <Environment resolution={quality === "high" ? 256 : 128} frames={1}>
        <color attach="background" args={["#2a2a2a"]} />
        <Lightformer form="rect" intensity={5} position={[0, 4, 3]} scale={[8, 2, 1]} rotation-x={Math.PI / 2.5} />
        <Lightformer form="rect" intensity={3.5} color="#E9D6B0" position={[-5, 1, 1]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.5} position={[5, 0.5, -1]} scale={[3, 5, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={1.5} color="#C6A46A" position={[0, 1, -6]} scale={3} />
      </Environment>
      <ContactShadows position={[0, shadowY, 0]} opacity={0.65} scale={9} blur={2.6} far={3.2} resolution={quality === "high" ? 512 : 256} color="#000000" />
    </>
  );
}
