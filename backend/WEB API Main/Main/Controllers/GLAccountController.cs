using BusinessSpecificLogic.EF;
using System.Web.Http;
using BusinessSpecificLogic.Logic;

namespace ReusableWebAPI.Controllers
{
    [RoutePrefix("api/GLAccount")]
    public class GLAccountController : BaseController<GLAccount>
    {
        public GLAccountController(IGLAccountLogic logic) : base(logic)
        {
        }
    }
}
