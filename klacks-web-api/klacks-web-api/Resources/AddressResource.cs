using klacks_web_api.Enums;
using klacks_web_api.Models.Employee;
using System;
using System.ComponentModel.DataAnnotations;


namespace klacks_web_api.Resources
{
  public class AddressResource
  {

    public Guid Id { get; set; }

    public Guid EmployeeId { get; set; }

    public EmployeeResource Employee { get; set; }


    public AddressTypeEnum Type { get; set; }

    public string AddressLine1 { get; set; }

    public string AddressLine2 { get; set; }

    public string Street { get; set; }

    public string Street2 { get; set; }

    public string Street3 { get; set; }

    [StringLength(50)]
    public string Zip { get; set; }

    [StringLength(100)]
    public string City { get; set; }

    [StringLength(100)]
    public string State { get; set; }

    [StringLength(100)]
    public string Country { get; set; }

  }
}
