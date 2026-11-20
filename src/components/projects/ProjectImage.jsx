export default function ProjectImage({ project }) {
  return (
    <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
      <img src={project.image} alt={project.title} loading="lazy" decoding="async" className="block w-full h-full object-contain" />
    </div>
  );
}
