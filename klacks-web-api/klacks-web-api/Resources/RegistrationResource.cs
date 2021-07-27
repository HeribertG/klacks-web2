

namespace klacks_web_api.Resources
{

  public class RegistrationResource
  {

    public string UserName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public bool SendEmail { get; set; } = false;

  }


  public class ChangePasswordResource
  {

    public string UserName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string OldPassword { get; set; }
    public string Password { get; set; }
    public string Token { get; set; }

  }


  
}
