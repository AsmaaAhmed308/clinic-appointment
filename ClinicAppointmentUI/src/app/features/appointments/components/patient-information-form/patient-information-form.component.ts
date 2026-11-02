import { Component, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-patient-information-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './patient-information-form.component.html',
})
export class PatientInformationFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly formValidChange = output<boolean>();

  readonly form = this.formBuilder.group({
    patientName: [
      '',
      [
        Validators.required,
        Validators.maxLength(200),
        nonWhitespaceValidator(),
      ],
    ],
    birthDate: [null as string | null, [Validators.required, notFutureDateValidator()]],
    contactInfo: ['', [Validators.maxLength(200), optionalContactInfoValidator()]],
    gender: ['', Validators.maxLength(20)],
  });

  constructor() {
    this.form.statusChanges
      .pipe(startWith(this.form.status), takeUntilDestroyed())
      .subscribe(() => this.formValidChange.emit(this.form.valid));
  }

  getPatientFields(): {
    patientName: string;
    patientBirthDate: string;
    contactInfo: string | null;
    gender: string | null;
  } | null {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return null;
    }

    const value = this.form.getRawValue();
    if (!value.patientName || !value.birthDate) {
      return null;
    }

    return {
      patientName: value.patientName.trim(),
      patientBirthDate: value.birthDate,
      contactInfo: emptyToNull(value.contactInfo),
      gender: emptyToNull(value.gender),
    };
  }
}

function emptyToNull(value: string | null | undefined): string | null {
  if (value == null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function nonWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (typeof value !== 'string' || value.length === 0) {
      return null;
    }

    return value.trim().length === 0 ? { whitespace: true } : null;
  };
}

function notFutureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || typeof value !== 'string') {
      return null;
    }

    const selected = new Date(`${value}T00:00:00`);
    if (Number.isNaN(selected.getTime())) {
      return { dateFormat: true };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selected > today ? { futureDate: true } : null;
  };
}

function optionalContactInfoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value == null || value === '') {
      return null;
    }

    if (typeof value !== 'string') {
      return { contactFormat: true };
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null;
    }

    const phonePattern = /^[+]?[\d\s()-]{7,20}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return phonePattern.test(trimmed) || emailPattern.test(trimmed)
      ? null
      : { contactFormat: true };
  };
}
