import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CursoService } from '../../services/curso.service';

@Component({
  selector: "app-curso-form",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./curso-form.html",
  styleUrl: "./curso-form.css",
})
export class CursoForm implements OnInit {
  private fb = inject(FormBuilder);
  private cursoService = inject(CursoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  idCurso: string | number | null = null;

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      // json-server v1 puede generar IDs numéricos o alfanuméricos.
      this.idCurso = idParam;
      this.cursoService.obtenerPorId(this.idCurso).subscribe((curso) => {
        this.form.patchValue(curso);
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    const valor = this.form.getRawValue();

    const peticion = this.idCurso
      ? this.cursoService.actualizar(this.idCurso, valor)
      : this.cursoService.crear(valor);

    peticion.subscribe(() => this.router.navigate(['/cursos']));
  }
}
