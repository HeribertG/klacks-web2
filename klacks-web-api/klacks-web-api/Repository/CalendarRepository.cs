using klacks_web_api.Data;
using klacks_web_api.Interface;
using klacks_web_api.Models;
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
  }
}
