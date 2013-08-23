using SiteMonitor.Model;

namespace SiteMonitor.Data.Contracts
{
    public interface ISiteMonitorUOW
    {
        // Save pending changes to the data store.
        void Commit();
        IRepository<Study> Studies { get; }
        IRepository<Machine> Machines { get; }

    }
}
