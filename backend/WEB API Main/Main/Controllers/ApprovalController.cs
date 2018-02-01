using BusinessSpecificLogic.EF;
using System.Web.Http;
using BusinessSpecificLogic.Logic;

namespace ReusableWebAPI.Controllers
{
    [RoutePrefix("api/Approval")]
    public class ApprovalController : BaseController<Approval>
    {
        public ApprovalController(IApprovalLogic logic) : base(logic)
        {
        }
    }
}
