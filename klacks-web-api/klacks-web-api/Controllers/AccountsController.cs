using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using klacks_web_api.Interface;
using klacks_web_api.Resources;
using klacks_web_api.Models.Authentfication;

namespace klacks_web_api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AccountsController : ControllerBase
  {

    private readonly IMapper mapper;
    private readonly IAccountRepository repository;

    public AccountsController(IAccountRepository repository, IMapper mapper)
    {
      this.repository = repository;
      this.mapper = mapper;

    }

    /// <summary> 
    /// Listet alle User auf.
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserResource>>> GetUserList()
    {
      return await repository.GetUserList();
     
    }

    
    [HttpPost("RegisterUser")]
    public async Task<ActionResult> RegisterUser([FromBody] RegistrationResource model)
    {

      var userIdentity = mapper.Map<AppUser>(model);

      var result = await repository.RegisterUser(userIdentity, model.Password);

      
      if (result.Success) { return Ok(result); }

      return BadRequest(result);
    }

    [HttpPost("ChangePasswordUser")]
    public async Task<ActionResult> ChangePasswordUser([FromBody] ChangePasswordResource model)
    {

      
      var result = await repository.ChangePasswordUser(model);

      if (result.Success) { return Ok(result); }

      return BadRequest(result);
    }

    [AllowAnonymous]
    [HttpPost("LoginUser")]
    public async Task<ActionResult<JWTTokenResource>> LoginUser([FromBody] LogInResource model)
    {
      var response = new JWTTokenResource();
      AuthenticatedResult result ;

      try
      {
        response.Success = false;
        response.ErrorMessage = "";
        response.Subject = model.Email;

        result = await repository.LogInUser(model.Email, model.Password);

        if (result.Success)
        {

          var version = new Version();
          var currentVersion = version.Get();

          response.Success = true;
          response.Token = result.Token;
          response.Username = result.UserName;
          response.FirstName = result.FirstName;
          response.Name = result.Name;
          response.Id = result.Id;
          response.ExpTime = result.Expires;
          response.IsAdmin = result.IsAdmin;
          response.IsAuthorised = result.IsAuthorised;
          response.RefreshToken = result.RefreshToken;
          
          response.Version = currentVersion;

          return Ok(response);

        }
      }
      catch (Exception ex)
      {
        response.ErrorMessage = ex.Message;
        throw;
      }



      return Ok(result.ModelState);
    }

    [AllowAnonymous]
    [HttpPost("RefreshToken")]
    public async Task<ActionResult<JWTTokenResource>> RefreshToken([FromBody] RefreshRequestResource model)
    {
      var response = new JWTTokenResource();
      AuthenticatedResult result;

      try
      {
        response.Success = false;
        response.ErrorMessage = "";
        
        result = await repository.RefreshToken(model);

        if (result != null && result.Success)
        {
          var version = new Version();
          var currentVersion = version.Get();

          response.Success = true;
          response.Token = result.Token;
          response.Username = result.UserName;
          response.FirstName = result.FirstName;
          response.Name = result.Name;
          response.Id = result.Id;
          response.ExpTime = result.Expires;
          response.IsAdmin = result.IsAdmin;
          response.IsAuthorised = result.IsAuthorised;

          response.Version = currentVersion;

          return Ok(response);

        }
        else
        {

          response = new JWTTokenResource
          {
            ErrorMessage = "Ihre Anmeldung ist abgelaufen",
            Success = false
          };

          return Ok(response);
        }
      }
      catch (Exception ex)
      {
        response.Success = false;
        response.ErrorMessage = ex.Message;
      }

      return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAccountUser(Guid id)
    {
     
      var res=  await repository.DeleteAccountUser(id);

      if (res.Success) { return Ok(res); }

      return BadRequest(res);
    }

    [HttpPut("SentPasswordUser")]
    public async Task<ActionResult> SentPasswordUser([FromBody] ChangePasswordResource model)
    {

      var result = await repository.SentPasswordUser(model);


      if (result.Success) { return Ok(result); }

      return BadRequest(result);

     
    }

    [HttpPut("ChangeRoleUser")]
    public async Task<ActionResult> ChangeRoleUser([FromBody] ChangeRole changeRole)
    {

      var res = await repository.ChangeRoleUser(changeRole);
      if (res != null) { return Ok(res); }

      return BadRequest((HttpResultResource) null);

    }

  }
}
