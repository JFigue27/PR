using BusinessSpecificLogic.EF;
using Reusable;
using System.Data.Entity;
using System.Linq;

namespace BusinessSpecificLogic.Logic
{
    public interface IGLAccountLogic : ILogic<GLAccount>
    {
    }

    public class GLAccountLogic : Logic<GLAccount>, IGLAccountLogic
    {
        public GLAccountLogic(DbContext context, IRepository<GLAccount> repository, LoggedUser LoggedUser) : base(context, repository, LoggedUser)
        {
        }

        protected override IQueryable<GLAccount> StaticDbQueryForList(IQueryable<GLAccount> dbQuery)
        {
            return dbQuery.OrderBy(e => e.Description);
        }
    }
}
