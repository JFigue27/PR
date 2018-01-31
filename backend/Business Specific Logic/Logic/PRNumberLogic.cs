using BusinessSpecificLogic.EF;
using Reusable;
using System.Data.Entity;

namespace BusinessSpecificLogic.Logic
{
    public interface IPRNumberLogic : ILogic<PRNumber>
    {
    }

    public class PRNumberLogic : Logic<PRNumber>, IPRNumberLogic
    {
        public PRNumberLogic(DbContext context, IRepository<PRNumber> repository, LoggedUser LoggedUser) : base(context, repository, LoggedUser)
        {
        }
    }
}
