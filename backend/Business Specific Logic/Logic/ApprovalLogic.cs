using BusinessSpecificLogic.EF;
using Reusable;
using Reusable.Email;
using System;
using System.Data.Entity;
using System.Linq;
using Dapper;
using Reusable.Auth;

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
                dbQuery = dbQuery.Where(e => e.Status == "Quote" || e.Status == "Quoted" || e.Status == "Approved" || e.Status == "Quote Rejected");
            }
            else if (LoggedUser.Role == "Buyer")
            {
                dbQuery = dbQuery.Where(e => e.Status == "Approved");
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
            entity.Hyperlink = "http://apps.capsonic.com/PR/Main/?id=" + entity.PurchaseRequestKey;
            entity.UserRequisitorKey = (int)LoggedUser.UserID;
        }

        protected override void onBeforeSaving(Approval entity, BaseEntity parent = null, OPERATION_MODE mode = OPERATION_MODE.NONE)
        {
            using (var accounts_ctx = new AuthContext())
            {
                var ctx = context as POContext;


                #region Validations
                //User currentUser = ctx.Users.AsNoTracking().FirstOrDefault(u => u.UserKey == LoggedUser.UserID);

                //if (currentUser == null)
                //{
                //    throw new KnownError("Logged User not found or session expired.");
                //}

                var pr = ctx.PurchaseRequests.AsNoTracking().Include(c => c.PRNumber)
                    .FirstOrDefault(c => c.PurchaseRequestKey == entity.PurchaseRequestKey);


                if (pr == null)
                {
                    throw new KnownError("PR document does not exist anymore.");
                }
                #endregion
                //entity.UserApprover = ctx.Users.FirstOrDefault(u => u.UserKey == entity.UserApproverKey);
                //entity.UserRequisitor = ctx.Users.FirstOrDefault(u => u.UserKey == entity.UserRequisitorKey);
                entity.UserRequisitor = accounts_ctx.Database.Connection.QueryFirst("select * from [User] where UserKey = @UserKey",
                    new { UserKey = entity.UserRequisitorKey});


                //if (mode == OPERATION_MODE.UPDATE)
                //{
                //    Email emailEntity = new Email();
                //    emailEntity.CreatedAt = DateTimeOffset.Now;


                //    var hyperlink = entity.Hyperlink;


                //    EmailService emailService = new EmailService("secure.emailsrvr.com", 587)
                //    {
                //        EmailAddress = currentUser.Email,
                //        Password = currentUser.EmailPassword,
                //        From = currentUser.Email,
                //        Subject = "PR - " + pr.PRNumber.GeneratedNumber + " [" + entity.Status + "] " + entity.Title,
                //        Body = "PR - " + pr.PRNumber.GeneratedNumber + ". " + " [" + entity.Status + "] " + entity.Title
                //                + "<br><b>Description</b><br>" + entity.RequestDescription
                //                + @"<br><br>Open document here: <a href=""" + hyperlink + @""">" + pr.PRNumber.GeneratedNumber + "</a>"
                //    };

                //    switch (entity.Status)
                //    {
                //        case "Pending":
                //            emailService.To.Add(pr.DepartmentManager.Email);
                //            emailService.To.Add(entity.UserApprover.Email);
                //            break;
                //        case "Quote":
                //            emailService.To.Add(entity.UserRequisitor.Email);
                //            var mros = ctx.Users.Where(u => u.Role == "MRO").ToList();
                //            foreach (var mro in mros)
                //            {
                //                emailService.To.Add(mro.Email);
                //            }
                //            break;
                //        case "Rejected":
                //            emailService.To.Add(entity.UserRequisitor.Email);
                //            break;
                //        case "Quoted":
                //            emailService.To.Add(pr.DepartmentManager.Email);
                //            emailService.To.Add(entity.UserApprover.Email);
                //            break;
                //        case "Quote Rejected":
                //            var mrosRejected = ctx.Users.Where(u => u.Role == "MRO").ToList();
                //            foreach (var mro in mrosRejected)
                //            {
                //                emailService.To.Add(mro.Email);
                //            }
                //            break;
                //        case "Approved":
                //            emailService.To.Add(entity.UserRequisitor.Email);
                //            var buyers = ctx.Users.Where(u => u.Role == "Buyer").ToList();
                //            foreach (var buyer in buyers)
                //            {
                //                emailService.To.Add(buyer.Email);
                //            }
                //            break;
                //        case "Finalized":
                //            emailService.To.Add(entity.UserRequisitor.Email);
                //            emailService.To.Add(entity.UserApprover.Email);
                //            break;
                //        default:
                //            break;
                //    }

                //    try
                //    {
                //        emailService.SendMail();
                //    }
                //    catch (Exception ex)
                //    {
                //        throw new KnownError("Could not send email, please verify your Profile settings.\n" + ex.Message);
                //    }
                //}


            }
        }
    }
}
