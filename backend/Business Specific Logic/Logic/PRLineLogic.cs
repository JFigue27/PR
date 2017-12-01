using BusinessSpecificLogic.EF;
using Reusable;
using System.Data.Entity;
using System.Linq;

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

        protected override IQueryable<PRLine> applyOrderByWhenPaging(IQueryable<PRLine> recordset)
        {
            return recordset.OrderBy(e => e.PRLineKey);
        }
    }
}
