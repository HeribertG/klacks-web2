
using klacks_web_api.Models.Employee;
using System;

namespace klacks_web_api.Resources
{
  public class AnnotationResource
  {
    public Guid Id { get; set; }

    public Guid EmployeeId { get; set; }

    public EmployeeResource Employee { get; set; }

    public string Note { get; set; }
  }
}
