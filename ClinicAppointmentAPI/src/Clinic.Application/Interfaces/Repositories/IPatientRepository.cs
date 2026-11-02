using Clinic.Domain.Entities;

namespace Clinic.Application.Interfaces.Repositories;

public interface IPatientRepository
{
    Task<Patient?> GetByIdAsync(int patientId);

    Task AddAsync(Patient patient);
}