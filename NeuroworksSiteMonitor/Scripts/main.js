(function () {
    var root = this;

    define3rdPartyModules();
    loadPluginsAndBoot();

    function define3rdPartyModules() {
        // These are already loaded via bundles. 
        // We define them and put them in the root object.
        //MIKE: What is the root object here, i.e. what was this? Answer: root is the browser window.
        //the 3rd party modules below have been loaded by @Scripts.Render(...) by this call, therefore the objects like root.jQuery etc. 
        //have been constructed, therefore the modules like 'jquery' can be defined using these objects in their factory functions
        define('jquery', [], function () { return root.jQuery; });
        define('ko', [], function () { return root.ko; });
        define('amplify', [], function () { return root.amplify; });
        define('infuser', [], function () { return root.infuser; });
        define('moment', [], function () { return root.moment; });
        define('sammy', [], function () { return root.Sammy; });
        define('toastr', [], function () { return root.toastr; });
        define('underscore', [], function () { return root._; });
    }
    
    function loadPluginsAndBoot() {
//MIKE: this is how requirejs knows where to load the argument scripts from
//http://requirejs.org/docs/api.html#jsfiles
//RequireJS loads all code relative to a baseUrl. The baseUrl is normally set to the same directory 
//as the script used in a data-main attribute for the top level script to load for a page. 
//The data-main attribute is a special attribute that require.js will check to start script loading. 
//<!--This sets the baseUrl to the "scripts" directory, and
//        loads a script that will have a module ID of 'main'-->
//    <script data-main="scripts/main" src="scripts/require.js"></script>
        //Or, baseUrl can be set manually via the requirejs.config. If there is no explicit config and data-main is not used, 
        //then the default baseUrl is the directory that contains the HTML page loading require.js.
//SUMMARY: here baseUrl is undefined, all scripts from "~/Scripts/app" are loaded because they are part of the "~/bundles/jsapplibs" bundle
        //and because Index.cshtml calls @Scripts.Render(..)

        //Papa: Plugins must be loaded after jQuery and Knockout, 
        // since they depend on them.
        //MIKE: these files didn't define modules in the first version of the course, 
        //so call to requirejs was needed to load them, and then called boot
        //because in this version of course ko.bindingHandlers and ko.debug.helpers are modules in the RequireJS sense
        //I removed call to requirejs function and added them to boot() definition.
        //If other modules, like bootstrapper .ex, referenced them as dependencies, boot() definition
        //wouldn't have to include them in the require(..) call
        //Papa's
        //requirejs([ //run scripts weather they are modules or not, if they are module factory function is run
        //        'ko.bindingHandlers', //MIKE: custom bindings
        //        'ko.debug.helpers'
        //], boot);
        //MIKE's
        boot();
    }
    //Papa's
    //this 
    //function boot() {
    //    require(['bootstrapper'], function (bs) { bs.run(); });
    //}
    //MIKE's
    function boot() {
        //require call runs resolves dependencies and runs defined module factory functions for its first argument elements
        require(['bootstrapper', 'ko.bindingHandlers', 'ko.debug.helpers'], function (bs) { bs.run(); });
    }
})();
