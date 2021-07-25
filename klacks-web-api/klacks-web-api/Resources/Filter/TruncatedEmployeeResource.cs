
using System.Collections.Generic;

namespace klacks_web_api.Resources.Filter
{
  public class TruncatedEmployeeResource : BaseTruncatedResult
  {

    public ICollection<EmployeeResource> Employees { get; set; }


  }
}
