using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ESPACE.API.Controllers.Backend;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace klacks_web_api
{

  public class CountriesController : BaseController
  {
    private readonly DatabaseContext context;
    private readonly IMapper mapper;

    public CountriesController(IMapper mapper, DatabaseContext context)
    {
      this.context = context;
      this.mapper = mapper;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<CountryResource>>> GetCountries()
    {
      var countries = await context.Countries.ToListAsync();

      return mapper.Map<List<Countries>, List<CountryResource>>(countries);


    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CertificateCategory>> GetCountries(Guid id)
    {
      var diplomaCategory = await context.CertificateCategory.FindAsync(id);

      if (diplomaCategory == null)
      {
        return NotFound();
      }

      return diplomaCategory;
    }


    [HttpPut]
    public async Task<IActionResult> PutCountries(CountryResource countryResource)
    {

      var countries = mapper.Map<CountryResource, Countries>(countryResource);
      context.Entry(countries).State = EntityState.Modified;

      try
      {
        await context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!CountryExists(countries.Id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return NoContent();
    }


    [HttpPost]
    public async Task<ActionResult<CountryResource>> PostCountries(CountryResource countryResource)
    {
      var countries = mapper.Map<CountryResource, Countries>(countryResource);

      context.Countries.Add(countries);

      await context.SaveChangesAsync();

      return mapper.Map<Countries, CountryResource>(countries);


    }


    [HttpDelete("{id}")]
    public async Task<ActionResult<CountryResource>> DeleteCountries(Guid id)
    {
      var countries = await context.Countries.FindAsync(id);
      if (countries == null)
      {
        return NotFound();
      }

      context.Countries.Remove(countries);
      await context.SaveChangesAsync();

      return mapper.Map<Countries, CountryResource>(countries);
    }

    private bool CountryExists(Guid id)
    {
      return context.Countries.Any(e => e.Id == id);
    }

  }
}
