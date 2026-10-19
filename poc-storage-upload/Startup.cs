using System;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PocStorageUpload.Repositories;
using PocStorageUpload.Services;

namespace PocStorageUpload
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Configura HttpClient con la URL y la clave solo en el servidor; registra servicio, repositorio y controladores.
        public void ConfigureServices(IServiceCollection services)
        {
            string supabaseUrl = Required("SUPABASE_URL").TrimEnd('/');
            string secretKey = Required("SUPABASE_SECRET_KEY");
            string bucket = Required("SUPABASE_BUCKET");
            if (!Regex.IsMatch(bucket, "^[a-z0-9-]+$"))
            {
                throw new InvalidOperationException("Usa un bucket con letras minúsculas, números o guiones.");
            }

            services.AddHttpClient("storage", delegate(HttpClient client)
            {
                client.BaseAddress = new Uri(supabaseUrl + "/storage/v1/");
                client.DefaultRequestHeaders.Add("apikey", secretKey);
            });
            services.AddScoped<StorageRepository>();
            services.AddScoped<ImagesService>();
            services.AddControllers();
        }

        // Ordena el flujo HTTP: errores, archivos estáticos y rutas de controladores.
        public void Configure(IApplicationBuilder app)
        {
            app.UseExceptionHandler(ConfigureErrorHandler);
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseEndpoints(ConfigureEndpoints);
        }

        // Lee una variable obligatoria y falla al arrancar si falta, en vez de ocultar la configuración incompleta.
        private string Required(string key)
        {
            string? value = _configuration[key];
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new InvalidOperationException("Falta " + key + ". Revisa .env.example.");
            }
            return value;
        }

        // Publica las rutas declaradas en los atributos de los controladores.
        private static void ConfigureEndpoints(IEndpointRouteBuilder endpoints)
        {
            endpoints.MapControllers();
        }

        // Conecta el manejador de excepciones al flujo HTTP.
        private static void ConfigureErrorHandler(IApplicationBuilder app)
        {
            app.Run(WriteErrorAsync);
        }

        // Convierte errores en respuestas HTTP comprensibles sin devolver credenciales ni detalles internos.
        private static async Task WriteErrorAsync(HttpContext context)
        {
            IExceptionHandlerFeature? feature = context.Features.Get<IExceptionHandlerFeature>();
            Exception? error = feature == null ? null : feature.Error;
            int status = StatusCodes.Status502BadGateway;
            string title = "No se pudo subir la imagen. Revisa la URL, la clave y el bucket de Storage.";
            if (error is ArgumentException)
            {
                status = StatusCodes.Status400BadRequest;
                title = error.Message;
            }

            ProblemDetails problem = new ProblemDetails();
            problem.Status = status;
            problem.Title = title;
            context.Response.StatusCode = status;
            await context.Response.WriteAsJsonAsync(problem);
        }
    }
}
