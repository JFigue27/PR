using BusinessSpecificLogic.EF;
using Reusable;
using Reusable.Email;
using System;
using System.Data.Entity;
using System.Linq;

namespace BusinessSpecificLogic.Logic
{
    public interface IApprovalLogic : IDocumentLogic<Approval>
    {
    }

    public class ApprovalLogic : DocumentLogic<Approval>, IApprovalLogic
    {
        public ApprovalLogic(DbContext context, IDocumentRepository<Approval> repository, LoggedUser LoggedUser) : base(context, repository, LoggedUser)
        {
        }

        protected override IQueryable<Approval> StaticDbQueryForList(IQueryable<Approval> dbQuery)
        {
            if (LoggedUser.Role == "DepartmentManager" || LoggedUser.Role == "GeneralManager")
            {
                dbQuery = dbQuery.Where(e => e.UserApproverKey == LoggedUser.UserID || e.UserRequisitorKey == LoggedUser.UserID);
            }
            else if (LoggedUser.Role == "MRO")
            {
                dbQuery = dbQuery.Where(e => e.Status == "Quote");
            }
            else
            {
                dbQuery = dbQuery.Where(e => e.UserRequisitorKey == LoggedUser.UserID);
            }

            return dbQuery
                .Include(e => e.InfoTrack)
                .Include(e => e.InfoTrack.User_CreatedBy);
        }

        protected override void OnCreateInstance(Approval entity)
        {
            entity.Status = "Pending";
            entity.Hyperlink = "http://apps.capsonic.com/PR/Main/?id=" + entity.PurchaseRequestKey;
        }

        protected override void onBeforeSaving(Approval entity, BaseEntity parent = null, OPERATION_MODE mode = OPERATION_MODE.NONE)
        {
            var ctx = context as POContext;


            #region Validations
            User currentUser = ctx.Users.AsNoTracking().FirstOrDefault(u => u.UserKey == LoggedUser.UserID);
            if (currentUser == null)
            {
                throw new KnownError("Logged User not found or session expired.");
            }


            var pr = ctx.PurchaseRequests.AsNoTracking().Include(c => c.PRNumber)
                .FirstOrDefault(c => c.PurchaseRequestKey == entity.PurchaseRequestKey);


            if (pr == null)
            {
                throw new KnownError("PR document does not exist anymore.");
            }
            #endregion
            entity.UserApprover = ctx.Users.FirstOrDefault(u => u.UserKey == entity.UserApproverKey);


            if (mode == OPERATION_MODE.ADD)
            {
                Email emailEntity = new Email();
                emailEntity.CreatedAt = DateTimeOffset.Now;


                var hyperlink = entity.Hyperlink;


                EmailService emailService = new EmailService("secure.emailsrvr.com", 587)
                {
                    EmailAddress = currentUser.Email,
                    Password = currentUser.EmailPassword,
                    From = currentUser.Email,
                    Subject = "PR - " + pr.PRNumber.GeneratedNumber + ". " + entity.Title,
                    Body = "PR - " + pr.PRNumber.GeneratedNumber + ". " + entity.Title
                            + "<br><br>" + entity.RequestDescription
                            + @"<br><br>Open document here: <a href=""" + hyperlink + @""">" + pr.PRNumber.GeneratedNumber + "</a>"
                };

                emailService.To.Add(entity.UserApprover.Email);


                emailService.Bcc.Add(currentUser.Email);


                try
                {
                    emailService.SendMail();
                }
                catch (Exception ex)
                {
                    throw new KnownError("Could not send email, please verify your Profile settings.\n" + ex.Message);
                }
            }
        }
    }
}
