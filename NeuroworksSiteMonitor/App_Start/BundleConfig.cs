using System.Web;
using System.Web.Optimization;

namespace NeuroworksSiteMonitor
{
    public class BundleConfig
    {
        //From project template
        //// For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        //public static void RegisterBundles(BundleCollection bundles)
        //{
        //    bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
        //                "~/Scripts/jquery-{version}.js"));

        //    bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
        //                "~/Scripts/jquery-ui-{version}.js"));

        //    bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
        //                "~/Scripts/jquery.unobtrusive*",
        //                "~/Scripts/jquery.validate*"));

        //    // Use the development version of Modernizr to develop with and learn from. Then, when you're
        //    // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
        //    bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
        //                "~/Scripts/modernizr-*"));

        //    bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));

        //    bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
        //                "~/Content/themes/base/jquery.ui.core.css",
        //                "~/Content/themes/base/jquery.ui.resizable.css",
        //                "~/Content/themes/base/jquery.ui.selectable.css",
        //                "~/Content/themes/base/jquery.ui.accordion.css",
        //                "~/Content/themes/base/jquery.ui.autocomplete.css",
        //                "~/Content/themes/base/jquery.ui.button.css",
        //                "~/Content/themes/base/jquery.ui.dialog.css",
        //                "~/Content/themes/base/jquery.ui.slider.css",
        //                "~/Content/themes/base/jquery.ui.tabs.css",
        //                "~/Content/themes/base/jquery.ui.datepicker.css",
        //                "~/Content/themes/base/jquery.ui.progressbar.css",
        //                "~/Content/themes/base/jquery.ui.theme.css"));
        //}

            public static void RegisterBundles(BundleCollection bundles)
        {
            // Force optimization to be on or off, regardless of web.config setting
            //BundleTable.EnableOptimizations = false;
            bundles.UseCdn = false;

            // .debug.js, -vsdoc.js and .intellisense.js files 
            // are in BundleTable.Bundles.IgnoreList by default.
            // Clear out the list and add back the ones we want to ignore.
            // Don't add back .debug.js.
            bundles.IgnoreList.Clear();
            //bundles.IgnoreList.Ignore("*-vsdoc.js");
            //bundles.IgnoreList.Ignore("*intellisense.js");

            // Modernizr goes separate since it loads first
            bundles.Add(new ScriptBundle("~/bundles/modernizr")
                .Include("~/Scripts/lib/modernizr-{version}.js"));

            // jQuery
            bundles.Add(new ScriptBundle("~/bundles/jquery",
                "//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js")
                .Include("~/Scripts/lib/jquery-{version}.js"));

            // 3rd Party JavaScript files
            bundles.Add(new ScriptBundle("~/bundles/jsextlibs")
                //.IncludeDirectory("~/Scripts/lib", "*.js", searchSubdirectories: false));
                .Include(
                    "~/Scripts/lib/json2.js", // IE7 needs this

                    // jQuery plugins
                    //"~/Scripts/lib/activity-indicator.js", //not present even in CodeCamper
                    "~/Scripts/lib/jquery.mockjson.js",
                    "~/Scripts/lib/TrafficCop.js",
                    "~/Scripts/lib/infuser.js", // depends on TrafficCop, template loader

                    // Knockout and its plugins
                    "~/Scripts/lib/knockout-{version}.js",
                    "~/Scripts/lib/knockout.activity.js",
                    "~/Scripts/lib/knockout.asyncCommand.js",
                    "~/Scripts/lib/knockout.dirtyFlag.js",
                    "~/Scripts/lib/knockout.validation.js",
                    "~/Scripts/lib/koExternalTemplateEngine.js",    //Papa's

                    // Other 3rd party libraries
                    "~/Scripts/lib/underscore.js",
                    "~/Scripts/lib/moment.js",
////changed to use version, installed with Nuget, then moved to lib
//                    "~/Scripts/lib/sammy-{version}.js",
//MIKE: copied from Papa's, version 0.6.3
                    "~/Scripts/lib/sammy.*",
//manually copied sammy.title.js plugin from Papa's CodeCamper
                    "~/Scripts/lib/sammy.title.js",
//added subfolder, installed with Nuget, commented out amplify.* to prevent usage of amplify.min.js
                    "~/Scripts/lib/amplify/amplify.js",   
//"~/Scripts/lib/amplify/amplify.*", //course version  
                    "~/Scripts/lib/toastr.js"
                    ));
            //LATER:
            //bundles.Add(new ScriptBundle("~/bundles/jsmocks")
            //    .IncludeDirectory("~/Scripts/app/mock", "*.js", searchSubdirectories: false));

            //MIKE: the following call will load config.js among other things
            // All application JS files (except mocks)
            bundles.Add(new ScriptBundle("~/bundles/jsapplibs")
                .IncludeDirectory("~/Scripts/app/", "*.js", searchSubdirectories: false));

            // 3rd Party CSS files
            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/boilerplate-styles.css",
                "~/Content/toastr.css",
                "~/Content/toastr-responsive.css"));

            // Custom LESS files
            bundles.Add(new Bundle("~/Content/Less", new LessTransform(), new CssMinify())
                .Include("~/Content/styles.less"));
        }
    }
}