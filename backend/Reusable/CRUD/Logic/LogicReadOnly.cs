using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;

namespace Reusable
{
    public interface IReadOnlyLogic<Entity> where Entity : class
    {
        LoggedUser LoggedUser { get; set; }
        CommonResponse GetAll();
        CommonResponse GetByID(int ID);
        CommonResponse GetPage(int perPage, int page, string filterGeneral, Expression<Func<Entity, bool>>[] wheres, Expression<Func<Entity, object>> orderby, params Expression<Func<Entity, bool>>[] database_wheres);
        CommonResponse GetSingleWhere(params Expression<Func<Entity, bool>>[] wheres);
        CommonResponse GetListWhere(Expression<Func<Entity, object>> orderby, params Expression<Func<Entity, bool>>[] wheres);
        CommonResponse GetAllByParent<ParentType>(int parentID) where ParentType : BaseEntity;
        CommonResponse CreateInstance(Entity entity = null);
        void FillRecursively<Parent>(IRecursiveEntity entity) where Parent : BaseEntity;
    }

    public abstract class ReadOnlyLogic<Entity> : IReadOnlyLogic<Entity> where Entity : class, new()
    {
        public LoggedUser LoggedUser { get; set; }

        protected DbContext context;
        protected IReadOnlyRepository<Entity> repository;

        public ReadOnlyLogic(DbContext context, IReadOnlyRepository<Entity> repository, LoggedUser LoggedUser)//, int? byUserId)
        {
            this.context = context;
            this.repository = repository;
            this.LoggedUser = LoggedUser;
            //this.byUserId = loggedUser.UserID;
        }

        //protected virtual void loadNavigationProperties(params Entity[] entities) { }
        //protected virtual void loadNavigationPropertiesWhenSingle(Entity entity) { }
        //protected virtual void addDbWheresWhenPaging(List<Expression<Func<Entity, bool>>> database_wheres) { }
        //protected virtual IQueryable<Entity> applyOrderByWhenPaging(IQueryable<Entity> recordset) { return recordset; }
        //public virtual List<Expression<Func<Entity, object>>> NavigationPropertiesWhenGetAll { get { return new List<Expression<Func<Entity, object>>>(); } }
        //protected virtual void Query_On_GetPage(IQueryable<Entity> recordset) { }




        //Hooks:
        protected virtual void OnCreateInstance(Entity entity) { }
        protected virtual IQueryable<Entity> StaticDbQueryForList(IQueryable<Entity> dbQuery) { return dbQuery; }
        protected virtual void OnGetSingle(Entity entity) { }
        protected virtual void AdapterOut(params Entity[] entities) { }
        protected virtual bool PopulateForSearch(params Entity[] entities) { return false; } // return true to avoid calling AdapterOut when getPage because they are the same.


