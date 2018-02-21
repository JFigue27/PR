using BusinessSpecificLogic.EF;
using Reusable;
using System.Data.Entity;
using System.Linq;

namespace BusinessSpecificLogic.Logic
{
    public interface IApprovalLogic : IDocumentLogic<Approval>
    {
    }

    public class ApprovalLogic : DocumentLogic<Approval>, IApprovalLogic
    {
        public ApprovalLogic(DbContext context, IDocumentRepository<Approval> repository, LoggedUser LoggedUser) : base(context, repository, LoggedUser)
        {
        }

        protected override IQueryable<Approval> StaticDbQueryForList(IQueryable<Approval> dbQuery)
        {
            return dbQuery
                .Include(e => e.InfoTrack)
                .Include(e => e.InfoTrack.User_CreatedBy);
        }
    }
}
