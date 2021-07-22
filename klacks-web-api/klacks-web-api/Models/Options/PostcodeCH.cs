using System.ComponentModel.DataAnnotations;

namespace klacks_web_api.Models.Options
{
    public class PostcodeCH
    {
        [Key]
        public int Id { get; set; }

         public int Zip { get; set; }

        [StringLength(50)]
        public string City { get; set; }

        [StringLength(10)]
        public string State { get; set; }

    }
}
