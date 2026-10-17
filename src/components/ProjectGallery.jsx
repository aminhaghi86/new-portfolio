import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProjectGallery({ images, title }) {
  const [selected, setSelected] = useState(0);
  const { t } = useTranslation();
  const image = images[selected];
  return (
    <div className="case-gallery">
      <figure>
        <a href={image.src} target="_blank" rel="noopener noreferrer" aria-label={t('openFullImage', { title: t(image.captionKey) })}>
          <img className="project-detail-image" src={image.src} alt={`${title} — ${t(image.captionKey)}`} width={image.width} height={image.height} />
        </a>
        <figcaption><span>{t(image.captionKey)}</span><a href={image.src} target="_blank" rel="noopener noreferrer">{t('viewFullImage')}<ExternalLink size={13} aria-hidden="true" /></a></figcaption>
      </figure>
      <div className="gallery-thumbnails" role="group" aria-label={t('projectGallery')}>
        {images.map((item, index) => <button key={item.src} type="button" className="gallery-thumbnail" aria-pressed={selected === index} aria-label={t(item.captionKey)} onClick={() => setSelected(index)}>
          <img src={item.src} alt="" width="160" height="90" loading="lazy" />
          <span>{t(item.captionKey)}</span>
        </button>)}
      </div>
    </div>
  );
}
