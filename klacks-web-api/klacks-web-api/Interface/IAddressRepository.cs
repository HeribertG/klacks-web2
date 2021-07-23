using klacks_web_api.Models.Employee;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace klacks_web_api.Interface
{
  public interface IAddressRepository
  {
    Task<List<Address>> GetAddressList();
    Task<List<Address>> GetEmployeeAddressList(Guid id);
    Task<List<Address>> GetSimpleAddressList(Guid id);
    Task<Address> GetAddress(Guid id);
    void AddAddress(Address address);
    Address PutAddress(Address address);
    void RemoveAddress(Address address);
    Task<Address> DeleteAddress(Guid id);
    bool AddressExists(Guid id);
  }
}
