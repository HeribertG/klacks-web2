using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using klacks_web_api.Interface;
using klacks_web_api.Models.Corporation;
using klacks_web_api.Resources;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace klacks_web_api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class StaffController : ControllerBase
  {
    private readonly IMapper mapper;
    private readonly IStaffRepository repository;
    private readonly IUnitOfWork unitOfWork;

    public StaffController(IMapper mapper,
                                 IStaffRepository repository,
                                 IUnitOfWork unitOfWork)
    {
      this.mapper = mapper;
      this.repository = repository;
      this.unitOfWork = unitOfWork;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<StaffResource>>> GetStaff()
    {
      var staff = await repository.GetStaffList();
      return mapper.Map<List<Staff>, List<StaffResource>>(staff);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<StaffResource>> GetStaff(Guid id)
    {
      var staff = await repository.GetStaff(id);

      if (staff == null)
      {
        return NotFound();
      }

      return mapper.Map<Staff, StaffResource>(staff);
    }


    [HttpPut]
    public async Task<ActionResult<StaffResource>> PutStaff(StaffResource staffResource)
    {
      var dbStaff = await repository.GetStaff(staffResource.Id);

      var updatedEmployee = mapper.Map(staffResource, dbStaff);
      var staff = mapper.Map<StaffResource, Staff>(staffResource);

      if (staff == null)
        return NotFound();

      staff = repository.PutStaff(staff);


      try
      {
        await unitOfWork.CompleteAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!repository.StaffExists(staffResource.Id))
        {
          return NotFound();
        }
        else
        {
          return NoContent();
        }
      }

      return mapper.Map<Staff, StaffResource>(staff);
    }


    [HttpPost]
    public async Task<ActionResult<StaffResource>> PostStaff(StaffResource staffResource)
    {
      var staff = mapper.Map<StaffResource, Staff>(staffResource);

      repository.AddStaff(staff);

      await unitOfWork.CompleteAsync();

      var customerResource1 = mapper.Map<Staff, StaffResource>(staff);
      return Ok(customerResource1);
    }


    [HttpDelete("{id}")]
    public async Task<ActionResult<StaffResource>> DeleteStaff(Guid id)
    {
      var staff = await repository.DeleteStaff(id);


      await unitOfWork.CompleteAsync();

      var staffResource = mapper.Map<Staff, StaffResource>(staff);
      return Ok(staffResource);
    }





  }
}
