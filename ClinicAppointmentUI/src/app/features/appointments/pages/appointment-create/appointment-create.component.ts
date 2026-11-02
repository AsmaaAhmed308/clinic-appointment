import { Component, DestroyRef, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { finalize } from 'rxjs';

import { AppointmentApiError } from '../../../../core/models/appointment-api-error.model';
import { AppointmentInformationFormComponent } from '../../components/appointment-information-form/appointment-information-form.component';
import { PatientInformationFormComponent } from '../../components/patient-information-form/patient-information-form.component';
import { CreateAppointmentRequest } from '../../models/create-appointment-request.model';
import { AppointmentService } from '../../services/appointment.service';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-appointment-create',
  imports: [
    RouterLink,
    MatButtonModule,
    PatientInformationFormComponent,
    AppointmentInformationFormComponent,
    ErrorStateComponent,
  ],
  templateUrl: './appointment-create.component.html',
  styleUrl: './appointment-create.component.scss',
})
export class AppointmentCreateComponent {
  private readonly appointmentService = inject(AppointmentService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly patientForm = viewChild.required(PatientInformationFormComponent);
  private readonly appointmentForm = viewChild.required(
    AppointmentInformationFormComponent,
  );

  readonly selectedSlot = signal<string | null>(null);
  readonly patientFormValid = signal(false);
  readonly appointmentFormValid = signal(false);
  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);

  readonly canConfirm = computed(
    () =>
      this.patientFormValid() &&
      this.appointmentFormValid() &&
      this.selectedSlot() !== null &&
      !this.saving(),
  );

  onSlotSelected(slot: string | null): void {
    this.selectedSlot.set(slot);
  }

  onPatientFormValidChange(isValid: boolean): void {
    this.patientFormValid.set(isValid);
  }

  onAppointmentFormValidChange(isValid: boolean): void {
    this.appointmentFormValid.set(isValid);
  }

  confirmAppointment(): void {
    if (!this.canConfirm()) {
      return;
    }

    const patientFields = this.patientForm().getPatientFields();
    const appointmentFields = this.appointmentForm().getAppointmentFields();
    const startTime = this.selectedSlot();

    if (!patientFields || !appointmentFields || startTime == null) {
      return;
    }

    const request: CreateAppointmentRequest = {
      doctorId: appointmentFields.doctorId,
      patientName: patientFields.patientName,
      patientBirthDate: patientFields.patientBirthDate,
      contactInfo: patientFields.contactInfo,
      gender: patientFields.gender,
      appointmentDate: appointmentFields.appointmentDate,
      startTime,
    };

    this.saving.set(true);
    this.saveError.set(null);

    this.appointmentService
      .createAppointment(request)
      .pipe(
        finalize(() => {
          this.saving.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          void this.router.navigate(['/appointments']);
        },
        error: (error: AppointmentApiError) => {
          this.saveError.set(error.message);

          if (error.kind === 'booking-conflict') {
            this.selectedSlot.set(null);
            this.appointmentForm().reloadAvailableSlots();
          }
        },
      });
  }
}
