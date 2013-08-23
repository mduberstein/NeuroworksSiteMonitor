using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SiteMonitor.Model;

namespace NeuroworksSiteMonitor.Controllers
{
    public class MachinesController : ApiController
    {
        
        static MockMachineData mockMachineData = new MockMachineData();
        // GET api/machines
        public IEnumerable<Machine> Get()
        {
            return mockMachineData.GetMachines();
        }

        // GET api/machines/5
        public Machine Get(int id)
        {
            var machine = mockMachineData.GetMachineById(id);
            if (null != machine) {
                return machine;
            } 
            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)); 
        }

        // POST api/machines
        public HttpResponseMessage Post(Machine machine)
        {
            //requirements of www.w3.org/Protocols/rfc2616/rfc2616-sec9.html - HTTP 1.1
            mockMachineData.AddMachine(machine);
            var response = Request.CreateResponse(HttpStatusCode.Created, machine);

            // Compose location header that tells how to get this session
            // e.g. ~/api/machine/5
            response.Headers.Location =
                new Uri(Url.Link(RouteConfig.ControllerAndId, new { id = machine.Id }));
            return response;
        }

        // PUT api/machines/5
        public HttpResponseMessage Put(Machine machine)
        {
            try {
                mockMachineData.UpdateMachine(machine);
                //SPA
                //return new HttpResponseMessage(HttpStatusCode.NoContent);
                return Request.CreateResponse(HttpStatusCode.OK, machine);
            }
            catch (Exception) {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // DELETE api/machines/5
        public HttpResponseMessage Delete(int id)
        {
            if (!mockMachineData.DeleteMachine(id)) {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
            }
            //SPA return new HttpResponseMessage(HttpStatusCode.NoContent);
            return new HttpResponseMessage(HttpStatusCode.BadRequest);
        }
    }
}
