using Clinic.Application.DTOs;
using Clinic.Application.DTOs.Availability;

namespace Clinic.Application.Services;

public class SlotGenerator
{
    public List<AvailableSlotDto> GenerateSlots(
        TimeOnly startTime,
        TimeOnly endTime,
        int durationMinutes)
    {
        var slots = new List<AvailableSlotDto>();

        if (durationMinutes <= 0 || startTime >= endTime)
        {
            return slots;
        }

        var currentTime = startTime;

        while (currentTime.AddMinutes(durationMinutes) <= endTime)
        {
            var slotEndTime = currentTime.AddMinutes(durationMinutes);

            slots.Add(new AvailableSlotDto
            {
                StartTime = currentTime,
                EndTime = slotEndTime
            });

            currentTime = slotEndTime;
        }

        return slots;
    }
}
