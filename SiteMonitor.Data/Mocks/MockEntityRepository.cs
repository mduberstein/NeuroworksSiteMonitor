using System;

using System.Collections.Generic;
using System.Reflection;
using System.Linq;

using SiteMonitor.Data.Contracts;
using SiteMonitor.Model;
using SiteMonitor.Data.Properties;
using SiteMonitor.Data.Enums;


namespace SiteMonitor.Data.Mocks
{
    public class MockEntityRepository<T> : IRepository<T> where T: class, ISiteMonitorEntity 
    {
        protected List<T> entityStore;
        public virtual IQueryable<T> GetAll()
        {
            return entityStore.AsQueryable<T>();
        }

        public virtual T GetById(int id)
        {
            if (id > 0 && id <= entityStore.Count) {
                foreach (T e in entityStore) {
                    if (e.Id == id) {
                        return e;
                    }
                }
            }
            return null;
        }

        public virtual void Add(T entity)
        {
            entity.Id = entityStore.Count + 1;
            entityStore.Add(entity);
        }

        public virtual void Update(T entity)
        {
            T entityToUpdate = GetById(entity.Id);
            if (null == entityToUpdate) {
                throw new ApplicationException(Resources.EntityNotFound);
            }
            //Copy an object of unknown structure in C#
            Type t = typeof(T);
            PropertyInfo[] properties = t.GetProperties();
            foreach (PropertyInfo pi in properties) {
                if (pi.CanWrite) {
                    object sourcePropertyValue = pi.GetValue(entity, null);
                    pi.SetValue(entityToUpdate, sourcePropertyValue, null);
                }
            }
        }

        public virtual void Delete(int id)
        {
            T entity = GetById(id);
            if (null == entity) {
                ApplicationException ex = new ApplicationException(Resources.EntityNotFound);
                ex.Data[ExceptionDataKey.Reason] = CrudExceptionReason.EntityNotFound;
                throw ex;
            }
            Delete(entity);
        }

        public virtual void Delete(T entity)
        {
            if (!entityStore.Remove(entity)) {
                ApplicationException ex = new ApplicationException(Resources.DeleteFromEntityStoreFailed);
                ex.Data[ExceptionDataKey.Reason] = CrudExceptionReason.DeleteFromEntityStoreFailed;
                throw ex;
            }
        }
    }
}
