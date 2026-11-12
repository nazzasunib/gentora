"use client";
import { useEffect, useState } from "react";

/** True after the first client render — avoids SSR/localStorage mismatches. */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