        public virtual CommonResponse GetAll()
        {
            CommonResponse response = new CommonResponse();
            IEnumerable<Entity> entities;
            try
            {
                //repository.ByUserId = LoggedUser.UserID;
                entities = StaticDbQueryForList(repository.GetAll().AsQueryable()).AsNoTracking();

                AdapterOut(entities.ToArray());
                return response.Success(entities);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
        }

        public virtual CommonResponse GetByID(int ID)
        {
            CommonResponse response = new CommonResponse();
            try
            {
                Entity entity = repository.GetByID(ID);
                if (entity != null)
                {
                    //repository.ByUserId = LoggedUser.UserID;
                    OnGetSingle(entity);
                    AdapterOut(entity);
                    return response.Success(entity);
                }
                else
                {
                    return response.Error("Entity not found.");
                }
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
        }

        protected class FilterResponse
        {
            public List<List<BaseEntity>> Dropdowns { get; set; }
            public int total_items { get; set; }
            public int total_filtered_items { get; set; }
        }

        public virtual CommonResponse GetPage(int perPage, int page, string filterGeneral, Expression<Func<Entity, bool>>[] wheres, Expression<Func<Entity, object>> orderby, params Expression<Func<Entity, bool>>[] database_wheres)
        {
            CommonResponse response = new CommonResponse();
            FilterResponse filterResponse = new FilterResponse();

            IEnumerable<Entity> entities; //Entities comming from DB
            IQueryable<Entity> resultset; //To filter properties not in DB

            try
            {
                //repository.ByUserId = LoggedUser.UserID;

                //Apply Database Filtering and Fetch
                entities = StaticDbQueryForList(repository.GetList(orderby, null, database_wheres).AsQueryable()).AsNoTracking().ToList();

                //Apply Roles Filtering

                //Applying Non-Database Wheres

                resultset = entities.AsQueryable();
                foreach (var where in wheres)
                {
                    resultset = resultset.Where(where);
                }

                filterResponse.total_items = resultset.Count();


                #region Apply General Search Filter

                bool PopulateForSearchEqualsAdapterOut = false;
                PopulateForSearchEqualsAdapterOut = PopulateForSearch(resultset.ToArray());

                HashSet<Entity> filteredResultSet = new HashSet<Entity>();
                if (!string.IsNullOrWhiteSpace(filterGeneral))
                {
                    string[] arrFilterGeneral = filterGeneral.ToLower().Split(' ');

                    var searchableProps = typeof(Entity).GetProperties().Where(prop => new[] { "String" }.Contains(prop.PropertyType.Name));

                    foreach (var e in resultset)
                    {
                        bool bAllKeywordsFound = true;
                        foreach (var keyword in arrFilterGeneral)
                        {
                            bool bAtLeastOnePropertyContainsIt = false;
                            foreach (var prop in searchableProps)
                            {
                                string a = (string)prop.GetValue(e, null);
                                if (a != null && a.ToLower().Contains(keyword.Trim()))
                                {
                                    bAtLeastOnePropertyContainsIt = true;
                                    break;
                                }
                            }
                            if (!bAtLeastOnePropertyContainsIt)
                            {
                                bAllKeywordsFound = false;
                                break;
                            }
                        }
                        if (bAllKeywordsFound)
                        {
                            filteredResultSet.Add(e);
                        }
                    }

                    //DID NOT WORK ALL THE TIMES:
                    //resultset = resultset.Where(e => searchableProps.Any(prop =>
                    //                                    arrFilterGeneral.All(keyword =>
                    //                                        ((string)prop.GetValue(e, null) ?? "").ToString().ToLower()
                    //                                        .Contains(keyword))));
                }
                else
                {
                    filteredResultSet = new HashSet<Entity>(resultset);
                }

                #endregion

                filterResponse.total_filtered_items = filteredResultSet.Count();

                #region Pagination
                IEnumerable<Entity> afterPaginate;
                if (perPage != 0)
                {
                    afterPaginate = filteredResultSet.Skip((page - 1) * perPage).Take(perPage);
                }
                else
                {
                    afterPaginate = filteredResultSet;
                }
                #endregion

                if (!PopulateForSearchEqualsAdapterOut)
                {
                    AdapterOut(afterPaginate.ToArray());
                }
                return response.Success(afterPaginate, filterResponse);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
        }

        public virtual CommonResponse GetSingleWhere(params Expression<Func<Entity, bool>>[] wheres)
        {
            CommonResponse response = new CommonResponse();
            FilterResponse filterResponse = new FilterResponse();

            Entity entity;
            try
            {
                //repository.ByUserId = LoggedUser.UserID;

                entity = repository.GetSingle(null, wheres);
                if (entity != null)
                {
                    OnGetSingle(entity);
                    AdapterOut(entity);
                }
                return response.Success(entity);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
        }

        public virtual CommonResponse GetListWhere(Expression<Func<Entity, object>> orderby, params Expression<Func<Entity, bool>>[] wheres)
        {
            CommonResponse response = new CommonResponse();
            IEnumerable<Entity> entities;
            try
            {
                //repository.ByUserId = LoggedUser.UserID;
                entities = StaticDbQueryForList(repository.GetList(orderby, null, wheres).AsQueryable()).AsNoTracking();

                AdapterOut(entities.ToArray());
                return response.Success(entities);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
        }

        public virtual CommonResponse GetAllByParent<ParentType>(int parentID) where ParentType : BaseEntity
        {
            CommonResponse response = new CommonResponse();
            IEnumerable<Entity> entities;

            try
            {
                //repository.ByUserId = LoggedUser.UserID;
                entities = repository.GetListByParent<ParentType>(parentID);

                AdapterOut(entities.ToArray());
                return response.Success(entities);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
        }

        public virtual CommonResponse GetSingleByParent<ParentType>(int parentID) where ParentType : BaseEntity
        {
            CommonResponse response = new CommonResponse();
            Entity entity;

            try
            {
                //repository.ByUserId = LoggedUser.UserID;
                entity = repository.GetSingleByParent<ParentType>(parentID);

                OnGetSingle(entity);
                AdapterOut(entity);
                return response.Success(entity);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
        }

        public CommonResponse CreateInstance(Entity entity = null)
        {
            CommonResponse response = new CommonResponse();
            try
            {
                if (entity == null)
                {
                    entity = new Entity();
                }
                OnCreateInstance(entity);
            }
            catch (KnownError ke)
            {
                return response.Error(ke);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }

            return response.Success(entity);
        }

        public void FillRecursively<Parent>(IRecursiveEntity entity) where Parent : BaseEntity
        {
            if (entity != null)
            {
                IEnumerable<Entity> entities = repository.GetListByParent<Parent>(entity.id);
                entity.nodes = new List<IRecursiveEntity>();
                foreach (IRecursiveEntity item in entities)
                {
                    entity.nodes.Add(item);
                    FillRecursively<Parent>(item);
                }
            }
        }

        public List<Entity> NestedToSingleList(IRecursiveEntity entity, List<Entity> result)
        {
            //repository.ByUserId = LoggedUser.UserID;
            if (result == null) { result = new List<Entity>(); }
            if (entity != null)
            {
                result.Add((Entity)entity);
                foreach (var item in entity.nodes)
                {
                    NestedToSingleList(item, result);
                }
            }
            return result;
        }

    }
}