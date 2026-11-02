using Clinic.Domain.Entities;

namespace Clinic.Application.Interfaces.Repositories;

public interface IAppointmentRepository
{
    Task<IReadOnlyList<Appointment>> GetByDoctorAndDateAsync(
        int doctorId,
        DateOnly appointmentDate);

    Task<bool> HasOverlappingAppointmentAsync(
        int doctorId,
        DateOnly appointmentDate,
        TimeOnly startTime,
        TimeOnly endTime);

    Task AddAsync(Appointment appointment);

    Task SaveChangesAsync();

    Task<IReadOnlyList<Appointment>> GetAllAsync();

}