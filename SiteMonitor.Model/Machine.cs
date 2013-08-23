using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SiteMonitor.Model
{
    public class Machine : ISiteMonitorEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string IpAddress { get; set; }
        public string SettingsServer { get; set; }
        public string SecurityServer { get; set; }
        public string SoftwareVersion { get; set; }
        public string OptionPack { get; set;}
        public string SerialNo { get; set; }
        public string InstallCode { get; set; }
        public string PrimaryUse { get; set; }
        public string Platform { get; set;}
        //fakes
        public string User { get; set; }
        public string Domain { get; set; }
        public string CommonCacheRoot { get; set; }

        public virtual ICollection<Study> Studies { get; set; }
    }
}
