using klacks_web_api.Data;
using klacks_web_api.Interface;
using klacks_web_api.Models.Corporation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace klacks_web_api.Repository
{
  public class StaffRepository : IStaffRepository
  {

    private readonly DatabaseContext context;
    public StaffRepository(DatabaseContext context)
    {
      this.context = context;
    }

    public void AddStaff(Staff staff)
    {
      context.Staff.Add(staff);
    }

    public bool StaffExists(Guid id)
    {
      return context.Staff.Any(e => e.Id == id);
    }

    public async Task<Staff> GetStaff(Guid id)
    {
      return await context.Staff.SingleOrDefaultAsync(emp => emp.Id == id);
    }

    public async Task<List<Staff>> GetStaffList()
    {
      return await context.Staff.ToListAsync();
    }


    public Staff PutStaff(Staff staff)
    {
      context.Entry(staff).State = EntityState.Modified;

      return staff;
    }

    public void RemoveStaff(Staff staff)
    {
      context.Staff.Remove(staff);
    }

    public async Task<Staff> DeleteStaff(Guid id)
    {
      var staff = await context.Staff.SingleOrDefaultAsync(emp => emp.Id == id);

      context.Staff.Remove(staff);
      return staff;
    }
  }
}
