using klacks_web_api.Data;
using klacks_web_api.Helper;
using klacks_web_api.Interface;
using klacks_web_api.Models.Authentfication;
using klacks_web_api.Resources;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using klacks_web_api.Models.Authentification;

namespace klacks_web_api.Repository
{
  public class AccountRepository : IAccountRepository
  {

    private readonly DatabaseContext _appDbContext;
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly JwtSettings _jwtSettings;

    public AccountRepository(
      UserManager<AppUser> userManager,
      RoleManager<IdentityRole> roleManager,
      DatabaseContext appDbContext,
      JwtSettings jwtSettings)
    {
      _userManager = userManager;
      _roleManager = roleManager;
      _appDbContext = appDbContext;
      _jwtSettings = jwtSettings;
    }




    #region user
    public async Task<AuthenticatedResult> RegisterUser(AppUser user, string password)
    {
      var authenticatedResult = new AuthenticatedResult();
      var existingUser = await _userManager.FindByEmailAsync(user.Email);

      if (existingUser != null)
      {
        authenticatedResult.Success = false;
        if (authenticatedResult.ModelState == null)
        {
          authenticatedResult.ModelState = new ModelStateDictionary();
        }
        authenticatedResult.ModelState.TryAddModelError("user exist", "User with this email address already exist");

        return authenticatedResult;
      }

      user.UserName = FormatHelper.ReplaceUmlaud(user.UserName);
      var result = await _userManager.CreateAsync(user, password);

      if (!result.Succeeded)
      {
        authenticatedResult.Success = false;

        authenticatedResult.ModelState = AddErrorsToModelState(result, authenticatedResult.ModelState);

        return authenticatedResult;

      }

      await _appDbContext.SaveChangesAsync();
      var expires = SetExpires();
      authenticatedResult.Token = CreateToken(user, expires);
      authenticatedResult.Success = true;
      authenticatedResult.Expires = expires;
      authenticatedResult = await SetAuthenticatedResult(authenticatedResult, user, expires);

      var mail = new MsgEMail(_appDbContext);
      var appName = "sva";

      var message = $"<h2><strong>Ihr Passwort f&uuml;r unsere Applikation&nbsp;{appName}.</strong></h2><p>{password}</p><p>Bitte benutzen sie dieses automatisch generierte Passwort nur einmal.</p><p>Sie k&ouml;nnen jederzeit ihr Passwort unter Profile um&auml;ndern.</p><p>&nbsp;</p><p>Freundliche Gr&uuml;sse</p><p>Ihre Administration</p>";
      authenticatedResult.Success = mail.SendMail(user.Email, "Ihre Zugangsdaten", message);

      return authenticatedResult;
    }

    public async Task<AuthenticatedResult> LogInUser(string email, string password)
    {
      var user = await _userManager.FindByEmailAsync(email);
      var currentUser = await _userManager.CheckPasswordAsync(user, password);

      if (currentUser)
      {
        return await GenerateAuthentication(user);
      }
      else
      {
        var authenticatedResult = new AuthenticatedResult
        {
          Success = false,
          ModelState = new ModelStateDictionary()
        };
        authenticatedResult.ModelState.TryAddModelError("user not exist", "outgoingserverUsername or outgoingserverPassword is not valid");

        return authenticatedResult;
      }

    }

    public async Task<AuthenticatedResult> RefreshToken(RefreshRequestResource model)
    {
      var user = GetUserFromAccessToken(model.Token);
      bool isValid = false;

      if (user != null)
      {
        var refreshToken = _appDbContext.RefreshToken.Where(x => x.AspNetUsersId == user.Id && x.Token == model.RefreshToken).FirstOrDefault();
        if (refreshToken != null && refreshToken.ExpiryDate >= DateTime.Now) { isValid = true; }

      }

      if (isValid == true && ValidateRefreshToken(user, model.RefreshToken))
      {
        return await GenerateAuthentication(user, false);
      }

      return null;
    }

    public async Task<AuthenticatedResult> ChangePasswordUser(ChangePasswordResource model)
    {
      var authenticatedResult = new AuthenticatedResult();
      var existingUser = await _userManager.FindByEmailAsync(model.Email);

      if (existingUser == null)
      {
        authenticatedResult.Success = false;
        if (authenticatedResult.ModelState == null)
        {
          authenticatedResult.ModelState = new ModelStateDictionary();
        }
        authenticatedResult.ModelState.TryAddModelError("user exist nicht ", "User with this email address do not  exist");

        return authenticatedResult;
      }

      try
      {

        var resetPassResult = await _userManager.ChangePasswordAsync(existingUser, model.OldPassword, model.Password);
        if (resetPassResult.Succeeded)
        {
          authenticatedResult.Success = resetPassResult.Succeeded;
        }
        else
        {
          authenticatedResult.ModelState = AddErrorsToModelState(resetPassResult, authenticatedResult.ModelState);
        }
      }
      catch (Exception e)
      {
        authenticatedResult.Success = false;

        authenticatedResult.ModelState.TryAddModelError(e.Message, "");
      }

      return authenticatedResult;
    }

