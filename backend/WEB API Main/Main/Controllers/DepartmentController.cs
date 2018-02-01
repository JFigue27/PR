using BusinessSpecificLogic.EF;
using System.Web.Http;
using BusinessSpecificLogic.Logic;

namespace ReusableWebAPI.Controllers
{
    [RoutePrefix("api/Department")]
    public class DepartmentController : BaseController<Department>
    {
        public DepartmentController(IDepartmentLogic logic) : base(logic)
        {
        }
    }
}
