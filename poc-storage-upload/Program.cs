using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace PocStorageUpload
{
    public class Program
    {
        // Punto de entrada: prepara la configuración y arranca el servidor de este ejemplo.
        public static void Main(string[] args)
        {
            if (File.Exists(".env"))
            {
                DotNetEnv.Env.NoClobber().Load();
            }

            IHost host = CreateHostBuilder(args).Build();
            host.Run();
        }

        // Crea el host de ASP.NET Core; delega la configuración web a Startup.
        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            return Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(ConfigureWebHost);
        }

        // Indica qué clase Startup registra servicios y configura las rutas.
        private static void ConfigureWebHost(IWebHostBuilder webBuilder)
        {
            webBuilder.UseStartup<Startup>();
        }
    }
}
