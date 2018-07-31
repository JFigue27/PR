using BusinessSpecificLogic.EF;
using System.Web.Http;
using BusinessSpecificLogic.Logic;

namespace ReusableWebAPI.Controllers
{
    [RoutePrefix("api/Task")]
    public class TaskController : BaseController<Task>
    {
        public TaskController(ITaskLogic logic) : base(logic)
        {
        }
    }
}
