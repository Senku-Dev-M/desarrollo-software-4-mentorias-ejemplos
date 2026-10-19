using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using PocStorageUpload.Models;

namespace PocStorageUpload.Repositories
{
    public class StorageRepository
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _supabaseUrl;
        private readonly string _bucket;

        public StorageRepository(IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _clientFactory = clientFactory;
            _supabaseUrl = (configuration["SUPABASE_URL"] ?? string.Empty).TrimEnd('/');
            _bucket = configuration["SUPABASE_BUCKET"] ?? string.Empty;
        }

        // Envía los bytes por HTTP usando el cliente configurado; solo devuelve la URL pública después de una respuesta exitosa.
        public async Task<UploadedImage> UploadAsync(Stream stream, string contentType, string filename)
        {
            using (HttpClient client = _clientFactory.CreateClient("storage"))
            using (StreamContent content = new StreamContent(stream))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue(contentType);
                string path = "object/" + _bucket + "/" + filename;
                using (HttpResponseMessage response = await client.PostAsync(path, content))
                {
                    response.EnsureSuccessStatusCode();
                }
            }

            UploadedImage result = new UploadedImage();
            result.Url = _supabaseUrl + "/storage/v1/object/public/" + _bucket + "/" + filename;
            return result;
        }
    }
}
