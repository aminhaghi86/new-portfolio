const tones = {
  orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
};

/** A clickable contact method (map, phone, email, Telegram). */
export default function ContactCard({ href, icon: Icon, tone, title, value, valueDir, external }) {
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="group flex items-center gap-3 sm:gap-5 p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
    >
      <div className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl group-hover:scale-110 transition ${tones[tone]}`}>
        <Icon size={26} strokeWidth={2.25} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <p dir={valueDir} className="text-start text-zinc-500 dark:text-zinc-400 break-all">{value}</p>
      </div>
    </a>
  );
}
