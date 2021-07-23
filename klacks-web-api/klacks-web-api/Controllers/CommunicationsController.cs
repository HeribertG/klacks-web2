using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using klacks_web_api.Interface;
using klacks_web_api.Models.Employee;
using klacks_web_api.Models.Options;
using klacks_web_api.Resources;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace klacks_web_api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CommunicationsController : ControllerBase
  {
    private readonly IMapper mapper;
    private readonly ICommunicationRepository repository;
    private readonly IUnitOfWork unitOfWork;

    public CommunicationsController(IMapper mapper,
                                    ICommunicationRepository repository,
                                    IUnitOfWork unitOfWork)
    {
      this.mapper = mapper;
      this.repository = repository;
      this.unitOfWork = unitOfWork;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<CommunicationResource>>> GetCommunication()
    {
      var communication = await repository.GetCommunicationList();
      return mapper.Map<List<Communication>, List<CommunicationResource>>(communication);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<CommunicationResource>> GetCommunication(Guid id)
    {
      var communication = await repository.GetCommunication(id);

      if (communication == null)
      {
        return NotFound();
      }

      return mapper.Map<Communication, CommunicationResource>(communication);
    }


    [HttpPut]
    public async Task<ActionResult<CommunicationResource>> PutCommunication(CommunicationResource communicationResource)
    {

      var dbCommunication = await repository.GetCommunication(communicationResource.Id);
      var communication = mapper.Map(communicationResource, dbCommunication);

      if (communication == null)
        return NotFound();

      communication = repository.PutCommunication(communication);

      try
      {
        await unitOfWork.CompleteAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!repository.CommunicationExists(communicationResource.Id))
        {
          return NotFound();
        }
        else
        {
          return NoContent();
        }
      }

      return mapper.Map<Communication, CommunicationResource>(communication);
    }


    [HttpPost]
    public async Task<ActionResult<CommunicationResource>> PostCommunication(CommunicationResource communicationResource)
    {
      var communication = mapper.Map<CommunicationResource, Communication>(communicationResource);

      repository.AddCommunication(communication);

      await unitOfWork.CompleteAsync();

      var communicationResource1 = mapper.Map<Communication, CommunicationResource>(communication);
      return Ok(communicationResource1);
    }


    [HttpDelete("{id}")]
    public async Task<ActionResult<CommunicationResource>> DeleteCommunication(Guid id)
    {
      var communication = await repository.DeleteCommunication(id);


      await unitOfWork.CompleteAsync();

      var communicationResource = mapper.Map<Communication, CommunicationResource>(communication);
      return Ok(communicationResource);
    }


    [HttpGet("CommunicationTypes")]
    public async Task<ActionResult<IEnumerable<CommunicationType>>> GetCommunicationType()
    {
      return await repository.GetCommunicationTypeList();

    }


  }
}
