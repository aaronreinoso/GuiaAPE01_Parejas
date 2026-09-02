import { Component, OnInit, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TareaService } from "../../services/tarea.service";
import { EstadoTarea } from "../../models/tarea.model";
import { CursoService } from "../../services/curso.service";

@Component({
  selector: "app-tarea-list",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./tarea-list.component.html",
  styleUrl: "./tarea-list.component.css",
})
export class TareaListComponent implements OnInit {
  private tareaService = inject(TareaService);
  private cursoService = inject(CursoService);

  // El servicio expone el estado como signal; el componente solo lo lee.
  readonly tareas = this.tareaService.tareas;
  readonly cursos = this.cursoService.cursos;
  readonly error = this.tareaService.error;

  readonly filtro = signal<EstadoTarea | "todas">("todas");

  // computed(): se recalcula automáticamente cada vez que cambian
  // `tareas` o `filtro`, sin necesidad de suscripciones manuales.
  readonly tareasFiltradas = computed(() => {
    const filtroActual = this.filtro();
    const listaActual = this.tareas();
    return filtroActual === "todas"
      ? listaActual
      : listaActual.filter((t) => t.estado === filtroActual);
  });

  constructor() {
    console.log("TareaList: constructor");
  }

  ngOnInit(): void {
    console.log("TareaList: ngOnInit");
    this.tareaService.cargarTareas();
    this.cursoService.cargarCursos();
  }

  obtenerNombreCurso(cursoId: number | string | null | undefined): string {
    if (!cursoId) return "Curso no asignado";
    const cursoEncontrado = this.cursos().find((c) => c.id == cursoId);
    return cursoEncontrado ? cursoEncontrado.nombre : "Curso no asignado";
  }

  cambiarFiltro(valor: EstadoTarea | "todas"): void {
    this.filtro.set(valor);
  }

  eliminar(id: string | number | undefined): void {
    if (id === undefined) return;
    if (confirm("¿Eliminar esta tarea?")) {
      this.tareaService.eliminarTarea(id).subscribe();
    }
  }
}
