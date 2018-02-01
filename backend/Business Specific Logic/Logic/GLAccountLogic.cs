using BusinessSpecificLogic.EF;
using Reusable;
using System.Data.Entity;

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
    }
}
