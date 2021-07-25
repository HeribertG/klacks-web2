using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace klacks_web_api.Resources
{
  public class CountryResource
  {

    public Guid Id { get; set; }
    public string Abbreviation { get; set; }
    public string Name { get; set; }

    public string Prefix { get; set; }
    public bool Select { get; set; }
  }
}
