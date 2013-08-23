using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SiteMonitor.Model
{
    class Machine
    {
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public string IPAddress { get; set; }
        public string SettingsServer { get; set; }
        public string SecurityServer { get; set; }
        public string SoftwareVersion { get; set; }
        public string SerialNo { get; set; }
        public string InstallCode { get; set; }
    }
}
