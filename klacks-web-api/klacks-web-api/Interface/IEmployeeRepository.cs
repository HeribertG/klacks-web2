using klacks_web_api.Models.Employee;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace klacks_web_api.Interface
{
  public interface IEmployeeRepository
  {
    Task<List<Employee>> GetEmployeeList();
    Task<List<Employee>> GetClientEmployeeList(Guid id);
    Task<List<Employee>> GetSimpleEmployeeList(Guid id);
    Task<Employee> GetEmployee(Guid id);
    void AddEmployee(Employee Employee);
    Employee PutEmployee(Employee Employee);
    void RemoveEmployee(Employee Employee);
    Task<Employee> DeleteEmployee(Guid id);
    bool EmployeeExists(Guid id);

  }
}
