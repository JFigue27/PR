using System.Web.Http;
using BusinessSpecificLogic.Logic;
using Reusable;

namespace ReusableWebAPI.Controllers
{
    [RoutePrefix("api/AdvancedSort")]
    public class AdvancedSortController : BaseController<AdvancedSort>
    {
        public AdvancedSortController(IAdvancedSortLogic logic) : base(logic)
        {
        }
    }
}
