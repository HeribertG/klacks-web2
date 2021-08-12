
using klacks_web_api.Enums;
using klacks_web_api.Models.Calendar;
using klacks_web_api.Models.Options;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace klacks_web_api.Resources
{
  public class CalendarResource
  {
    public CalendarResource()
    {
      Absences = new Collection<AbsenceResource>();
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

    

    public GenderEnum Gender { get; set; }



    public ICollection<AbsenceResource> Absences { get; set; }
  }
}
