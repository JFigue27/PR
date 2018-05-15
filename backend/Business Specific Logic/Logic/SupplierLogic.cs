using BusinessSpecificLogic.EF;
using Reusable;
using System.Data.Entity;
using System.Linq;

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

        protected override IQueryable<Supplier> StaticDbQueryForList(IQueryable<Supplier> dbQuery)
        {
            return dbQuery.OrderBy(e => e.Value);
        }
    }
}
