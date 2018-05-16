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
        private readonly ApprovalLogic approvalLogic;

        public PurchaseRequestLogic(DbContext context, IDocumentRepository<PurchaseRequest> repository, LoggedUser LoggedUser,
            ApprovalLogic approvalLogic) : base(context, repository, LoggedUser)
        {
            this.approvalLogic = approvalLogic;
        }

        protected override IQueryable<PurchaseRequest> StaticDbQueryForList(IQueryable<PurchaseRequest> dbQuery)
        {
            //if (LoggedUser.Role != "Administrator")
            //{
            //    dbQuery = dbQuery.Where(e => e.RequisitorKey == LoggedUser.UserID);
            //}

            return dbQuery.Include(e => e.PRLines)
                .Include(e => e.DepartmentAssigned)
                .Include(e => e.DepartmentAssigned.Manager)
                .Include(e => e.InfoTrack)
                .Include(e => e.GeneralManager)
                .Include(e => e.Requisitor)
                .OrderByDescending(e => e.InfoTrack.Date_CreatedOn);
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
                var ctx = context as POContext;
                if (entity.GeneralManager != null)
                {
                    ctx.Entry(entity.GeneralManager).State = EntityState.Unchanged;
                }
                if (entity.Requisitor != null)
                {
                    ctx.Entry(entity.Requisitor).State = EntityState.Unchanged;
                }
                if (entity.DepartmentAssigned != null)
                {
                    ctx.Entry(entity.DepartmentAssigned).State = EntityState.Unchanged;
                }
                if (entity.DepartmentManager != null)
                {
                    ctx.Entry(entity.DepartmentManager).State = EntityState.Unchanged;
                }

                if (string.IsNullOrWhiteSpace(entity.FriendlyIdentifier))
                {
                    throw new KnownError("Friendly identifier is a required field");
                }


                #region PR Number Generation

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

                entity.RequisitorKey = LoggedUser.UserID;
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
            if (mode == OPERATION_MODE.ADD)
            {
                CommonResponse approvalResponse = approvalLogic.CreateInstance(new Approval()
                {
                    PurchaseRequestKey = entity.id,
                    Title = "Purchase Request - " + entity.FriendlyIdentifier
                });

                Approval approval = (Approval) approvalResponse.Result;
                approvalLogic.repository.Add(approval);
            }

        }

        protected override void OnCreateInstance(PurchaseRequest entity)
        {
            var ctx = context as POContext;
            var user = ctx.Users.AsNoTracking().FirstOrDefault(u => u.Role == "General Manager");
            if (user == null)
            {
                throw new KnownError("You have not configured a General Manager yet");
            }

            entity.GeneralManagerKey = user.id;
            entity.GeneralManager = user;

            var requisitor = ctx.Users.AsNoTracking().FirstOrDefault(u => u.UserKey == LoggedUser.UserID);
            if (requisitor == null)
            {
                throw new KnownError("Logged user not found");
            }
            entity.Requisitor = requisitor;
            entity.RequisitorKey = requisitor.id;

            //var manager = ctx.Users.AsNoTracking().FirstOrDefault(u => u.UserKey == LoggedUser.UserID);
            //if (requisitor == null)
            //{
            //    throw new KnownError("Logged user not found");
            //}


            var department = ctx.Departments.AsNoTracking()
                .Include(d => d.Manager)
                .FirstOrDefault(d => d.DepartmentKey == LoggedUser.DeparmentKey);
            if (department == null)
            {
                throw new KnownError("Department not found or not set for current user");
            }

            entity.DepartmentKey = department.id;
            entity.DepartmentAssigned = department;
            entity.DepartmentManagerKey = department.Manager.id;
        }
    }
}