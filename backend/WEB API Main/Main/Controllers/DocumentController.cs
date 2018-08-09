using Newtonsoft.Json;
using Reusable;
using System;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ReusableWebAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public abstract class DocumentController<Document> : BaseController<Document> where Document : BaseDocument
    {
        protected new IDocumentLogic<Document> logic;
        public DocumentController(IDocumentLogic<Document> logic) : base(logic)
        {
            this.logic = logic;
        }

        [HttpPost, Route("Finalize")]
        virtual public CommonResponse Finalize([FromBody]string value)
        {
            CommonResponse response = new CommonResponse();
            Document entity;

            try
            {
                entity = JsonConvert.DeserializeObject<Document>(value);
                return logic.Finalize(entity);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
        }

        [HttpPost, Route("Unfinalize")]
        virtual public CommonResponse Unfinalize([FromBody]string value)
        {
            CommonResponse response = new CommonResponse();
            Document entity;

            try
            {
                entity = JsonConvert.DeserializeObject<Document>(value);
                return logic.Unfinalize(entity);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
        }

        [HttpPost, Route("MakeRevision")]
        public CommonResponse MakeRevision([FromBody]string value)
        {
            var response = new CommonResponse();
            try
            {
                var entity = JsonConvert.DeserializeObject<Document>(value);
                return logic.MakeRevision(entity);
            }
            catch (Exception ex)
            {
                return response.Error(ex.Message);
            }
        }

        [HttpPost, Route("Checkout/{id}")]
        public CommonResponse Checkout(int id)
        {
            var response = new CommonResponse();
            try
            {
                return logic.Checkout(id);
            }
            catch (Exception ex)
            {
                return response.Error(ex.Message);
            }
        }

        [HttpPost, Route("CancelCheckout/{id}")]
        public CommonResponse CanelCheckout(int id)
        {
            var response = new CommonResponse();
            try
            {
                return logic.CancelCheckout(id);
            }
            catch (Exception ex)
            {
                return response.Error(ex.Message);
            }
        }

        [HttpPost, Route("Checkin")]
        public CommonResponse Checkin([FromBody]string value)
        {
            var response = new CommonResponse();
            try
            {
                var entity = JsonConvert.DeserializeObject<Document>(value);
                return logic.Checkin(entity);
            }
            catch (Exception ex)
            {
                return response.Error(ex.Message);
            }
        }
    }
}