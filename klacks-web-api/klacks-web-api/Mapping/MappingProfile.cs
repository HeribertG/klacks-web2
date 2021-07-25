

using AutoMapper;
using klacks_web_api.Models.Corporation;
using klacks_web_api.Models.Employee;
using klacks_web_api.Models.Options;
using klacks_web_api.Resources;

namespace klacks_web_api.Mapping
{
  public class MappingProfile : Profile
  {
    public MappingProfile()
    {
      CreateMap<Address, AddressResource>();
      CreateMap<AddressResource, Address>();

      CreateMap<Communication, CommunicationResource>();
      CreateMap<CommunicationResource, Communication>();

      CreateMap<Communication, CommunicationResource>();
      CreateMap<CommunicationResource, Communication>();

      CreateMap<Annotation, AnnotationResource>();
      CreateMap<AnnotationResource, Annotation>();

      CreateMap<Staff, StaffResource>();
      CreateMap<StaffResource, Staff>();

      CreateMap<Employee, EmployeeResource>();
      CreateMap<EmployeeResource, Employee>();

      CreateMap<Countries, CountriesResource>();
      CreateMap<CountriesResource, Countries>();
    }
  }
}
