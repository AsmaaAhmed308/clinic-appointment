using Clinic.Domain.Entities;

namespace Clinic.Application.Interfaces.Repositories;

public interface IDoctorRepository
{
    Task<IReadOnlyList<Doctor>> GetAllAsync();

    Task<Doctor?> GetByIdAsync(int doctorId);

    Task<DoctorSchedule?> GetScheduleAsync(int doctorId, DayOfWeek dayOfWeek);
}