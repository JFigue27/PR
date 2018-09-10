[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(ReusableWebAPI.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(ReusableWebAPI.App_Start.NinjectWebCommon), "Stop")]

namespace ReusableWebAPI.App_Start
{
    using System;
    using System.Data.Entity;
    using System.Linq;
    using System.Security.Claims;
    using System.Web;
    using BusinessSpecificLogic;
    using BusinessSpecificLogic.Logic;
    using Microsoft.Web.Infrastructure.DynamicModuleHelper;

    using Ninject;
    using Ninject.Web.Common;
    using Ninject.Web.Common.WebHost;
    using Reusable;
    using ReusableWebAPI.Controllers;

    public static class NinjectWebCommon 
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start() 
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
        }
        
        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            bootstrapper.ShutDown();
        }
        
        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        public static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();
                RegisterServices(kernel);
                return kernel;
            }
            catch
            {
                kernel.Dispose();
                throw;
            }
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            kernel.Bind(typeof(DbContext)).To(typeof(MainContext)).InRequestScope();
            kernel.Bind(typeof(IRepository<>)).To(typeof(Repository<>)).InRequestScope();
            kernel.Bind(typeof(IReadOnlyRepository<>)).To(typeof(ReadOnlyRepository<>)).InRequestScope();
            kernel.Bind(typeof(IDocumentRepository<>)).To(typeof(DocumentRepository<>)).InRequestScope();
            kernel.Bind<LoggedUser>().ToMethod(ctx =>
            {
                var identityUser = new LoggedUser((ClaimsIdentity)HttpContext.Current.User?.Identity);

                if (!string.IsNullOrWhiteSpace(identityUser.UserName) && identityUser.UserName != "Anonymous")
                {
                    var dbContext = ctx.Kernel.Get<MainContext>();
                    User user;
                    switch (identityUser.IdentityProvider)
                    {
                        case "google":
                            user = dbContext.Users.AsNoTracking().FirstOrDefault(u => u.Email.ToLower().Trim() == identityUser.Email.ToLower().Trim());
                            break;
                        default:
                            user = dbContext.Users.AsNoTracking().FirstOrDefault(u => u.UserName.ToLower().Trim() == identityUser.UserName.ToLower().Trim());
                            break;
                    }
                    if (user != null)
                    {
                        identityUser.UserID = user.UserKey; //Replace IdentityServer UserKey by local UserKey.
                        identityUser.Role = user.Role; //Replace IdentityServer UserKey by local UserKey. TODO: Centralize all permissions in IdentityServer
                        identityUser.LocalUser = user;
                    }
                    else
                    {
                        identityUser = new LoggedUser(); //Anonymous by default.
                    }
                }
                else
                {
                    identityUser = new LoggedUser(); //Anonymous by default.
                }
                return identityUser;
            }).InRequestScope();
            kernel.Bind(typeof(ReadOnlyLogic<>)).ToSelf().InRequestScope();
            kernel.Bind(typeof(Logic<>)).ToSelf().InRequestScope();
            kernel.Bind(typeof(DocumentLogic<>)).ToSelf().InRequestScope();

            #region Specific App Bindings


            ///Start:Generated:DI<<<
            kernel.Bind<IPRLineLogic>().To<PRLineLogic>();
            kernel.Bind<IPRNumberLogic>().To<PRNumberLogic>();
            kernel.Bind<ISupplierLogic>().To<SupplierLogic>();
            kernel.Bind<IDepartmentLogic>().To<DepartmentLogic>();
            kernel.Bind<IGLAccountLogic>().To<GLAccountLogic>();
            kernel.Bind<IPurchaseRequestLogic>().To<PurchaseRequestLogic>();
            kernel.Bind<IApprovalLogic>().To<ApprovalLogic>();
            kernel.Bind<ICommentLogic>().To<CommentLogic>();
            ///End:Generated:DI<<<
            #endregion

            kernel.Bind<IUserLogic>().To<UserLogic>();
            kernel.Bind<IWorkflowLogic>().To<WorkflowLogic>();
            kernel.Bind<IStepLogic>().To<StepLogic>();
            kernel.Bind<IStepOperationLogic>().To<StepOperationLogic>();
            kernel.Bind<ITrackLogic>().To<TrackLogic>();
            kernel.Bind<ITokenLogic>().To<TokenLogic>();
            kernel.Bind<IAdvancedSortLogic>().To<AdvancedSortLogic>();
            kernel.Bind<ITaskLogic>().To<TaskLogic>();
            kernel.Bind(typeof(BaseController<>)).ToSelf().InRequestScope();
            kernel.Bind(typeof(ReadOnlyBaseController<>)).ToSelf().InRequestScope();
            kernel.Bind(typeof(DocumentController<>)).ToSelf().InRequestScope();
        }        
    }
}