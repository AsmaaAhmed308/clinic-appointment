
using Clinic.Application.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Clinic.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly IDoctorRepository _doctorRepository;

    public DoctorsController(IDoctorRepository doctorRepository)
    {
        _doctorRepository = doctorRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllDoctors()
    {
        var doctors = await _doctorRepository.GetAllAsync();

        var result = doctors.Select(d => new
        {
            d.DoctorId,
            d.Name,
            d.Specialty
        });

        return Ok(result);
    }
}
