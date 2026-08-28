import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { shouldReduceMobileMotion } from "@/lib/mobileRouteTransition";

type TransitionPhase = "idle" | "leaving" | "entering";

type MobileRouteTransitionContextValue = {
  phase: TransitionPhase;
  navigateWithAnimation: (href: string, navigate: (href: string) => void) => void;
};

const MobileRouteTransitionContext = createContext<MobileRouteTransitionContextValue | null>(null);

export function MobileRouteTransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const navigateWithAnimation = useCallback((href: string, navigate: (href: string) => void) => {
    if (phase !== "idle") return;
    if (shouldReduceMobileMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      navigate(href);
      return;
    }
    setPhase("leaving");
    timers.current.push(window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      navigate(href);
      setPhase("entering");
      timers.current.push(window.setTimeout(() => setPhase("idle"), 260));
    }, 140));
  }, [phase]);

  return <MobileRouteTransitionContext.Provider value={{ phase, navigateWithAnimation }}>{children}</MobileRouteTransitionContext.Provider>;
}

export function useMobileRouteTransition() {
  const context = useContext(MobileRouteTransitionContext);
  if (!context) throw new Error("useMobileRouteTransition must be used inside MobileRouteTransitionProvider");
  return context;
}

export function MobileRouteFrame({ children }: { children: ReactNode }) {
  const { phase } = useMobileRouteTransition();
  return <div className={`mobile-route-frame ${phase === "leaving" ? "mobile-route-leaving" : ""} ${phase === "entering" ? "mobile-route-entering" : ""}`}>{children}</div>;
}
