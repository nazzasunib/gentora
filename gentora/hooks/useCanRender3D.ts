"use client";
import { useEffect, useState } from "react";

/**
 * Decides whether to mount the WebGL scene.
 * Falls back to static imagery when WebGL is unavailable, the user prefers reduced
 * motion, data-saver is on, or the device looks low-powered.
 */
export function useCanRender3D() {
  const [state, setState] = useState<"checking" | "yes" | "no">("checking");
  useEffect(() => {
    try {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
      const lowMem = typeof nav.deviceMemory === "number" && nav.deviceMemory < 3;
      const lowCpu = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency < 3;
      const saveData = !!nav.connection?.saveData;
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setState(gl && !reduced && !lowMem && !lowCpu && !saveData ? "yes" : "no");
    } catch {
      setState("no");
    }
  }, []);
  return state;
}
