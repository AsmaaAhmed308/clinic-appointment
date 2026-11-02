export type AppointmentApiErrorKind =
  | 'network'
  | 'not-found'
  | 'booking-conflict'
  | 'validation'
  | 'unavailable';

export interface AppointmentApiError {
  kind: AppointmentApiErrorKind;
  message: string;
  status: number | null;
}
