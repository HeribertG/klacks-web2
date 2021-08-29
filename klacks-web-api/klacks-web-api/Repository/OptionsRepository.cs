using klacks_web_api.Data;
using klacks_web_api.Interface;
using klacks_web_api.Models.Options;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace SVA.API.Repository
{
  public class OptionsRepository : IOptionsRepository
  {
    private readonly DatabaseContext context;
    public OptionsRepository(DatabaseContext context)
    {
      this.context = context;
    }

    #region EmployeeStatus

    public async Task<List<EmployeeStatus>> GetEmployeeStatusList()
    {
      return await context.EmployeeStatus.ToListAsync();
    }

    public async Task<EmployeeStatus> GetEmployeeStatus(Guid id)
    {
      return await context.EmployeeStatus.FindAsync(id);
    }

    public EmployeeStatus AddEmployeeStatus(EmployeeStatus employeeStatus)
    {
      context.EmployeeStatus.Add(employeeStatus);

      return employeeStatus;
    }

    public EmployeeStatus PutEmployeeStatus(EmployeeStatus employeeStatus)
    {
      context.EmployeeStatus.Update(employeeStatus);

      return employeeStatus;
    }

    public void RemoveEmployeeStatus(EmployeeStatus employeeStatus)
    {
      context.EmployeeStatus.Remove(employeeStatus);
    }

    public async Task<EmployeeStatus> DeleteEmployeeStatus(Guid id)
    {
      var employeeStatus = await context.EmployeeStatus.FindAsync(id);

      context.EmployeeStatus.Remove(employeeStatus);

      return employeeStatus;
    }

    public bool EmployeeStatusExists(Guid id)
    {
      return context.EmployeeStatus.Any(e => e.Id == id);
    }

    #endregion EmployeeStatus

    #region CivilStatus

    public async Task<List<CivilStatus>> GetCivilStatusList()
    {
      return await context.CivilStatus.ToListAsync();
    }

    public async Task<CivilStatus> GetCivilStatus(Guid id)
    {
      return await context.CivilStatus.FindAsync(id);
    }

    public CivilStatus AddCivilStatus(CivilStatus civilStatus)
    {
      context.CivilStatus.Add(civilStatus);

      return civilStatus;
    }

    public CivilStatus PutCivilStatus(CivilStatus civilStatus)
    {
      context.CivilStatus.Update(civilStatus);

      return civilStatus;
    }

    public void RemoveCivilStatus(CivilStatus civilStatus)
    {
      context.CivilStatus.Remove(civilStatus);
    }

    public async Task<CivilStatus> DeleteCivilStatus(Guid id)
    {
      var civilStatus = await context.CivilStatus.FindAsync(id);

      context.CivilStatus.Remove(civilStatus);

      return civilStatus;
    }

    public bool CivilStatusExists(Guid id)
    {
      return context.CivilStatus.Any(e => e.Id == id);
    }



    #endregion CivilStatus

    #region AbsenceReason

    public async Task<List<AbsenceReason>> GetAbsenceReasonList()
    {
      return await context.AbsenceReason.ToListAsync();
    }

    public async Task<AbsenceReason> GetAbsenceReason(Guid id)
    {
      return await context.AbsenceReason.FindAsync(id);
    }

    public AbsenceReason AddAbsenceReason(AbsenceReason absenceReason)
    {
      context.AbsenceReason.Add(absenceReason);

      return absenceReason;
    }

    public AbsenceReason PutAbsenceReason(AbsenceReason absenceReason)
    {
      context.AbsenceReason.Update(absenceReason);

      return absenceReason;
    }

    public void RemoveAbsenceReason(AbsenceReason absenceReason)
    {
      context.AbsenceReason.Remove(absenceReason);
    }

    public async Task<AbsenceReason> DeleteAbsenceReason(Guid id)
    {
      var absenceReason = await context.AbsenceReason.FindAsync(id);

      context.AbsenceReason.Remove(absenceReason);

      return absenceReason;
    }

    public bool AbsenceReasonExists(Guid id)
    {
      return context.AbsenceReason.Any(e => e.Id == id);
    }


    #endregion AbsenceReason
  }
}
