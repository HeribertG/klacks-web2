using klacks_web_api.Models.Authentfication;
using klacks_web_api.Resources;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace klacks_web_api.Interface
{
  public interface IAccountRepository
  {
    Task<AuthenticatedResult> RegisterUser(AppUser user, string password);
    Task<AuthenticatedResult> LogInUser(string userName, string password);
    Task<List<UserResource>> GetUserList();
    Task<HttpResultResource> DeleteAccountUser(Guid id);

    Task<AuthenticatedResult> ChangePasswordUser(ChangePasswordResource model);

    Task<HttpResultResource> ChangeRoleUser(ChangeRole editUserRole);

    Task<AuthenticatedResult> SentPasswordUser(ChangePasswordResource model);

    Task<AuthenticatedResult> RefreshToken(RefreshRequestResource model);
    int CountUser(string username);
   
  }
}
