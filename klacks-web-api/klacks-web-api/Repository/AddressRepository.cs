using klacks_web_api.Data;
using klacks_web_api.Interface;
using klacks_web_api.Models.Employee;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace klacks_web_api.Repository
{
  public class AddressRepository : IAddressRepository
  {
    private readonly DatabaseContext context;
    public AddressRepository(DatabaseContext context)
    {
      this.context = context;
    }

    bool IAddressRepository.AddressExists(Guid id)
    {
      return context.Address.Any(e => e.Id == id);
    }

    async Task<Address> IAddressRepository.GetAddress(Guid id)
    {
      return await context.Address.SingleOrDefaultAsync(c => c.Id == id);
    }

    async Task<List<Address>> IAddressRepository.GetAddressList()
    {
      return await context.Address.ToListAsync();
    }

    async Task<List<Address>> IAddressRepository.GetEmployeeAddressList(Guid id)
    {
      return await context.Address.IgnoreQueryFilters().Where(x => x.EmployeeId == id).OrderByDescending(x => x.ValidFrom).ToListAsync();
    }

    async Task<List<Address>> IAddressRepository.GetSimpleAddressList(Guid id)
    {
      return await context.Address.Where(c => c.EmployeeId == id).ToListAsync();
    }

    Address IAddressRepository.PutAddress(Address address)
    {
      context.Entry(address).State = EntityState.Modified;

      return address;
    }

    void IAddressRepository.AddAddress(Address address)
    {
      context.Address.Add(address);
    }

    async Task<Address> IAddressRepository.DeleteAddress(Guid id)
    {
      var address = await context.Address.SingleOrDefaultAsync(add => add.Id == id);
      context.Remove(address);
      return address;
    }

    void IAddressRepository.RemoveAddress(Address address)
    {
      context.Remove(address);
    }
  }
}
