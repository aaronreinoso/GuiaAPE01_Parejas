import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CursoService } from '../../services/curso.service';

@Component({
  selector: "app-curso-list",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./curso-list.html",
  styleUrl: "./curso-list.css",
})
export class CursoList implements OnInit {
  private cursoService = inject(CursoService);

  readonly cursos = this.cursoService.cursos;

  ngOnInit(): void {
    this.cursoService.cargarCursos();
  }

  eliminar(id: string | number | undefined): void {
    if (id === undefined) return;

    if (confirm('¿Eliminar este curso?')) {
      this.cursoService.eliminar(id).subscribe();
    }
  }
}
