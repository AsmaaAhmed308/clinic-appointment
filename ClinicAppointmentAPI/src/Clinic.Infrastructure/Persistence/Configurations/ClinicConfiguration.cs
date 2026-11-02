using Clinic.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ClinicEntity = Clinic.Domain.Entities.Clinic;
namespace Clinic.Infrastructure.Persistence.Configurations;

public class ClinicConfiguration : IEntityTypeConfiguration<ClinicEntity>
{
    public void Configure(EntityTypeBuilder<ClinicEntity> builder)
    {
        builder.ToTable("Clinic");

        builder.HasKey(c => c.ClinicId);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.HasMany(c => c.Doctors)
            .WithOne(d => d.Clinic)
            .HasForeignKey(d => d.ClinicId);
    }
}