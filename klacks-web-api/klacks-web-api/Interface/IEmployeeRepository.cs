using klacks_web_api.Models.Employee;
using klacks_web_api.Resources.Filter;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace klacks_web_api.Interface
{
  public interface IEmployeeRepository
  {
    Task<TruncatedEmployee> GetTruncatedEmployeList(FilterEmployeeResource filter);
    Task<Employee> GetEmployee(Guid id);
    void AddEmployee(Employee employee);
    Employee PutEmployee(Employee employee);
    void RemoveEmployee(Employee employee);
    Task<Employee> DeleteEmployee(Guid id);
    bool EmployeeExists(Guid id);
    Task<IEnumerable<Employee>> FindEmployeeList(string name = null, string firstname = null);

  }
}
