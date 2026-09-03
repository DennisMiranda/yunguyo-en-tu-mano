import { useEffect } from 'react';

interface SEOData {
  title: string;
  description: string;
}

export function useSEO(data: SEOData) {
  useEffect(() => {
    document.title = data.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', data.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = data.description;
      document.head.appendChild(meta);
    }
  }, [data.title, data.description]);
}