    public async Task<HttpResultResource> DeleteAccountUser(Guid id)
    {
      var res = new HttpResultResource();
      try
      {
        var user = await _appDbContext.AppUser.SingleOrDefaultAsync(x => x.Id == id.ToString());
        _appDbContext.Remove(user);
        await _appDbContext.SaveChangesAsync();
        res.Success = true;

      }
      catch (Exception e)
      {
        res.Success = false;
        res.Messages = e.Message;
      }


      return res;
    }

    public async Task<HttpResultResource> ChangeRoleUser(Models.Authentfication.ChangeRole editUserRole)
    {

      var user = await _userManager.FindByIdAsync(editUserRole.UserId);
      IdentityResult result = null;
      var res = new HttpResultResource();

      if (editUserRole.IsSelected && !(await _userManager.IsInRoleAsync(user, editUserRole.RoleName)))
      {
        result = await _userManager.AddToRoleAsync(user, editUserRole.RoleName);
      }
      else if (!editUserRole.IsSelected && await _userManager.IsInRoleAsync(user, editUserRole.RoleName))
      {
        result = await _userManager.RemoveFromRoleAsync(user, editUserRole.RoleName);
      }


      if (result == null || result.Succeeded)
      {
        res.Success = true;
        return res;
      }

      foreach (var r in result.Errors)
      {
        res.Messages += r.Description + " ";
      }

      res.Success = false;

      return res;
    }

    public async Task<AuthenticatedResult> SentPasswordUser(ChangePasswordResource model)
    {
      var authenticatedResult = new AuthenticatedResult();

      var existingUser = await _userManager.FindByEmailAsync(model.Email);

      if (existingUser == null)
      {
        authenticatedResult.Success = false;
        if (authenticatedResult.ModelState == null)
        {
          authenticatedResult.ModelState = new ModelStateDictionary();
        }
        authenticatedResult.ModelState.TryAddModelError("user exist nicht ", "User with this email address do not  exist");

        return authenticatedResult;
      }


      try
      {

        var removePassResult = await _userManager.RemovePasswordAsync(existingUser);


        if (!removePassResult.Succeeded)
        {
          authenticatedResult.ModelState = AddErrorsToModelState(removePassResult, authenticatedResult.ModelState);
          return authenticatedResult;
        }
      }
      catch (Exception e)
      {
        authenticatedResult.Success = false;

        authenticatedResult.ModelState.TryAddModelError(e.Message, "");
        return authenticatedResult;
      }


      try
      {
        var addPassResult = await _userManager.AddPasswordAsync(existingUser, model.Password);

        if (addPassResult.Succeeded)
        {

          var mail = new MsgEMail(_appDbContext);

          var message = $"<h2><strong>Ihr Passwort wurde ge&auml;ndert.</strong></h2><p> {model.Password}</p><p> Bitte benutzen sie dieses automatisch generierte Passwort nur einmal.</p><p> Sie k&ouml;nnen jederzeit ihr Passwort unter Profile um&auml;ndern.</p><p> &nbsp;</p><p> Freundliche Gr&uuml;sse </p><p> Ihre Administration</p>";
          authenticatedResult.Success = mail.SendMail(model.Email, "Passwort wurde geändert", message);
        }
        else
        {
          authenticatedResult.ModelState = AddErrorsToModelState(addPassResult, authenticatedResult.ModelState);
        }
      }
      catch (Exception e)
      {
        authenticatedResult.Success = false;

        authenticatedResult.ModelState.TryAddModelError(e.Message, "");
      }

      return authenticatedResult;
    }

    private AppUser GetUserFromAccessToken(string token)
    {
      var tokenHandler = new JwtSecurityTokenHandler();

      var tokenValidationParameters = new TokenValidationParameters
      {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret)),
        ValidateIssuer = false,
        ValidateAudience = false,
        RequireAudience = false,
        RequireExpirationTime = false,
        ValidateLifetime = true
      };

      SecurityToken securityToken = null;
      JwtSecurityToken jwtSecurityToken = null;
      AppUser user = null;

