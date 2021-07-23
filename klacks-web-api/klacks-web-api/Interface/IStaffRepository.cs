using klacks_web_api.Models.Corporation;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace klacks_web_api.Interface
{
  public interface IStaffRepository
  {
    Task<List<Staff>> GetStaffList();
    Task<Staff> GetStaff(Guid id);
    void AddStaff(Staff staff);
    Staff PutStaff(Staff staff);
    void RemoveStaff(Staff staff);
    Task<Staff> DeleteStaff(Guid id);
    bool StaffExists(Guid id);
  }
}
