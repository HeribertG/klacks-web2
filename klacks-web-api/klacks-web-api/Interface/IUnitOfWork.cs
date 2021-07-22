using System.Threading.Tasks;

namespace klacks_web_api.Interface
{
  public interface IUnitOfWork
  {
    Task CompleteAsync();
  }
}
