using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PocPostgresCrud.Models;
using PocPostgresCrud.Services;

namespace PocPostgresCrud.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly UsersService _service;

        public UsersController(UsersService service)
        {
            _service = service;
        }

        [HttpGet]
        // Devuelve la lista como HTTP 200; la consulta se delega al servicio.
        public async Task<IActionResult> GetAll()
        {
            List<User> users = await _service.GetAllAsync();
            return Ok(users);
        }

        [HttpGet("{id:long}")]
        // Devuelve HTTP 200 si existe el usuario o 404 si el servicio devuelve null.
        public async Task<IActionResult> GetById(long id)
        {
            User? user = await _service.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        // Recibe JSON validado y responde 201 con la ruta del recurso creado.
        public async Task<IActionResult> Create([FromBody] UserRequest request)
        {
            User user = await _service.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        [HttpPut("{id:long}")]
        // Pasa ID y datos al servicio; devuelve 404 si no hay usuario o 200 con el resultado.
        public async Task<IActionResult> Update(long id, [FromBody] UserRequest request)
        {
            User? user = await _service.UpdateAsync(id, request);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpDelete("{id:long}")]
        // Devuelve 204 cuando se eliminó el usuario o 404 cuando no existía.
        public async Task<IActionResult> Delete(long id)
        {
            bool deleted = await _service.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
