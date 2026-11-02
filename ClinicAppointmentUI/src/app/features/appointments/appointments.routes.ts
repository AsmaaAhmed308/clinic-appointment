import { Routes } from '@angular/router';
import { AppointmentCreateComponent } from './pages/appointment-create/appointment-create.component';
import { AppointmentsListComponent } from './pages/appointments-list/appointments-list.component';
import { AppointmentService } from './services/appointment.service';

export const appointmentRoutes: Routes = [
  {
    path: '',
    component: AppointmentsListComponent,
    providers: [AppointmentService],
  },
  {
    path: 'new',
    component: AppointmentCreateComponent,
    providers: [AppointmentService],
  },
];
