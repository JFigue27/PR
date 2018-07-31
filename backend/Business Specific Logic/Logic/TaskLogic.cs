using BusinessSpecificLogic.EF;
using BusinessSpecificLogic.JSON_Entities;
using Newtonsoft.Json;
using Reusable;
using Reusable.CRUD.JsonEntities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace BusinessSpecificLogic.Logic
{
    /* 
     * TODO: 
     * -TransferTasks
     * -There are shared tasks where any user assigned can complete it.
     */

    public interface ITaskLogic : ILogic<Task>
    {
        void SaveTasks(List<Contact> responsibles, BaseEntity fromEntity = null);
        void SaveTask(Contact responsible, BaseEntity fromEntity = null);
        void SaveTask(int responsibleKey, BaseEntity fromEntity = null);
        void CancelTask(BaseEntity fromEntity);
        //void TransferTasks(int fromUserKey, int toUserKey);
    }

    public class TaskLogic : Logic<Task>, ITaskLogic
    {
        public TaskLogic(DbContext context, IRepository<Task> repository, LoggedUser LoggedUser) : base(context, repository, LoggedUser)
        {
        }

        private Task CreateTaskFromEntity(BaseEntity fromEntity, int? userKey)
        {
            switch (fromEntity.AAA_EntityName)
            {
                case "Approval":
                    var approval = fromEntity as Approval;
                    var taskFromApproval = new Task()
                    {
                        Category = "Approval",
                        DateDue = DateTimeOffset.Now,
                        Priority = Task.TaskPriority.MEDIUM,
                        Status = Task.TaskStatus.PENDING,
                        Title = approval.Title,
                        UserAssignedToKey = userKey,
                        DateClosed = null,
                        DateCreatedAt = DateTimeOffset.Now,
                        ForeignKey = approval.id,
                        ForeignType = approval.AAA_EntityName,
                        //ForeignURLKey = approval.CQAHeaderKey,
                        ForeignURLType = "CQAHeader",
                        UserCreatedByKey = LoggedUser.UserID,
                        Description = approval.RequestDescription
                    };
                    return taskFromApproval;
                    
                default:
                    throw new KnownError("Error. Could not create Task. Entity type not supported yet.");
            }
        }

        private void UpdateTaskFromEntity(Task task, BaseEntity fromEntity)
        {
            switch (fromEntity.AAA_EntityName)
            {
                case "Approval":
                    var approval = fromEntity as Approval;
                    task.Description = string.IsNullOrWhiteSpace(approval.ResponseDescription) ? approval.RequestDescription : approval.ResponseDescription;

                    if (task.Status != Task.TaskStatus.COMPLETED && (approval.Status == "Rejected" || approval.Status == "Approved"))
                    {
                        task.DateClosed = DateTimeOffset.Now;
                        task.Status = Task.TaskStatus.COMPLETED;
                        task.UserCompletedByKey = LoggedUser.UserID;
                    }
                    else if (approval.Status != "Rejected" && approval.Status != "Approved")
                    {
                        task.Status = Task.TaskStatus.IN_PROGRESS;
                    }
                    break;

                default:
                    break;
            }
        }

        public void SaveTasks(List<Contact> responsibles, BaseEntity entity = null)
        {
            var ctx = context as POContext;

            var users = ctx.Users.Where(u => u.sys_active == true && u.Email != null).ToList();

            var tasks = ctx.Tasks.Where(t => t.ForeignKey == entity.id && t.ForeignType == entity.AAA_EntityName && (t.IsCancelled == null || t.IsCancelled == false)).ToList();

            if (responsibles != null && responsibles.Count > 0)
            {
                foreach (var responsible in responsibles)
                {
                    var user = users.FirstOrDefault(u => responsible.Email != null && responsible.Email.Trim().ToLower() == u.Email.Trim().ToLower());
                    if (user != null)
                    {
                        //Create Task only if it is not created for user
                        var task = tasks.FirstOrDefault(t => t.UserAssignedToKey == user.UserKey);
                        if (task == null)
                        {
                            task = CreateTaskFromEntity(entity, user.id);
                            ctx.Tasks.Add(task);
                        }
                    }
                }

                foreach (var task in tasks)
                {
                    var userAssigned = users.FirstOrDefault(u => u.UserKey == task.UserAssignedToKey);
                    if (userAssigned != null)
                    {
                        var userResponsible = responsibles.FirstOrDefault(u => userAssigned.Email != null && userAssigned.Email.Trim().ToLower() == u.Email.Trim().ToLower());
                        if (userResponsible != null)
                        {
                            //Update Tasks if already exists for user
                            UpdateTaskFromEntity(task, entity);
                        }
                        else
                        {
                            //Cancel Task when user is removed
                            task.IsCancelled = true;
                        }
                    }
                    else
                    {
                        //Cancel Task when user no longer exists
                        task.IsCancelled = true;
                    }
                }
            }
            else
            {
                //Cancel all tasks when there are no users
                foreach (var task in tasks)
                {
                    task.IsCancelled = true;
                }
            }

            ctx.SaveChanges();
        }

        public void SaveTask(Contact responsible, BaseEntity entity = null)
        {
            var ctx = context as POContext;

            if (string.IsNullOrWhiteSpace(responsible.Email)) throw new KnownError("Error. Missing Responsible's Email.");


            var user = ctx.Users.Where(u => u.sys_active == true && u.Email.Trim().ToLower() == responsible.Email.Trim().ToLower()).FirstOrDefault();

            var task = ctx.Tasks
                .Where(t => t.ForeignKey == entity.id)
                .Where(t => t.ForeignType == entity.AAA_EntityName)
                .Where(t => (t.IsCancelled == null || t.IsCancelled == false))
                .Where(t => t.UserAssignedToKey == user.UserKey)
                .FirstOrDefault();

            if (task == null)
            {
                task = CreateTaskFromEntity(entity, user.id);
                ctx.Tasks.Add(task);
            }
            else
            {
                UpdateTaskFromEntity(task, entity);
            }

            ctx.SaveChanges();
        }

        public void SaveTask(int responsibleKey, BaseEntity entity = null)
        {
            var ctx = context as POContext;

            if (responsibleKey <= 0) throw new KnownError("Error. Missing Responsible's ID.");


            var task = ctx.Tasks
                .Where(t => t.ForeignKey == entity.id)
                .Where(t => t.ForeignType == entity.AAA_EntityName)
                .Where(t => (t.IsCancelled == null || t.IsCancelled == false))
                .Where(t => t.UserAssignedToKey == responsibleKey)
                .FirstOrDefault();

            if (task == null)
            {
                task = CreateTaskFromEntity(entity, responsibleKey);
                ctx.Tasks.Add(task);
            }
            else
            {
                UpdateTaskFromEntity(task, entity);
            }

            ctx.SaveChanges();
        }

        public void CancelTask(BaseEntity fromEntity)
        {
            var ctx = context as POContext;
            var task = ctx.Tasks.FirstOrDefault(t => t.ForeignKey == fromEntity.id && t.ForeignType == fromEntity.AAA_EntityName);
            if (task != null && task.IsCancelled == null || task.IsCancelled == false)
            {
                task.IsCancelled = true;
                ctx.SaveChanges();
            }
        }

        protected override IQueryable<Task> StaticDbQueryForList(IQueryable<Task> dbQuery)
        {
            var ctx = context as POContext;

            var sAdvancedSortName = HttpContext.Current.Request["advanced-sort"];
            if (sAdvancedSortName != null)
            {
                var advancedSort = ctx.AdvancedSortings
                    .Include(e => e.Filtering)
                    .Include(e => e.Sorting)
                    .FirstOrDefault(e => e.UserKey == LoggedUser.UserID && e.Name == sAdvancedSortName);

                if (advancedSort != null)
                {
                    #region Filtering
                    //foreach (var filter in advancedSort.Filtering)
                    //{
                    //    if (!string.IsNullOrWhiteSpace(filter.Value))
                    //    {
                    //        var catalogList = JsonConvert.DeserializeObject<List<Catalog>>(filter.Value);
                    //        if (catalogList.Count > 0)
                    //        {
                    //            dbQuery = dbQuery.Where(e => ctx.AdvancedSortings
                    //                        .Where(advSort => advSort.UserKey == LoggedUser.UserID && advSort.Name == sAdvancedSortName)
                    //                        .Join(ctx.FilterDatas, a => a.AdvancedSortKey, f => f.AdvancedSortKey, (a, f) => f)
                    //                        .Any(f => (f.Key == filter.Key && f.Value.Contains(e.Status.ToString()))));
                    //        }
                    //    }

                    //}

                    //Status
                    var filterStatus = advancedSort.Filtering.FirstOrDefault(e => e.Key == "Status");
                    if (filterStatus != null && !string.IsNullOrWhiteSpace(filterStatus.Value))
                    {
                        var list = JsonConvert.DeserializeObject<List<Catalog>>(filterStatus.Value);
                        if (list.Count > 0)
                        {
                            dbQuery = dbQuery.Where(e => ctx.AdvancedSortings
                                                                .Where(advSort => advSort.UserKey == LoggedUser.UserID && advSort.Name == sAdvancedSortName)
                                                                .Join(ctx.FilterDatas, a => a.AdvancedSortKey, f => f.AdvancedSortKey, (a, f) => f)
                                                                .Any(f => (f.Key == "Status" && f.Value.Contains(e.Status.ToString()))));
                        }
                    }

                    //Category
                    var filterCategory = advancedSort.Filtering.FirstOrDefault(e => e.Key == "Category");
                    if (filterCategory != null && !string.IsNullOrWhiteSpace(filterCategory.Value))
                    {
                        var list = JsonConvert.DeserializeObject<List<Catalog>>(filterCategory.Value);
                        if (list.Count > 0)
                        {
                            dbQuery = dbQuery.Where(e => ctx.AdvancedSortings
                                                                .Where(advSort => advSort.UserKey == LoggedUser.UserID && advSort.Name == sAdvancedSortName)
                                                                .Join(ctx.FilterDatas, a => a.AdvancedSortKey, f => f.AdvancedSortKey, (a, f) => f)
                                                                .Any(f => (f.Key == "Category" && f.Value.Contains(e.Category))));
                        }
                    }

                    //Priority
                    var filterPriority = advancedSort.Filtering.FirstOrDefault(e => e.Key == "Priority");
                    if (filterPriority != null && !string.IsNullOrWhiteSpace(filterPriority.Value))
                    {
                        var list = JsonConvert.DeserializeObject<List<Catalog>>(filterPriority.Value);
                        if (list.Count > 0)
                        {
                            dbQuery = dbQuery.Where(e => ctx.AdvancedSortings
                                                                .Where(advSort => advSort.UserKey == LoggedUser.UserID && advSort.Name == sAdvancedSortName)
                                                                .Join(ctx.FilterDatas, a => a.AdvancedSortKey, f => f.AdvancedSortKey, (a, f) => f)
                                                                .Any(f => (f.Key == "Priority" && f.Value.Contains(e.Priority.ToString()))));
                        }
                    }

                    //CreatedBy
                    var filterCreatedBy = advancedSort.Filtering.FirstOrDefault(e => e.Key == "CreatedBy");
                    if (filterCreatedBy != null && !string.IsNullOrWhiteSpace(filterCreatedBy.Value))
                    {
                        var list = JsonConvert.DeserializeObject<List<Catalog>>(filterCreatedBy.Value);
                        if (list.Count > 0)
                        {
                            dbQuery = dbQuery.Where(e => ctx.AdvancedSortings
                                                                .Where(advSort => advSort.UserKey == LoggedUser.UserID && advSort.Name == sAdvancedSortName)
                                                                .Join(ctx.FilterDatas, a => a.AdvancedSortKey, f => f.AdvancedSortKey, (a, f) => f)
                                                                .Any(f => (f.Key == "CreatedBy" && f.Value.Contains("\"id\":" + e.UserCreatedBy.UserKey + ","))));
                        }
                    }

                    //AssignedTo
                    var filterAssignedTo = advancedSort.Filtering.FirstOrDefault(e => e.Key == "AssignedTo");
                    if (filterAssignedTo != null && !string.IsNullOrWhiteSpace(filterAssignedTo.Value))
                    {
                        var list = JsonConvert.DeserializeObject<List<Catalog>>(filterAssignedTo.Value);
                        if (list.Count > 0)
                        {
                            dbQuery = dbQuery.Where(e => ctx.AdvancedSortings
                                                                .Where(advSort => advSort.UserKey == LoggedUser.UserID && advSort.Name == sAdvancedSortName)
                                                                .Join(ctx.FilterDatas, a => a.AdvancedSortKey, f => f.AdvancedSortKey, (a, f) => f)
                                                                .Any(f => (f.Key == "AssignedTo" && f.Value.Contains("\"id\":" + e.UserAssignedTo.UserKey + ","))));
                        }
                    }

                    //CompletedBy
                    var filterCompletedBy = advancedSort.Filtering.FirstOrDefault(e => e.Key == "CompletedBy");
                    if (filterCompletedBy != null && !string.IsNullOrWhiteSpace(filterCompletedBy.Value))
                    {
                        var list = JsonConvert.DeserializeObject<List<Catalog>>(filterCompletedBy.Value);
                        if (list.Count > 0)
                        {
                            dbQuery = dbQuery.Where(e => ctx.AdvancedSortings
                                                                .Where(advSort => advSort.UserKey == LoggedUser.UserID && advSort.Name == sAdvancedSortName)
                                                                .Join(ctx.FilterDatas, a => a.AdvancedSortKey, f => f.AdvancedSortKey, (a, f) => f)
                                                                .Any(f => (f.Key == "CompletedBy" && f.Value.Contains("\"id\":" + e.UserCompletedBy.UserKey + ","))));
                        }
                    }
                    #endregion

                    #region Sorting
                    advancedSort.Sorting = advancedSort.Sorting.OrderBy(s => s.Sequence).ToList();
                    var dbQueryOrdered = dbQuery.OrderBy(e => 0);

                    foreach (var sort in advancedSort.Sorting)
                    {
                        dbQueryOrdered = OrderBy(dbQueryOrdered, sort);
                    }
                    dbQuery = dbQueryOrdered;

                    #endregion

                }
            }

            return dbQuery
                .Include(e => e.UserCreatedBy)
                .Where(e => e.IsCancelled == null || e.IsCancelled == false);
        }

        private IOrderedQueryable<Task> OrderBy(IOrderedQueryable<Task> dbQuery, SortData sort)
        {
            switch (sort.Value)
            {
                case "Status":
                    if (sort.AscDesc == "DESC")
                    {
                        dbQuery = dbQuery.ThenByDescending(e => e.Status.ToString());
                    }
                    else
                    {
                        dbQuery = dbQuery.ThenBy(e => e.Status.ToString());
                    }
                    break;
                case "Created By":
                    if (sort.AscDesc == "DESC")
                    {
                        dbQuery = dbQuery.ThenByDescending(e => e.UserCreatedBy.Value);
                    }
                    else
                    {
                        dbQuery = dbQuery.ThenBy(e => e.UserCreatedBy.Value);
                    }
                    break;
                case "Assigned To":
                    if (sort.AscDesc == "DESC")
                    {
                        dbQuery = dbQuery.ThenByDescending(e => e.UserAssignedTo.Value);
                    }
                    else
                    {
                        dbQuery = dbQuery.ThenBy(e => e.UserAssignedTo.Value);
                    }
                    break;
                case "Priority":
                    if (sort.AscDesc == "DESC")
                    {
                        dbQuery = dbQuery.ThenByDescending(e => e.Priority.ToString());
                    }
                    else
                    {
                        dbQuery = dbQuery.ThenBy(e => e.Priority.ToString());
                    }
                    break;
                case "Category":
                    if (sort.AscDesc == "DESC")
                    {
                        dbQuery = dbQuery.ThenByDescending(e => e.Category);
                    }
                    else
                    {
                        dbQuery = dbQuery.ThenBy(e => e.Category);
                    }
                    break;
                case "Title":
                    if (sort.AscDesc == "DESC")
                    {
                        dbQuery = dbQuery.ThenByDescending(e => e.Title);
                    }
                    else
                    {
                        dbQuery = dbQuery.ThenBy(e => e.Title);
                    }
                    break;
                case "Description":
                    if (sort.AscDesc == "DESC")
                    {
                        dbQuery = dbQuery.ThenByDescending(e => e.Description);
                    }
                    else
                    {
                        dbQuery = dbQuery.ThenBy(e => e.Description);
                    }
                    break;
                case "Completed By":
                    if (sort.AscDesc == "DESC")
                    {
                        dbQuery = dbQuery.ThenByDescending(e => e.UserCompletedBy.Value);
                    }
                    else
                    {
                        dbQuery = dbQuery.ThenBy(e => e.UserCompletedBy.Value);
                    }
                    break;
                case "Date Created At":
                    if (sort.AscDesc == "DESC")
                    {
                        dbQuery = dbQuery.ThenByDescending(e => e.DateCreatedAt);
                    }
                    else
                    {
                        dbQuery = dbQuery.ThenBy(e => e.DateCreatedAt);
                    }
                    break;
                case "Date Due Date":
                    if (sort.AscDesc == "DESC")
                    {
                        dbQuery = dbQuery.ThenByDescending(e => e.DateDue);
                    }
                    else
                    {
                        dbQuery = dbQuery.ThenBy(e => e.DateDue);
                    }
                    break;
                case "Date Closed":
                    if (sort.AscDesc == "DESC")
                    {
                        dbQuery = dbQuery.ThenByDescending(e => e.DateClosed);
                    }
                    else
                    {
                        dbQuery = dbQuery.ThenBy(e => e.DateClosed);
                    }
                    break;
                default:
                    break;
            }

            return dbQuery;
        }

        
    }
}
