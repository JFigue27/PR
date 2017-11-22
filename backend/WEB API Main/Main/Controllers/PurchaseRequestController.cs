using BusinessSpecificLogic.EF;
using System.Web.Http;
using BusinessSpecificLogic.Logic;

namespace ReusableWebAPI.Controllers
{
    [RoutePrefix("api/PurchaseRequest")]
    public class PurchaseRequestController : BaseController<PurchaseRequest>
    {
        public PurchaseRequestController(IPurchaseRequestLogic logic) : base(logic)
        {
        }
    }
}
