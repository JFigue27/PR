using Reusable;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessSpecificLogic.EF
{
    [Table("GLAccount")]
    public class GLAccount : BaseEntity
    {
        public GLAccount()
        {
            ///Start:Generated:Constructor<<<
			///End:Generated:Constructor<<<
            
        }

        [Key]
        public int GLAccountKey { get; set; }

        public override int id { get { return GLAccountKey; } }

        ///Start:Generated:Properties<<<
        public string Value { get; set; }
        public string Description { get; set; }
        public int? DepartmentKey { get; set; }
        [ForeignKey("DepartmentKey")]
        public Department Department { get; set; }
        public decimal? Budget { get; set; }
        public string FSMasterAccount { get; set; }
        public string FSGLAccountDescription  { get; set; }
        public string FSGLOrganizationDescription { get; set; }
        public string FSIsGLAccountActiveOrInactive { get; set; }
        public int FSGLMasterAccountKey { get; set; }
        public string FSGLAccountGroupDescription { get; set; }
        ///End:Generated:Properties<<<
    }
}
