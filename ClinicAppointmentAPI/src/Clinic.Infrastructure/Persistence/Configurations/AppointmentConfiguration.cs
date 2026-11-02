using Clinic.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Clinic.Infrastructure.Persistence.Configurations;

public class AppointmentConfiguration
    : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.ToTable("Appointment");

        builder.HasKey(a => a.AppointmentId);

        builder.Property(a => a.AppointmentDate)
            .HasColumnType("date")
            .IsRequired();

        builder.Property(a => a.StartTime)
            .HasColumnType("time")
            .IsRequired();

        builder.Property(a => a.DurationMinutes)
            .HasDefaultValue(30)
            .IsRequired();
    }
}