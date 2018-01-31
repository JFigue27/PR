using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reusable.Workflows
{
    [Table("WorkflowStepOperation")]
    public partial class StepOperation : BaseEntity, IRecursiveEntity
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public StepOperation()
        {
            nodes = new List<IRecursiveEntity>();
        }

        [Key]
        public int StepKey { get; set; }
        public override int id { get { return StepKey; } }

        [Required]
        [StringLength(150)]
        public string Name { get; set; }

        public bool? IsDone { get; set; }

        public int? ForeignParentKey { get; set; }

        public int? WorkflowKey { get; set; }

        public string ProcessType { get; set; }


        [ForeignKey("ParentKey")]
        public StepOperation ParentStep { get; set; }
        public int? ParentKey { get; set; }

        public List<StepOperation> StepOperations { get; set; }

        [NotMapped]
        public List<IRecursiveEntity> nodes { get; set; }

        [NotMapped]
        public bool IsDoneQueried { get; set; }
    }
}
