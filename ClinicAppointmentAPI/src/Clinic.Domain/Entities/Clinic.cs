namespace Clinic.Domain.Entities;

public class Clinic
{
    public int ClinicId { get; set; }

    public required string Name { get; set; }

    public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
}
