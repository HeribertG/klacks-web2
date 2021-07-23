using AutoMapper;
using klacks_web_api.Interface;
using klacks_web_api.Models.Employee;
using klacks_web_api.Resources;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace klacks_web_api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AddressesController : ControllerBase
  {
    private readonly IMapper mapper;
    private readonly IAddressRepository repository;
    private readonly IUnitOfWork unitOfWork;

    public AddressesController(IMapper mapper,
                               IAddressRepository repository,
                               IUnitOfWork unitOfWork)
    {
      this.mapper = mapper;
      this.repository = repository;
      this.unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AddressResource>>> GetAddress()
    {
      var address = await repository.GetAddressList();
      return mapper.Map<List<Address>, List<AddressResource>>(address);
    }

    [HttpGet("EmployeeAddressList/{id}")]
    public async Task<ActionResult<IEnumerable<AddressResource>>> GetEmployeeAddressList(Guid id)
    {
      var address = await repository.GetEmployeeAddressList(id);
      return mapper.Map<List<Address>, List<AddressResource>>(address);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AddressResource>> GetAddress(Guid id)
    {
      var address = await repository.GetAddress(id);

      if (address == null)
      {
        return NotFound();
      }

      return mapper.Map<Address, AddressResource>(address);

    }

    [HttpPut]
    public async Task<ActionResult<AddressResource>> PutAddress(AddressResource addressResource)
    {

      var dbAddress = await repository.GetAddress(addressResource.Id);
      var address = mapper.Map(addressResource, dbAddress);
      
      if (address == null)
        return NotFound();

      address = repository.PutAddress(address);


      try
      {
        await unitOfWork.CompleteAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!repository.AddressExists(addressResource.Id))
        {
          return NotFound();
        }
        else
        {
          return NoContent();
        }
      }

      return mapper.Map<Address, AddressResource>(address);
    }

    [HttpPost]
    public async Task<ActionResult<AddressResource>> PostAddress(AddressResource addressResource)
    {
      var dbaddress = await repository.GetAddress(addressResource.Id);

      var address = mapper.Map(addressResource, dbaddress);

      repository.AddAddress(address);

      await unitOfWork.CompleteAsync();

      return mapper.Map<Address, AddressResource>(address);

    }


    [HttpDelete("{id}")]
    public async Task<ActionResult<AddressResource>> DeleteAddress(Guid id)
    {
      var address = await repository.DeleteAddress(id);


      await unitOfWork.CompleteAsync();

      var addressResource = mapper.Map<Address, AddressResource>(address);
      return Ok(addressResource);
    }

    [HttpGet("GetSimpleAddress/{id}")]
    public async Task<ActionResult<IEnumerable<AddressResource>>> GetSimpleAddress(Guid id)
    {
      var address = await repository.GetSimpleAddressList(id);
      return mapper.Map<List<Address>, List<AddressResource>>(address);
    }

  }
}
