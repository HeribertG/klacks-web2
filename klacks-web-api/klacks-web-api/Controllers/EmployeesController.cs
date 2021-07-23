using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using klacks_web_api.Models.Employee;
using klacks_web_api.Interface;
using AutoMapper;
using klacks_web_api.Resources;

namespace klacks_web_api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class EmployeesController : ControllerBase
  {
    private readonly IMapper mapper;
    private readonly IEmployeeRepository repository;
    private readonly IUnitOfWork unitOfWork;

    public EmployeesController(IMapper mapper,
                               IEmployeeRepository repository,
                               IUnitOfWork unitOfWork)
    {
      this.mapper = mapper;
      this.repository = repository;
      this.unitOfWork = unitOfWork;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeResource>>> GetEmployeeList()
    {
      var employee= await repository.GetEmployeeList();
      return mapper.Map<List<Employee>, List<EmployeeResource>>(employee);
    }

    [HttpGet("GetSimpleEmployeeList")]
    public async Task<ActionResult<IEnumerable<EmployeeResource>>> GetSimpleEmployeeList()
    {
      var employee = await repository.GetSimpleEmployeeList();
      return mapper.Map<List<Employee>, List<EmployeeResource>>(employee);
    }

   
    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeeResource>> GetEmployee(Guid id)
    {
      var employee = await repository.GetEmployee(id);

      if (employee == null)
      {
        return NotFound();
      }

      return  mapper.Map<Employee, EmployeeResource>(employee);
    }

   
    [HttpPut]
    public async Task<ActionResult<EmployeeResource>> PutEmployee(EmployeeResource employeeResource)
    {
      var dbEmployee = await repository.GetEmployee(employeeResource.Id);

      var updatedEmployee = mapper.Map(employeeResource, dbEmployee);

      var employee = repository.PutEmployee(updatedEmployee);

      await unitOfWork.CompleteAsync();

      return mapper.Map<Employee, EmployeeResource>(employee);
    }

   
    [HttpPost]
    public async Task<ActionResult<EmployeeResource>> PostEmployee(EmployeeResource employeeResource)
    {
      var employee = mapper.Map<EmployeeResource, Employee>(employeeResource);
      repository.AddEmployee(employee);

      await unitOfWork.CompleteAsync();

      return mapper.Map<Employee, EmployeeResource>(employee);
    }

    
    [HttpDelete("{id}")]
    public async Task<ActionResult<EmployeeResource>> DeleteEmployee(Guid id)
    {
      var employee = await repository.DeleteEmployee(id); ;
      await unitOfWork.CompleteAsync();

      return mapper.Map<Employee, EmployeeResource>(employee);
    }

    
  }
}
