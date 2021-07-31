using System;
using System.Threading.Tasks;
namespace klacks_web_api.Interface
{
  public interface IImageRepository
  {
    public Task<Image.Image> GetImage(Guid id);
    public Task<byte[]> GetImageData(Image.Image image);
    public string GetMimeTypeFromFilename(string filename);
  }
}
