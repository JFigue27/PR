using Reusable;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessSpecificLogic.EF
{
    [Table("Supplier")]
    public class Supplier : BaseEntity
    {
        public Supplier()
        {
            ///Start:Generated:Constructor<<<
			///End:Generated:Constructor<<<
            
        }

        [Key]
        public int SupplierKey { get; set; }

        public override int id { get { return SupplierKey; } }

        ///Start:Generated:Properties<<<
        public string Value { get; set; }
        ///End:Generated:Properties<<<
    }
}
