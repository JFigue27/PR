using BusinessSpecificLogic.EF;
using System.Web.Http;
using BusinessSpecificLogic.Logic;

namespace ReusableWebAPI.Controllers
{
    [RoutePrefix("api/Supplier")]
    public class SupplierController : BaseController<Supplier>
    {
        public SupplierController(ISupplierLogic logic) : base(logic)
        {
        }
    }
}
