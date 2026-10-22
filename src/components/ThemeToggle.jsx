import { Moon, Sun, SunMoon } from "lucide-react";

const options = [
  { value: "auto", Icon: SunMoon, fa: "خودکار", en: "Auto" },
  { value: "light", Icon: Sun, fa: "روشن", en: "Light" },
  { value: "dark", Icon: Moon, fa: "تیره", en: "Dark" },
];

export default function ThemeToggle({ mode, onChange, language }) {
  const isFa = language === "fa";

  return (
    <div
      role="group"
      aria-label={isFa ? "انتخاب تم" : "Choose theme"}
      className="inline-flex items-center gap-1 rounded-2xl bg-zinc-100 p-1 dark:bg-white/10"
    >
      {options.map(({ value, Icon, fa, en }) => {
        const label = isFa ? fa : en;
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={active}
            aria-label={label}
            title={label}
            className={`rounded-xl p-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              active
                ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-700 dark:text-blue-300"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Icon size={18} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}