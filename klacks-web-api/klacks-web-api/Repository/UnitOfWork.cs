using SVA.API.Core;
using SVA.API.Data;
using System.Threading.Tasks;

namespace SVA.API.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DatabaseContext context;

        public UnitOfWork(DatabaseContext context)
        {
            this.context = context;
        }

        public async Task CompleteAsync()
        {
            await context.SaveChangesAsync();
        }
    }
}
