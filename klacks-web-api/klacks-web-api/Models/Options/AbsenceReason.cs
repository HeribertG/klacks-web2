using System;

namespace klacks_web_api.Models.Options
{
  public class AbsenceReason
  {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Abbreviation { get; set; }
    public string BackgroundColor { get; set; }
    public string  Description { get; set; }
    public int Defaultlenght { get; set; }
    public decimal DefaultValue { get; set; }
    public bool WithSaturday { get; set; }
    public bool WithSunday { get; set; }
    public bool WithHoliday { get; set; }
    public bool IsWork { get; set; }

  }
}
