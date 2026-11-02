export interface AppointmentCreated {
  appointmentId: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  startTime: string;
  durationMinutes: number;
}
