using Reusable;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessSpecificLogic.EF
{
    [Table("PRNumber")]
    public class PRNumber : BaseEntity
    {
        public PRNumber()
        {
            ///Start:Generated:Constructor<<<
			CreatedAt = DateTime.Now;
			///End:Generated:Constructor<<<
            
        }

        [Key]
        public int PRNumberKey { get; set; }

        public override int id { get { return PRNumberKey; } }

        ///Start:Generated:Properties<<<
        public DateTime CreatedAt { get; set; }
        public string GeneratedNumber { get; set; }
        public string Revision { get; set; }
        public int? RevisionFrom { get; set; }
        public int? DuplicatedFrom { get; set; }
        public int Sequence { get; set; }
        public string TaskDescriptionRevisionReason { get; set; }
        ///End:Generated:Properties<<<
    }
}
