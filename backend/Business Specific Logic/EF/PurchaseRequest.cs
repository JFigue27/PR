using Reusable;
using Reusable.Attachments;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessSpecificLogic.EF
{
    [Table("PurchaseRequest")]
    public class PurchaseRequest : BaseDocument, IAttachment
    {
        public PurchaseRequest()
        {
            ///Start:Generated:Constructor<<<
			sys_active = true;
			///End:Generated:Constructor<<<


        }

        [Key]
        public int PurchaseRequestKey { get; set; }

        public override int id { get { return PurchaseRequestKey; } }

        ///Start:Generated:Properties<<<
        public string PurposeOrUse { get; set; }
        public string RequisitionName { get; set; }
        public string Department { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public string DepartmentManager { get; set; }
        public string GeneralManager { get; set; }
        public string AccountNo { get; set; }
        public string FriendlyIdentifier { get; set; }
        public DateTimeOffset? DateDepartmentManager { get; set; }
        public DateTimeOffset? DateGeneralManager { get; set; }
        public string Supplier1 { get; set; }
        public string Supplier2 { get; set; }
        public string Supplier3 { get; set; }
        public string SupplierCurrency1 { get; set; }
        public string SupplierCurrency2 { get; set; }
        public string SupplierCurrency3 { get; set; }
        public string Notes { get; set; }
        public string SupplierSelected { get; set; }
        public int PRNumberKey { get; set; }
        [ForeignKey("PRNumberKey")]
        public PRNumber PRNumber { get; set; }
        ///End:Generated:Properties<<<

        public List<PRLine> PRLines { get; set; }

        public string AttachmentsFolder { get; set; }
        public List<Attachment> Attachments { get; set; }
    }
}
