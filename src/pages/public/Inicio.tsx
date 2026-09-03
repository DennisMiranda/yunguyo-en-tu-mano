import Hero from '../../components/Hero';
import ListadoCategorias from '../../components/ListadoCategorias';
import SomosYunguyo from '../../components/SomosYunguyo';
import { useSEO } from '../../hooks/useSEO';
import { SEO } from '../../lib/seo';

export default function Inicio() {
  useSEO(SEO.home);

  return (
    <>
      <Hero />
      <ListadoCategorias />
      <SomosYunguyo />
    </>
  );
}
