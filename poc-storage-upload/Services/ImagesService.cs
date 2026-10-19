using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using PocStorageUpload.Models;
using PocStorageUpload.Repositories;

namespace PocStorageUpload.Services
{
    public class ImagesService
    {
        private readonly StorageRepository _repository;

        public ImagesService(StorageRepository repository)
        {
            _repository = repository;
        }

        // Valida tamaño y MIME, genera un UUID para evitar colisiones y pasa el stream al repositorio sin guardar en disco.
        public async Task<UploadedImage> UploadAsync(IFormFile? image)
        {
            if (image == null || image.Length == 0)
            {
                throw new ArgumentException("Selecciona una imagen.");
            }
            if (image.Length > 2 * 1024 * 1024)
            {
                throw new ArgumentException("El máximo es 2 MB.");
            }

            string extension;
            switch (image.ContentType)
            {
                case "image/png":
                    extension = ".png";
                    break;
                case "image/jpeg":
                    extension = ".jpg";
                    break;
                case "image/webp":
                    extension = ".webp";
                    break;
                default:
                    throw new ArgumentException("Usa PNG, JPG o WebP.");
            }

            string filename = Guid.NewGuid().ToString("N") + extension;
            using (Stream stream = image.OpenReadStream())
            {
                return await _repository.UploadAsync(stream, image.ContentType, filename);
            }
        }
    }
}
