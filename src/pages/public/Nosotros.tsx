import { useSEO } from '../../hooks/useSEO';
import { SEO } from '../../lib/seo';

export default function Nosotros() {
  useSEO(SEO.nosotros);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Nosotros</h1>
    </div>
  );
}
