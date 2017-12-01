using BusinessSpecificLogic.EF;
using Reusable;
using System;
using System.Data.Entity;
using System.Linq;
using Dapper;

namespace BusinessSpecificLogic.Logic
{
    public interface IPurchaseRequestLogic : IBaseLogic<PurchaseRequest>
    {
    }

    public class PurchaseRequestLogic : BaseLogic<PurchaseRequest>, IPurchaseRequestLogic
    {
        public PurchaseRequestLogic(DbContext context, IRepository<PurchaseRequest> repository) : base(context, repository)
        {
        }

        protected override void loadNavigationProperties(params PurchaseRequest[] entities)
        {
            var ctx = context as POContext;
            foreach (var item in entities)
            {
                item.PRNumber = ctx.PRNumbers.FirstOrDefault(e => e.PRNumberKey == item.PRNumberKey);
                item.PRLines = ctx.PRLines.Where(line => line.PurchaseRequestKey == item.id).ToList();
            }
        }

        protected override void onBeforeSaving(PurchaseRequest entity, BaseEntity parent = null, OPERATION_MODE mode = OPERATION_MODE.NONE)
        {
            if (mode == OPERATION_MODE.ADD)
            {
                #region PR Number Generation
                var ctx = context as POContext;

                DateTime date = DateTime.Now;

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
        }

        protected override void onAfterSaving(DbContext context, PurchaseRequest entity, BaseEntity parent = null, OPERATION_MODE mode = OPERATION_MODE.NONE)
        {
            var ctx = context as POContext;

            ctx.Database.Connection.Execute("DELETE FROM PRLine WHERE PurchaseRequestKey = @PurchaseRequestKey", new { PurchaseRequestKey = entity.id }, ctx.Database.CurrentTransaction.UnderlyingTransaction);

            foreach (var line in entity.PRLines)
            {
                line.PurchaseRequestKey = entity.id;
                ctx.PRLines.Add(line);
                ctx.SaveChanges();
            }
        }
    }
}
