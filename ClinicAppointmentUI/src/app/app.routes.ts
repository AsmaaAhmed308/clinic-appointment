import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'appointments' },
  {
    path: 'appointments',
    loadChildren: () =>
      import('./features/appointments/appointments.routes').then((m) => m.appointmentRoutes),
  },
  { path: '**', redirectTo: 'appointments' },
];
