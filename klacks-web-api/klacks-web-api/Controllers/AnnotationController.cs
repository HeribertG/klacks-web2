using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using klacks_web_api.Interface;
using klacks_web_api.Models.Employee;
using klacks_web_api.Resources;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace klacks_web_api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AnnotationController : ControllerBase
  {
    private readonly IMapper mapper;
    private readonly IAnnotationRepository repository;
    private readonly IUnitOfWork unitOfWork;

    public AnnotationController(IMapper mapper,
                                 IAnnotationRepository repository,
                                 IUnitOfWork unitOfWork)
    {
      this.mapper = mapper;
      this.repository = repository;
      this.unitOfWork = unitOfWork;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<AnnotationResource>>> GetAnnotation()
    {
      var annotation = await repository.GetAnnotationList();
      return mapper.Map<List<Annotation>, List<AnnotationResource>>(annotation);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<AnnotationResource>> GetAnnotation(Guid id)
    {
      var annotation = await repository.GetAnnotation(id);

      if (annotation == null)
      {
        return NotFound();
      }

      return mapper.Map<Annotation, AnnotationResource>(annotation);
    }


    [HttpPut]
    public async Task<ActionResult<AnnotationResource>> PutAnnotation(AnnotationResource annotationResource)
    {

      var dbAnnotation = await repository.GetAnnotation(annotationResource.Id);
      var annotation = mapper.Map(annotationResource, dbAnnotation);
      
      if (annotation == null)
        return NotFound();

      annotation = repository.PutAnnotation(annotation);


      try
      {
        await unitOfWork.CompleteAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!repository.AnnotationExists(annotationResource.Id))
        {
          return NotFound();
        }
        else
        {
          return NoContent();
        }
      }

      return mapper.Map<Annotation, AnnotationResource>(annotation);
    }

    [HttpPost]
    public async Task<ActionResult<AnnotationResource>> PostAnnotation(AnnotationResource annotationResource)
    {
      var annotation = mapper.Map<AnnotationResource, Annotation>(annotationResource);

      repository.AddAnnotation(annotation);

      await unitOfWork.CompleteAsync();

      var annotationResource1 = mapper.Map<Annotation, AnnotationResource>(annotation);
      return Ok(annotationResource1);
    }


    [HttpDelete("{id}")]
    public async Task<ActionResult<AnnotationResource>> DeleteAnnotation(Guid id)
    {
      var annotation = await repository.DeleteAnnotation(id);


      await unitOfWork.CompleteAsync();

      var annotationResource = mapper.Map<Annotation, AnnotationResource>(annotation);
      return Ok(annotationResource);
    }

    //[HttpGet("GetSimpleAnnotation/{id}")]
    //public async Task<ActionResult<IEnumerable<AnnotationResource>>> GetSimpleAnnotation(Guid id)
    //{
    //  var annotation = await repository.GetSimpleAnnotationList(id);
    //  return mapper.Map<List<Annotation>, List<AnnotationResource>>(annotation);
    //}

  }
}
