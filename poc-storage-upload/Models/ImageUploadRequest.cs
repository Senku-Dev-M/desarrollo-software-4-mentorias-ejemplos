using Microsoft.AspNetCore.Http;

namespace PocStorageUpload.Models
{
    public class ImageUploadRequest
    {
        public IFormFile? Image { get; set; }
    }
}
