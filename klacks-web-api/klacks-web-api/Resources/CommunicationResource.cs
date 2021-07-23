
using klacks_web_api.Models.Employee;
using klacks_web_api.Models.Enums;
using System;


namespace klacks_web_api.Resources
{
  public class CommunicationResource
  {

    public Guid Id { get; set; }

    public Guid EmployeeId { get; set; }

    public EmployeeResource Employee { get; set; }

    public CommunicationTypeEnum Type { get; set; }

    public string Value { get; set; }

    public string Prefix { get; set; }

    public string Description { get; set; }

  }
}
