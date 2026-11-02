namespace Clinic.Domain.Entities;

public class Patient
{
    public int PatientId { get; set; }

    public required string Name { get; set; }

    public DateOnly BirthDate { get; set; }

    public string? ContactInfo { get; set; }

    public string? Gender { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
