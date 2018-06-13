using Reusable;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessSpecificLogic.EF
{
    [Table("Comment")]
    public class Comment : BaseEntity
    {
        public Comment()
        {
            Comments = new List<Comment>();
        }

        [Key]
        public int CommentKey { get; set; }

        public long? ParentKey { get; set; }
        public string CommentText { get; set; }
        public DateTimeOffset? CommentDate { get; set; }
        public int CommentByUserKey { get; set; }
        [ForeignKey("CommentByUserKey")]
        public User CommentByUser { get; set; }

        public List<Comment> Comments { get; set; }
        public string Identicon64 { get; set; }

        public override int id => CommentKey;
    }
}
