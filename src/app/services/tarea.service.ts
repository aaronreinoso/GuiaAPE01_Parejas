import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Tarea } from '../models/tarea.model';
import { API_URL } from '../core/constants';

/**
 * Capa de comunicación con la API REST de tareas.
 * Cada método corresponde a un verbo HTTP distinto sobre el mismo
 * recurso (/tareas), tal como se explicó en la sección de APIs y
 * servicios web: GET (leer), POST (crear), PUT (reemplazar), DELETE (borrar).
 */
@Injectable({ providedIn: 'root' })
export class TareaService {
  private http = inject(HttpClient);
  private readonly endpoint = `${API_URL}/tareas`;

  // Estado reactivo compartido por toda la aplicación.
  // Los componentes solo LEEN este signal; el servicio es el único
  // responsable de actualizarlo tras cada operación contra la API.
  readonly tareas = signal<Tarea[]>([]);

  /** GET /tareas — carga (o recarga) la lista completa de tareas. */
  cargarTareas(): void {
    this.http.get<Tarea[]>(this.endpoint).subscribe((data) => this.tareas.set(data));
  }

  /** GET /tareas/:id — obtiene una tarea puntual (para el formulario de edición). */
  obtenerPorId(id: string | number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.endpoint}/${id}`);
  }

  /** POST /tareas — crea una nueva tarea y refresca la lista. */
  crear(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.endpoint, tarea).pipe(tap(() => this.cargarTareas()));
  }

  /** PUT /tareas/:id — reemplaza una tarea existente y refresca la lista. */
  actualizar(id: string | number, tarea: Tarea): Observable<Tarea> {
    return this.http
      .put<Tarea>(`${this.endpoint}/${id}`, tarea)
      .pipe(tap(() => this.cargarTareas()));
  }

  /** DELETE /tareas/:id — elimina una tarea y refresca la lista. */
  eliminar(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`).pipe(tap(() => this.cargarTareas()));
  }
}
