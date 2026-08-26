import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Curso } from '../models/curso.model';
import { API_URL } from '../core/constants';
import { tap } from 'rxjs';

/**
 * Servicio de solo lectura: ilustra que una misma vista puede combinar
 * datos de más de un endpoint (aquí, /tareas y /cursos).
 */
@Injectable({ providedIn: 'root' })
export class CursoService {
  private http = inject(HttpClient);
  private readonly endpoint = `${API_URL}/cursos`;

  readonly cursos = signal<Curso[]>([]);

  /** GET /cursos */
  cargarCursos(): void {
    this.http.get<Curso[]>(this.endpoint).subscribe((data) => this.cursos.set(data));
  }

  /** GET /cursos/:id */
  obtenerPorId(id: string | number) {
    return this.http.get<Curso>(`${this.endpoint}/${id}`);
  }

  /** POST /cursos */
  crear(curso: Omit<Curso, 'id'>) {
    return this.http.post<Curso>(this.endpoint, curso).pipe(tap(() => this.cargarCursos()));
  }

  /** PUT /cursos/:id */
  actualizar(id: string | number, curso: Omit<Curso, 'id'>) {
    return this.http.put<Curso>(`${this.endpoint}/${id}`, curso).pipe(tap(() => this.cargarCursos()));
  }

  /** DELETE /cursos/:id */
  eliminar(id: string | number) {
    return this.http.delete<void>(`${this.endpoint}/${id}`).pipe(tap(() => this.cargarCursos()));
  }
}
