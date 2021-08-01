

using klacks_web_api.Enums;
using klacks_web_api.Models.Options;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace klacks_web_api.Resources
{
  public class EmployeeResource
  {
    public EmployeeResource()
    {
      Addresses = new Collection<AddressResource>();
      Communications = new Collection<CommunicationResource>();
      Annotations = new Collection<AnnotationResource>();
    }

    public Guid Id { get; set; }

    public StaffResource Staff { get; set; }

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

    public GenderEnum Gender { get; set; }

    public bool IsDeleted { get; set; }

    public ICollection<AddressResource> Addresses { get; set; }
    public ICollection<CommunicationResource> Communications { get; set; }
    public ICollection<AnnotationResource> Annotations { get; set; }
  }
}
