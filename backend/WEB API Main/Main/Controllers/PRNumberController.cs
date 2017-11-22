using BusinessSpecificLogic.EF;
using System.Web.Http;
using BusinessSpecificLogic.Logic;

namespace ReusableWebAPI.Controllers
{
    [RoutePrefix("api/PRNumber")]
    public class PRNumberController : BaseController<PRNumber>
    {
        public PRNumberController(IPRNumberLogic logic) : base(logic)
        {
        }
    }
}
