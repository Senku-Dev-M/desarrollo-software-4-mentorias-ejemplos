using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PocPostgresCrud.Services;

namespace PocPostgresCrud.Controllers
{
    [ApiController]
    [Route("api/health")]
    public class HealthController : ControllerBase
    {
        private readonly UsersService _service;

        public HealthController(UsersService service)
        {
            _service = service;
        }

        [HttpGet]
        // Comprueba la conexión mediante el servicio y devuelve un estado legible al frontend.
        public async Task<IActionResult> Get()
        {
            await _service.CheckConnectionAsync();
            return Ok(new { status = "ok", driver = "Npgsql" });
        }
    }
}
