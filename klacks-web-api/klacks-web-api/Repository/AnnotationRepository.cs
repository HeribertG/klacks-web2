


using klacks_web_api.Data;
using klacks_web_api.Interface;
using klacks_web_api.Models.Employee;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace klacks_web_api.Repository
{
  public class AnnotationRepository : IAnnotationRepository
  {
    private readonly DatabaseContext context;
    public AnnotationRepository(DatabaseContext context)
    {
      this.context = context;
    }

    public void AddAnnotation(Annotation annotation)
    {
      context.Annotation.Add(annotation);
    }

    public bool AnnotationExists(Guid id)
    {
      return context.Annotation.Any(e => e.Id == id);
    }

    public async Task<Annotation> DeleteAnnotation(Guid id)
    {
      var annotation = await context.Annotation.SingleOrDefaultAsync(x => x.Id == id);
      context.Remove(annotation);
      return annotation;
    }

    public async Task<Annotation> GetAnnotation(Guid id)
    {
      return await context.Annotation.SingleOrDefaultAsync(x => x.EmployeeId == id);
    }

    public async Task<List<Annotation>> GetAnnotationList()
    {
      return await context.Annotation.ToListAsync();
    }



    public Annotation PutAnnotation(Annotation annotation)
    {
      context.Entry(annotation).State = EntityState.Modified;

      return annotation;
    }

    public void RemoveAnnotation(Annotation annotation)
    {
      context.Remove(annotation);

    }
  }
}
