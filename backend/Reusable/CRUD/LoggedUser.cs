using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Reusable
{
    public interface ILoggedUser
    {
        string Role { get; set; }
        int? UserID { get; set; }
        string UserName { get; set; }
    }

    public class LoggedUser : ILoggedUser
    {
        ClaimsIdentity identity;
        public LoggedUser(ClaimsIdentity identity)
        {
            Role = "Anonymous";
            UserID = null;
            UserName = "Anonymous";

            if (identity != null)
            {
                this.identity = identity;
                IEnumerable<Claim> claims = identity.Claims;

                if (claims.Count() > 0)
                {
                    Claim claimRole = claims.First(c => c.Type == "role");
                    if (claimRole != null)
                    {
                        Role = claimRole.Value;
                    }
                    Claim claimUserID = claims.First(c => c.Type == "userID");
                    if (claimUserID != null)
                    {
                        UserID = int.Parse(claimUserID.Value);
                    }
                    Claim claimUserName = claims.First(c => c.Type == "userName");
                    if (claimUserName != null)
                    {
                        UserName = claimUserName.Value;
                    }
                    Claim claimDepartment = claims.First(c => c.Type == "DepartmentKey");
                    if (claimDepartment != null)
                    {
                        DeparmentKey = int.Parse(claimDepartment.Value);
                    }
                }
            }
        }

        public string Role { get; set; }
        public int? UserID { get; set; }
        public string UserName { get; set; }
        public int DeparmentKey { get; set; }
    }
}