namespace Clinic.Domain.Entities;

public class Appointment
{
    public int AppointmentId { get; set; }

    public int PatientId { get; set; }

    public int DoctorId { get; set; }

    public DateOnly AppointmentDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public int DurationMinutes { get; set; } = 30;

    public Patient Patient { get; set; } = null!;

    public Doctor Doctor { get; set; } = null!;
}
