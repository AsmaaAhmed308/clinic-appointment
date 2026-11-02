export interface CreateAppointmentRequest {
  doctorId: number;
  patientName: string;
  patientBirthDate: string;
  contactInfo: string | null;
  gender: string | null;
  appointmentDate: string;
  startTime: string;
}
