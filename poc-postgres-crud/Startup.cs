using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using PocPostgresCrud.Repositories;
using PocPostgresCrud.Services;

namespace PocPostgresCrud
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Construye una conexión TLS verificada y registra un pool reutilizable, el repositorio y el servicio.
        public void ConfigureServices(IServiceCollection services)
        {
            NpgsqlConnectionStringBuilder connectionString = new NpgsqlConnectionStringBuilder();
            connectionString.Host = Required("PGHOST");
            connectionString.Port = int.Parse(Required("PGPORT"));
            connectionString.Database = Required("PGDATABASE");
            connectionString.Username = Required("PGUSER");
            connectionString.Password = Required("PGPASSWORD");
            connectionString.SslMode = SslMode.VerifyFull;
            connectionString.RootCertificate = Required("PGSSLROOTCERT");
            connectionString.MaxPoolSize = 5;
            connectionString.Timeout = 10;
            connectionString.CommandTimeout = 10;

            services.AddSingleton<NpgsqlDataSource>(delegate(IServiceProvider provider)
            {
                return NpgsqlDataSource.Create(connectionString.ConnectionString);
            });
            services.AddScoped<UsersRepository>();
            services.AddScoped<UsersService>();
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
            int status = StatusCodes.Status500InternalServerError;
            string title = "No se pudo completar la operación. Revisa la conexión y la tabla.";

            if (error is ArgumentException)
            {
                status = StatusCodes.Status400BadRequest;
                title = error.Message;
            }
            else if (error is PostgresException postgresError &&
                     postgresError.SqlState == PostgresErrorCodes.UniqueViolation)
            {
                status = StatusCodes.Status409Conflict;
                title = "Ese correo ya existe.";
            }

            ProblemDetails problem = new ProblemDetails();
            problem.Status = status;
            problem.Title = title;
            context.Response.StatusCode = status;
            await context.Response.WriteAsJsonAsync(problem);
        }
    }
}
