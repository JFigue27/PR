using BusinessSpecificLogic.EF;
using Dapper;
using Reusable;
using Reusable.Attachments;
using System;
using System.Configuration;
using System.Data.Entity;
using System.Linq;

namespace BusinessSpecificLogic.Logic
{
    public interface IPurchaseRequestLogic : IDocumentLogic<PurchaseRequest>
    {
    }

    public class PurchaseRequestLogic : DocumentLogic<PurchaseRequest>, IPurchaseRequestLogic
    {
        public PurchaseRequestLogic(DbContext context, IDocumentRepository<PurchaseRequest> repository, LoggedUser LoggedUser) : base(context, repository, LoggedUser)
        {
        }

        protected override IQueryable<PurchaseRequest> StaticDbQueryForList(IQueryable<PurchaseRequest> dbQuery)
        {
            return dbQuery.Include(e => e.PRLines)
                .Include(e => e.DepartmentAssigned);
        }

        protected override void OnGetSingle(PurchaseRequest entity)
        {
            var ctx = context as POContext;

            StaticDbQueryForList(ctx.PurchaseRequests).FirstOrDefault(e => e.PurchaseRequestKey == entity.PurchaseRequestKey);
        }

        protected override void AdapterOut(params PurchaseRequest[] entities)
        {
            var ctx = context as POContext;

            foreach (var item in entities)
            {
                item.PRNumber = ctx.PRNumbers.FirstOrDefault(e => e.PRNumberKey == item.PRNumberKey);

                item.PRLines = item.PRLines?.OrderBy(e => e.PRLineKey).ToList();

                item.Attachments = AttachmentsIO.getAttachmentsFromFolder(item.AttachmentsFolder, "PR_Attachments");
            }
        }

        protected override void onBeforeSaving(PurchaseRequest entity, BaseEntity parent = null, OPERATION_MODE mode = OPERATION_MODE.NONE)
        {
            if (mode == OPERATION_MODE.ADD)
            {

                #region PR Number Generation
                var ctx = context as POContext;

                DateTimeOffset date = DateTimeOffset.Now;

                int sequence = 0;
                var last = ctx.PRNumbers.Where(n => n.CreatedAt.Year == date.Year
                                        && n.CreatedAt.Month == date.Month && n.CreatedAt.Day == date.Day).OrderByDescending(n => n.Sequence)
                                        .FirstOrDefault();

                if (last != null)
                {
                    sequence = last.Sequence + 1;
                }

                string generated = date.Year.ToString().Substring(2) + date.Month.ToString("D2") + date.Day.ToString("D2") + sequence.ToString("D3");


                PRNumber cqaNumber = ctx.PRNumbers.Add(new PRNumber()
                {
                    CreatedAt = date,
                    Sequence = sequence,
                    GeneratedNumber = generated,
                    Revision = "A"
                });

                ctx.SaveChanges();

                entity.PRNumberKey = cqaNumber.PRNumberKey;

                #endregion
            }


            #region Attachments
            string baseAttachmentsPath = ConfigurationManager.AppSettings["PR_Attachments"];
            if (entity != null && entity.Attachments != null)
            {
                foreach (var file in entity.Attachments)
                {
                    if (file.ToDelete)
                    {
                        string filePath = baseAttachmentsPath + "\\" + file.Directory + "\\" + file.FileName;
                        AttachmentsIO.DeleteFile(filePath);
                    }
                }
            }

            #endregion
        }

        protected override void onAfterSaving(DbContext context, PurchaseRequest entity, BaseEntity parent = null, OPERATION_MODE mode = OPERATION_MODE.NONE)
        {
            var ctx = context as POContext;

            ctx.Database.Connection.Execute("DELETE FROM PRLine WHERE PurchaseRequestKey = @PurchaseRequestKey", new { PurchaseRequestKey = entity.id }, ctx.Database.CurrentTransaction.UnderlyingTransaction);

            if (entity.PRLines != null)
            {
                foreach (var line in entity.PRLines)
                {
                    line.PurchaseRequestKey = entity.id;
                    ctx.PRLines.Add(line);
                    ctx.SaveChanges();
                }
            }
        }
    }
}