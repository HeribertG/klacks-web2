using System;
using System.ComponentModel.DataAnnotations;

namespace klacks_web_api.Models.Options
{
  public class Countries
  {
    [Key]
    public Guid Id { get; set; }

    [StringLength(10)]
    public string Abbreviation { get; set; }
    [StringLength(100)]
    public string Name { get; set; }

    [StringLength(10)]
    public string Prefix { get; set; }

   
  }
}
