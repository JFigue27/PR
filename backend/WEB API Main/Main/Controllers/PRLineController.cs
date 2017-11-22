using BusinessSpecificLogic.EF;
using System.Web.Http;
using BusinessSpecificLogic.Logic;

namespace ReusableWebAPI.Controllers
{
    [RoutePrefix("api/PRLine")]
    public class PRLineController : BaseController<PRLine>
    {
        public PRLineController(IPRLineLogic logic) : base(logic)
        {
        }
    }
}
