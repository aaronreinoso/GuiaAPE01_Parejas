import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, catchError, throwError } from "rxjs";
import { Tarea } from "../models/tarea.model";
import { API_URL } from "../core/constants";

/**
 * Capa de comunicación con la API REST de tareas.
 * Cada método corresponde a un verbo HTTP distinto sobre el mismo
 * recurso (/tareas), tal como se explicó en la sección de APIs y
 * servicios web: GET (leer), POST (crear), PUT (reemplazar), DELETE (borrar).
 */
@Injectable({ providedIn: "root" })
export class TareaService {
  private http = inject(HttpClient);
  private readonly endpoint = `${API_URL}/tareas`;

  // Estado reactivo compartido por toda la aplicación.
  // Los componentes solo LEEN este signal; el servicio es el único
  // responsable de actualizarlo tras cada operación contra la API.
  readonly tareas = signal<Tarea[]>([]);
  readonly error = signal<string | null>(null);

  /** GET /tareas — carga (o recarga) la lista completa de tareas. */
  cargarTareas(): void {
    this.http
      .get<Tarea[]>(this.endpoint)
      .pipe(
        catchError((err) => {
          console.error("Error al conectar con el backend:", err);
          this.error.set(
            "No se pudo conectar con el servidor.",
          );
          return throwError(() => err);
        }),
        tap(() => this.error.set(null)),
      )
      .subscribe({
        next: (data: Tarea[]) => this.tareas.set(data),
        error: () => {},
      });
  }

  /** GET /tareas/:id — obtiene una tarea puntual (para el formulario de edición). */
  obtenerPorId(id: string | number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.endpoint}/${id}`).pipe(
      catchError((err) => {
        this.error.set("Error al obtener la tarea. Verifique la conexión.");
        return throwError(() => err);
      }),
    );
  }
  /** POST /tareas — crea una nueva tarea y refresca la lista. */
  crear(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.endpoint, tarea).pipe(
      tap(() => this.cargarTareas()),
      catchError((err) => {
        this.error.set("Error al crear la tarea. Verifique la conexión.");
        return throwError(() => err);
      }),
    );
  }

  /** PUT /tareas/:id — reemplaza una tarea existente y refresca la lista. */
  actualizar(id: string | number, tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.endpoint}/${id}`, tarea).pipe(
      tap(() => this.cargarTareas()),
      catchError((err) => {
        this.error.set("Error al actualizar la tarea. Verifique la conexión.");
        return throwError(() => err);
      }),
    );
  }

  /** DELETE /tareas/:id — elimina una tarea y refresca la lista. */
  eliminarTarea(id: string | number): Observable<any> {
    return this.http.delete(`${this.endpoint}/${id}`).pipe(
      tap(() => this.cargarTareas()),
      catchError((err) => {
        this.error.set("Error al eliminar la tarea. Verifique la conexión.");
        return throwError(() => err);
      }),
    );
  }
}
