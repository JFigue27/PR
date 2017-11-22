using BusinessSpecificLogic.EF;
using Reusable;
using System;
using System.Data.Entity;
using System.Linq;

namespace BusinessSpecificLogic.Logic
{
    public interface ITrackLogic : IBaseLogic<Track>
    {
        CommonResponse AssignResponsible(int iTrackKey, int iUserKey);
    }

    public class TrackLogic : BaseLogic<Track>, ITrackLogic
    {
        public TrackLogic(DbContext context, IRepository<Track> repository) : base(context, repository)
        {
        }

        public CommonResponse AssignResponsible(int iTrackKey, int iUserKey)
        {
            CommonResponse response = new CommonResponse();
            try
            {
                var ctx = context as MainContext;
                Track track = ctx.Tracks.FirstOrDefault(t => t.TrackKey == iTrackKey);
                track.User_AssignedToKey = iUserKey;
                ctx.SaveChanges();
            }
            catch (Exception e)
            {
                return response.Error("ERROR: " + e.ToString());
            }
            return response.Success();
        }
    }
}
