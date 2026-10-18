import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BASE_SCALE = 1.2; // تصویر کمی بزرگ‌تر از قاب تا پارالکس لبه خالی نشان ندهد
const HOVER_SCALE = 1.3;

export default function useProjectCards(scope, deps = []) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ۱) پارالکس تصویر: روی همهٔ دستگاه‌ها (مبتنی بر اسکرول)
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray("[data-parallax]").forEach((img) => {
          const card = img.closest("[data-tilt]") ?? img;
          gsap.set(img, { scale: BASE_SCALE });
          gsap.fromTo(
            img,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      });

      // ۲) tilt سه‌بعدی و زوم: فقط با موس واقعی (روی موبایل اجرا نمی‌شود)
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const cleanups = gsap.utils.toArray("[data-tilt]").map((card) => {
          const img = card.querySelector("[data-parallax]");
          gsap.set(card, { transformPerspective: 900, transformOrigin: "50% 50%" });

          const rotX = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
          const rotY = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });

          const onEnter = () => {
            if (img) gsap.to(img, { scale: HOVER_SCALE, duration: 0.8, ease: "power2.out", overwrite: "auto" });
          };
          const onMove = (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            rotY(px * 10);
            rotX(-py * 8);
          };
          const onLeave = () => {
            rotX(0);
            rotY(0);
            if (img) gsap.to(img, { scale: BASE_SCALE, duration: 0.8, ease: "power2.out", overwrite: "auto" });
          };

          card.addEventListener("pointerenter", onEnter);
          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          return () => {
            card.removeEventListener("pointerenter", onEnter);
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          };
        });

        return () => cleanups.forEach((cleanup) => cleanup());
      });
    },
    { scope, dependencies: deps, revertOnUpdate: true }
  );
}