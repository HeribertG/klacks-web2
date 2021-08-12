

using klacks_web_api.Models;
using klacks_web_api.Models.Employee;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace klacks_web_api.Interface
{
  public interface ICalendarRepository
  {
    Task<List<HolydayRule>> GetHolydayRuleList();
    Task<HolydayRule> GetHolydayRule(Guid id);
    HolydayRule AddHolydayRule(HolydayRule holydayRule);
    HolydayRule PutHolydayRule(HolydayRule holydayRule);
    void RemoveHolydayRule(HolydayRule holydayRule);
    Task<HolydayRule> DeleteHolydayRule(Guid id);
    bool HolydayRuleExists(Guid id);

    Task<List<Employee>> GetCalendarList();
  }
}
