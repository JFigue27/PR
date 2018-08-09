using System.Web.Http;
using Reusable;

namespace ReusableWebAPI.Controllers
{
    [RoutePrefix("api/Revision")]
    public class RevisionController : BaseController<Revision>
    {
        public RevisionController(IRevisionLogic logic) : base(logic)
        {
        }
    }
}
