using System;
using System.Data.Entity;

namespace Reusable
{
    public interface IDocumentLogic<Entity> : ILogic<Entity> where Entity : BaseDocument
    {
        CommonResponse Activate(int id);
        CommonResponse Unlock(Entity entity);
        CommonResponse Unlock(int id);
        CommonResponse Lock(Entity entity);
        CommonResponse Lock(int id);
        CommonResponse Finalize(Entity entity);
        CommonResponse Unfinalize(Entity entity);
    }

    public abstract class DocumentLogic<Document> : Logic<Document>, IDocumentLogic<Document> where Document : BaseDocument, new()
    {
        protected new IDocumentRepository<Document> repository;

        public DocumentLogic(DbContext context, IDocumentRepository<Document> repository, LoggedUser LoggedUser) : base(context, repository, LoggedUser)
        {
            this.repository = repository;
        }

        public virtual CommonResponse Activate(int id)
        {
            CommonResponse response = new CommonResponse();
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        //repository.ByUserId = LoggedUser.UserID;
                        repository.Activate(id);

                        transaction.Commit();
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return response.Error("ERROR: " + e.ToString());
                    }
                }

            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
            return response.Success(id);
        }

        public virtual CommonResponse Lock(int id)
        {
            CommonResponse response = new CommonResponse();
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        //repository.ByUserId = LoggedUser.UserID;
                        repository.Lock(id);

                        transaction.Commit();
                    }
                    catch (KnownError error)
                    {
                        transaction.Rollback();
                        return response.Error(error);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return response.Error("ERROR: " + e.ToString());
                    }
                }

            }
            catch (KnownError error)
            {
                return response.Error(error);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
            return response.Success(id);
        }

        public virtual CommonResponse Lock(Document entity)
        {
            CommonResponse response = new CommonResponse();
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        //repository.ByUserId = LoggedUser.UserID;
                        repository.Lock(entity);

                        transaction.Commit();
                    }
                    catch (KnownError error)
                    {
                        transaction.Rollback();
                        return response.Error(error);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return response.Error("ERROR: " + e.ToString());
                    }
                }

            }
            catch (KnownError error)
            {
                return response.Error(error);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
            return response.Success(entity);
        }

        public virtual CommonResponse Unlock(int id)
        {
            CommonResponse response = new CommonResponse();
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        //repository.ByUserId = LoggedUser.UserID;
                        repository.Unlock(id);

                        transaction.Commit();
                    }
                    catch (KnownError error)
                    {
                        transaction.Rollback();
                        return response.Error(error);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return response.Error("ERROR: " + e.ToString());
                    }
                }

            }
            catch (KnownError error)
            {
                return response.Error(error);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
            return response.Success(id);
        }

        public virtual CommonResponse Unlock(Document entity)
        {
            CommonResponse response = new CommonResponse();
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        //repository.ByUserId = LoggedUser.UserID;
                        repository.Unlock(entity);

                        transaction.Commit();
                    }
                    catch (KnownError error)
                    {
                        transaction.Rollback();
                        return response.Error(error);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return response.Error("ERROR: " + e.ToString());
                    }
                }

            }
            catch (KnownError error)
            {
                return response.Error(error);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
            return response.Success(entity);
        }

        public virtual CommonResponse Finalize(Document entity)
        {
            CommonResponse response = new CommonResponse();
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        //repository.ByUserId = LoggedUser.UserID;

                        onFinalize(entity);

                        repository.Finalize(entity);

                        transaction.Commit();
                    }
                    catch (KnownError error)
                    {
                        transaction.Rollback();
                        return response.Error(error);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return response.Error("ERROR: " + e.ToString());
                    }
                }

            }
            catch (KnownError error)
            {
                return response.Error(error);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
            return response.Success(entity);
        }

        public virtual CommonResponse Unfinalize(Document entity)
        {
            CommonResponse response = new CommonResponse();
            try
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        //repository.ByUserId = LoggedUser.UserID;

                        onUnfinalize(entity);

                        repository.Unfinalize(entity);

                        transaction.Commit();
                    }
                    catch (KnownError error)
                    {
                        transaction.Rollback();
                        return response.Error(error);
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        return response.Error("ERROR: " + e.ToString());
                    }
                }

            }
            catch (KnownError error)
            {
                return response.Error(error);
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
            return response.Success(entity);
        }
    }
}
