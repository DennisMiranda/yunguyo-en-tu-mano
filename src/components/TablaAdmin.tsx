import type { ReactNode } from 'react';

export interface ColumnaTabla {
  nombre: string;
  align?: 'left' | 'right';
}

interface TablaAdminProps {
  columnas: ColumnaTabla[];
  children: ReactNode;
}

export default function TablaAdmin({ columnas, children }: TablaAdminProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              {columnas.map((col) => (
                <th
                  key={col.nombre}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.nombre}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
