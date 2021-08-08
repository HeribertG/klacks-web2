using klacks_web_api.Data;
using klacks_web_api.Enums;
using klacks_web_api.Models.Calendar;
using klacks_web_api.Models.Corporation;
using klacks_web_api.Models.Options;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace klacks_web_api.Models.Employee
{
  public class Employee : BaseEntity
  {
    public Employee()
    {
      Addresses = new Collection<Address>();
      Communications = new Collection<Communication>();
      Annotations = new Collection<Annotation>();
      Absences = new Collection<Absence>();
    }

    [Key]
    public Guid Id { get; set; }

    public Staff Staff { get; set; }

    [ForeignKey("CivilStatus")]
    public Guid? CivilStatusId { get; set; }
    public CivilStatus CivilStatus { get; set; }


    [StringLength(50)]
    public string Title { get; set; }


    [StringLength(50)]
    public string Name { get; set; }

    [StringLength(50)]
    public string FirstName { get; set; }

    [StringLength(50)]
    public string SecondName { get; set; }

    [StringLength(50)]
    public string MaidenName { get; set; }
       
    [DataType(DataType.Date)]
    public DateTime? Birthdate { get; set; }

    [Required]
    public GenderEnum Gender { get; set; }

    public ICollection<Address> Addresses { get; set; }
    public ICollection<Communication> Communications { get; set; }
    public ICollection<Annotation> Annotations { get; set; }
    public ICollection<Absence> Absences { get; set; }
  }
}
