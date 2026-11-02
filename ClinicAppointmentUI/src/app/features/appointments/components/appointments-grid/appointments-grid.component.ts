import { Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AppointmentListItem } from '../../models/appointment-list-item.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { DisplayValuePipe } from '../../../../shared/pipes/display-value.pipe';

@Component({
  selector: 'app-appointments-grid',
  imports: [
    MatTableModule,
    DisplayValuePipe,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './appointments-grid.component.html',
})
export class AppointmentsGridComponent {
  readonly appointments = input<AppointmentListItem[]>([]);
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly displayedColumns = [
    'appointmentId',
    'patientName',
    'patientBirthDate',
    'contactInfo',
    'gender',
    'doctorName',
    'appointmentDate',
    'startTime',
    'durationMinutes',
  ] as const;
}
