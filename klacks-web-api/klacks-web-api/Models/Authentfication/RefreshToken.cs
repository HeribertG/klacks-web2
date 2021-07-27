using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace klacks_web_api.Models.Authentfication
{
  public class RefreshToken
  {
    [Key]
    [Column("Id")]
    public Guid Id { get; set; }
    public string AspNetUsersId { get; set; }
    [MaxLength(100)]
    public string Token { get; set; }
    public DateTime ExpiryDate { get; set; }
  }
}
