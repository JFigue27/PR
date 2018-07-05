using BusinessSpecificLogic.EF;
using Reusable;
using Reusable.Email;
using System;
using System.Data.Entity;
using System.Linq;
using System.Web;

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

        protected override void AdapterOut(params Approval[] entities)
        {
            foreach (var item in entities)
            {
                if (item.PurchaseRequest != null)
                {
                    item.PONumberValue = item.PurchaseRequest.PONumber;
                }
            }
        }

        protected override bool PopulateForSearch(params Approval[] entities)
        {
            AdapterOut(entities);
            return true;
        }


        protected override IQueryable<Approval> StaticDbQueryForList(IQueryable<Approval> dbQuery)
        {
            if (LoggedUser.Role == "Department Manager")
            {
                dbQuery = dbQuery
                    .Where(e => (e.UserApproverKey == LoggedUser.UserID || e.UserRequisitorKey == LoggedUser.UserID));
            }
            else if (LoggedUser.Role == "General Manager")
            {
                dbQuery = dbQuery
                    .Where(e => e.UserRequisitorKey == LoggedUser.UserID || e.UserApproverKey == LoggedUser.UserID );
            }
            else if (LoggedUser.Role == "Administrator")
            {
                //We do not filter for Administrator
            }
            else if (LoggedUser.Role == "Finance")
            {
                //We do not filter for Finance
            }
            else if (LoggedUser.Role == "MRO")
            {
                dbQuery = dbQuery.Include(e => e.PurchaseRequest)
                    .Where(e => e.PurchaseRequest.PRType == "MRO" 
                                             && e.Status != "Pending" 
                                             && e.Status != "DM Rejected");
            }
            else if (LoggedUser.Role == "Purchasing Manager")
            {
                dbQuery = dbQuery.Include(e => e.PurchaseRequest)
                    .Where(e => e.PurchaseRequest.PRType == "MRO" && e.Status != "Pending" &&
                    (  e.Status != "DM Rejected" || e.Status != "MRO Quote" ));
            }
            else if (LoggedUser.Role == "Project Manager")
            {
                dbQuery = dbQuery.Include(e => e.PurchaseRequest)
                    .Where(e => e.PurchaseRequest.PRType == "MRP" &&
                    (e.Status == "DM Approved" || e.Status == "Project Manager Rejected" || e.Status == "Finalized"));
            }
            else //User
            {
                dbQuery = dbQuery.Where(e => e.UserRequisitorKey == LoggedUser.UserID);
            }

            #region Sorting

            var dbQueryOrdered = dbQuery.OrderBy(e => 0);
            var sortStatus = HttpContext.Current.Request["sort-Status"];
            if (sortStatus != null)
            {
                dbQueryOrdered = OrderBy(dbQueryOrdered, new SortData { Value="Status", AscDesc=sortStatus});
            }
                
            dbQuery = dbQueryOrdered;

            #endregion



            return dbQuery
                .Include(e => e.InfoTrack)
                .Include(e => e.PurchaseRequest)
                .Include(e => e.InfoTrack.User_CreatedBy);
        }

        private IOrderedQueryable<Approval> OrderBy(IOrderedQueryable<Approval> dbQuery, SortData sort)
        {
            switch (sort.Value)
            {
                case "Status":
                    if (sort.AscDesc.ToUpper() == "DESC")
                    {
                        dbQuery = dbQuery.ThenByDescending(e => e.Status.ToString());
                    }
                    else
                    {
                        dbQuery = dbQuery.ThenBy(e => e.Status.ToString());
                    }
                    break;
                //case "Created By":
                //    if (sort.AscDesc == "DESC")
                //    {
                //        dbQuery = dbQuery.ThenByDescending(e => e.UserCreatedBy.Value);
                //    }
                //    else
                //    {
                //        dbQuery = dbQuery.ThenBy(e => e.UserCreatedBy.Value);
                //    }
                //    break;
                //case "Assigned To":
                //    if (sort.AscDesc == "DESC")
                //    {
                //        dbQuery = dbQuery.ThenByDescending(e => e.UserAssignedTo.Value);
                //    }
                //    else
                //    {
                //        dbQuery = dbQuery.ThenBy(e => e.UserAssignedTo.Value);
                //    }
                //    break;
                //case "Priority":
                //    if (sort.AscDesc == "DESC")
                //    {
                //        dbQuery = dbQuery.ThenByDescending(e => e.Priority.ToString());
                //    }
                //    else
                //    {
                //        dbQuery = dbQuery.ThenBy(e => e.Priority.ToString());
                //    }
                //    break;
                //case "Category":
                //    if (sort.AscDesc == "DESC")
                //    {
                //        dbQuery = dbQuery.ThenByDescending(e => e.Category);
                //    }
                //    else
                //    {
                //        dbQuery = dbQuery.ThenBy(e => e.Category);
                //    }
                //    break;
                //case "Title":
                //    if (sort.AscDesc == "DESC")
                //    {
                //        dbQuery = dbQuery.ThenByDescending(e => e.Title);
                //    }
                //    else
                //    {
                //        dbQuery = dbQuery.ThenBy(e => e.Title);
                //    }
                //    break;
                //case "Description":
                //    if (sort.AscDesc == "DESC")
                //    {
                //        dbQuery = dbQuery.ThenByDescending(e => e.Description);
                //    }
                //    else
                //    {
                //        dbQuery = dbQuery.ThenBy(e => e.Description);
                //    }
                //    break;
                //case "Completed By":
                //    if (sort.AscDesc == "DESC")
                //    {
                //        dbQuery = dbQuery.ThenByDescending(e => e.UserCompletedBy.Value);
                //    }
                //    else
                //    {
                //        dbQuery = dbQuery.ThenBy(e => e.UserCompletedBy.Value);
                //    }
                //    break;
                //case "Date Created At":
                //    if (sort.AscDesc == "DESC")
                //    {
                //        dbQuery = dbQuery.ThenByDescending(e => e.DateCreatedAt);
                //    }
                //    else
                //    {
                //        dbQuery = dbQuery.ThenBy(e => e.DateCreatedAt);
                //    }
                //    break;
                //case "Date Due Date":
                //    if (sort.AscDesc == "DESC")
                //    {
                //        dbQuery = dbQuery.ThenByDescending(e => e.DateDue);
                //    }
                //    else
                //    {
                //        dbQuery = dbQuery.ThenBy(e => e.DateDue);
                //    }
                //    break;
                //case "Date Closed":
                //    if (sort.AscDesc == "DESC")
                //    {
                //        dbQuery = dbQuery.ThenByDescending(e => e.DateClosed);
                //    }
                //    else
                //    {
                //        dbQuery = dbQuery.ThenBy(e => e.DateClosed);
                //    }
                //    break;
                default:
                    break;
            }

            return dbQuery;
        }


        protected override void OnCreateInstance(Approval entity)
        {
            entity.Hyperlink = "http://apps.capsonic.com/PR/Main/?id=" + entity.PurchaseRequestKey;
            entity.UserRequisitorKey = (int) LoggedUser.UserID;
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
                .Include(e => e.DepartmentManager)
                .FirstOrDefault(c => c.PurchaseRequestKey == entity.PurchaseRequestKey);


            if (pr == null)
            {
                throw new KnownError("PR document does not exist anymore.");
            }
            #endregion
            entity.UserApprover = ctx.Users.FirstOrDefault(u => u.UserKey == entity.UserApproverKey);
            entity.UserRequisitor = ctx.Users.FirstOrDefault(u => u.UserKey == entity.UserRequisitorKey);


            if (mode == OPERATION_MODE.UPDATE)
            {
                Email emailEntity = new Email();
                emailEntity.CreatedAt = DateTimeOffset.Now;


                var hyperlink = entity.Hyperlink;


                EmailService emailService = new EmailService("secure.emailsrvr.com", 587)
                {
                    EmailAddress = currentUser.Email,
                    Password = currentUser.EmailPassword,
                    From = currentUser.Email,
                    Subject = "PR - " + pr.PRNumber.GeneratedNumber + " [" +  entity.Status + "] " + entity.Title,
                    

                    Body = @"<div style='width: 90%;margin: auto;box-shadow: 1px 1px 8px #c3c3c3;border: 1px solid #d4d4d4;'>
    <div style='background: #006064;text-align: center;color: white;padding: 10px;'>
        <div style='font-size: 20px;font-family: sans-serif;'>PR System notification</div>
    </div>
    <div  style='padding:20px;'>
        <div style='font-size: 16px;margin-bottom: 10px; margin-left: 10px;font-family: sans-serif;'>
            <label>
                <b>User</b>
            </label>
            <br>
            <span>" + currentUser.Value + @"</span>
        </div>
        <div style='font-size: 16px;margin-bottom: 10px; margin-left: 10px;font-family: sans-serif;'>
            <label>
                <b>Status</b>
            </label>
            <br>
            <span>" + entity.Status + @"</span>
        </div>
        
        <div style='font-size: 16px;margin-bottom: 10px; margin-left: 10px;font-family: sans-serif;'>
            <label>
                <b>PR Friendly Identifier</b>
            </label>
            <br>
            <span> " + pr.FriendlyIdentifier + @"</span>
        </div>
    
        <div style='font-size: 16px;margin-bottom: 10px; margin-left: 10px;font-family: sans-serif;'>
            <label>
                <b>Request message</b>
            </label>
            <br>
            <span> " + entity.RequestDescription + @"</span>
        </div>

        <div style='font-size: 16px;margin-bottom: 10px;padding:10px;margin-left: 10px; color:#0075ed;border: none;border-radius: 5px;font-family: sans-serif;'>
            <a href=' " + hyperlink + @" ' style='text-decoration: none;font-size: 22px;'>
                Open document here
            </a>
        </div>
    </div>
</div>"

                };

                switch (entity.Status)
                {
                    case "Pending":
                        emailService.To.Add(pr.DepartmentManager.Email);
                        emailService.To.Add(entity.UserApprover.Email);
                        break;
                    case "MRO Quote":
                    case "DM Quote":
                        emailService.To.Add(entity.UserRequisitor?.Email);
                        var mros = ctx.Users.Where(u => u.Role == "MRO").ToList();
                        foreach (var mro in mros)
                        {
                            emailService.To.Add(mro.Email);
                        }
                        break;
                    case "Finance Quote":
                        emailService.To.Add(entity.UserRequisitor?.Email);
                        var finances = ctx.Users.Where(u => u.Role == "Finance").ToList();
                        foreach (var finance in finances)
                        {
                            emailService.To.Add(finance.Email);
                        }
                        break;

                    case "DM Rejected":
                        emailService.To.Add(entity.UserRequisitor.Email);
                        break;

                    case "GM Rejected":
                        emailService.To.Add(entity.UserRequisitor.Email);
                        break;

                    case "MRO Quoted":
                        emailService.To.Add(pr.DepartmentManager.Email);
                        emailService.To.Add(entity.UserApprover.Email);
                        break;

                    case "Quote Rejected":
                        var mrosRejected = ctx.Users.Where(u => u.Role == "MRO").ToList();
                        foreach (var mro in mrosRejected)
                        {
                            emailService.To.Add(mro.Email);
                        }
                        break;
                    case "Approved":
                        emailService.To.Add(entity.UserRequisitor.Email);
                        var buyers = ctx.Users.Where(u => u.Role == "Buyer").ToList();
                        foreach (var buyer in buyers)
                        {
                            emailService.To.Add(buyer.Email);
                        }
                        break;
                    case "Finalized":
                        emailService.To.Add(entity.UserRequisitor.Email);
                        emailService.To.Add(entity.UserApprover.Email);
                        break;
                    default:
                        break;
                }

                try
                {
                    if (emailService.To.Count > 0)
                    {
                        emailService.SendMail();
                    }

                }
                catch (Exception ex)
                {
                    throw new KnownError("Could not send email, please verify your Profile settings.\n" + ex.Message);
                }
            }
        }
    }
}
