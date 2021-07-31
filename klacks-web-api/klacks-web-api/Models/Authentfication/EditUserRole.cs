namespace klacks_web_api.Models.Authentification
{
  public class ChangeRole
  {
    public string UserId { get; set; }

    public string RoleName { get; set; }

    public bool IsSelected { get; set; }
  }
}
