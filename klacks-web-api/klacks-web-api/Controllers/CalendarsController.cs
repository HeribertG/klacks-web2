using AutoMapper;
using klacks_web_api.Interface;
using klacks_web_api.Models;
using klacks_web_api.Models.Employee;
using klacks_web_api.Resources;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace klacks_web_api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CalendarsController : ControllerBase
  {

    private readonly IMapper mapper;
    private readonly ICalendarRepository repository;
    private readonly IUnitOfWork unitOfWork;

    public CalendarsController(IMapper mapper,
                               ICalendarRepository repository,
                               IUnitOfWork unitOfWork)
    {
      this.mapper = mapper;
      this.repository = repository;
      this.unitOfWork = unitOfWork;
    }

    [HttpGet("GetHolydayRuleList")]
    public async Task<ActionResult<List<HolydayRule>>> GetHolydayRuleListAsync()
    {
      return await repository.GetHolydayRuleList();
    }


    [HttpGet("HolydayRule/{id}")]
    public async Task<ActionResult<HolydayRule>> GetHolydayRuleAsync(Guid id)
    {
      return await repository.GetHolydayRule(id);
    }


    [HttpPost("HolydayRule")]
    public async Task<ActionResult<HolydayRule>> PostHolydayRule([FromBody] HolydayRule holydayRule)
    {
      var holydayRule1 = repository.AddHolydayRule(holydayRule);

      await unitOfWork.CompleteAsync();

      return holydayRule1;
    }


    [HttpPut("HolydayRule")]
    public async Task<ActionResult<HolydayRule>> PutHolydayRule([FromBody] HolydayRule holydayRule)
    {
      var holydayRule1 = repository.PutHolydayRule(holydayRule);

      if (holydayRule1 == null)
      {
        return NotFound();
      }

      await unitOfWork.CompleteAsync();

      return holydayRule1;
    }


    [HttpDelete("HolydayRule/{id}")]
    public async Task DeleteAsync(Guid id)
    {
      var address = repository.DeleteHolydayRule(id);

      await unitOfWork.CompleteAsync();
    }

    [HttpGet("GetCalendarList")]
    public async Task<ActionResult<List<CalendarResource>>> GetCalendarList()
    {
      var employee = await repository.GetCalendarList();
      var result = mapper.Map<List<Employee>, List<CalendarResource>>(employee);

      return Ok(result);
    }
  }
}
