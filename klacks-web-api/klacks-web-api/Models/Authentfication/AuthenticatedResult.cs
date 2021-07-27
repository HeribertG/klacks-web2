using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;

namespace klacks_web_api.Models.Authentfication
{
  public class AuthenticatedResult
  {
    public string Token { get; set; }
    public bool Success { get; set; }
    public ModelStateDictionary ModelState { get; set; }
    public string Message { get; set; }
    public DateTime Expires { get; set; }
    public string UserName { get; set; }
    public string FirstName { get; set; }
    public string Name { get; set; }
    public string Id { get; set; }
    public bool IsAdmin { get; set; }
    public bool IsAuthorised { get; set; }
    public string RefreshToken { get; set; }
    public string TotpHash { get; set; }
    public bool TotpEnabled { get; set; } = false;
    public bool IsClient { get; set; } = false;
    public Guid? ClientId { get; set; }
    public String PasswortResetToken { get; set; }
  }
}
