namespace klacks_web_api.Resources.Filter
{
  public class BaseFilter
  {
    public string OrderBy { get; set; }
    public string SortOrder { get; set; }
    public int NumberOfItemsPerPage { get; set; }
    public int RequiredPage { get; set; }
    public int? FirstItemOnLastPage { get; set; }
    public int? NumberOfItemOnPreviousPage { get; set; }
    public bool? IsPreviousPage { get; set; }
    public bool? IsNextPage { get; set; }
  }
}
