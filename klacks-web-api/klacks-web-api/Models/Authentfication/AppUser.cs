using Microsoft.AspNetCore.Identity;
using System;

namespace klacks_web_api.Models.Authentfication
{
  public class AppUser : IdentityUser
  {
    // Extended Properties
    public string FirstName { get; set; }
    public string LastName { get; set; }
  }
}
