using System;
using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
using SiteMonitor.Data.Contracts;
using SiteMonitor.Model;
using SiteMonitor.Data.Mocks;

namespace SiteMonitor.Data
{
    public class SiteMonitorUOW : ISiteMonitorUOW
    {
        #region ISiteMonitorUOW
        public IRepository<Machine> Machines{
            get
            {
                if (null == machines) {
                    machines = new MockMachineRepository();
                }
                return machines;
            }
        }
        public IRepository<Study> Studies
        {
            get
            {
                if (null == studies) {
                    studies = new MockStudyRepository();
                }
                return studies;
            }
        }
        //LATER
        public void Commit() { }
        #endregion

        #region Singleton
        static SiteMonitorUOW()
        {
            singleton = new SiteMonitorUOW();
        }

        public static ISiteMonitorUOW GetSiteMonitorUOW()
        {
            return singleton;
        }



        private SiteMonitorUOW()
        {
        }
        #endregion

        private static ISiteMonitorUOW singleton;
        private IRepository<Machine> machines;
        private IRepository<Study> studies;
    }
}
