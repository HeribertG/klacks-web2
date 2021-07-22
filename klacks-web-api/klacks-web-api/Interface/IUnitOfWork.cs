using System.Threading.Tasks;

namespace SVA.API.Core
{
  public interface IUnitOfWork
    {
        Task CompleteAsync();
    }
}
