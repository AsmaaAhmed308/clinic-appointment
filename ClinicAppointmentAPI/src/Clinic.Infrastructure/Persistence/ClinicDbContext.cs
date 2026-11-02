using ClinicEntity = Clinic.Domain.Entities.Clinic;
using Doctor = Clinic.Domain.Entities.Doctor;
using DoctorSchedule = Clinic.Domain.Entities.DoctorSchedule;
using Patient = Clinic.Domain.Entities.Patient;
using Appointment = Clinic.Domain.Entities.Appointment;
using Microsoft.EntityFrameworkCore;

namespace Clinic.Infrastructure.Persistence;

public class ClinicDbContext : DbContext
{
    public ClinicDbContext(DbContextOptions<ClinicDbContext> options)
        : base(options)
    {
    }

    public DbSet<ClinicEntity> Clinics => Set<ClinicEntity>();

    public DbSet<Doctor> Doctors => Set<Doctor>();

    public DbSet<DoctorSchedule> DoctorSchedules => Set<DoctorSchedule>();

    public DbSet<Patient> Patients => Set<Patient>();

    public DbSet<Appointment> Appointments => Set<Appointment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(ClinicDbContext).Assembly);
    }
}