import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import myData from "../data.json";

const { linkedin, github } = myData.myPersonalInfo[0];
const baseClass = "flex min-w-0 min-h-14 flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-xl px-2 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500";

const profiles = [
  { name: "Instagram", label: "Instagram @haghiweb", href: "https://www.instagram.com/haghiweb/", icon: FaInstagram, iconSize: 20, className: "bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white" },
  { name: "LinkedIn", label: "LinkedIn", href: linkedin, icon: FaLinkedinIn, iconSize: 19, className: "bg-[#0A66C2] text-white" },
  { name: "GitHub", label: "GitHub", href: github, icon: FaGithub, iconSize: 19, className: "bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900" },
];

export default function SocialLinks() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3" aria-label="Social profiles">
      {profiles.map(({ name, label, href, icon: Icon, iconSize, className }) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`${baseClass} ${className}`}>
          <Icon size={iconSize} aria-hidden="true" />
          <span>{name}</span>
        </a>
      ))}
    </div>
  );
}
