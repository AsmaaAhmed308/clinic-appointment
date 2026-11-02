namespace Clinic.Application.DTOs.Appointments;

public class CreateAppointmentDto
{
    public int DoctorId { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public DateOnly PatientBirthDate { get; set; }

    public string? ContactInfo { get; set; }

    public string? Gender { get; set; }

    public DateOnly AppointmentDate { get; set; }

    public TimeOnly StartTime { get; set; }
}