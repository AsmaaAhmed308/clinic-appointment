import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import { mapApiError } from '../../../core/http/map-api-error';
import { AppointmentCreated } from '../models/appointment-created.model';
import { AppointmentListItem } from '../models/appointment-list-item.model';
import { AvailableSlot } from '../models/available-slot.model';
import { CreateAppointmentRequest } from '../models/create-appointment-request.model';
import { DoctorOption } from '../models/doctor-option.model';
import { DoctorResponse } from '../models/doctor-response.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private readonly http: HttpClient) {}

  getAppointments(): Observable<AppointmentListItem[]> {
    return this.http
      .get<AppointmentListItem[]>('Appointments')
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  getDoctors(): Observable<DoctorOption[]> {
    return this.http.get<DoctorResponse[]>('Doctors').pipe(
      map((doctors) =>
        doctors.map((doctor) => ({
          id: doctor.doctorId,
          name: doctor.name,
        })),
      ),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  getAvailableSlots(
    doctorId: number,
    appointmentDate: string,
  ): Observable<AvailableSlot[]> {
    const params = new HttpParams()
      .set('doctorId', doctorId)
      .set('appointmentDate', appointmentDate);

    return this.http
      .get<AvailableSlot[]>('Appointments/available-slots', { params })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  createAppointment(
    request: CreateAppointmentRequest,
  ): Observable<AppointmentCreated> {
    return this.http
      .post<AppointmentCreated>('Appointments', request)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => mapApiError(error));
  }
}
