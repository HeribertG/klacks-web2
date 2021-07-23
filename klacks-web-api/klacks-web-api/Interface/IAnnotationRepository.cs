using klacks_web_api.Models.Employee;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;



namespace klacks_web_api.Interface
{
  public interface IAnnotationRepository
  {
    Task<List<Annotation>> GetAnnotationList();
    Task<Annotation> GetAnnotation(Guid id);
    void AddAnnotation(Annotation annotation);
    Annotation PutAnnotation(Annotation annotation);
    void RemoveAnnotation(Annotation annotation);
    Task<Annotation> DeleteAnnotation(Guid id);

    bool AnnotationExists(Guid id);
  }
}
