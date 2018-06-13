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
            return dbQuery.Include(e => e.Comments);
        }
    }
}
