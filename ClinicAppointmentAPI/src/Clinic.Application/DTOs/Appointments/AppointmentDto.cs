namespace Clinic.Application.DTOs.Appointments;

public class AppointmentDto
{
    public int AppointmentId { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public string DoctorName { get; set; } = string.Empty;

    public DateOnly AppointmentDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public int DurationMinutes { get; set; }
}