import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TareaService } from '../../services/tarea.service';
import { CursoService } from '../../services/curso.service';
import { EstadoTarea } from '../../models/tarea.model';

@Component({
  selector: 'app-tarea-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './tarea-form.component.html',
  styleUrl: './tarea-form.component.css',
})
export class TareaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tareaService = inject(TareaService);
  private cursoService = inject(CursoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly cursos = this.cursoService.cursos;

  // null => estamos creando una tarea nueva; un ID => estamos editando.
  idTarea: string | number | null = null;

  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    descripcion: [''],
    fechaEntrega: ['', Validators.required],
    // Se tipa explícitamente como EstadoTarea; si no, TypeScript infiere
    // el literal 'pendiente' como único valor posible del control.
    estado: this.fb.nonNullable.control<EstadoTarea>('pendiente', Validators.required),
    cursoId: [null as string | number | null],
  });

  ngOnInit(): void {
    this.cursoService.cargarCursos();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idTarea = idParam;
      // Modo edición: GET /tareas/:id y precargamos el formulario.
      this.tareaService.obtenerPorId(this.idTarea).subscribe((tarea) => {
        this.form.patchValue(tarea);
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;
    const valor = this.form.getRawValue();

    const peticion = this.idTarea
      ? this.tareaService.actualizar(this.idTarea, valor) // PUT
      : this.tareaService.crear(valor); // POST

    peticion.subscribe(() => this.router.navigate(['/']));
  }
}
