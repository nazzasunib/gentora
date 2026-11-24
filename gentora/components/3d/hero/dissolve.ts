import * as THREE from "three";

/**
 * Scroll-driven "fabric dissolve" for the hero transformation.
 *
 * Two garments share the same noise field: the outgoing one uses invert=1 and
 * the incoming one invert=0, so at any progress they are exact complements —
 * no gaps, no overlap, no flicker. A hairline warm edge marks the seam.
 *
 * axis 0 = world Y (top → bottom), 1 = angle around `center` (front → back),
 * 2 = world Z (toe → heel).
 */
export interface Dissolve {
  progress: { value: number };
  min: { value: number };
  max: { value: number };
  invert: { value: number };
  axis: { value: number };
  edge: { value: THREE.Color };
  center: { value: THREE.Vector3 };
}

export interface DissolveOptions {
  axis?: 0 | 1 | 2;
  min?: number;
  max?: number;
  invert?: boolean;
  center?: [number, number, number];
  edge?: string;
  edgeStrength?: number;
}

export function makeDissolve(material: THREE.MeshStandardMaterial, o: DissolveOptions = {}): Dissolve {
  const u: Dissolve = {
    progress: { value: o.invert ? 0 : 0 },
    min: { value: o.min ?? 0 },
    max: { value: o.max ?? 1 },
    invert: { value: o.invert ? 1 : 0 },
    axis: { value: o.axis ?? 0 },
    edge: { value: new THREE.Color(o.edge ?? "#E2C48E").multiplyScalar(o.edgeStrength ?? 1.4) },
    center: { value: new THREE.Vector3(...(o.center ?? [0, 0, 0])) },
  };

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uDProgress = u.progress;
    shader.uniforms.uDMin = u.min;
    shader.uniforms.uDMax = u.max;
    shader.uniforms.uDInvert = u.invert;
    shader.uniforms.uDAxis = u.axis;
    shader.uniforms.uDEdge = u.edge;
    shader.uniforms.uDCenter = u.center;

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vDWorld;")
      .replace("#include <project_vertex>", "#include <project_vertex>\nvDWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;");

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uDProgress; uniform float uDMin; uniform float uDMax; uniform float uDInvert; uniform float uDAxis;
uniform vec3 uDEdge; uniform vec3 uDCenter;
varying vec3 vDWorld;
float dHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float dNoise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(dHash(i), dHash(i + vec3(1,0,0)), f.x), mix(dHash(i + vec3(0,1,0)), dHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(dHash(i + vec3(0,0,1)), dHash(i + vec3(1,0,1)), f.x), mix(dHash(i + vec3(0,1,1)), dHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}`
      )
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
float dCoord;
if (uDAxis < 0.5) dCoord = (uDMax - vDWorld.y) / (uDMax - uDMin);
else if (uDAxis < 1.5) { vec3 dr = vDWorld - uDCenter; dCoord = abs(atan(dr.x, dr.z)) / 3.14159265; }
else dCoord = (uDMax - vDWorld.z) / (uDMax - uDMin);
float dField = clamp(dCoord, 0.0, 1.0) * 0.93 + (dNoise(vDWorld * 7.0) * 0.8 + dNoise(vDWorld * 30.0) * 0.2) * 0.07;
float dDelta = (uDProgress * 1.04 - 0.02) - dField;
if (uDInvert < 0.5) { if (dDelta < 0.0) discard; } else { if (dDelta >= 0.0) discard; }
float dBand = (1.0 - smoothstep(0.0, 0.01, abs(dDelta))) * step(0.002, uDProgress) * step(uDProgress, 0.998);`
      )
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance += uDEdge * dBand;");
  };
  material.customProgramCacheKey = () => "vestures-dissolve";
  material.side = THREE.DoubleSide;
  return u;
}

/** smoothstep-eased local progress of p inside [a, b] */
export const seg = (p: number, a: number, b: number) => {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
