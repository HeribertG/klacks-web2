using klacks_web_api.Models.Employee;
using klacks_web_api.Models.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace klacks_web_api.Interface
{
  public interface ICommunicationRepository
  {
    Task<List<Communication>> GetCommunicationList();
    Task<Communication> GetCommunication(Guid id);
    void AddCommunication(Communication communication);
    Communication PutCommunication(Communication communication);
    void RemoveCommunication(Communication communication);
    Task<Communication> DeleteCommunication(Guid id);
    bool CommunicationExists(Guid id);
    Task<List<CommunicationType>> GetCommunicationTypeList();
    Task<List<Communication>> GetClientCommunication(Guid id);

  }
}
