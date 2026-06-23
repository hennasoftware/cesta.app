import { useEffect } from 'react';
import { defaultSeo } from '../config/brand';

type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function removeMeta(selector: string) {
  document.head.querySelector(selector)?.remove();
}

function toAbsoluteUrl(value: string) {
  return new URL(value, window.location.origin).toString();
}

export function Seo({ title = defaultSeo.title, description = defaultSeo.description, image, url }: SeoProps) {
  useEffect(() => {
    document.title = title;
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });

    if (url) {
      upsertMeta('meta[property="og:url"]', { property: 'og:url', content: toAbsoluteUrl(url) });
    } else {
      removeMeta('meta[property="og:url"]');
    }
    if (image) {
      const absoluteImage = toAbsoluteUrl(image);
      upsertMeta('meta[property="og:image"]', { property: 'og:image', content: absoluteImage });
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absoluteImage });
    } else {
      removeMeta('meta[property="og:image"]');
      removeMeta('meta[name="twitter:image"]');
    }
  }, [description, image, title, url]);

  return null;
}
