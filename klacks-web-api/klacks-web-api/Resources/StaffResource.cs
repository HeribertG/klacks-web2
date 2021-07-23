
using klacks_web_api.Models.Employee;
using System;
using System.ComponentModel.DataAnnotations;

namespace klacks_web_api.Resources
{
  public class StaffResource
  {
   
    public Guid Id { get; set; }

    public Guid EmployeeId { get; set; }

    public Employee Employee { get; set; }

    [DataType(DataType.Date)]
    public DateTime ValidFrom { get; set; }

    [DataType(DataType.Date)]
    public DateTime? ValidUntil { get; set; }


  }
}
