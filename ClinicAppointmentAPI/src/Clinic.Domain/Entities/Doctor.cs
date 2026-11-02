namespace Clinic.Domain.Entities;

public class Doctor
{
    public int DoctorId { get; set; }

    public int ClinicId { get; set; }

    public required string Name { get; set; }

    public string? Specialty { get; set; }

    public Clinic Clinic { get; set; } = null!;

    public ICollection<DoctorSchedule> DoctorSchedules { get; set; } = new List<DoctorSchedule>();

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