      try
      {
        tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
      }
      catch (Exception)
      {

      }
      finally
      {


        if (securityToken != null)
        {
          jwtSecurityToken = securityToken as JwtSecurityToken;
        }

        if (jwtSecurityToken != null && jwtSecurityToken.Header.Alg == "HS256")
        {
          var userId = jwtSecurityToken.Claims.Where(x => x.Type == "Id").FirstOrDefault();


          user = _appDbContext.AppUser.Where(x => x.Id == userId.Value).FirstOrDefault();

        }
      }



      return user;
    }


    private async Task<AuthenticatedResult> GenerateAuthentication(AppUser user, bool withRefreshToken = true)
    {
      var authenticatedResult = new AuthenticatedResult();

      var expires = SetExpires();

      if (withRefreshToken)
      {

        var refreshToken = new RefreshToken
        {
          AspNetUsersId = user.Id,
          Token = (new RefreshTokenGenerator()).GenerateRefreshToken(),
          ExpiryDate = DateTime.Now.AddHours(20)
        };
        _appDbContext.RefreshToken.Add(refreshToken);

        await _appDbContext.SaveChangesAsync();

        authenticatedResult.RefreshToken = refreshToken.Token;

      }



      authenticatedResult.Token = CreateToken(user, expires);
      authenticatedResult.Success = true;
      authenticatedResult = await SetAuthenticatedResult(authenticatedResult, user, expires);


      return authenticatedResult;
    }

    private bool ValidateRefreshToken(AppUser user, string refreshToken)
    {
      var refreshTokenUser = _appDbContext.RefreshToken.Where(x => x.Token == refreshToken)
                            .OrderByDescending(x => x.ExpiryDate)
                            .FirstOrDefault();

      if (refreshTokenUser != null && refreshTokenUser.AspNetUsersId == user.Id &&
          refreshTokenUser.ExpiryDate > DateTime.UtcNow)
      {
        return true;
      }


      return false;
    }

    private async Task<IdentityResult> SetClientRole(AppUser user)
    {

      var roleExist = await _roleManager.RoleExistsAsync("Client");

      if (!roleExist)
      {
        await _roleManager.CreateAsync(new IdentityRole("Client"));
      }

      return await _userManager.AddToRoleAsync(user, "Client");
    }


    #endregion user

    public int CountUser(string username)
    {
      return _appDbContext.AppUser.Count(x => x.UserName.Contains(username));
    }

    private string CreateToken(AppUser user, DateTime expires)
    {
      var tokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.UTF8.GetBytes(_jwtSettings.Secret);
      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new[]
          {
           new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
           new Claim(JwtRegisteredClaimNames.Sub, user.FirstName),
           new Claim(JwtRegisteredClaimNames.Sub, user.LastName),
           new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
           new Claim(JwtRegisteredClaimNames.Email, user.Email),
           new Claim("Id", user.Id)

                }),
        Expires = expires,
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
      };

      var token = tokenHandler.CreateToken(tokenDescriptor);

      return tokenHandler.WriteToken(token);
    }

    private ModelStateDictionary AddErrorsToModelState(IdentityResult identityResult, ModelStateDictionary modelState)
    {
      if (modelState == null)
      {
        modelState = new ModelStateDictionary();
      }
      foreach (var e in identityResult.Errors)
      {
        modelState.TryAddModelError(e.Code, e.Description);
      }

      return modelState;
    }

    private DateTime SetExpires()
    {
      return DateTime.Now.AddMinutes(15);

    }

    private async Task<AuthenticatedResult> SetAuthenticatedResult(AuthenticatedResult authenticatedResult, AppUser user, DateTime expires)
    {
     
      var email = user.Email;



      authenticatedResult.Token = CreateToken(user, expires);
      authenticatedResult.Success = true;
      authenticatedResult.Expires = expires;
      authenticatedResult.UserName = user.UserName;
      authenticatedResult.FirstName = user.FirstName;
      authenticatedResult.Name = user.LastName;
      authenticatedResult.Id = user.Id;
      authenticatedResult.IsAdmin = await _userManager.IsInRoleAsync(user, "Admin");
      authenticatedResult.IsAuthorised = await _userManager.IsInRoleAsync(user, "Authorised");

      return authenticatedResult;
    }

    public async Task<List<UserResource>> GetUserList()
    {
      var result = new List<UserResource>();
      var lst = await _appDbContext.AppUser.ToListAsync();

      foreach (var item in lst)
      {
        var c = new UserResource
        {
          Id = item.Id,
          UserName = item.UserName,
          FirstName = item.FirstName,
          LastName = item.LastName,
          Email = item.Email,
          IsAuthorised = await _userManager.IsInRoleAsync(item, "Authorised"),
          IsAdmin = await _userManager.IsInRoleAsync(item, "Admin"),
        };

        result.Add(c);
      }


      return result;
    }
  }
}
