import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function useScrollReveal(scope, deps = []) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          root.querySelectorAll("[data-reveal]").forEach((section) => {
            if (section.dataset.reveal === "exit-only") return;

            gsap.from(section, {
              y: 24,
              duration: 0.65,
              ease: "power2.out",
              immediateRender: false,
              clearProps: "transform",
              scrollTrigger: {
                trigger: section,
                start: "top 92%",
                once: true,
              },
            });
          });
        }
      );

      let timer;
      let lastHeight = root.offsetHeight;
      let observer;

      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(() => {
          window.clearTimeout(timer);

          timer = window.setTimeout(() => {
            const height = root.offsetHeight;
            if (Math.abs(height - lastHeight) < 8) return;

            lastHeight = height;
            ScrollTrigger.refresh();
          }, 250);
        });

        observer.observe(root);
      }

      return () => {
        window.clearTimeout(timer);
        observer?.disconnect();
        mm.revert();
      };
    },
    { scope, dependencies: deps, revertOnUpdate: true }
  );
}