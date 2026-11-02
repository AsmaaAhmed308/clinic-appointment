using Clinic.Application.Interfaces.Repositories;
using Clinic.Domain.Entities;
using Clinic.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Clinic.Infrastructure.Repositories;

public class DoctorRepository : IDoctorRepository
{
    private readonly ClinicDbContext _context;

    public DoctorRepository(ClinicDbContext context)
    {
        _context = context;
    }


    public async Task<IReadOnlyList<Doctor>> GetAllAsync()
    {
        return await _context.Doctors
            .AsNoTracking()
            .ToListAsync();
    }


    public async Task<Doctor?> GetByIdAsync(int doctorId)
    {
        return await _context.Doctors
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.DoctorId == doctorId);
    }


    public async Task<DoctorSchedule?> GetScheduleAsync(
    int doctorId,
    DayOfWeek dayOfWeek)
    {
        return await _context.DoctorSchedules
            .AsNoTracking()
            .FirstOrDefaultAsync(s =>
                s.DoctorId == doctorId &&
                s.DayOfWeek == dayOfWeek);
    }
}