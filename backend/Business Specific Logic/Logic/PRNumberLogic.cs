using BusinessSpecificLogic.EF;
using Reusable;
using System.Data.Entity;

namespace BusinessSpecificLogic.Logic
{
    public interface IPRNumberLogic : IBaseLogic<PRNumber>
    {
    }

    public class PRNumberLogic : BaseLogic<PRNumber>, IPRNumberLogic
    {
        public PRNumberLogic(DbContext context, IRepository<PRNumber> repository) : base(context, repository)
        {
        }
    }
}
