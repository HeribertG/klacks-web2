
using klacks_web_api.Data;
using klacks_web_api.Image;
using klacks_web_api.Interface;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;


namespace SVA.API.Repository
{
  public class ImageRepository : IImageRepository
  {
    private readonly DatabaseContext _context;
    private readonly IConfiguration _configuration;

    public ImageRepository(DatabaseContext context, IConfiguration configuration)
    {
      this._context = context;
      this._configuration = configuration;
    }

    public async Task<Image> GetImage(Guid id)
    {
      return await _context.Image.FindAsync(id);
    }

    public async Task<byte[]> GetImageData(Image image)
    {
      if (image == null)
      {
        return null;
      }

      var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
      var path = _configuration["CurrentPaths:Images"];
      var imagePath = Path.Combine(baseDirectory, path, image.Path);
      try
      {
        byte[] result = await System.IO.File.ReadAllBytesAsync(imagePath);
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
