using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using klacks_web_api.Helper;
using klacks_web_api.Image;
using klacks_web_api.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;


namespace SVA.API.Controllers.Backend
{
  [Route("api/[controller]")]
  [ApiController]
  public class LoadFileController : ControllerBase
  {

    private readonly IConfiguration configuration;
    private readonly ILoadFileRepository repository;
    private readonly IUnitOfWork unitOfWork;

    public LoadFileController(IConfiguration configuration, ILoadFileRepository repository, IUnitOfWork unitOfWork)
    {
      this.repository = repository;
      this.unitOfWork = unitOfWork;
      this.configuration = configuration;
    }
    [HttpPost("Upload")]
    public ActionResult SingleFile(IFormFile file)
    {
      if (file != null)
      {
        var sf = new UploadFile(configuration);

        sf.StoreFile(file);

        return Ok();
      }
      return Ok("No File");
    }

    [HttpGet("DownLoad")]
    public async Task<FileContentResult> SingleFile(string type)
    {
      try
      {
        var task = await Task.Factory.StartNew((export) =>
        {

          var path = GetFileFromDocumentDirectory((string)export);

          if (path != null)
          {

            byte[] result = System.IO.File.ReadAllBytes(path);
            return File(result, "image/png");

          }
          else
          {
            return File(Encoding.UTF8.GetBytes("File nicht gefunden"), "text/plain");
          }

        }, type);


        return task;

      }
      catch (Exception ex)
      {
        return File(Encoding.UTF8.GetBytes(ex.Message), "text/plain");
      }
    }

    [HttpDelete("{type}")]
    public ActionResult DeleteFile(string type)
    {
      var path = GetFileFromDocumentDirectory(type);
      if (System.IO.File.Exists(path))
      {
        System.IO.File.Delete(path);
      }
      return Ok();
    }

    private string GetFileFromDocumentDirectory(string type)
    {
      if (type.Contains("profile"))
      {
        var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
        var path = configuration["CurrentPaths:Images"];
        var docuDirectory = Path.Combine(baseDirectory, path);

        if (Directory.Exists(docuDirectory))
        {


          if (System.IO.File.Exists(Path.Combine(docuDirectory, type + ".png")))
          {
            return Path.Combine(docuDirectory, type + ".png");
          }
          else if (System.IO.File.Exists(Path.Combine(docuDirectory, type + ".jpg")))
          {
            return Path.Combine(docuDirectory, type + ".jpg");
          }
          else if (System.IO.File.Exists(Path.Combine(docuDirectory, type + ".jpeg")))
          {
            return Path.Combine(docuDirectory, type + ".jpeg");
          }
          else if (System.IO.File.Exists(Path.Combine(docuDirectory, type + ".gif")))
          {
            return Path.Combine(docuDirectory, type + ".gif");
          }
          
        }
      }
      else if (type== "own-icon.ico")
      {
        var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
        var path = configuration["CurrentPaths:Images"];
        var docuDirectory = Path.Combine(baseDirectory, path);

        if (Directory.Exists(docuDirectory))
        {
          return Path.Combine(docuDirectory, "own-icon.ico");
        }
      }
      else if (type == "own-logo.png")
      {
        var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
        var path = configuration["CurrentPaths:Images"];
        var docuDirectory = Path.Combine(baseDirectory, path);

        if (Directory.Exists(docuDirectory))
        {
          return Path.Combine(docuDirectory, "own-logo.png");
        }
      }
      else
      {
         
      }

      return null;
    }

    [HttpGet("GetSimpleImage")]
    public async Task<IActionResult> GetImageSimple(Guid guid)
    {
      var dbImage = await repository.GetImage(guid);
      if (dbImage != null)
      {
        var imgData = await repository.GetImageData(dbImage);
        if (imgData != null)
        {

          return File(imgData, "image/png", dbImage.Path);
        }
      }

      return NotFound();
    }

    [HttpPost("Image")]
    public async Task<ActionResult<Image>> PostImage([FromBody] Image image)
    {

      repository.AddImage(image);
      
      await unitOfWork.CompleteAsync();

      return Ok(image);
    }

    [HttpPut("Image")]
    public async Task<ActionResult<Image>> PutImage([FromBody] Image image)
    {

      var img = repository.UpdateImage(image);
     

      await unitOfWork.CompleteAsync();

      return Ok(img);
    }



    [HttpDelete("DeleteImage/{id}")]
    public async Task<ActionResult<Image>> DeleteImage(Guid id)
    {

      var image = await repository.DeleteImage(id);
      
      await unitOfWork.CompleteAsync();

      return Ok(image);
    }
  }
}
