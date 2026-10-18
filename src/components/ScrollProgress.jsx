import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ScrollProgress() {
  const barRef = useRef(null);
  const { i18n } = useTranslation();
  const isRtl = i18n.resolvedLanguage === "fa";

  useGSAP(() => {
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );
  }, { scope: barRef });

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        ref={barRef}
        className={`h-full w-full ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-blue-500 via-cyan-400 to-emerald-400`}
        // در فارسی نوار از راست پر می‌شود
        style={{ transformOrigin: isRtl ? "100% 50%" : "0% 50%" }}
      />
    </div>
  );
}