"use client";

import { Component, type ReactNode } from "react";

export default class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    if (process.env.NODE_ENV !== "production") console.warn("[GENTORA 3D] falling back to images:", err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
