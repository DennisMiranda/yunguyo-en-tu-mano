export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categorias: {
        Row: {
          id: number;
          nombre: string;
          descripcion: string | null;
          imagen: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          nombre: string;
          descripcion?: string | null;
          imagen?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          nombre?: string;
          descripcion?: string | null;
          imagen?: string | null;
          created_at?: string;
        };
      };
      emprendimientos: {
        Row: {
          id: number;
          nombre: string;
          categoria_id: number;
          descripcion: string | null;
          imagen_principal: string | null;
          galeria: string[];
          whatsapp: string | null;
          google_maps: string | null;
          horario: Json | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          nombre: string;
          categoria_id: number;
          descripcion?: string | null;
          imagen_principal?: string | null;
          galeria?: string[];
          whatsapp?: string | null;
          google_maps?: string | null;
          horario?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          nombre?: string;
          categoria_id?: number;
          descripcion?: string | null;
          imagen_principal?: string | null;
          galeria?: string[];
          whatsapp?: string | null;
          google_maps?: string | null;
          horario?: Json | null;
          created_at?: string;
        };
      };
    };
  };
}
