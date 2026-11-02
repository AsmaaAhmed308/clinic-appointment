using Clinic.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Clinic.Infrastructure.Persistence.Configurations;

public class DoctorScheduleConfiguration
    : IEntityTypeConfiguration<DoctorSchedule>
{
    public void Configure(EntityTypeBuilder<DoctorSchedule> builder)
    {
        builder.ToTable("DoctorSchedule");

        builder.HasKey(s => s.ScheduleId);

        builder.Property(s => s.DayOfWeek)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(s => s.StartTime)
            .HasColumnType("time")
            .IsRequired();

        builder.Property(s => s.EndTime)
            .HasColumnType("time")
            .IsRequired();

        builder.HasIndex(s => new { s.DoctorId, s.DayOfWeek })
            .IsUnique();
    }
}