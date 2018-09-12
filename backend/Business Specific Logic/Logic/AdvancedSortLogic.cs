using Reusable;
using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Data;
using BusinessSpecificLogic.EF;

namespace BusinessSpecificLogic.Logic
{
    public interface IAdvancedSortLogic : ILogic<AdvancedSort>
    {
    }

    public class AdvancedSortLogic : Logic<AdvancedSort>, IAdvancedSortLogic
    {
        public AdvancedSortLogic(DbContext context, IRepository<AdvancedSort> repository, LoggedUser LoggedUser) : base(context, repository, LoggedUser)
        {
        }

        protected override IQueryable<AdvancedSort> StaticDbQueryForList(IQueryable<AdvancedSort> dbQuery)
        {
            return dbQuery.Include(e => e.Sorting).Include(e => e.Filtering);
        }

        protected override void OnGetSingle(AdvancedSort entity)
        {
            var ctx = context as POContext;

            StaticDbQueryForList(ctx.AdvancedSortings).FirstOrDefault(e => e.AdvancedSortKey == entity.AdvancedSortKey);
        }

        protected override void AdapterOut(params AdvancedSort[] entities)
        {
            foreach (var item in entities)
            {
                item.Sorting = item.Sorting.OrderBy(e => e.Sequence).ToList();
            }
        }

        protected override void onBeforeSaving(AdvancedSort entity, BaseEntity parent = null, OPERATION_MODE mode = OPERATION_MODE.NONE)
        {
            var ctx = context as POContext;

            entity.UserKey = LoggedUser.LocalUser.UserKey;

            foreach (var item in entity.Sorting)
            {
                item.AdvancedSortKey = entity.id;
                ctx.Entry(item).State = item.SortDataKey == 0 ? EntityState.Added : EntityState.Modified;
            }

            foreach (var item in entity.Filtering)
            {
                item.AdvancedSortKey = entity.id;
                ctx.Entry(item).State = item.FilterDataKey == 0 ? EntityState.Added : EntityState.Modified;
            }

            if (mode == OPERATION_MODE.UPDATE)
            {
                var originalEntity = ctx.AdvancedSortings
                    .Include(e => e.Filtering)
                    .Include(e => e.Sorting)
                    .AsNoTracking()
                    .FirstOrDefault(e => e.AdvancedSortKey == entity.id);

                for (int i = originalEntity.Sorting.Count - 1; i >= 0; i--)
                {
                    var oSort = originalEntity.Sorting[i];
                    if (!entity.Sorting.Any(e => e.SortDataKey == oSort.SortDataKey))
                    {
                        ctx.Entry(oSort).State = EntityState.Deleted;
                    }
                }

                for (int i = originalEntity.Filtering.Count - 1; i >= 0; i--)
                {
                    var oFilter = originalEntity.Filtering[i];
                    if (!entity.Filtering.Any(e => e.FilterDataKey == oFilter.FilterDataKey))
                    {
                        ctx.Entry(oFilter).State = EntityState.Deleted;
                    }
                }
            }

        }

        protected override void onAfterSaving(DbContext context, AdvancedSort entity, BaseEntity parent = null, OPERATION_MODE mode = OPERATION_MODE.NONE)
        {
            //var ctx = context as POContext;

            //foreach (var item in entity.Sorting)
            //{
            //    item.AdvancedSortKey = entity.id;
            //    ctx.Entry(item).State = item.SortDataKey == 0 ? EntityState.Added : EntityState.Modified;
            //}

            //foreach (var item in entity.Filtering)
            //{
            //    item.AdvancedSortKey = entity.id;
            //    ctx.Entry(item).State = item.FilterDataKey == 0 ? EntityState.Added : EntityState.Modified;
            //}

            //ctx.SaveChanges();
        }

        public override CommonResponse GetSingleWhere(params Expression<Func<AdvancedSort, bool>>[] wheres)
        {
            var wheresList = wheres.ToList();
            wheresList.Add(e => e.UserKey == LoggedUser.LocalUser.UserKey);

            return base.GetSingleWhere(wheresList.ToArray());
        }
    }
}
