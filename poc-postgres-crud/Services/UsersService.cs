using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Threading.Tasks;
using PocPostgresCrud.Models;
using PocPostgresCrud.Repositories;

namespace PocPostgresCrud.Services
{
    public class UsersService
    {
        private readonly UsersRepository _repository;

        public UsersService(UsersRepository repository)
        {
            _repository = repository;
        }

        // Delega el listado al repositorio; el servicio no contiene SQL.
        public Task<List<User>> GetAllAsync()
        {
            return _repository.GetAllAsync();
        }

        // Delega la consulta por ID y conserva null para que el controlador responda 404.
        public Task<User?> GetByIdAsync(long id)
        {
            return _repository.GetByIdAsync(id);
        }

        // Construye un usuario validado y delega la inserción al repositorio.
        public Task<User> CreateAsync(UserRequest request)
        {
            User user = BuildUser(request);
            return _repository.CreateAsync(user);
        }

        // Normaliza los datos, conserva el ID solicitado y delega la actualización.
        public Task<User?> UpdateAsync(long id, UserRequest request)
        {
            User user = BuildUser(request);
            user.Id = id;
            return _repository.UpdateAsync(user);
        }

        // Delega el borrado; el controlador convertirá el resultado en 204 o 404.
        public Task<bool> DeleteAsync(long id)
        {
            return _repository.DeleteAsync(id);
        }

        // Delega una comprobación no destructiva al repositorio.
        public Task CheckConnectionAsync()
        {
            return _repository.CheckConnectionAsync();
        }

        // Normaliza espacios y correo y aplica las reglas antes de guardar, incluso si se llama al servicio sin HTTP.
        private static User BuildUser(UserRequest request)
        {
            string name = request.Name.Trim();
            string email = request.Email.Trim().ToLowerInvariant();
            if (name.Length < 1 || name.Length > 100)
            {
                throw new ArgumentException("El nombre debe tener entre 1 y 100 caracteres.");
            }

            MailAddress? address;
            if (email.Length < 3 || email.Length > 200 ||
                !MailAddress.TryCreate(email, out address) || address.Address != email)
            {
                throw new ArgumentException("Ingresa un correo válido.");
            }

            User user = new User();
            user.Name = name;
            user.Email = email;
            return user;
        }
    }
}
