using System;
using System.Collections.Generic;
using System.Text;
using Users.Application.Abstractions.Persistence;
using Users.Domain.Entities;
using Users.Domain.ValueObjects;

namespace Users.Infrastructure.Persistence
{
    public sealed class SQLUserRepository : IUserRepository
    {
        Task IUserRepository.AddAsync(User user)
        {
            throw new NotImplementedException();
        }

        Task IUserRepository.DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        Task<IReadOnlyCollection<User>> IUserRepository.GetAllAsync()
        {
            throw new NotImplementedException();
        }

        Task<User?> IUserRepository.GetByEmailAsync(Email email)
        {
            throw new NotImplementedException();
        }

        Task<User?> IUserRepository.GetByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        Task IUserRepository.UpdateAsync(User user)
        {
            throw new NotImplementedException();
        }
    }
}
