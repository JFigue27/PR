namespace Reusable
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("User")]
    public partial class User : BaseDocument
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public User()
        {
            sys_active = true;
        }

        [Key]
        public int UserKey { get; set; }

        [Required]
        [StringLength(50)]
        public string Value { get; set; }

        [Required]
        [StringLength(20)]
        [Index(IsUnique = true)]
        public string UserName { get; set; }

        [StringLength(50)]
        public string Role { get; set; }

        [StringLength(50)]
        public string AuthorizatorPassword { get; set; }

        [StringLength(256)]
        public string Email { get; set; }

        [StringLength(50)]
        public string Phone1 { get; set; }

        [StringLength(50)]
        public string Phone2 { get; set; }

        public byte[] Identicon { get; set; }

        public string Identicon64 { get; set; }

        public override int id { get { return UserKey; } set { UserKey = value; } }

        [NotMapped]
        public string Password { get; set; }

        [NotMapped]
        public string ConfirmPassword { get; set; }

        [NotMapped]
        public bool ChangePassword { get; set; }


        public string EmailPassword { get; set; }

        public string EmailServer { get; set; }

        public string EmailPort { get; set; }

        public int? DepartmentKey { get; set; }
    }
}