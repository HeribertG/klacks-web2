using klacks_web_api.Data;
using klacks_web_api.Interface;
using klacks_web_api.Models.Employee;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace klacks_web_api.Repository
{
  public class EmployeeRepository : IEmployeeRepository
  {

    private readonly DatabaseContext context;
    public EmployeeRepository(DatabaseContext context)
    {
      this.context = context;
    }
    public void AddEmployee(Employee employee)
    {
      context.Employee.Add(employee);
    }

    public async Task<Employee> DeleteEmployee(Guid id)
    {
      var employee = await context.Employee.SingleOrDefaultAsync(add => add.Id == id);
      context.Remove(employee);
      return employee;
    }

    public bool EmployeeExists(Guid id)
    {
      return context.Employee.Any(e => e.Id == id);
    }

 

    public async Task<Employee> GetEmployee(Guid id)
    {
      return await context.Employee
        .Include(x => x.Addresses)
        .Include(x => x.Annotations)
        .Include(x => x.Communications)
        .SingleOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<Employee>> GetEmployeeList()
    {
      return await context.Employee
        .Include(x => x.Addresses)
        .Include(x => x.Annotations)
        .Include(x => x.Communications)
        .ToListAsync();
    }

    public async Task<List<Employee>> GetSimpleEmployeeList()
    {
      return await context.Employee
       .ToListAsync();
    }

    public Employee PutEmployee(Employee employee)
    {
      context.Employee.Update(employee);

      return employee;
    }

    public void RemoveEmployee(Employee employee)
    {
      context.Remove(employee);
    }
  }
}
