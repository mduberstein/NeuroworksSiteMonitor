define('router',
    ['jquery', 'underscore', 'sammy', 'presenter', 'config', 'route-mediator', 'store'],
    function ($, _, Sammy, presenter, config, routeMediator, store) {
        var
            currentHash = '',
            defaultRoute = '',
            isRedirecting = false,
            logger = config.logger,
            startupUrl = '',
            window = config.window,
//MIKE: Create an instance of a Sammy.Application
            sammy = new Sammy.Application(function () {
                //Sammy.Title - built in plugin
                if (Sammy.Title) {
                    //Sammy.Application.use method - entry point for plugins
                    //Calling Sammy.Application.use with function Sammy.Title from the plugin calls Sammy.Title.apply(this, args) which
                    //1. is call to Sammy.Title method with the this of Sammy.Application
                    //2. In the plugin any lines like: this.<Method_Name> add methods <Method_Name> to the Sammy.Application instance methods
                    //In the case of Sammy.Title plugin that would be .setTitle
                    //3. Sammy.Title plugin also calls Sammy.Application's method .helper(method_name, method_var) which in this case adds method .title to the Sammy.Application's context_prototype.prototype
                    //which allows this.title(<title>) to be called in the callback of sammy.get('verb', <callback>) below
                    this.use(Sammy.Title);  
                    this.setTitle(config.title);
                }
                //this here is Sammy.Application
                //this maps verb 'GET', route '' and function that causes the Sammy to navigate to startupUrl 
                this.get('', function () {
                    //First, invokes lookupRoute() and if a route is found, parses the possible URL params 
                    // and then invokes the route's callback within a new Sammy.EventContext.
                    //this.app here is same as this, see Sammy.Application definition in sammy.js
                    this.app.runRoute('get', startupUrl);
                });
            }),

            navigateBack = function () {
                window.history.back();
            },

            navigateTo = function (url) {
                sammy.setLocation(url);
            },

            register = function (options) {
                if (options.routes) {
                    // Register a list of routes
                    _.each(options.routes, function (route) {
                        //flattens each combination of view and route objects from each RouteData[i]
                        //into one object to call sammy.registerRoute({..});
                        registerRoute({
                            route: route.route,
                            title: route.title,
                            callback: route.callback,
                            view: options.view,
                            group: route.group,
                            isDefault: !!route.isDefault
                        });
                    });
                    return;
                }

                // Register 1 route
                registerRoute(options);
            },

            registerBeforeLeaving = function () {
                //Takes a single callback that is pushed on to a queue. 
                //Before any route is run, the callbacks are evaluated in queue order within the current Sammy.EventContext
                //The actual lines are in sammy.js in method runRoute:
                //if (app.contextMatchesOptions(context, before[0])) {
                //    returned = before[1].apply(context, [context]);
                //    if (returned === false) { return false; }
                //}
                //meaning above code is 
                //The first argument of sammy.before here is the regular expression against which the route(i.e. url part starting with #) to be navigated to is matched
                //by app.contextMatchesOptions call above.
                //If the route matches the regular expression (/.*/ in our case will be matched by any route), the callback - i.e. the second argument of sammy.before is called.
                //If any of the callbacks explicitly return false, execution of any further callbacks and the route itself is halted.
                sammy.before(/.*/, function () {
                    var
                        //this is object constructed with "new Sammy.EventContext()"
                        context = this,
                        //routeMediator implementation sets canLeave to canLeave of the view-model that was activated
                        //by processing this route.
                        response = routeMediator.canLeave();

                    if (!isRedirecting && !response.val) {
                        isRedirecting = true;
                        logger.warning(response.message);
                        //Delegates to the location_proxy to set the current location. 
                        //See Sammy.DefaultLocationProxy for more info on location proxies
                        //Keep hash url the same in address bar
                        context.app.setLocation(currentHash);
                    }
                    else {
                        isRedirecting = false;
                        currentHash = context.app.getLocation();
                    }
                    // Cancel the route if this returns false
                    return response.val;
                });
            },
 
            registerRoute = function (options) {
                if (!options.callback) {
                    throw Error('callback must be specified.');
                }

                if (options.isDefault) {
                    defaultRoute = options.route;
                }
                //this method causes the second argument(callback) to be called when the first argument(route)
                //is navigated to(or proecessed in terminology of my word file)
                //debugger;
                //Papa: context is 'this'
                //MIKE: context is object of constructed with "new Sammy.EventContext()"
                //It has properties: app, verb, path, params, target
                sammy.get(options.route, function (context) { //context is 'this'
                    store.save(config.stateKeys.lastView, context.path);
                    //debugger;
                    //vm.<sessions| favorites | speakers>.activate
                    //for context.params see sammy.runRoute, but the only time CodeCamper SPA
                    //uses them, this is object of kind {id: 38} say for url #/session/38
                    options.callback(context.params); //This is call viewmodel.activate
                    //top level .cshtml views have this class
                    //$('.view').hide();
                    presenter.transitionTo(
                        $(options.view),
                        context.path,
                        options.group
                    );
                    //title setting, uses EventContext's method .title defined by calling this.use(Sammy.Title); above
                    if (this.title) {
                        this.title(options.title);
                    }
                });
            },

            run = function () {
                var url = store.fetch(config.stateKeys.lastView);

                // 1) if i browse to a location, use it
                // 2) otherwise, use the url i grabbed from storage
                // 3) otherwise use the default route
                startupUrl = sammy.getLocation() || url || defaultRoute;
                
                if (!startupUrl) {
                    logger.error('No route was indicated.');
                    return;
                }
                //starts the application lifecycle
                sammy.run();
                registerBeforeLeaving();
                navigateTo(startupUrl);
           };

        return {
            navigateBack: navigateBack,
            navigateTo: navigateTo,
            register: register,
            run: run
        };
    });