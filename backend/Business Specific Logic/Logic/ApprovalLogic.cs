using BusinessSpecificLogic.EF;
using Reusable;
using System.Data.Entity;

namespace BusinessSpecificLogic.Logic
{
    public interface IApprovalLogic : ILogic<Approval>
    {
    }

    public class ApprovalLogic : Logic<Approval>, IApprovalLogic
    {
        public ApprovalLogic(DbContext context, IRepository<Approval> repository, LoggedUser LoggedUser) : base(context, repository, LoggedUser)
        {
        }
    }
}
