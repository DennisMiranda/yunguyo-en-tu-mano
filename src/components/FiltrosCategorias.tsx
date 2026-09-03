interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

interface Props {
  categorias: Categoria[];
  categoriaSeleccionada: string | null;
  onSeleccionar: (id: string | null) => void;
}

export default function FiltrosCategorias({
  categorias,
  categoriaSeleccionada,
  onSeleccionar,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSeleccionar(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          categoriaSeleccionada === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Todas
      </button>
      {categorias.map((categoria) => (
        <button
          key={categoria.id}
          type="button"
          onClick={() => onSeleccionar(categoria.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            categoriaSeleccionada === categoria.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {categoria.nombre}
        </button>
      ))}
    </div>
  );
}
