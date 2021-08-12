
using System;

namespace klacks_web_api.Resources
{
  public class AbsenceResource
  {
    public Guid Id { get; set; }

    public Guid EmployeeId { get; set; }

    public Guid AbsenceReasonId { get; set; }

    public DateTime BeginDate { get; set; }

    public DateTime EndDate { get; set; }
  }
}
