interface SEOData {
  title: string;
  description: string;
}

const BASE_TITLE = 'Yunguyo en tu mano';
const BASE_DESCRIPTION =
  'Directorio digital de emprendimientos de Yunguyo, Puno, Perú.';

export const SEO: Record<string, SEOData> = {
  home: {
    title: BASE_TITLE,
    description: BASE_DESCRIPTION,
  },
  explorar: {
    title: `Explorar | ${BASE_TITLE}`,
    description:
      'Explora todos los emprendimientos de Yunguyo. Encuentra negocios locales por categoría.',
  },
  categorias: {
    title: `Categorías | ${BASE_TITLE}`,
    description:
      'Descubre las categorías de emprendimientos disponibles en Yunguyo.',
  },
  nosotros: {
    title: `Nosotros | ${BASE_TITLE}`,
    description:
      'Conoce más sobre Yunguyo en tu mano, el directorio digital de emprendimientos locales.',
  },
};

export function getSEOForCategoria(nombre: string): SEOData {
  return {
    title: `${nombre} | ${BASE_TITLE}`,
    description: `Explora los emprendimientos de ${nombre} en Yunguyo.`,
  };
}

export function getSEOForEmprendimiento(
  nombre: string,
  categoria: string
): SEOData {
  return {
    title: `${nombre} | ${BASE_TITLE}`,
    description: `${nombre} - Emprendimiento de ${categoria} en Yunguyo, Puno, Perú.`,
  };
}
