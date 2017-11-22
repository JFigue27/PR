using Reusable;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessSpecificLogic.EF
{
    [Table("PurchaseRequest")]
    public class PurchaseRequest : BaseDocument
    {
        public PurchaseRequest()
        {
            ///Start:Generated:Constructor<<<
			sys_active = true;
			CreatedAt = DateTime.Now;
			///End:Generated:Constructor<<<

            
        }

        [Key]
        public int PurchaseRequestKey { get; set; }

        public override int id { get { return PurchaseRequestKey; } }

        ///Start:Generated:Properties<<<
        public string PurposeOrUse { get; set; }
        public string RequisitionName { get; set; }
        public string Department { get; set; }
        public DateTime CreatedAt { get; set; }
        public string DepartmentManager { get; set; }
        public string GeneralManager { get; set; }
        public string AccountNo { get; set; }
        public string FriendlyIdentifier { get; set; }
        public DateTime? DateDepartmentManager { get; set; }
        public DateTime? DateGeneralManager { get; set; }
        public int PRNumberKey { get; set; }
        [ForeignKey("PRNumberKey")]
        public PRNumber PRNumber { get; set; }
        ///End:Generated:Properties<<<
    }
}
