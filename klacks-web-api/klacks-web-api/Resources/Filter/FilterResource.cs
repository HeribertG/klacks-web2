using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace klacks_web_api.Resources.Filter
{
  public class FilterResource : BaseFilter
  {
    public FilterResource()
    {
      Countries = new Collection<CountriesResource>();
    
    }

    
    public bool ShowDeleteEntries { get; set; }
    public bool IncludeAddress { get; set; } 
 
    public bool? SearchOnlyByName { get; set; } = null;
   public bool? male { get; set; }
    public bool? female { get; set; }
       public string searchString { get; set; }

    public bool? ktnAG { get; set; }
    public bool? ktnAI { get; set; }
    public bool? ktnAR { get; set; }
    public bool? ktnBE { get; set; }
    public bool? ktnBL { get; set; }
    public bool? ktnBS { get; set; }
    public bool? ktnFR { get; set; }
    public bool? ktnGE { get; set; }
    public bool? ktnGL { get; set; }
    public bool? ktnGR { get; set; }
    public bool? ktnJU { get; set; }
    public bool? ktnLU { get; set; }
    public bool? ktnNE { get; set; }
    public bool? ktnNW { get; set; }
    public bool? ktnOW { get; set; }
    public bool? ktnSG { get; set; }
    public bool? ktnSH { get; set; }
    public bool? ktnSO { get; set; }
    public bool? ktnSZ { get; set; }
    public bool? ktnTG { get; set; }
    public bool? ktnTI { get; set; }
    public bool? ktnUR { get; set; }
    public bool? ktnVD { get; set; }
    public bool? ktnVS { get; set; }
    public bool? ktnZG { get; set; }
    public bool? ktnZH { get; set; }
    public bool? ktnNull { get; set; }

    public bool? activeMembership { get; set; }
    public bool? formerMembership { get; set; }
    public bool? futureMembership { get; set; }

    public bool? hasAnnotation { get; set; }

    public bool? ScopeFromFlag { get; set; }
    public bool? ScopeUntilFlag { get; set; }
    public DateTime? ScopeFrom { get; set; }
    public DateTime? ScopeUntil { get; set; }

 
 
    public ICollection<CountriesResource> Countries { get; set; }
    


  }
}
