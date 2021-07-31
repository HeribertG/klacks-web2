
using System;
using System.IO;
using System.Threading.Tasks;
using klacks_web_api.Data;
using klacks_web_api.Image;
using klacks_web_api.Interface;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;


namespace SVA.API.Repository
{
  public class LoadFileRepository :ILoadFileRepository
  {

    private DatabaseContext context;
    private readonly IConfiguration configuration;

    public LoadFileRepository(DatabaseContext context,IConfiguration configuration) 
    {
      this.context = context;
      this.configuration = configuration;
    }

    public void AddImage(Image image)
    {
      
      context.Image.Add(image);
    }
    public Image UpdateImage(Image image)
    {
      context.Image.Update(image);

      return image;
    }
    public async Task<Image> DeleteImage(Guid id)
    {
      var image = await context.Image.SingleOrDefaultAsync(p => p.Id == id);

      if (image != null) { context.Image.Remove(image); }

     

      return image;
    }

    public async Task<Image> GetImage(Guid id)
    {
      return await context.Image.FindAsync(id);
    }

    public async Task<byte[]> GetImageData(Image image)
    {
      if (image == null)
      {
        return null;
      }

      var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
      var path = configuration["CurrentPaths:Images"];
      var imagePath = Path.Combine(baseDirectory, path, image.Path);
      try
      {
        byte[] result = await File.ReadAllBytesAsync(imagePath);
        return result;

      }
      catch (Exception)
      {
        return null;
      }
    }


    public string GetMimeTypeFromFilename(string filename)
    {
      var provider = new FileExtensionContentTypeProvider();
      string contentType;
      if (!provider.TryGetContentType(filename, out contentType))
      {
        contentType = "application/octet-stream";
      }
      return contentType;
    }
  }
}
