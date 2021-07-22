
using klacks_web_api.Data;
using klacks_web_api.Interface;
using System.Threading.Tasks;

namespace klacks_web_api.Repository
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
