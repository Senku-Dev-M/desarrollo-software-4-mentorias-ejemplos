using System.ComponentModel.DataAnnotations;

namespace PocPostgresCrud.Models
{
    public class UserRequest
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100)]
        public string Name { get; set; }

        [Required(ErrorMessage = "El correo es obligatorio.")]
        [StringLength(200)]
        [EmailAddress(ErrorMessage = "Ingresa un correo válido.")]
        public string Email { get; set; }

        public UserRequest()
        {
            Name = string.Empty;
            Email = string.Empty;
        }
    }
}
