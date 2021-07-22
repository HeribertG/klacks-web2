using klacks_web_api.Data;
using klacks_web_api.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace klacks_web_api.Models.Employee
{
  public class Address : BaseEntity
  {

    [Key]
    public Guid Id { get; set; }

    [Required]
    [ForeignKey("Employee")]
    public Guid EmployeeId { get; set; }

    public Employee Employee { get; set; }


    [Required]
    [DataType(DataType.Date)]
    public DateTime? ValidFrom { get; set; }

    
    
    [Required]
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
