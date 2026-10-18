import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useLenis() {
    useEffect(() => {
        // کاربرانی که «کاهش حرکت» را روشن کرده‌اند، اسکرول معمولی مرورگر را می‌بینند
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const lenis = new Lenis({
            //   duration: 1.15, // عدد بزرگ‌تر = اسکرول کشدارتر
            //   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            lerp: 0.12, // 0.08 = نرم‌تر و سنگین‌تر، 0.15 = سریع‌تر و سبک‌تر
            smoothWheel: true,
            // داخل مودال‌ها (پروژه/حریم خصوصی)، textarea و select اسکرول عادی کار کند
            allowNestedScroll: true,
            prevent: (node) => !!node.closest?.("dialog[open]"),
        });

        // ۱) هر بار Lenis اسکرول کرد، ScrollTrigger هم خبردار شود
        lenis.on("scroll", ScrollTrigger.update);

        // ۲) Lenis روی تیکر GSAP سوار شود تا هر دو با یک ساعت کار کنند
        const tick = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // ۳) لینک‌های #anchor (ناوبری، دکمه‌های Hero و ...) با اسکرول نرم
        const onClick = (event) => {
            if (event.defaultPrevented || event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const link = event.target.closest?.('a[href^="#"]');
            if (!link) return;
            const hash = link.getAttribute("href");
            if (!hash || hash === "#") return;

            let target ;
            try { target = document.querySelector(hash); } catch { return; }
            if (!target) return;

            event.preventDefault();

            // اگر بخش هنوز در حالت اولیهٔ افکت ورود است (y: 90)، موقعیت واقعی را با کم کردن همان جابه‌جایی حساب می‌کنیم
            const reveal = target.closest("[data-reveal]");
            const shift = reveal ? Number(gsap.getProperty(reveal, "y")) || 0 : 0;
            // همان scroll-margin که با کلاس‌های scroll-mt-* تعریف کرده‌اید
            const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
            const top = target.getBoundingClientRect().top + window.scrollY - shift - margin;

            lenis.scrollTo(top, { duration: 1.4 });
            history.replaceState(null, "", hash);
            // برای کاربران کیبورد (skip link)
            if (target.hasAttribute("tabindex")) target.focus({ preventScroll: true });
        };
        document.addEventListener("click", onClick);

        return () => {
            document.removeEventListener("click", onClick);
            gsap.ticker.remove(tick);
            gsap.ticker.lagSmoothing(500, 33); // مقدار پیش‌فرض GSAP
            lenis.destroy();
        };
    }, []);
}