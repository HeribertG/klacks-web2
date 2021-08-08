using klacks_web_api.Data;
using klacks_web_api.Models.Options;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;



namespace klacks_web_api.Models.Calendar
{
  public class Absence : BaseEntity
  {
    public Guid Id { get; set; }

    [Required]
    [ForeignKey("Employee")]
    public Guid EmployeeId { get; set; }

    public Employee.Employee Employee { get; set; }

    [ForeignKey("AbsenceReason")]
    public Guid AbsenceReasonId { get; set; }

    public AbsenceReason AbsenceReason { get; set; }

    public DateTime BeginDate { get; set; }

    public DateTime EndDate { get; set; }

  }
}
