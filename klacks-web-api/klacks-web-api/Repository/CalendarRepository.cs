using klacks_web_api.Data;
using klacks_web_api.Interface;
using klacks_web_api.Models;
using klacks_web_api.Models.Employee;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace klacks_web_api.Repository
{
  public class CalendarRepository : ICalendarRepository
  {
    private readonly DatabaseContext context;
    public CalendarRepository(DatabaseContext context)
    {
      this.context = context;
    }

    public HolydayRule AddHolydayRule(HolydayRule holydayRule)
    {
      context.HolydayRule.Add(holydayRule);

      return holydayRule;
    }

    public async Task<HolydayRule> DeleteHolydayRule(Guid id)
    {
      var holydayRule = await context.HolydayRule.SingleOrDefaultAsync(x => x.Id == id);
      context.Remove(holydayRule);
      return holydayRule;
    }

    public async Task<HolydayRule> GetHolydayRule(Guid id)
    {
      return await context.HolydayRule.SingleOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<HolydayRule>> GetHolydayRuleList()
    {
      return await context.HolydayRule.ToListAsync();
    }

    public bool HolydayRuleExists(Guid id)
    {
      return context.HolydayRule.Any(e => e.Id == id);
    }

    public HolydayRule PutHolydayRule(HolydayRule holydayRule)
    {
      context.HolydayRule.Update(holydayRule);

      return holydayRule;
    }

    public void RemoveHolydayRule(HolydayRule holydayRule)
    {
      context.Remove(holydayRule);
    }

    public async Task<List<Employee>> GetCalendarList()
    {
      var tmp = context.Employee
                .Include(x => x.Absences)
                .Include(x => x.Staff)
                .AsQueryable();

      tmp = FilterByDate(tmp);
      tmp = Sort("name", "asc", tmp);

      return await tmp.ToListAsync();
    }

    private IQueryable<Employee> FilterByDate(IQueryable<Employee> tmp)
    {

      var nowDate = new DateTime(DateTime.Now.Date.Year, 1, 1);
      //only active

      return tmp.Where(co =>
                        co.Staff.ValidFrom.Date <= nowDate &&
                        (co.Staff.ValidUntil.HasValue == false ||
                        (co.Staff.ValidUntil.HasValue && co.Staff.ValidUntil.Value.Date >= nowDate)
                        ));



    }

    private IQueryable<Employee> Sort(string orderBy, string sortOrder, IQueryable<Employee> tmp)
    {
      if (sortOrder != "")
      {

        if (orderBy == "firstName")
        {
          return sortOrder == "asc" ? tmp.OrderBy(x => x.FirstName).ThenBy(x => x.Name) : tmp.OrderByDescending(x => x.FirstName).ThenByDescending(x => x.Name);
        }

        else if (orderBy == "name")
        {
          return sortOrder == "asc" ? tmp.OrderBy(x => x.Name).ThenBy(x => x.FirstName) : tmp.OrderByDescending(x => x.Name).ThenByDescending(x => x.FirstName);
        }

      }


      return tmp;
    }
  }
}

