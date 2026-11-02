import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

import { AppointmentApiError } from '../../../../core/models/appointment-api-error.model';
import { AppointmentListItem } from '../../models/appointment-list-item.model';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentsGridComponent } from '../../components/appointments-grid/appointments-grid.component';

@Component({
  selector: 'app-appointments-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, AppointmentsGridComponent],
  templateUrl: './appointments-list.component.html',
})
export class AppointmentsListComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly destroyRef = inject(DestroyRef);

  appointments: AppointmentListItem[] = [];
  loading = false;
  loadError: AppointmentApiError | null = null;

  ngOnInit(): void {
    this.loadAppointments();
  }

  private loadAppointments(): void {
    this.loading = true;
    this.loadError = null;

    this.appointmentService
      .getAppointments()
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (appointments) => {
          this.appointments = appointments;
        },
        error: (error: AppointmentApiError) => {
          this.loadError = error;
          this.appointments = [];
        },
      });
  }
}
