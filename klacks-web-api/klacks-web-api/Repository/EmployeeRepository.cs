using klacks_web_api.Data;
using klacks_web_api.Interface;
using klacks_web_api.Models.Employee;
using klacks_web_api.Resources;
using klacks_web_api.Resources.Filter;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace klacks_web_api.Repository
{
  public class EmployeeRepository : IEmployeeRepository
  {

    private readonly DatabaseContext context;
    public EmployeeRepository(DatabaseContext context)
    {
      this.context = context;
    }
    public void AddEmployee(Employee employee)
    {
      context.Employee.Add(employee);
    }

    public async Task<Employee> DeleteEmployee(Guid id)
    {
      var employee = await context.Employee.SingleOrDefaultAsync(add => add.Id == id);
      context.Remove(employee);
      return employee;
    }

    public bool EmployeeExists(Guid id)
    {
      return context.Employee.Any(e => e.Id == id);
    }



    public async Task<Employee> GetEmployee(Guid id)
    {
      return await context.Employee
        .Include(x => x.Addresses)
        .Include(x => x.Annotations)
        .Include(x => x.Communications)
        .SingleOrDefaultAsync(c => c.Id == id);
    }


    public async Task<TruncatedEmployee> GetTruncatedEmployeList(FilterEmployeeResource filter)
    {

      var tmp = FilterClient(filter);

      var count = tmp.Count();

      var firstItem = 0;

      if (count > 0 && count > filter.NumberOfItemsPerPage)
      {
        if ((filter.IsNextPage.HasValue || filter.IsPreviousPage.HasValue) && filter.FirstItemOnLastPage.HasValue)
        {
          if (filter.IsNextPage.HasValue)
          {
            firstItem = filter.FirstItemOnLastPage.Value + filter.NumberOfItemsPerPage;
          }
          else
          {
            var numberOfItem = filter.NumberOfItemOnPreviousPage ?? filter.NumberOfItemsPerPage;
            firstItem = filter.FirstItemOnLastPage.Value - numberOfItem;
            if (firstItem < 0) { firstItem = 0; }
          }
        }
        else
        {
          firstItem = filter.RequiredPage * filter.NumberOfItemsPerPage;
        }
        tmp = tmp.Skip(firstItem).Take(filter.NumberOfItemsPerPage);
      }


      var res = new TruncatedEmployee()
      {
        Employees = await tmp.ToListAsync(),
        MaxItems = count
      };

      res.MaxPages = filter.NumberOfItemsPerPage > 0 ? (res.MaxItems / filter.NumberOfItemsPerPage) : 0;
      res.CurrentPage = filter.RequiredPage;
      res.FirstItemOnPage = firstItem;

      return res;

    }

    public Employee PutEmployee(Employee employee)
    {
      context.Employee.Update(employee);

      return employee;
    }

    public void RemoveEmployee(Employee employee)
    {
      context.Remove(employee);
    }

    public IQueryable<Employee> FilterClient(FilterEmployeeResource filter)
    {

      var tmp = context.Employee.IgnoreQueryFilters()
               .Include(cu => cu.Addresses)
               .Include(cu => cu.Communications)
               .Include(cu => cu.Annotations)
               .Include(cu => cu.Staff)
               .Where(x => x.IsDeleted == filter.ShowDeleteEntries)
               .AsQueryable();




      var gender = CreateGenderList(filter.male, filter.female);
      var state = CreateStateList(filter.ktnAG, filter.ktnAI, filter.ktnAR, filter.ktnBE, filter.ktnBL, filter.ktnBS, filter.ktnFR, filter.ktnGE, filter.ktnGL, filter.ktnGR, filter.ktnLU, filter.ktnNE, filter.ktnNW,
                                  filter.ktnOW, filter.ktnSG, filter.ktnSH, filter.ktnSO, filter.ktnSZ, filter.ktnTG, filter.ktnTI, filter.ktnUR, filter.ktnVD, filter.ktnVS, filter.ktnZG, filter.ktnZH);
      var country = CreateCountryList(filter.Countries);


      tmp = FilterBySearchString(filter.searchString, filter.IncludeAddress, tmp);


      if (!(filter.SearchOnlyByName.HasValue && filter.SearchOnlyByName.Value))
      {
        tmp = FilterByGender(gender, tmp);

        tmp = FilterByAnnotation(filter.hasAnnotation, tmp);

        tmp = FilterByCountry(country, tmp); 



        var isSwiss = filter.Countries.Where(x => x.Abbreviation == "CH").Select(x => x.Select).FirstOrDefault();
        tmp = FilterByState(state, isSwiss, tmp);



        tmp = FilterByMembership(filter.activeMembership != null && filter.activeMembership.Value,
                                 (filter.formerMembership != null && filter.formerMembership.Value),
                                 (filter.futureMembership != null && filter.futureMembership.Value), tmp);



        if ((filter.ScopeFromFlag.HasValue || filter.ScopeUntilFlag.HasValue) &&
            (filter.ScopeFrom.HasValue || filter.ScopeUntil.HasValue))
        {
          tmp = FilterScope(filter.ScopeFromFlag, filter.ScopeUntilFlag, filter.ScopeFrom, filter.ScopeUntil, tmp);
        }




        tmp = Sort(filter.OrderBy, filter.SortOrder, tmp);



      }

      return tmp;

    }

    async Task<IEnumerable<Employee>> IEmployeeRepository.FindEmployeeList(string name, string firstname)
    {
      var lst = new List<Employee>();

      //name + firstname
      if (!string.IsNullOrWhiteSpace(name) && !string.IsNullOrWhiteSpace(firstname))
      {
        lst = await context.Employee.Where(x => x.Name.ToLower().Contains(name.ToLower().Trim()) && x.FirstName.ToLower().Contains(firstname.ToLower().Trim())).ToListAsync();
      }
     
      //firstname
      else if (!string.IsNullOrWhiteSpace(firstname))
      {
        lst = await context.Employee.Where(x =>  x.FirstName.ToLower().Contains(firstname.ToLower().Trim())).ToListAsync();
      }
      //name
      else if (string.IsNullOrWhiteSpace(name))
      {
        lst = await context.Employee.Where(x => x.Name.ToLower().Contains(name.ToLower().Trim())).ToListAsync();
      }
     
      return lst;
    }

    private int[] CreateGenderList(bool? male, bool? female)
    {
      var tmp = new List<int>();

      if (male != null && male.Value) { tmp.Add(1); }
      if (female != null && female.Value) { tmp.Add(0); }


      return tmp.ToArray();
    }

    private string[] CreateStateList(bool? ktnAG, bool? ktnAI, bool? ktnAR, bool? ktnBE, bool? ktnBL, bool? ktnBS, bool? ktnFR, bool? ktnGE, bool? ktnGL, bool? ktnGR, bool? ktnLU, bool? ktnNE, bool? ktnNW,
                                   bool? ktnOW, bool? ktnSG, bool? ktnSH, bool? ktnSO, bool? ktnSZ, bool? ktnTG, bool? ktnTI, bool? ktnUR, bool? ktnVD, bool? ktnVS, bool? ktnZG, bool? ktnZH)
    {
      var tmp = new List<string>();

      if (ktnAG != null && ktnAG.Value == true) { tmp.Add("AG"); }
      if (ktnAI != null && ktnAI.Value == true) { tmp.Add("AI"); }
      if (ktnAR != null && ktnAR.Value == true) { tmp.Add("AR"); }
      if (ktnBE != null && ktnBE.Value == true) { tmp.Add("BE"); }
      if (ktnBL != null && ktnBL.Value == true) { tmp.Add("BL"); }
      if (ktnBS != null && ktnBS.Value == true) { tmp.Add("BS"); }
      if (ktnFR != null && ktnFR.Value == true) { tmp.Add("FR"); }
      if (ktnGE != null && ktnGE.Value == true) { tmp.Add("GE"); }
      if (ktnGL != null && ktnGL.Value == true) { tmp.Add("GL"); }
      if (ktnGR != null && ktnGR.Value == true) { tmp.Add("GR"); }
      if (ktnLU != null && ktnLU.Value == true) { tmp.Add("LU"); }
      if (ktnNE != null && ktnNE.Value == true) { tmp.Add("NE"); }
      if (ktnNW != null && ktnNW.Value == true) { tmp.Add("NW"); }
      if (ktnOW != null && ktnOW.Value == true) { tmp.Add("OW"); }
      if (ktnSG != null && ktnSG.Value == true) { tmp.Add("SG"); }
      if (ktnSH != null && ktnSH.Value == true) { tmp.Add("SH"); }
      if (ktnSO != null && ktnSO.Value == true) { tmp.Add("SO"); }
      if (ktnSZ != null && ktnSZ.Value == true) { tmp.Add("SZ"); }
      if (ktnTG != null && ktnTG.Value == true) { tmp.Add("TG"); }
      if (ktnTI != null && ktnTI.Value == true) { tmp.Add("TI"); }
      if (ktnUR != null && ktnUR.Value == true) { tmp.Add("UR"); }
      if (ktnVD != null && ktnVD.Value == true) { tmp.Add("VD"); }
      if (ktnVS != null && ktnVS.Value == true) { tmp.Add("VS"); }
      if (ktnZG != null && ktnZG.Value == true) { tmp.Add("ZG"); }
      if (ktnZH != null && ktnZH.Value == true) { tmp.Add("ZH"); }


      return tmp.ToArray();
    }
    private string[] CreateCountryList(ICollection<CountriesResource> current)
    {
      var tmp = new List<string>();

      if (current != null && current.Count > 0)
        foreach (CountriesResource c in current)
          if (c.Select) { tmp.Add(c.Abbreviation); }

      return tmp.ToArray();
    }

    private IQueryable<Employee> FilterByState(string[] state, bool isCountrySwissSelected, IQueryable<Employee> tmp)
    {
      if (state.Length == 0 && isCountrySwissSelected)
      {
        //
      }
      else if (state.Length < 25)
      {
        tmp = tmp.Where(co => co.Addresses.Count == 0 || co.Addresses.Any(ad => (ad.State == "") || state.Contains(ad.State)));
      }

      return tmp;
    }

    private IQueryable<Employee> FilterBySearchString(string searchString, bool includeAddress, IQueryable<Employee> tmp)
    {


      if (!string.IsNullOrEmpty(searchString))
      {

        if (searchString.Contains("+"))
        {
          var keywordList = searchString.ToLower().Split("+");
          tmp = FilterBySearchStringExact(keywordList, includeAddress, tmp);
        }
        else
        {
          var keywordList = searchString.TrimEnd().TrimStart().ToLower().Split(' ');

          if (keywordList.Length == 1)
          {
            if (keywordList[0].Length == 1)
            {
              tmp = FilterBySearchStringFirstSymbol(keywordList[0], tmp);
            }
            else
            {
              tmp = FilterBySearchStringExact(keywordList, includeAddress, tmp);
            }

          }
          else
          {
            tmp = FilterBySearchStringStandart(keywordList, includeAddress, tmp);

          }
        }
      }

      return tmp;
    }

    private IQueryable<Employee> FilterBySearchStringStandart(string[] keywordList, bool includeAddress, IQueryable<Employee> tmp)
    {
      var list = new List<Guid>();
      foreach (var keyword in keywordList)
      {
        foreach (var item in tmp)
        {
          var tmpWord = keyword.TrimEnd().TrimStart().ToLower();

          if (item.FirstName != null && item.FirstName.ToLower().Contains(tmpWord))
          {
            list.Add(item.Id);
          }
          if (item.SecondName != null && item.SecondName.ToLower().Contains(tmpWord))
          {
            list.Add(item.Id);
          }
          if (item.Name != null && item.Name.ToLower().Contains(tmpWord))
          {
            list.Add(item.Id);
          }
          if (item.MaidenName != null && item.MaidenName.ToLower().Contains(tmpWord))
          {
            list.Add(item.Id);
          }


          if (includeAddress)
          {
            foreach (var addr in item.Addresses)
            {
              if (addr.Street != null && addr.Street.ToLower().Contains(tmpWord))
              {
                list.Add(item.Id);
              }
              if (addr.Street2 != null && addr.Street2.ToLower().Contains(tmpWord))
              {
                list.Add(item.Id);
              }
              if (addr.Street3 != null && addr.Street3.ToLower().Contains(tmpWord))
              {
                list.Add(item.Id);
              }
              if (addr.City != null && addr.City.ToLower().Contains(tmpWord))
              {
                list.Add(item.Id);
              }
            }
          }
        }
      }

      tmp = tmp.Where(x => list.Contains(x.Id));
      return tmp;
    }

    private IQueryable<Employee> FilterBySearchStringExact(string[] keywordList, bool includeAddress, IQueryable<Employee> tmp)
    {
      foreach (var keyword in keywordList)
      {
        var tmpKeyword = keyword.TrimEnd().TrimEnd().ToLower();

        if (tmpKeyword.Contains("@"))
        {
          tmp = tmp.Where(co =>
            co.Communications.Any(com => com.Value.ToLower() == tmpKeyword));
        }
        else
        {

          if (includeAddress)
          {
            tmp = tmp.Where(co =>
                co.FirstName.ToLower().Contains(tmpKeyword) ||
                co.SecondName.ToLower().Contains(tmpKeyword) ||
                co.Name.ToLower().Contains(tmpKeyword) ||
                co.MaidenName.ToLower().Contains(tmpKeyword) ||
                co.Addresses.Any(ad => ad.Street.ToLower().Contains(tmpKeyword)) ||
                co.Addresses.Any(ad => ad.Street2.ToLower().Contains(tmpKeyword)) ||
                co.Addresses.Any(ad => ad.Street3.ToLower().Contains(tmpKeyword)) ||
                co.Addresses.Any(ad => ad.City.ToLower() == tmpKeyword)
            );
          }
          else
          {
            tmp = tmp.Where(co =>
                co.FirstName.ToLower().Contains(tmpKeyword) ||
                co.SecondName.ToLower().Contains(tmpKeyword) ||
                co.Name.ToLower().Contains(tmpKeyword) ||
                co.MaidenName.ToLower().Contains(tmpKeyword)
            );
          }

        }
      }

      return tmp;
    }

    private IQueryable<Employee> FilterBySearchStringFirstSymbol(string keyword, IQueryable<Employee> tmp)
    {

      tmp = tmp.Where(co =>
          co.Name.ToLower().Substring(0, 1) == keyword.ToLower());


      return tmp;
    }

    private IQueryable<Employee> FilterByAnnotation(bool? hasAnnotation, IQueryable<Employee> tmp)
    {


      if (hasAnnotation != null && hasAnnotation.Value) { tmp = tmp.Where(co => co.Annotations.Count > 0); }

      return tmp;
    }

    private IQueryable<Employee> FilterByGender(int[] gender, IQueryable<Employee> tmp)
    {

      tmp = tmp.Where(co => gender.Any(y => y == ((int)co.Gender)));

      return tmp;
    }

    private IQueryable<Employee> FilterByCountry(string[] country, IQueryable<Employee> tmp)
    {

      if (country.Length > 0)
      {
        tmp = tmp.Where(co => co.Addresses.Count == 0 || co.Addresses.Any(ad => ad.Country == "" || country.Contains(ad.Country)));
      }


      return tmp;
    }

    private IQueryable<Employee> FilterByMembership(bool activeMembership, bool formerMembership, bool futureMembership, IQueryable<Employee> tmp)
    {

      if (activeMembership && formerMembership && futureMembership)
      {
        //No need for filters
      }
      else
      {
        var nowDate = DateTime.Now.Date;
        //only active
        if (activeMembership && !formerMembership && !futureMembership)
        {
          tmp = tmp.Where(co =>
                          co.Staff.ValidFrom.Date <= nowDate &&
                          (co.Staff.ValidUntil.HasValue == false ||
                          (co.Staff.ValidUntil.HasValue && co.Staff.ValidUntil.Value.Date >= nowDate)
                          ));

        }
        //only former
        if (!activeMembership && formerMembership && !futureMembership)
        {
          tmp = tmp.Where(co =>
                         (co.Staff.ValidUntil.HasValue && co.Staff.ValidUntil.Value.Date < nowDate)
                         );

        }
        //only future
        if (!activeMembership && !formerMembership && futureMembership)
        {
          tmp = tmp.Where(co =>
                         (co.Staff.ValidFrom.Date > nowDate)
                         );

        }
        //former + active
        if (activeMembership && formerMembership && !futureMembership)
        {
          tmp = tmp.Where(co =>
                          co.Staff.ValidFrom.Date <= nowDate &&
                          (co.Staff.ValidUntil.HasValue == false ||
                          (co.Staff.ValidUntil.HasValue && co.Staff.ValidUntil.Value.Date > nowDate) ||
                          co.Staff.ValidUntil.HasValue && co.Staff.ValidUntil.Value.Date < nowDate
                          ));

        }

        //active + future
        if (activeMembership && !formerMembership && futureMembership)
        {
          tmp = tmp.Where(co =>
                           (co.Staff.ValidFrom.Date <= nowDate &&
                           (co.Staff.ValidUntil.HasValue == false ||
                           (co.Staff.ValidUntil.HasValue && co.Staff.ValidUntil.Value.Date > nowDate)) ||
                           (co.Staff.ValidFrom.Date > nowDate)
                           ));

        }

        //former + future
        if (!activeMembership && formerMembership && futureMembership)
        {
          tmp = tmp.Where(co =>
                        (co.Staff.ValidUntil.HasValue && co.Staff.ValidUntil.Value.Date < nowDate) ||
                        (co.Staff.ValidFrom.Date > nowDate)
                        );

        }
      }

      return tmp;
    }

    private IQueryable<Employee> Sort(string orderBy, string sortOrder, IQueryable<Employee> tmp)
    {
      if (sortOrder != "")
      {

        if (orderBy == "firstName")
        {
          return sortOrder == "asc" ? tmp.OrderBy(x => x.FirstName).ThenBy(x => x.Name) : tmp.OrderByDescending(x => x.FirstName).ThenByDescending(x => x.Name);
        }
        
        else if (orderBy == "name")
        {
          return sortOrder == "asc" ? tmp.OrderBy(x => x.Name).ThenBy(x => x.FirstName) : tmp.OrderByDescending(x => x.Name).ThenByDescending(x => x.FirstName);
        }
       
      }


      return tmp;
    }

    private IQueryable<Employee> FilterScope(bool? ScopeFromFlag, bool? ScopeUntilFlag, DateTime? ScopeFrom,
      DateTime? ScopeUntil, IQueryable<Employee> tmp)
    {
      if ((ScopeFromFlag.HasValue && ScopeFromFlag.Value) &&
          (ScopeUntilFlag.HasValue && ScopeUntilFlag.Value) &&
          (ScopeFrom.HasValue && ScopeUntil.HasValue))
      {
        return ScopeFrom2Date1(ScopeFrom.Value, ScopeUntil.Value, tmp);
      }
      else
      {
        if (ScopeFromFlag.HasValue && ScopeFromFlag.Value)
        {

          if ((ScopeFrom.HasValue && ScopeUntil.HasValue))
          {
            return ScopeFrom2Date(ScopeFrom.Value, ScopeUntil.Value, tmp);
          }
          else
          {
            return ScopeFrom1Date(ScopeFrom, ScopeUntil, tmp);
          }
        }
        else if (ScopeUntilFlag.HasValue && ScopeUntilFlag.Value)
        {

          if (ScopeFrom.HasValue && ScopeUntil.HasValue)
          {
            return ScopeUntil2Date(ScopeFrom.Value, ScopeUntil.Value, tmp);
          }
          else
          {
            return ScopeUntil1Date(ScopeFrom, ScopeUntil, tmp);
          }
        }

      }

      return tmp;
    }
    private IQueryable<Employee> ScopeFrom2Date1(DateTime ScopeFrom, DateTime ScopeUntil, IQueryable<Employee> tmp)
    {

      return tmp.Where(x => (x.Staff.ValidFrom.Date >= ScopeFrom.Date &&
                            x.Staff.ValidFrom.Date <= ScopeUntil.Date) ||
                            (x.Staff.ValidUntil.Value.Date >= ScopeFrom.Date &&
                            x.Staff.ValidUntil.Value.Date <= ScopeUntil.Date));
    }
    private IQueryable<Employee> ScopeFrom2Date(DateTime ScopeFrom, DateTime ScopeUntil, IQueryable<Employee> tmp)
    {

      return tmp.Where(x => x.Staff.ValidFrom.Date >= ScopeFrom.Date && x.Staff.ValidFrom.Date <= ScopeUntil.Date);
    }
    private IQueryable<Employee> ScopeFrom1Date(DateTime? ScopeFrom, DateTime? ScopeUntil, IQueryable<Employee> tmp)
    {

      if (ScopeFrom.HasValue)
      {
        return tmp.Where(x => x.Staff.ValidFrom.Date >= ScopeFrom.Value.Date);
      }
      else if (ScopeUntil.HasValue)
      {
        return tmp.Where(x => x.Staff.ValidFrom.Date <= ScopeUntil.Value.Date);
      }

      return tmp;
    }

    private IQueryable<Employee> ScopeUntil2Date(DateTime ScopeFrom, DateTime ScopeUntil, IQueryable<Employee> tmp)
    {
      return tmp.Where(x => x.Staff.ValidUntil.HasValue && (x.Staff.ValidUntil.Value.Date >= ScopeFrom.Date && x.Staff.ValidUntil.Value.Date <= ScopeUntil.Date));
    }

    private IQueryable<Employee> ScopeUntil1Date(DateTime? ScopeFrom, DateTime? ScopeUntil, IQueryable<Employee> tmp)
    {

      if (ScopeFrom.HasValue)
      {
        return tmp.Where(x => x.Staff.ValidUntil.HasValue && x.Staff.ValidUntil.Value.Date >= ScopeFrom.Value.Date);
      }
      else if (ScopeUntil.HasValue)
      {
        return tmp.Where(x => x.Staff.ValidUntil.Value.Date <= ScopeUntil.Value.Date);
      }

      return tmp;
    }

  }
}
