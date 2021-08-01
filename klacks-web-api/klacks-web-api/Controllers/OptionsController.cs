using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using klacks_web_api.Interface;
using System;
using klacks_web_api.Models.Options;
using Microsoft.EntityFrameworkCore;

namespace klacks_web_api.Controllers
{

  [Route("api/[controller]")]
  [ApiController]
  public class OptionsController : ControllerBase
  {
    
    private readonly IOptionsRepository repository;
    private readonly IUnitOfWork unitOfWork;

    public OptionsController(IOptionsRepository repository,
                               IUnitOfWork unitOfWork)
    {
      this.repository = repository;
      this.unitOfWork = unitOfWork;
    }

    #region EmployeeStatus

    [HttpGet("EmployeeStatus")]
    public async Task<ActionResult<IEnumerable<EmployeeStatus>>> GetEmployeeStatus()
    {
      return await repository.GetEmployeeStatusList();
    }


    [HttpGet("EmployeeStatus/{id}")]
    public async Task<ActionResult<EmployeeStatus>> GetEmployeeStatus(Guid id)
    {
      var employeeStatus = await repository.GetEmployeeStatus(id);

      if (employeeStatus == null)
      {
        return NotFound();
      }

      return  employeeStatus;
    }


    [HttpPut("EmployeeStatus")]
    public async Task<ActionResult<EmployeeStatus>> PutEmployeeStatus(EmployeeStatus employeeStatus)
    {
    
      repository.PutEmployeeStatus(employeeStatus);

      try
      {
        await unitOfWork.CompleteAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!repository.EmployeeStatusExists(employeeStatus.Id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return employeeStatus;
    }


    [HttpPost("EmployeeStatus")]
    public async Task<ActionResult<EmployeeStatus>> PostEmployeeStatus(EmployeeStatus employeeStatus)
    {

   
      employeeStatus = repository.AddEmployeeStatus(employeeStatus);
      await unitOfWork.CompleteAsync();

      return employeeStatus;
    }


    [HttpDelete("EmployeeStatus/{id}")]
    public async Task<ActionResult<EmployeeStatus>> DeleteEmployeeStatus(Guid id)
    {
      var employeeStatus = await repository.DeleteEmployeeStatus(id);
      if (employeeStatus == null)
      {
        return NotFound();
      }
      else
      {
        await unitOfWork.CompleteAsync();
      }

      return employeeStatus;
    }


    #endregion EmployeeStatus

    #region CivilStatus

    [HttpGet("CivilStatus")]
    public async Task<ActionResult<IEnumerable<CivilStatus>>> GetCivilStatus()
    {
      return await repository.GetCivilStatusList();
    }


    [HttpGet("CivilStatus/{id}")]
    public async Task<ActionResult<CivilStatus>> GetCivilStatus(Guid id)
    {
      var civilStatus = await repository.GetCivilStatus(id);

      if (civilStatus == null)
      {
        return NotFound();
      }

      return civilStatus;
    }


    [HttpPut("CivilStatus")]
    public async Task<ActionResult<CivilStatus>> PutCivilStatus(CivilStatus civilStatus)
    {

      repository.PutCivilStatus(civilStatus);

      try
      {
        await unitOfWork.CompleteAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!repository.CivilStatusExists(civilStatus.Id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return civilStatus;
    }


    [HttpPost("CivilStatus")]
    public async Task<ActionResult<CivilStatus>> PostCivilStatus(CivilStatus civilStatus)
    {


      civilStatus = repository.AddCivilStatus(civilStatus);
      await unitOfWork.CompleteAsync();

      return civilStatus;
    }


    [HttpDelete("CivilStatus/{id}")]
    public async Task<ActionResult<CivilStatus>> DeleteCivilStatus(Guid id)
    {
      var civilStatus = await repository.DeleteCivilStatus(id);
      if (civilStatus == null)
      {
        return NotFound();
      }
      else
      {
        await unitOfWork.CompleteAsync();
      }

      return civilStatus;
    }


    #endregion CivilStatus

  }
}
