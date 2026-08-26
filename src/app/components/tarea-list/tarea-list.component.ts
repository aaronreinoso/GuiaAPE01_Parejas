import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TareaService } from '../../services/tarea.service';
import { EstadoTarea } from '../../models/tarea.model';

@Component({
  selector: 'app-tarea-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tarea-list.component.html',
  styleUrl: './tarea-list.component.css',
})
export class TareaListComponent implements OnInit {
  private tareaService = inject(TareaService);

  // El servicio expone el estado como signal; el componente solo lo lee.
  readonly tareas = this.tareaService.tareas;

  readonly filtro = signal<EstadoTarea | 'todas'>('todas');

  // computed(): se recalcula automáticamente cada vez que cambian
  // `tareas` o `filtro`, sin necesidad de suscripciones manuales.
  readonly tareasFiltradas = computed(() => {
    const filtroActual = this.filtro();
    const listaActual = this.tareas();
    return filtroActual === 'todas'
      ? listaActual
      : listaActual.filter((t) => t.estado === filtroActual);
  });

  ngOnInit(): void {
    this.tareaService.cargarTareas();
  }

  cambiarFiltro(valor: EstadoTarea | 'todas'): void {
    this.filtro.set(valor);
  }

  eliminar(id: string | number | undefined): void {
    if (id === undefined) return;
    if (confirm('¿Eliminar esta tarea?')) {
      this.tareaService.eliminar(id).subscribe();
    }
  }
}
