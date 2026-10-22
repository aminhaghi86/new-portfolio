import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProjectGallery({ images, title }) {
  const [selected, setSelected] = useState(0);
  const viewportRef = useRef(null);
  const { t } = useTranslation();
  const image = images[selected];

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0, left: 0 });
  }, [selected]);

  return (
    <div className="case-gallery">
      <figure>
        <div ref={viewportRef} className="gallery-viewport" role="region" aria-label={t('projectImagePreview', { title: t(image.captionKey) })} tabIndex={0}>
          <img key={image.src} className="project-detail-image" src={image.src} alt={`${title} — ${t(image.captionKey)}`} width={image.width} height={image.height} style={{ maxWidth: image.width }} decoding="async" />
        </div>
        <figcaption aria-live="polite"><span>{t(image.captionKey)}</span><a href={image.src} target="_blank" rel="noopener noreferrer" aria-label={t('openFullImage', { title: t(image.captionKey) })}>{t('viewFullImage')}<ExternalLink size={13} aria-hidden="true" /></a></figcaption>
      </figure>
      <p className="gallery-hint">{t('galleryScrollHint')}</p>
      <div className="gallery-thumbnails" role="group" aria-label={t('projectGallery')}>
        {images.map((item, index) => <button key={item.src} type="button" className="gallery-thumbnail" aria-pressed={selected === index} aria-label={t(item.captionKey)} onClick={() => setSelected(index)}>
          <img src={item.src} alt="" width="160" height="90" loading="lazy" decoding="async" />
          <span>{t(item.captionKey)}</span>
        </button>)}
      </div>
    </div>
  );
}
