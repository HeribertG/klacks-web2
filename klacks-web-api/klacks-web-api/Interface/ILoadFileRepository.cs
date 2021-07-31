

using System;
using System.Threading.Tasks;

namespace klacks_web_api.Interface
{
  public interface ILoadFileRepository
  {

    void AddImage(Image.Image image);
    Image.Image UpdateImage(Image.Image image);
    Task<Image.Image> DeleteImage(Guid id);
    Task<byte[]> GetImageData(Image.Image image);
    Task<Image.Image> GetImage(Guid id);
  }
}
