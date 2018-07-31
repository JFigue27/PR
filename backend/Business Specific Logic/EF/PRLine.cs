using Reusable;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessSpecificLogic.EF
{
    [Table("PRLine")]
    public class PRLine : BaseEntity
    {
        public PRLine()
        {
            ///Start:Generated:Constructor<<<
			///End:Generated:Constructor<<<
            
        }

        [Key]
        public int PRLineKey { get; set; }

        public override int id { get => PRLineKey; set => PRLineKey = value; }

        ///Start:Generated:Properties<<<
        public string ItemNumber { get; set; }
        public string Description { get; set; }
        public string UM { get; set; }
        public decimal Qty { get; set; }
        public decimal? PriceEach { get; set; }
        public decimal? PriceEach2 { get; set; }
        public decimal? PriceEach3 { get; set; }
        public int PurchaseRequestKey { get; set; }
        [ForeignKey("PurchaseRequestKey")]
        public PurchaseRequest PurchaseRequest { get; set; }
        ///End:Generated:Properties<<<
    }
}
