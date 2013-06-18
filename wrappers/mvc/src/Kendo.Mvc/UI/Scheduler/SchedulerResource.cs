﻿namespace Kendo.Mvc.UI
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Linq.Expressions;
    using Kendo.Mvc.Extensions;
    using Kendo.Mvc.Resources;

    public class SchedulerResource<TModel> : JsonObject, IHideObjectMembers, ISchedulerResource<TModel>
        where TModel : class
    {
        public SchedulerResource(string field)
        {
            //TODO: refactor
            if (string.IsNullOrEmpty(field))
            {
                throw new InvalidOperationException(Exceptions.MemberExpressionRequired);
            }

            Title = "";

            Field = field;

            Multiple = false;

            DataSource = new DataSource();
        }

        public DataSource DataSource
        { 
            get;
            private set;
        }

        public string Title { get; set; }
        
        public string Field { get; set; } 
        
        public bool Multiple { get; set; }

        public string DataTextField { get; set; }

        public string DataValueField { get; set; }

        public string DataColorField { get; set; } 

        protected override void Serialize(IDictionary<string, object> json)
        {
            if (!string.IsNullOrEmpty(DataSource.Transport.Read.Url))
            {
                json["dataSource"] = DataSource.ToJson();
            }
            else if (DataSource.Data != null)
            {
                json["dataSource"] = DataSource.Data;
            }

            json["title"] = Title;

            json["field"] = Field;

            json["multiple"] = Multiple;

            if (!string.IsNullOrEmpty(DataTextField))
            {
                json["dataTextField"] = DataTextField;
            }

            if (!string.IsNullOrEmpty(DataValueField))
            {
                json["dataValueField"] = DataValueField;
            }

            if (!string.IsNullOrEmpty(DataColorField))
            {
                json["dataColorField"] = DataColorField;
            }
        }
    }
}
