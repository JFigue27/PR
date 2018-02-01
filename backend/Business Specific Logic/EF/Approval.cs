using Reusable;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessSpecificLogic.EF
{
    [Table("Approval")]
    public class Approval : BaseEntity
    {
        public Approval()
        {
            ///Start:Generated:Constructor<<<
			///End:Generated:Constructor<<<

        }

        [Key]
        public int ApprovalKey { get; set; }

        public override int id { get { return ApprovalKey; } }

        ///Start:Generated:Properties<<<
        public DateTimeOffset DateRequested { get; set; }
        public string Status { get; set; }
        public DateTimeOffset DateResponse { get; set; }
        public string ResponseDescription { get; set; }
        public int PurchaseRequestKey { get; set; }
        [ForeignKey("PurchaseRequestKey")]
        public PurchaseRequest PurchaseRequest { get; set; }
        public int UserRequisitorKey { get; set; }
        [ForeignKey("UserRequisitorKey")]
        public User UserRequisitor { get; set; }
        public int? UserApproverKey { get; set; }
        [ForeignKey("UserApproverKey")]
        public User UserApprover { get; set; }
        ///End:Generated:Properties<<<
    }
}