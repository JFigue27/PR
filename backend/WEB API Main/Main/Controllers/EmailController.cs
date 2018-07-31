using BusinessSpecificLogic.EF;
using System.Web.Http;
using BusinessSpecificLogic.Logic;
using Reusable;

namespace ReusableWebAPI.Controllers
{
    [RoutePrefix("api/Email")]
    public class EmailController : DocumentController<Email>
    {
        public EmailController(IEmailLogic logic) : base(logic)
        {
        }

        [HttpGet, Route("GetEmailOrTemplate/{sActivity}/{iEmailKey}/{iCQAHeaderKey}")]
        public CommonResponse GetEmailOrTemplate(string sActivity, int iEmailKey, int iCQAHeaderKey)
        {
            return (logic as EmailLogic).GetEmailOrTemplate(sActivity, iEmailKey, iCQAHeaderKey);
        }
    }
}
