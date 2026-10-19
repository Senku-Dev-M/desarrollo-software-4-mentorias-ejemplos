namespace PocPostgresCrud.Models
{
    public class User
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        public User()
        {
            Name = string.Empty;
            Email = string.Empty;
        }
    }
}
