using klacks_web_api.Data;
using klacks_web_api.Interface;
using klacks_web_api.Models.Employee;
using klacks_web_api.Models.Options;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace klacks_web_api.Repository
{
  public class CommunicationRepository : ICommunicationRepository

  {
    private readonly DatabaseContext context;
    public CommunicationRepository(DatabaseContext context)
    {
      this.context = context;
    }

    public bool CommunicationExists(Guid id)
    {
      return context.Communication.Any(e => e.Id == id);
    }

    public async Task<Communication> GetCommunication(Guid id)
    {
      return await context.Communication.SingleOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<Communication>> GetClientCommunication(Guid id)
    {
      return await context.Communication.Where(c => c.EmployeeId == id).ToListAsync();
    }

    public Communication PutCommunication(Communication communication)
    {
      context.Entry(communication).State = EntityState.Modified;

      return communication;
    }

    public void AddCommunication(Communication communication)
    {
      context.Communication.Add(communication);
    }

    public async Task<Communication> DeleteCommunication(Guid id)
    {
      var communication = await context.Communication.SingleOrDefaultAsync(com => com.Id == id);

      context.Remove(communication);

      return communication;
    }

    public async Task<List<Communication>> GetCommunicationList()
    {
      return await context.Communication.ToListAsync();
    }

    public void RemoveCommunication(Communication communication)
    {
      context.Remove(communication);
    }

    public async Task<List<CommunicationType>> GetCommunicationTypeList()
    {
      return await context.CommunicationType.ToListAsync();
    }


  }
}
