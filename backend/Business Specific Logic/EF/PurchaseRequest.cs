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
            PRType = "MRO";

        }

        [Key]
        public int PurchaseRequestKey { get; set; }

        public override int id { get { return PurchaseRequestKey; } }

        ///Start:Generated:Properties<<<
        public string PurposeOrUse { get; set; }
        public int? RequisitorKey { get; set; }
        [ForeignKey("RequisitorKey")]
        public User Requisitor { get; set; }
        public string RequisitionName { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public int? DepartmentManagerKey { get; set; }
        [ForeignKey("DepartmentManagerKey")]
        public User DepartmentManager { get; set; }
        public int? GeneralManagerKey { get; set; }
        [ForeignKey("GeneralManagerKey")]
        public User GeneralManager { get; set; }
        public int? GLAccountKey { get; set; }
        [ForeignKey("GLAccountKey")]
        public GLAccount AccountNo { get; set; }
        public string FriendlyIdentifier { get; set; }
        public DateTimeOffset? DateDepartmentManager { get; set; }
        public DateTimeOffset? DateGeneralManager { get; set; }
        public int? Supplier1Key { get; set; }
        [ForeignKey("Supplier1Key")]
        public Supplier Supplier1 { get; set; }
        public int? Supplier2Key { get; set; }
        [ForeignKey("Supplier2Key")]
        public Supplier Supplier2 { get; set; }
        public int? Supplier3Key { get; set; }
        [ForeignKey("Supplier3Key")]
        public Supplier Supplier3 { get; set; }
        public string SupplierCurrency1 { get; set; }
        public string SupplierCurrency2 { get; set; }
        public string SupplierCurrency3 { get; set; }
        public string Notes { get; set; }
        public int? SupplierSelectedKey { get; set; }
        [ForeignKey("SupplierSelectedKey")]
        public Supplier SupplierSelected { get; set; }
        public string PONumber { get; set; }
        public int PRNumberKey { get; set; }
        [ForeignKey("PRNumberKey")]
        public PRNumber PRNumber { get; set; }
        public int? DepartmentKey { get; set; }
        [ForeignKey("DepartmentKey")]
        public Department DepartmentAssigned { get; set; }
        ///End:Generated:Properties<<<

        public List<PRLine> PRLines { get; set; }

        public string AttachmentsFolder { get; set; }
        public List<Attachment> Attachments { get; set; }

        public string PRType { get; set; } //MRO or MRP, where MRP = Finance
    }
}
