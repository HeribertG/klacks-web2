using klacks_web_api.Interface;
using klacks_web_api.Models.Employee;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace klacks_web_api.Repository
{
  public class EmployeeRepository : IEmployeeRepository
  {
    public void AddEmployee(Employee Employee)
    {
      throw new NotImplementedException();
    }

    public Task<Employee> DeleteEmployee(Guid id)
    {
      throw new NotImplementedException();
    }

    public bool EmployeeExists(Guid id)
    {
      throw new NotImplementedException();
    }

    public Task<List<Employee>> GetClientEmployeeList(Guid id)
    {
      throw new NotImplementedException();
    }

    public Task<Employee> GetEmployee(Guid id)
    {
      throw new NotImplementedException();
    }

    public Task<List<Employee>> GetEmployeeList()
    {
      throw new NotImplementedException();
    }

    public Task<List<Employee>> GetSimpleEmployeeList(Guid id)
    {
      throw new NotImplementedException();
    }

    public Employee PutEmployee(Employee Employee)
    {
      throw new NotImplementedException();
    }

    public void RemoveEmployee(Employee Employee)
    {
      throw new NotImplementedException();
    }
  }
}
