namespace Clinic.Application.DTOs.Availability;

public class AvailableSlotDto
{
    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }
}