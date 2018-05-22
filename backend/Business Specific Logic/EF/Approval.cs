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
        public string FriendlyStatus
        {
            get
            {
                var sStatus = "";
                switch (Status)
                {
                    case "Pending":
                        return "Pending";
                    case "DM Rejected":
                    case "GM Rejected":
                        return "Rejected";
                    case "DM Quote Approved":
                    case "GM Quote Approved":
                        return "Approved for Quoting";
                    case "MRO Quoted":
                        return "Quoted submitted by MRO";
                    default:
                        break;
                }

                return sStatus;
            }
        }
    }
}