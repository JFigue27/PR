using BusinessSpecificLogic.EF;
using Reusable;
using System.Data.Entity;

namespace BusinessSpecificLogic.Logic
{
    public interface IPRLineLogic : IBaseLogic<PRLine>
    {
    }

    public class PRLineLogic : BaseLogic<PRLine>, IPRLineLogic
    {
        public PRLineLogic(DbContext context, IRepository<PRLine> repository) : base(context, repository)
        {
        }
    }
}
