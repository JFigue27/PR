using BusinessSpecificLogic.EF;
using BusinessSpecificLogic.Logic;
using System.Web.Http;

namespace ReusableWebAPI.Controllers
{
    [RoutePrefix("api/Comment")]
    public class CommentController : BaseController<Comment>
    {
        public CommentController(ICommentLogic logic) : base(logic)
        {
        }
    }
}
