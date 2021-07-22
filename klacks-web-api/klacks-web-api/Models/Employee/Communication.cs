
using klacks_web_api.Data;
using klacks_web_api.Models.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace klacks_web_api.Models.Employee
{
  public class Communication : BaseEntity
  {

    [Key]
    public Guid Id { get; set; }

    [Required]
    [ForeignKey("Employee")]
    public Guid EmployeeId { get; set; }

    public Employee Employee { get; set; }
      
    [Required]
    public CommunicationTypeEnum Type { get; set; }
     
    [StringLength(100)]
    public string Value { get; set; }

    public string Prefix { get; set; }

    public string Description { get; set; }


  }
}
