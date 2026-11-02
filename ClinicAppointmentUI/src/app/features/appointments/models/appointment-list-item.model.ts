export interface AppointmentListItem {
  appointmentId: number;
  patientName: string;
  patientBirthDate: string;
  contactInfo: string | null;
  gender: string | null;
  doctorName: string;
  appointmentDate: string;
  startTime: string;
  durationMinutes: number;
}
