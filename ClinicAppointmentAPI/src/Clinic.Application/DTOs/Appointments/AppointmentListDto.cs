
namespace Clinic.Application.DTOs.Appointments;

public class AppointmentListDto
{
    public int AppointmentId { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public DateOnly PatientBirthDate { get; set; }

    public string? ContactInfo { get; set; }

    public string? Gender { get; set; }

    public string DoctorName { get; set; } = string.Empty;

    public DateOnly AppointmentDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public int DurationMinutes { get; set; }
}
