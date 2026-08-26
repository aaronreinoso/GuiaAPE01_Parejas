import { Routes } from '@angular/router';
import { TareaListComponent } from './components/tarea-list/tarea-list.component';
import { TareaFormComponent } from './components/tarea-form/tarea-form.component';
import { CursoList } from './components/curso-list/curso-list';
import { CursoForm } from './components/curso-form/curso-form';

// El Router es lo que hace posible el comportamiento "SPA": cambiar de
// vista actualizando solo una parte del DOM, sin recargar el navegador.
export const routes: Routes = [
  { path: '', component: TareaListComponent },
  { path: 'tareas/nueva', component: TareaFormComponent },
  { path: 'tareas/:id/editar', component: TareaFormComponent },
  { path: 'cursos', component: CursoList },
  { path: 'cursos/nuevo', component: CursoForm },
  { path: 'cursos/:id/editar', component: CursoForm },
  { path: '**', redirectTo: '' },
];
