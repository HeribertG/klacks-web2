

namespace klacks_web_api.Resources.Filter
{
  public class BaseTruncatedResult
  {
    public int MaxItems { get; set; }
    public int MaxPages { get; set; }
    public int CurrentPage { get; set; }
    public int FirstItemOnPage { get; set; }
  }
}
