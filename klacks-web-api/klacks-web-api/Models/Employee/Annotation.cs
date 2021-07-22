
using klacks_web_api.Data;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace klacks_web_api.Models.Employee
{
  public class Annotation : BaseEntity
  {
    [Key]
    public Guid Id { get; set; }

    [Required]
    [ForeignKey("Employee")]
    public Guid EmployeeId { get; set; }

    public Employee Employee { get; set; }

    public string Note { get; set; }



  }
}
