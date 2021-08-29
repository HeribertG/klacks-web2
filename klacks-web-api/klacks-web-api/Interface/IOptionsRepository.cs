
using klacks_web_api.Models.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace klacks_web_api.Interface
{
  public interface IOptionsRepository
  {
  
    Task<List<EmployeeStatus>> GetEmployeeStatusList();
    Task<EmployeeStatus> GetEmployeeStatus(Guid id);
    EmployeeStatus AddEmployeeStatus(EmployeeStatus employeeStatus);
    EmployeeStatus PutEmployeeStatus(EmployeeStatus employeeStatus);
    void RemoveEmployeeStatus(EmployeeStatus employeeStatus);
    Task<EmployeeStatus> DeleteEmployeeStatus(Guid id);
    bool EmployeeStatusExists(Guid id);

    Task<List<CivilStatus>> GetCivilStatusList();
    Task<CivilStatus> GetCivilStatus(Guid id);
    CivilStatus AddCivilStatus(CivilStatus civilStatus);
    CivilStatus PutCivilStatus(CivilStatus civilStatus);
    void RemoveCivilStatus(CivilStatus civilStatus);
    Task<CivilStatus> DeleteCivilStatus(Guid id);
    bool CivilStatusExists(Guid id);


    Task<List<AbsenceReason>> GetAbsenceReasonList();
    Task<AbsenceReason> GetAbsenceReason(Guid id);
    AbsenceReason AddAbsenceReason(AbsenceReason absenceReason);
    AbsenceReason PutAbsenceReason(AbsenceReason absenceReason);
    void RemoveAbsenceReason(AbsenceReason absenceReason);
    Task<AbsenceReason> DeleteAbsenceReason(Guid id);
    bool AbsenceReasonExists(Guid id);
  }
}
