import Hero from '../../components/Hero';
import Buscador from '../../components/Buscador';
import ListadoCategorias from '../../components/ListadoCategorias';
import SomosYunguyo from '../../components/SomosYunguyo';
import FormularioEmprendimiento from '../../components/FormularioEmprendimiento';
import { useSEO } from '../../hooks/useSEO';
import { SEO } from '../../lib/seo';

export default function Inicio() {
  useSEO(SEO.home);

  return (
    <>
      <Hero />
      <Buscador />
      <ListadoCategorias />
      <SomosYunguyo />
      <FormularioEmprendimiento />
    </>
  );
}
