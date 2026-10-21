import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// انیمیشن ورود زمان‌محور Hero (یک‌بار هنگام لود، مستقل از اسکرول)
// نکته: روی تصویر اصلی (LCP) opacity نمی‌گذاریم، فقط جابه‌جایی و scale
export default function useHeroIntro(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(scope.current);

        const tl = gsap.timeline({
          delay: 0.15,
          defaults: { ease: "power4.out", clearProps: "opacity,transform" },
        });

        tl
          // ستون متن
          .from(q(".section-eyebrow"), { y: 24, opacity: 0, duration: 0.7 })
          .fromTo(
            q(".hero-copy h1"),
            { y: 70, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
            {
              y: 0,
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              clearProps: "opacity,transform,clipPath",
            },
            "-=0.45"
          )
          .from(q(".hero-description"), { y: 30, opacity: 0, duration: 0.8 }, "-=0.7")
          .from(q(".hero-actions > *"), { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.6")
          .from(q(".hero-promises li"), { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.5")

          // ستون نمایشی (همزمان با عنوان شروع می‌شود)
          .from(q(".showcase-person"), { y: 30, opacity: 0, duration: 0.8 }, 0.3)
          .from(
            q(".showcase-browser"),
            { y: 90, scale: 0.93, duration: 1.4, ease: "expo.out", clearProps: "transform" },
            0.35
          )
          .from(q(".showcase-workflow"), { y: 30, opacity: 0, duration: 0.8 }, 0.9)
          .from(q(".showcase-workflow li"), { y: 14, opacity: 0, duration: 0.5, stagger: 0.1 }, 1.0);
      });
      return () => mm.revert();
    },

    { scope }
  );
}