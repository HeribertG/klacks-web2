
using klacks_web_api.Data;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace klacks_web_api.Image
{
  public class Image : BaseEntity
  {
    [Key]
    public Guid Id { get; set; }
          
    public int Type { get; set; }
    [Column(TypeName = "text")]
    public string Path { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public Guid DocumentType { get; set; }
    public string AdditionalData { get; set; }
   
  }
}
