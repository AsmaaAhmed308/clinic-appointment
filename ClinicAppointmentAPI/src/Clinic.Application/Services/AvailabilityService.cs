using Clinic.Application.DTOs;
using Clinic.Application.DTOs.Availability;
using Clinic.Application.Interfaces.Repositories;

namespace Clinic.Application.Services;

public class AvailabilityService
{
    private readonly IDoctorRepository _doctorRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly SlotGenerator _slotGenerator;

    private const int DefaultDurationMinutes = 30;

    public AvailabilityService(
        IDoctorRepository doctorRepository,
        IAppointmentRepository appointmentRepository,
        SlotGenerator slotGenerator)
    {
        _doctorRepository = doctorRepository;
        _appointmentRepository = appointmentRepository;
        _slotGenerator = slotGenerator;
    }

    public async Task<IReadOnlyList<AvailableSlotDto>> GetAvailableSlotsAsync(
        int doctorId,
        DateOnly appointmentDate)
    {
        // 1. Check if doctor exists
        var doctor = await _doctorRepository.GetByIdAsync(doctorId);

        if (doctor == null)
        {
            throw new KeyNotFoundException("Doctor not found.");
        }

        // 2. Get doctor's schedule for the selected day
        var dayOfWeek = appointmentDate.DayOfWeek;

        var schedule = await _doctorRepository.GetScheduleAsync(
            doctorId,
            dayOfWeek);

        if (schedule == null)
        {
            return Array.Empty<AvailableSlotDto>();
        }

        // 3. Generate all possible slots
        var allSlots = _slotGenerator.GenerateSlots(
            schedule.StartTime,
            schedule.EndTime,
            DefaultDurationMinutes);

        // 4. Get existing appointments
        var appointments = await _appointmentRepository.GetByDoctorAndDateAsync(
            doctorId,
            appointmentDate);

        // 5. Remove overlapping slots
        var availableSlots = allSlots
            .Where(slot => !appointments.Any(appointment =>
            {
                var appointmentEnd = appointment.StartTime.AddMinutes(
                    appointment.DurationMinutes);

                return slot.StartTime < appointmentEnd &&
                       appointment.StartTime < slot.EndTime;
            }))
            .ToList();

        return availableSlots;
    }
}