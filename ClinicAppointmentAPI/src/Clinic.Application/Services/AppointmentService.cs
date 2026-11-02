using Clinic.Application.DTOs.Appointments;
using Clinic.Application.Interfaces.Repositories;
using Clinic.Domain.Entities;

namespace Clinic.Application.Services;

public class AppointmentService
{
    private readonly IDoctorRepository _doctorRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly SlotGenerator _slotGenerator;

    public AppointmentService(
        IDoctorRepository doctorRepository,
        IPatientRepository patientRepository,
        IAppointmentRepository appointmentRepository,
        SlotGenerator slotGenerator)
    {
        _doctorRepository = doctorRepository;
        _patientRepository = patientRepository;
        _appointmentRepository = appointmentRepository;
        _slotGenerator = slotGenerator;
    }

    public async Task<Appointment> CreateAppointmentAsync(
        CreateAppointmentDto dto)
    {
        // 1. Validate doctor
        var doctor = await _doctorRepository.GetByIdAsync(dto.DoctorId);

        if (doctor == null)
            throw new KeyNotFoundException("Doctor not found.");

        // 2. Get doctor's schedule
        var schedule = await _doctorRepository.GetScheduleAsync(
            dto.DoctorId,
            dto.AppointmentDate.DayOfWeek);

        if (schedule == null)
            throw new InvalidOperationException(
                "Doctor does not work on the selected day.");

        // 3. Generate available time slots
        var slots = _slotGenerator.GenerateSlots(
            schedule.StartTime,
            schedule.EndTime,
            30);

        var selectedSlot = slots.FirstOrDefault(
            s => s.StartTime == dto.StartTime);

        if (selectedSlot == null)
            throw new InvalidOperationException(
                "Selected time is outside working hours or is not a valid slot.");

        // 4. Check existing appointments
        var appointments =
            await _appointmentRepository.GetByDoctorAndDateAsync(
                dto.DoctorId,
                dto.AppointmentDate);

        var appointmentEnd = selectedSlot.EndTime;

        var hasConflict = appointments.Any(a =>
        {
            var existingEnd = a.StartTime.AddMinutes(a.DurationMinutes);

            return dto.StartTime < existingEnd &&
                   a.StartTime < appointmentEnd;
        });

        if (hasConflict)
            throw new InvalidOperationException(
                "This appointment slot is already booked.");

        // 5. Create patient
        var patient = new Patient
        {
            Name = dto.PatientName,
            BirthDate = dto.PatientBirthDate,
            ContactInfo = dto.ContactInfo,
            Gender = dto.Gender
        };

        await _patientRepository.AddAsync(patient);

       





        // 6. Create appointment
        var appointment = new Appointment
        {
            DoctorId = doctor.DoctorId,
            Patient = patient,
            AppointmentDate = dto.AppointmentDate,
            StartTime = dto.StartTime,
            DurationMinutes = 30
        };

        // 7. Save patient and appointment together
        await _appointmentRepository.AddAsync(appointment);

        await _appointmentRepository.SaveChangesAsync();

        // Keep doctor navigation available for the response
        appointment.Doctor = doctor;

        return appointment;

    }



    //Load all appointments
    public async Task<IReadOnlyList<AppointmentListDto>>
        GetAllAppointmentsAsync()
    {
        var appointments = await _appointmentRepository.GetAllAsync();

        return appointments.Select(a => new AppointmentListDto
        {
            AppointmentId = a.AppointmentId,
            PatientName = a.Patient.Name,
            PatientBirthDate = a.Patient.BirthDate,
            ContactInfo = a.Patient.ContactInfo,
            Gender = a.Patient.Gender,
            DoctorName = a.Doctor.Name,
            AppointmentDate = a.AppointmentDate,
            StartTime = a.StartTime,
            DurationMinutes = a.DurationMinutes
        }).ToList();
    }



}