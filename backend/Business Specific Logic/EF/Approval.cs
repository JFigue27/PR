using Reusable;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessSpecificLogic.EF
{
    [Table("Approval")]
    public class Approval : BaseDocument
    {
        public Approval()
        {
            ///Start:Generated:Constructor<<<
            sys_active = true;
            ///End:Generated:Constructor<<<
            Status = "Created";
        }

        [Key]
        public int ApprovalKey { get; set; }

        public override int id { get { return ApprovalKey; } }

        ///Start:Generated:Properties<<<
        public DateTimeOffset? DateRequested { get; set; }
        public string Status { get; set; }
        public DateTimeOffset? DateResponse { get; set; }
        public string ResponseDescription { get; set; }
        public string RequestDescription { get; set; }
        public int PurchaseRequestKey { get; set; }
        [ForeignKey("PurchaseRequestKey")]
        public PurchaseRequest PurchaseRequest { get; set; }
        public int UserRequisitorKey { get; set; }
        [ForeignKey("UserRequisitorKey")]
        public User UserRequisitor { get; set; }
        public int? UserApproverKey { get; set; }
        [ForeignKey("UserApproverKey")]
        public User UserApprover { get; set; }
        public string Hyperlink { get; set; }
        public string Title { get; set; }
        ///End:Generated:Properties<<<

        [NotMapped]
        public string PONumberValue { get; set; }


        [NotMapped]
        public string FriendlyStatus
        {
            get
            {
                var sStatus = "";
                switch (Status)
                {
                    case "Created":
                        return "Created";
                    case "Pending":
                        return "Pending";
                    case "DM Rejected":
                    case "GM Rejected":
                        return "Rejected";
                    case "DM Quote":
                    case "GM Quote":
                        return "Approved for quoting";
                    case "MRO Quoted":
                        return "Quoted submitted by MRO";
                    case "PM Rejected":
                        return "Quoted rejected by purchasing manager";
                    case "PM Approved":
                        return "Quoted ready for approval";
                    case "DM Quote Rejected":
                    case "GM Quote Rejected":
                        return "Quoted rejected by manager";
                    case "DM Quote Approved":
                    case "GM Quote Approved":
                        return "Approved";
                    case "DM Approved":
                    case "GM Approved":
                        return "Request appproved for purchase";
                    case "Finalized":
                        return "Finalized";
                    default:
                        break;
                }

                return sStatus;
            }
        }
    }
}