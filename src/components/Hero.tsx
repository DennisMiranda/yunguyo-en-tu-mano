import heroImg from '../assets/hero.jpeg';

export default function Hero() {
  return (
    <section 
      className="relative min-h-[60vh] md:min-h-[70vh] flex items-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-black/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-full md:w-1/2 lg:w-1/2 text-center md:text-left">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl md:font-extrabold mb-4 md:mb-6" style={{ color: 'var(--hero-yellow)', textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)' }}>
            Yunguyo tiene mucho por descubrir
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white font-bold drop-shadow-md mb-4">
            Conoce los emprendimientos, productos y servicios que dan vida a nuestra comunidad.
          </p>
          <p className="text-lg md:text-xl lg:text-2xl text-white italic drop-shadow-md">
            ¡Comienza tu nueva historia!
          </p>
        </div>
      </div>
    </section>
  );
}
