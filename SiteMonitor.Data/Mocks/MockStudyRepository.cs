using System;
using System.Collections.Generic;
using SiteMonitor.Model;

namespace SiteMonitor.Data.Mocks
{
    public class MockStudyRepository : MockEntityRepository<Study>
    {
        public MockStudyRepository()
        {
            entityStore = new List<Study>{
                new Study{Id = 1, Name = "FirstName1LastName1OnMachine1", MachineId = 1}
                , new Study{Id = 2, Name = "FirstName2LastName2OnMachine1", MachineId = 1}
                , new Study{Id = 3, Name = "FirstName3LastName3OnMachine1", MachineId = 1}
                , new Study{Id = 4, Name = "FirstName1LastName1OnMachine2", MachineId = 2}
                , new Study{Id = 5, Name = "FirstName2LastName2OnMachine2", MachineId = 2}
                , new Study{Id = 6, Name = "FirstName3LastName3OnMachine2", MachineId = 2}
                , new Study{Id = 7, Name = "FirstName1LastName1OnMachine3", MachineId = 3}
                , new Study{Id = 8, Name = "FirstName2LastName2OnMachine3", MachineId = 3}
                , new Study{Id = 9, Name = "FirstName3LastName3OnMachine3", MachineId = 3}
            };
        }
    }
}
