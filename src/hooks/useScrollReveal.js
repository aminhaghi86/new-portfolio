import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function useScrollReveal(scope, deps = []) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // اگر کاربر "کاهش حرکت" را در سیستم فعال کرده، انیمیشن اجرا نمی‌شود
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray("[data-reveal]").forEach((section) => {
          const items = section.querySelectorAll("[data-reveal-item]");
          const useBlur = section.dataset.reveal === "blur";

          // ورود: با اسکرول رو به پایین نمایان می‌شود، با اسکرول برعکس برمی‌گردد
          const enter = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              end: "top 35%",
              scrub: 1.2, // نرمی حرکت؛ عدد بزرگ‌تر = نرم‌تر
            },
          });

          enter.fromTo(
            section,
            {
              opacity: 0,
              y: 90,
              scale: 0.94,
              transformOrigin: "50% 0%",
              ...(useBlur && { filter: "blur(12px)" }),
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: "power3.out",
              ...(useBlur && { filter: "blur(0px)" }),
            },
            0
          );

          // کارت‌ها یکی‌یکی (stagger)
          if (items.length) {
            enter.fromTo(
              items,
              { opacity: 0, y: 60, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, ease: "power3.out", stagger: 0.18 },
              0.15
            );
          }

          // خروج: وقتی از بالای صفحه خارج می‌شود کم‌کم محو می‌شود
          gsap.fromTo(
            section,
            { opacity: 1, y: 0, scale: 1 },
            {
              opacity: 0,
              y: -70,
              scale: 0.97,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: section,
                start: "bottom 30%",
                end: "bottom -10%",
                scrub: 1,
              },
            }
          );
        });
      });

      // وقتی ارتفاع صفحه عوض شود (لود تصاویر lazy، باز شدن details، تغییر زبان)
      // موقعیت‌ها دوباره محاسبه می‌شوند
      let timer;
      const ro = new ResizeObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => ScrollTrigger.refresh(), 150);
      });
      ro.observe(scope.current);

      return () => {
        ro.disconnect();
        clearTimeout(timer);
        mm.revert();
      };
    },
    { scope, dependencies: deps, revertOnUpdate: true }
  );
}