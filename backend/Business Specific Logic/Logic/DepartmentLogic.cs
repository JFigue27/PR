using BusinessSpecificLogic.EF;
using Reusable;
using System.Data.Entity;
using System.Linq;

namespace BusinessSpecificLogic.Logic
{
    public interface IDepartmentLogic : ILogic<Department>
    {
    }

    public class DepartmentLogic : Logic<Department>, IDepartmentLogic
    {
        public DepartmentLogic(DbContext context, IRepository<Department> repository, LoggedUser LoggedUser) : base(context, repository, LoggedUser)
        {
        }

        protected override IQueryable<Department> StaticDbQueryForList(IQueryable<Department> dbQuery)
        {
            return dbQuery.Include(e => e.GLAccounts).Include(e => e.Manager);
        }
    }
}
