using System.ComponentModel.DataAnnotations;

namespace klacks_web_api.Models.Options
{
  public class CommunicationType
  {
    [Key]
    public int Id { get; set; }

    public string Name { get; set; }

    public int Type { get; set; }

    public int Category { get; set; }

    public int DefaultIndex { get; set; }
  }
}
