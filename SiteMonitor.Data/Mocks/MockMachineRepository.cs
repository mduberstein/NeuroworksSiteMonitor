using System;
using System.Collections.Generic;
using SiteMonitor.Model;

namespace SiteMonitor.Data.Mocks
{
    public class MockMachineRepository:MockEntityRepository<Machine>
    {
        public MockMachineRepository()
        {
            entityStore = new List<Machine>{                           
            //with Studies, good demonstration of how AJAX calls serialize entire object graph, list of Studies is JavaScript array on the client
            //new Machine { Id = 1, Name = "MDUBERSTEIN-DT3", Date = new DateTime(2013, 1, 24, 15, 46, 40), IpAddress = "192.168.35.38", SettingsServer="MDUBERSTEINDT", SecurityServer="MDUBERSTEINDT",
            //SoftwareVersion = "7.2 build 11", SerialNo = "A201-0033-0007-DAB7*", OptionPack = "ED00-00FF-FF5B-7FC5"
            //, InstallCode = "0x01040020", PrimaryUse = "Acquisition | Video - Normal Res MPEG4 (EEG/Sleep)", Platform = "CPU: Core 2 Duo 2.66 GHz, QTY: 4, RAM: 2048 MB, OS: Windows 7",
            //Studies = new List<Study> {new Study{Id = 1, Name = "FirstName1LastName1OnMachine1"}, new Study{Id = 2, Name = "FirstName2LastName2OnMachine1"}, new Study{Id = 3, Name = "FirstName3LastName3OnMachine1"} }
            //}, 
            //new Machine { Id = 2, Name = "MDUBERSTEIN-DT3", Date = new DateTime(2012, 2, 6, 14, 5, 15), IpAddress = "192.168.35.30", SettingsServer="MDUBERSTEINDT", SecurityServer="MDUBERSTEINDT",
            //SoftwareVersion = "7.0 build 63", SerialNo = "A201-0033-0007-DAB7*", OptionPack = "ED00-00FF-FF5B-7FC5"
            //, InstallCode = "0x01000010", PrimaryUse = "Review and Monitoring (EEG/Sleep)", Platform = "CPU: Core 2 Duo 2.66 GHz, QTY: 4, RAM: 2048 MB, OS: WinXP SP2",
            //Studies = new List<Study> {new Study{Id = 4, Name = "FirstName1LastName1OnMachine2"}, new Study{Id = 5, Name = "FirstName2LastName2OnMachine2"}, new Study{Id = 6, Name = "FirstName3LastName3OnMachine2"}}
            //},
            //new Machine { Id = 3, Name = "MDUBERSTEIN-DT", Date = new DateTime(2013, 1, 23, 13, 58, 28), IpAddress = "192.168.35.68", SettingsServer="(LOCAL)", SecurityServer="(LOCAL)",
            //SoftwareVersion = "7.2 build 5", SerialNo = "A201-0033-0007-DAB7*", OptionPack = "ED00-00FF-FF5B-7FC5"
            //, InstallCode = "0x01040020", PrimaryUse = "Acquisition | Video - Normal Res MPEG4 (EEG/Sleep) (dual-monitor)", Platform = "CPU: P4 (default) 2.80 GHz, QTY: 8, RAM: 2048 MB, OS: Windows 7",
            //Studies = new List<Study> {new Study{Id = 7, Name = "FirstName1LastName1OnMachine3"}, new Study{Id = 8, Name = "FirstName2LastName2OnMachine3"}, new Study{Id = 9, Name = "FirstName3LastName3OnMachine3"}}
            //without Studies
            new Machine { Id = 1, Name = "MDUBERSTEIN", Date = new DateTime(2013, 1, 24, 15, 46, 40), IpAddress = "192.168.35.38", SettingsServer="MDUBERSTEINDT", SecurityServer="MDUBERSTEINDT",
            SoftwareVersion = "7.2 build 11", SerialNo = "A201-0033-0007-DAB7*", OptionPack = "ED00-00FF-FF5B-7FC5"
            , InstallCode = "0x01040020", PrimaryUse = "Acquisition | Video - Normal Res MPEG4 (EEG/Sleep)", Platform = "CPU: Core 2 Duo 2.66 GHz, QTY: 4, RAM: 2048 MB, OS: Windows 7"
            //fakes
            , User = "mduberstein", Domain = "neurology1", CommonCacheRoot = @"\\mduberstein-dt\Neuroworks\SettingsGeneral"} 
            
            , new Machine { Id = 2, Name = "MDUBERSTEIN-DT3", Date = new DateTime(2012, 2, 6, 14, 5, 15), IpAddress = "192.168.35.30", SettingsServer="MDUBERSTEINDT", SecurityServer="MDUBERSTEINDT",
            SoftwareVersion = "7.0 build 63", SerialNo = "A201-0033-0007-DAB7*", OptionPack = "ED00-00FF-FF5B-7FC5"
            , InstallCode = "0x01000010", PrimaryUse = "Review and Monitoring (EEG/Sleep)", Platform = "CPU: Core 2 Duo 2.66 GHz, QTY: 4, RAM: 2048 MB, OS: WinXP SP2"
            //fakes
            , User = "salexander", Domain = "neurology1", CommonCacheRoot = @"\\mduberstein-dt\Neuroworks\SettingsGeneral"} 
            
            ,new Machine { Id = 3, Name = "MDUBERSTEIN-DT", Date = new DateTime(2013, 1, 23, 13, 58, 28), IpAddress = "192.168.35.68", SettingsServer="(LOCAL)", SecurityServer="(LOCAL)",
            SoftwareVersion = "7.2 build 5", SerialNo = "A201-0033-0007-DAB7*", OptionPack = "ED00-00FF-FF5B-7FC5"
            , InstallCode = "0x01040020", PrimaryUse = "Acquisition | Video - Normal Res MPEG4 (EEG/Sleep) (dual-monitor)", Platform = "CPU: P4 (default) 2.80 GHz, QTY: 8, RAM: 2048 MB, OS: Windows 7"
            //fakes
            , User = "mshtyrev", Domain = "neurology1", CommonCacheRoot = @"\\mduberstein-dt\Neuroworks\SettingsGeneral"} 
            
            ,new Machine { Id = 4, Name = "MDUBERSTEIN-D4", Date = new DateTime(2013, 1, 23, 13, 58, 28), IpAddress = "192.168.35.68", SettingsServer="(LOCAL)", SecurityServer="(LOCAL)",
            SoftwareVersion = "7.2 build 5", SerialNo = "A201-0033-0007-DAB7*", OptionPack = "ED00-00FF-FF5B-7FC5"
            , InstallCode = "0x01040020", PrimaryUse = "Alarms | Video - Normal Res MPEG4 (EEG/Sleep) (dual-monitor)", Platform = "CPU: P4 (default) 2.80 GHz, QTY: 8, RAM: 2048 MB, OS: Windows 7"
            //fakes
            , User = "mshtyrev", Domain = "neurology1", CommonCacheRoot = @"\\mduberstein-dt\Neuroworks\SettingsGeneral"} 
};
        }
    }
}
