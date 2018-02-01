namespace BusinessSpecificLogic.EF
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using Reusable;
    using Reusable.Workflows;

    public partial class POContext : DbContext
    {
        public POContext()
            : base("name=POConn")
        {
            Configuration.LazyLoadingEnabled = false;
            Configuration.ProxyCreationEnabled = false;

            //Database.Log = Console.Write;
        }

        ///Start:Generated:DbSet<<<
		public virtual DbSet<PRLine> PRLines { get; set; }
		public virtual DbSet<PRNumber> PRNumbers { get; set; }
		public virtual DbSet<Supplier> Suppliers { get; set; }
		public virtual DbSet<Department> Departments { get; set; }
		public virtual DbSet<GLAccount> GLAccounts { get; set; }
		public virtual DbSet<PurchaseRequest> PurchaseRequests { get; set; }
		///End:Generated:DbSet<<<

        #region From Reusable Modules
        public virtual DbSet<Track> Tracks { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Workflow> Workflows { get; set; }
        public virtual DbSet<Step> Steps { get; set; }
        public virtual DbSet<StepOperation> StepOperations { get; set; }
        public virtual DbSet<Token> Tokens { get; set; }
        #endregion

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            
            #region Reusable
            modelBuilder.Entity<User>()
                .Property(e => e.Identicon64)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .HasMany(e => e.Sorts)
                .WithOptional(e => e.User)
                .HasForeignKey(e => e.Sort_User_ID);

            modelBuilder.Entity<User>()
                .HasMany(e => e.Tracks)
                .WithOptional(e => e.User_LastEditedBy)
                .HasForeignKey(e => e.User_LastEditedByKey);

            modelBuilder.Entity<User>()
                .HasMany(e => e.Tracks1)
                .WithOptional(e => e.User_RemovedBy)
                .HasForeignKey(e => e.User_RemovedByKey);

            modelBuilder.Entity<User>()
                .HasMany(e => e.Tracks2)
                .WithOptional(e => e.User_AssignedTo)
                .HasForeignKey(e => e.User_AssignedToKey);

            modelBuilder.Entity<User>()
                .HasMany(e => e.Tracks3)
                .WithOptional(e => e.User_AssignedBy)
                .HasForeignKey(e => e.User_AssignedByKey);

            modelBuilder.Entity<User>()
                .HasMany(e => e.Tracks4)
                .WithOptional(e => e.User_CreatedBy)
                .HasForeignKey(e => e.User_CreatedByKey);

            #endregion
        }
    }
}
