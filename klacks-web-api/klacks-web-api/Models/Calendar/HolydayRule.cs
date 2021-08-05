

using System;

namespace klacks_web_api.Models
{
  public class HolydayRule
  {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Rule { get; set; }
    public string SubRule {  get; set; }
    public string Description { get; set; }
    public bool Visible { get; set; }
    public bool Paid { get; set; }

  }
}
