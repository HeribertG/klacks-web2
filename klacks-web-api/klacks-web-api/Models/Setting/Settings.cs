using System;
using System.ComponentModel.DataAnnotations;

namespace klacks_web_api.Models.Setting
{
    public class Settings
    {
        [Key]
        public Guid Id { get; set; }

        [StringLength(30)]
        public string Type { get; set; }

        public string Value { get; set; }

    }
}
