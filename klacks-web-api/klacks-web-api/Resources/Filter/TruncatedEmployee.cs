
using klacks_web_api.Models.Employee;
using System.Collections.Generic;

namespace klacks_web_api.Resources.Filter
{
  public class TruncatedEmployee : BaseTruncatedResult
  {

    public ICollection<Employee> Employees { get; set; }

   
  }
}
