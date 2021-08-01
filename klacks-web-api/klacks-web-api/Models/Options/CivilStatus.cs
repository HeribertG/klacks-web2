

using System;
using System.ComponentModel.DataAnnotations;

namespace klacks_web_api.Models.Options
{
  public class CivilStatus
  {
    [Key]
    public Guid Id { get; set; }

    [StringLength(50)]
    public string Name { get; set; }
    public int Position { get; set; }
    public bool IsDefault { get; set; }
  }
}
