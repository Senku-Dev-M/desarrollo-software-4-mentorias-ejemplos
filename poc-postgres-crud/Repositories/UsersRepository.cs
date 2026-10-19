using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using PocPostgresCrud.Models;

namespace PocPostgresCrud.Repositories
{
    public class UsersRepository
    {
        private readonly NpgsqlDataSource _dataSource;

        public UsersRepository(NpgsqlDataSource dataSource)
        {
            _dataSource = dataSource;
        }

        // Ejecuta SELECT y mapea cada fila; using libera lector y comando al terminar.
        public async Task<List<User>> GetAllAsync()
        {
            List<User> users = new List<User>();
            string sql = "select id, name, email from public.poc_users order by id";

            using (NpgsqlCommand command = _dataSource.CreateCommand(sql))
            using (NpgsqlDataReader reader = await command.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    users.Add(ReadUser(reader));
                }
            }
            return users;
        }

        // Consulta por ID mediante un parámetro, no concatenación SQL, y devuelve null si no existe.
        public async Task<User?> GetByIdAsync(long id)
        {
            string sql = "select id, name, email from public.poc_users where id = @id";
            using (NpgsqlCommand command = _dataSource.CreateCommand(sql))
            {
                command.Parameters.AddWithValue("id", id);
                using (NpgsqlDataReader reader = await command.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return ReadUser(reader);
                    }
                }
            }
            return null;
        }

        // Inserta con parámetros y obtiene el ID generado mediante RETURNING; los datos nunca se concatenan al SQL.
        public async Task<User> CreateAsync(User user)
        {
            string sql = "insert into public.poc_users (name, email) values (@name, @email) returning id";
            using (NpgsqlCommand command = _dataSource.CreateCommand(sql))
            {
                command.Parameters.AddWithValue("name", user.Name);
                command.Parameters.AddWithValue("email", user.Email);
                object? result = await command.ExecuteScalarAsync();
                user.Id = Convert.ToInt64(result);
            }
            return user;
        }

        // Actualiza únicamente el ID solicitado; cero filas afectadas significa que no existe.
        public async Task<User?> UpdateAsync(User user)
        {
            string sql = "update public.poc_users set name = @name, email = @email where id = @id";
            using (NpgsqlCommand command = _dataSource.CreateCommand(sql))
            {
                command.Parameters.AddWithValue("name", user.Name);
                command.Parameters.AddWithValue("email", user.Email);
                command.Parameters.AddWithValue("id", user.Id);
                int affected = await command.ExecuteNonQueryAsync();
                if (affected == 0)
                {
                    return null;
                }
            }
            return user;
        }

        // Borra por ID parametrizado y devuelve si PostgreSQL eliminó alguna fila.
        public async Task<bool> DeleteAsync(long id)
        {
            string sql = "delete from public.poc_users where id = @id";
            using (NpgsqlCommand command = _dataSource.CreateCommand(sql))
            {
                command.Parameters.AddWithValue("id", id);
                int affected = await command.ExecuteNonQueryAsync();
                return affected > 0;
            }
        }

        // Ejecuta SELECT 1: comprueba la conexión sin leer ni modificar datos de usuarios.
        public async Task CheckConnectionAsync()
        {
            using (NpgsqlCommand command = _dataSource.CreateCommand("select 1"))
            {
                await command.ExecuteScalarAsync();
            }
        }

        // Convierte las columnas del SELECT en un objeto User; los índices siguen el orden del SQL.
        private static User ReadUser(NpgsqlDataReader reader)
        {
            User user = new User();
            user.Id = reader.GetInt64(0);
            user.Name = reader.GetString(1);
            user.Email = reader.GetString(2);
            return user;
        }
    }
}
