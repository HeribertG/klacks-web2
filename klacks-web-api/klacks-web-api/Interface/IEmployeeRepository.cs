using klacks_web_api.Models.Employee;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace klacks_web_api.Interface
{
  public interface IEmployeeRepository
  {
    Task<List<Employee>> GetEmployeeList();
    Task<List<Employee>> GetSimpleEmployeeList();
    Task<Employee> GetEmployee(Guid id);
    void AddEmployee(Employee employee);
    Employee PutEmployee(Employee employee);
    void RemoveEmployee(Employee employee);
    Task<Employee> DeleteEmployee(Guid id);
    bool EmployeeExists(Guid id);

  }
}
