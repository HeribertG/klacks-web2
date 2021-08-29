using klacks_web_api.Interface;
using klacks_web_api.Models.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

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


    #region AbsenceReason

    [HttpGet("AbsenceReason")]
    public async Task<ActionResult<IEnumerable<AbsenceReason>>> GetAbsenceReason()
    {
      return await repository.GetAbsenceReasonList();
    }


    [HttpGet("AbsenceReason/{id}")]
    public async Task<ActionResult<AbsenceReason>> GetAbsenceReason(Guid id)
    {
      var absenceReason = await repository.GetAbsenceReason(id);

      if (absenceReason == null)
      {
        return NotFound();
      }

      return absenceReason;
    }


    [HttpPut("AbsenceReason")]
    public async Task<ActionResult<AbsenceReason>> PutAbsenceReason(AbsenceReason absenceReason)
    {

      repository.PutAbsenceReason(absenceReason);

      try
      {
        await unitOfWork.CompleteAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!repository.AbsenceReasonExists(absenceReason.Id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return absenceReason;
    }


    [HttpPost("AbsenceReason")]
    public async Task<ActionResult<AbsenceReason>> PostAbsenceReason(AbsenceReason absenceReason)
    {


      absenceReason = repository.AddAbsenceReason(absenceReason);
      await unitOfWork.CompleteAsync();

      return absenceReason;
    }


    [HttpDelete("AbsenceReason/{id}")]
    public async Task<ActionResult<AbsenceReason>> DeleteAbsenceReason(Guid id)
    {
      var absenceReason = await repository.DeleteAbsenceReason(id);
      if (absenceReason == null)
      {
        return NotFound();
      }
      else
      {
        await unitOfWork.CompleteAsync();
      }

      return absenceReason;
    }

  



    #endregion AbsenceReason
  }
}
