using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reusable
{
    public abstract class BaseDocument : BaseEntity, Trackable
    {
        public BaseDocument()
        {
            CreatedAt = DateTime.Now;
        }

        [NotMapped]
        public Track InfoTrack { get; set; }

        virtual public bool sys_active { get; set; }

        virtual public bool is_locked { get; set; }

        virtual public string document_status { get; set; }

        virtual public DateTime CreatedAt { get; set; }
    }
}
