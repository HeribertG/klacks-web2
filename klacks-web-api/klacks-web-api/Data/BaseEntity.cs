using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace klacks_web_api.Data
{
  [NotMapped]
  public class BaseEntity
  {
    public DateTime? CreateTime { get; set; }

    public string CurrentUserCreated { get; set; }

    public DateTime? UpdateTime { get; set; }

    public string CurrentUserUpdated { get; set; }

    public DateTime? DeletedTime { get; set; }

    public bool IsDeleted { get; set; }

    public string CurrentUserDeleted { get; set; }

  }
}
