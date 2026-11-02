import { Component, DestroyRef, OnInit, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  Subject,
  catchError,
  combineLatest,
  finalize,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';

import { AppointmentService } from '../../services/appointment.service';
import { DoctorOption } from '../../models/doctor-option.model';
import { AvailableSlotsComponent } from '../available-slots/available-slots.component';

@Component({
  selector: 'app-appointment-information-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AvailableSlotsComponent,
  ],
  templateUrl: './appointment-information-form.component.html',
})
export class AppointmentInformationFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly appointmentService = inject(AppointmentService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly slotsRefresh$ = new Subject<void>();

  readonly selectedSlotChange = output<string | null>();
  readonly formValidChange = output<boolean>();
  readonly visitDurationMinutes = 30;

  doctors: DoctorOption[] = [];
  doctorsLoading = false;
  doctorsError: string | null = null;

  slots: string[] = [];
  slotsLoading = false;
  slotsError: string | null = null;

  readonly form = this.formBuilder.group({
    doctorId: [null as number | null, Validators.required],
    appointmentDate: [null as string | null, Validators.required],
  });

  constructor() {
    this.form.statusChanges
      .pipe(startWith(this.form.status), takeUntilDestroyed())
      .subscribe(() => this.formValidChange.emit(this.form.valid));

    combineLatest([
      this.form.controls.doctorId.valueChanges.pipe(
        startWith(this.form.controls.doctorId.value),
      ),
      this.form.controls.appointmentDate.valueChanges.pipe(
        startWith(this.form.controls.appointmentDate.value),
      ),
      this.slotsRefresh$.pipe(startWith(undefined)),
    ])
      .pipe(
        takeUntilDestroyed(),
        switchMap(([doctorId, appointmentDate]) => {
          this.clearSlotSelection();
          this.slots = [];
          this.slotsError = null;

          if (doctorId == null || !appointmentDate) {
            this.slotsLoading = false;
            return of<string[]>([]);
          }

          this.slotsLoading = true;

          return this.appointmentService.getAvailableSlots(doctorId, appointmentDate).pipe(
            map((availableSlots) =>
              availableSlots.map((slot) => slot.startTime),
            ),
            catchError(() => {
              this.slotsError = 'Available time slots could not be loaded.';
              return of<string[]>([]);
            }),
            finalize(() => {
              this.slotsLoading = false;
            }),
          );
        }),
      )
      .subscribe((slots) => {
        this.slots = slots;
      });
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  getAppointmentFields(): {
    doctorId: number;
    appointmentDate: string;
  } | null {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return null;
    }

    const value = this.form.getRawValue();
    if (value.doctorId == null || !value.appointmentDate) {
      return null;
    }

    return {
      doctorId: value.doctorId,
      appointmentDate: value.appointmentDate,
    };
  }

  reloadAvailableSlots(): void {
    this.slotsRefresh$.next();
  }

  private loadDoctors(): void {
    this.doctorsLoading = true;
    this.doctorsError = null;

    this.appointmentService
      .getDoctors()
      .pipe(
        finalize(() => {
          this.doctorsLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (doctors) => {
          this.doctors = doctors;
        },
        error: () => {
          this.doctors = [];
          this.doctorsError = 'Doctors could not be loaded.';
        },
      });
  }

  private clearSlotSelection(): void {
    this.selectedSlotChange.emit(null);
  }
}
