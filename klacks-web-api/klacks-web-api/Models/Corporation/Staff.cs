using klacks_web_api.Data;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace klacks_web_api.Models.Corporation
{
  public class Staff : BaseEntity
  {
    [Key]
    public Guid Id { get; set; }

    [Required]
    [ForeignKey("Employee")]
    public Guid EmployeeId { get; set; }

    public Employee.Employee Employee { get; set; }


    [Required]
    [DataType(DataType.Date)]
    public DateTime ValidFrom { get; set; }

    [DataType(DataType.Date)]
    public DateTime? ValidUntil { get; set; }


  }
}
