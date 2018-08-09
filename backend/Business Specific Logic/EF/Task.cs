using Reusable;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessSpecificLogic.EF
{
    [Table("Task")]
    public class Task : BaseEntity
    {
        public Task()
        {
            ///Start:Generated:Constructor<<<
            ///End:Generated:Constructor<<<
            DateCreatedAt = DateTimeOffset.Now;
        }

        [Key]
        public int TaskKey { get; set; }

        public override int id { get { return TaskKey; } set { TaskKey = value; } }

        ///Start:Generated:Properties<<<
        public string Category { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public TaskStatus Status { get; set; }
        public TaskPriority Priority { get; set; }

        public int? UserCreatedByKey { get; set; }
        [ForeignKey("UserCreatedByKey")]
        public User UserCreatedBy { get; set; }

        public int? UserAssignedToKey { get; set; }
        [ForeignKey("UserAssignedToKey")]
        public User UserAssignedTo { get; set; }

        public int? UserCompletedByKey { get; set; }
        [ForeignKey("UserCompletedByKey")]
        public User UserCompletedBy { get; set; }

        public DateTimeOffset DateCreatedAt { get; set; }
        public DateTimeOffset? DateDue { get; set; }
        public DateTimeOffset? DateClosed { get; set; }

        public int? ForeignKey { get; set; }
        public string ForeignType { get; set; }
        public int? ForeignURLKey { get; set; }
        public string ForeignURLType { get; set; }

        public bool? IsCancelled { get; set; }
        ///End:Generated:Properties<<<

        public enum TaskStatus
        {
            PENDING,
            IN_PROGRESS,
            COMPLETED,
            CANCELLED,
            ON_HOLD
        }

        public enum TaskPriority
        {
            LOW,
            MEDIUM,
            HIGH,
            URGENT
        }
    }
}
