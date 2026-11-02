
using Clinic.Application.DTOs.Appointments;
using Clinic.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Clinic.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly AppointmentService _appointmentService;
    private readonly AvailabilityService _availabilityService;

    public AppointmentsController(
        AppointmentService appointmentService,
        AvailabilityService availabilityService)
    {
        _appointmentService = appointmentService;
        _availabilityService = availabilityService;
    }

    [HttpGet("available-slots")]
    public async Task<IActionResult> GetAvailableSlots(
        [FromQuery] int doctorId,
        [FromQuery] DateOnly appointmentDate)
    {
        try
        {
            var slots = await _availabilityService
                .GetAvailableSlotsAsync(doctorId, appointmentDate);

            return Ok(slots);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateAppointment(
        [FromBody] CreateAppointmentDto dto)
    {
        try
        {
            var appointment = await _appointmentService.CreateAppointmentAsync(dto);

            var result = new AppointmentDto
            {
                AppointmentId = appointment.AppointmentId,
                PatientName = appointment.Patient.Name,
                DoctorName = appointment.Doctor.Name,
                AppointmentDate = appointment.AppointmentDate,
                StartTime = appointment.StartTime,
                DurationMinutes = appointment.DurationMinutes
            };

            return CreatedAtAction(nameof(CreateAppointment), result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }




    [HttpGet]
    public async Task<IActionResult> GetAllAppointments()
    {
        var appointments = await _appointmentService
            .GetAllAppointmentsAsync();

        return Ok(appointments);
    }

}
