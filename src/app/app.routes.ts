import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

import { MainLayout } from './layout/main-layout/main-layout';

import { EstudianteList } from './features/estudiantes/estudiante-list/estudiante-list';
import { EstudianteForm } from './features/estudiantes/estudiante-form/estudiante-form';

import { CursoForm } from './features/cursos/curso-form/curso-form';

import { AsignacionForm } from './features/asignaciones/asignacion-form/asignacion-form';
import { EstudianteCursos } from './features/asignaciones/estudiante-cursos/estudiante-cursos';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: '',
    component: MainLayout,
    canActivate: [
      authGuard
    ],

    children: [

      {
        path: 'estudiantes',
        component: EstudianteList
      },

      {
        path: 'estudiantes/nuevo',
        component: EstudianteForm
      },

      {
        path: 'estudiantes/editar/:id',
        component: EstudianteForm
      },

      {
        path: 'cursos',
        redirectTo: 'cursos/nuevo',
        pathMatch: 'full'
      },

      {
        path: 'cursos/nuevo',
        component: CursoForm
      },

      {
        path: 'asignaciones',
        component: AsignacionForm
      },

      {
        path: 'estudiante-cursos',
        component: EstudianteCursos
      },

      {
        path: '',
        redirectTo: 'estudiantes',
        pathMatch: 'full'
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];