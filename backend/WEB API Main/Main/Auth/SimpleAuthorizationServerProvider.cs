using System.Threading.Tasks;
using Microsoft.Owin.Security.OAuth;
using System.Security.Claims;
using Reusable;
using BusinessSpecificLogic;
using Microsoft.AspNet.Identity.EntityFramework;
using Reusable.Auth;
using BusinessSpecificLogic.Logic;
using Ninject;
using ReusableWebAPI.App_Start;

namespace ReusableWebAPI.Auth
{
    internal class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        private UserLogic userLogic;

        public SimpleAuthorizationServerProvider()
        {
        }
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

            using (AuthRepository _repo = new AuthRepository())
            {
                IdentityUser user = await _repo.FindUser(context.UserName, context.Password);

                if (user == null)
                {
                    context.SetError("invalid_grant", "El usuario o la contraseña son incorrectos.");
                    return;
                }
            }


            userLogic = NinjectWebCommon.CreateKernel().Get<UserLogic>();

            CommonResponse response = userLogic.GetByName(context.UserName);
            if (response.ErrorThrown)
            {
                context.SetError(response.ResponseDescription);
                return;
            }

            User theUser = (User)response.Result;

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim("role", theUser.Role));
            identity.AddClaim(new Claim("userID", theUser.id.ToString()));
            identity.AddClaim(new Claim("userName", theUser.UserName.ToString()));

            context.Validated(identity);
        }
    }
}