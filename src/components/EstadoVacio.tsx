import { Inbox } from 'lucide-react';

interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
}

export function EstadoVacio({ titulo, descripcion }: EstadoVacioProps) {
  return (
    <div className="text-center py-12">
      <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{titulo}</h3>
      {descripcion && <p className="text-gray-600">{descripcion}</p>}
    </div>
  );
}
