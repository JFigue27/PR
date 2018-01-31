using BusinessSpecificLogic.EF;
using Reusable;
using System.Data.Entity;

namespace BusinessSpecificLogic.Logic
{
    public interface IPRLineLogic : ILogic<PRLine>
    {
    }

    public class PRLineLogic : Logic<PRLine>, IPRLineLogic
    {
        public PRLineLogic(DbContext context, IRepository<PRLine> repository, LoggedUser LoggedUser) : base(context, repository, LoggedUser)
        {
        }
    }
}
