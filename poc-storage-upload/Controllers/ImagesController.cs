using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PocStorageUpload.Models;
using PocStorageUpload.Services;

namespace PocStorageUpload.Controllers
{
    [ApiController]
    [Route("api/images")]
    public class ImagesController : ControllerBase
    {
        private readonly ImagesService _service;

        public ImagesController(ImagesService service)
        {
            _service = service;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        // Recibe multipart/form-data; delega validación y subida al servicio y devuelve la URL como JSON.
        public async Task<IActionResult> Upload([FromForm] ImageUploadRequest request)
        {
            UploadedImage image = await _service.UploadAsync(request.Image);
            return Ok(image);
        }
    }
}
