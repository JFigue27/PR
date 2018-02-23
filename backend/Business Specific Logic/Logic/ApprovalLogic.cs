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
            if (LoggedUser.Role == "DepartmentManager" || LoggedUser.Role == "GeneralManager")
            {
                dbQuery = dbQuery.Where(e => e.UserApproverKey == LoggedUser.UserID || e.UserRequisitorKey == LoggedUser.UserID);
            }
            else
            {
                dbQuery = dbQuery.Where(e => e.UserRequisitorKey == LoggedUser.UserID);
            }

            return dbQuery
                .Include(e => e.InfoTrack)
                .Include(e => e.InfoTrack.User_CreatedBy);
        }

        protected override void OnCreateInstance(Approval entity)
        {
            entity.Status = "Pending";
        }
    }
}
