using System;
using System.Data.Entity;
using System.Linq;
using BusinessSpecificLogic.EF;
using Reusable;

namespace BusinessSpecificLogic.Logic
{
    public interface ICommentLogic : ILogic<Comment>
    {
    }

    public class CommentLogic : Logic<Comment>, ICommentLogic
    {
        public CommentLogic(DbContext context, IRepository<Comment> repository, LoggedUser LoggedUser) : base(context, repository, LoggedUser)
        {
        }

        protected override IQueryable<Comment> StaticDbQueryForList(IQueryable<Comment> dbQuery)
        {
            return dbQuery
                .Include(e => e.Comments)
                .Include(e => e.CommentByUser)
                .Include("Comments.CommentByUser");
        }

        protected override void OnGetSingle(Comment entity)
        {
            var ctx = context as POContext;
            StaticDbQueryForList(ctx.Comments).FirstOrDefault(e => e.CommentKey == entity.CommentKey);
        }

        protected override void onBeforeSaving(Comment entity, BaseEntity parent = null, OPERATION_MODE mode = OPERATION_MODE.NONE)
        {
            var ctx = context as POContext;

            if (mode == OPERATION_MODE.ADD)
            {
                if (entity.CommentByUser == null)
                {
                    var user = ctx.Users.FirstOrDefault(u => u.UserKey == LoggedUser.LocalUser.UserKey && u.sys_active == true);
                    entity.CommentByUser = user ?? throw new KnownError("User does not exist anymore.");
                }
                entity.CommentByUserKey = LoggedUser.LocalUser.UserKey;
                entity.CommentDate = DateTimeOffset.Now;
            }
        }
    }
}
