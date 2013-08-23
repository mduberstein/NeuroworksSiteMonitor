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
    public class StudiesController : ApiController
    {
        static ISiteMonitorUOW uow = SiteMonitorUOW.GetSiteMonitorUOW();

        // GET api/studies
        public IEnumerable<Study> Get()
        {
            return uow.Studies.GetAll().OrderBy(s=>s.Id);
        }

        // GET api/studies/5
        public Study Get(int id)
        {
            var study = uow.Studies.GetById(id);
            if (null != study) {
                return study;
            } 
            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)); 
        }

        //Create
        // POST api/studies
        public HttpResponseMessage Post(Study study)
        {
            //requirements of www.w3.org/Protocols/rfc2616/rfc2616-sec9.html - HTTP 1.1
            uow.Studies.Add(study);
            var response = Request.CreateResponse(HttpStatusCode.Created, study);

            // Compose location header that tells how to get this session
            // e.g. ~/api/study/5
            response.Headers.Location =
                new Uri(Url.Link(RouteConfig.ControllerAndId, new { id = study.Id }));
            return response;
        }

        //Update
        // PUT api/studies/5
        public HttpResponseMessage Put(Study study)
        {
            try {
                uow.Studies.Update(study);
                //SPA
                //return new HttpResponseMessage(HttpStatusCode.NoContent);
                return Request.CreateResponse(HttpStatusCode.OK, study);
            }
            catch (Exception) {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // DELETE api/studies/5
        public HttpResponseMessage Delete(int id)
        {
            try {
                uow.Studies.Delete(id);
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
