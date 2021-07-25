using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using klacks_web_api.Data;
using klacks_web_api.Models.Options;
using klacks_web_api.Resources;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace klacks_web_api.Controllers
{

  [Route("api/[controller]")]
  [ApiController]
  public class CountriesController : ControllerBase
  {
    private readonly DatabaseContext context;
    private readonly IMapper mapper;

    public CountriesController(IMapper mapper, DatabaseContext context)
    {
      this.context = context;
      this.mapper = mapper;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<CountriesResource>>> GetCountries()
    {
      var countries = await context.Countries.ToListAsync();

      return mapper.Map<List<Countries>, List<CountriesResource>>(countries);


    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CountriesResource>> GetCountries(Guid id)
    {
      var countries = await context.Countries.FindAsync(id);

      if (countries == null)
      {
        return NotFound();
      }

      return mapper.Map<Countries, CountriesResource>(countries);
    }



  }
}
