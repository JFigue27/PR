using BusinessSpecificLogic.EF;
using Reusable;
using System.Data.Entity;

namespace BusinessSpecificLogic.Logic
{
    public interface ISupplierLogic : ILogic<Supplier>
    {
    }

    public class SupplierLogic : Logic<Supplier>, ISupplierLogic
    {
        public SupplierLogic(DbContext context, IRepository<Supplier> repository, LoggedUser LoggedUser) : base(context, repository, LoggedUser)
        {
        }
    }
}
