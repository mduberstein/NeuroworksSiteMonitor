using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SiteMonitor.Model;
using SiteMonitor.Data.Contracts;
using SiteMonitor.Data;
using SiteMonitor.Data.Enums;

namespace NeuroworksSiteMonitor.Controllers
{
    public class MachinesController : ApiController
    {
        static ISiteMonitorUOW uow = SiteMonitorUOW.GetSiteMonitorUOW();

        // GET api/machines
        public IEnumerable<Machine> Get()
        {
            return uow.Machines.GetAll().OrderBy(m=>m.Id);
        }

        // GET api/machines/5
        public Machine Get(int id)
        {
            var machine = uow.Machines.GetById(id);
            if (null != machine) {
                return machine;
            }
            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
            //MIKE: doesn't work because the return type is not HttpResponseMessage
            //return Request.CreateErrorResponse(HttpStatusCode.NotFound, string.Format("No machine with Id of {0}", id));

        }
        //MIKE: as a result of dataservice.machine.tests.js getMachine returning null result in the case of error
        //so on the client side result.responseText blows on result being null reference
        //public HttpResponseMessage Get(int id)
        //{
        //    var machine = uow.Machines.GetById(id);
        //    if (null != machine) {
        //        return Request.CreateResponse<Machine>(HttpStatusCode.OK, machine);
        //    } else {
        //        return Request.CreateErrorResponse(HttpStatusCode.NotFound, string.Format("No machine with Id of {0}", id));
        //    }
        //}

        //Create
        // POST api/machines
        public HttpResponseMessage Post(Machine machine)
        {
            //requirements of www.w3.org/Protocols/rfc2616/rfc2616-sec9.html - HTTP 1.1
            uow.Machines.Add(machine);
            var response = Request.CreateResponse(HttpStatusCode.Created, machine);

            // Compose location header that tells how to get this session
            // e.g. ~/api/machine/5
            response.Headers.Location =
                new Uri(Url.Link(RouteConfig.ControllerAndId, new { id = machine.Id }));
            return response;
        }

        //Update
        // PUT api/machines/5
        public HttpResponseMessage Put(Machine machine)
        {
            try {
                uow.Machines.Update(machine);
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
            try {
                uow.Machines.Delete(id);
            }
            catch (Exception ex) {
                if (CrudExceptionReason.EntityNotFound == (CrudExceptionReason)ex.Data[ExceptionDataKey.Reason]) {
                    throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));

                }
                //SPA return new HttpResponseMessage(HttpStatusCode.NoContent);
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
