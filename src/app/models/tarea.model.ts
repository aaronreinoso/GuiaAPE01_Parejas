export type EstadoTarea = 'pendiente' | 'en_progreso' | 'completada';

/**
 * Forma de los datos que viajan como JSON entre el frontend (Angular)
 * y el backend (json-server sirviendo db.json).
 */
export interface Tarea {
  id?: string | number;
  titulo: string;
  descripcion: string;
  fechaEntrega: string; // formato ISO: yyyy-mm-dd
  estado: EstadoTarea;
  cursoId?: string | number | null;
}
