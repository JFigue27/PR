using Reusable;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessSpecificLogic.EF
{
    [Table("Department")]
    public class Department : BaseEntity
    {
        public Department()
        {
            ///Start:Generated:Constructor<<<
			///End:Generated:Constructor<<<
            
        }

        [Key]
        public int DepartmentKey { get; set; }

        public override int id { get { return DepartmentKey; } }

        ///Start:Generated:Properties<<<
        public string Value { get; set; }
        public decimal Budget { get; set; }
        public int? ManagerKey { get; set; }
        [NotMapped]
        public dynamic Manager { get; set; }
        public ICollection<GLAccount> GLAccounts { get; set; }
        ///End:Generated:Properties<<<
    }
}
