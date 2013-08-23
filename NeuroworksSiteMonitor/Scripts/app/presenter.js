define('presenter',
    ['jquery'],
    function ($) {
        var
            transitionOptions = {
                ease: 'swing',
                fadeOut: 500,
                floatIn: 200,
                offsetLeft: '20px',
                offsetRight: '-20px'
            },

            entranceThemeTransition = function ($view) {
                $view
                //this is required because $('.view').hide() is called in router.js before presenter.transitionTo()
                .css({                   
                    display: 'block'
                    , visibility: 'visible' //redundant as .hide() does not change visibility
                })
                .addClass('view-active').animate({
                    marginRight: 0,
                    marginLeft: 0,
                    opacity: 1
                }, transitionOptions.floatIn, transitionOptions.ease);
            },
            //possilbe values are
            //possible values are .top-group, .left-group, see router-config
            highlightActiveView = function (route, group) {
                // Reset top level nav links
                // Find all NAV links by CSS classname 
                var $group = $(group);
                if ($group) {
                    $(group + '.route-active').removeClass('route-active');
                    if (route) {
                        // Highlight the selected nav that matches the route
                        $group.has('a[href="' + route + '"]').addClass('route-active');
                    }
                }

            },

            resetViews = function () {
                $('.view').css({
                    marginLeft: transitionOptions.offsetLeft,
                    marginRight: transitionOptions.offsetRight
                    , opacity: 0 //redundant if called from fadeOut(..) only, but it is also called on its own
                    //I don't understand why none without ' causes Reference error in sammy.js and breaks navigation.
                    //I guess this is because of jQuery syntax is different from CSS syntax
                    //'none' here is DOM object property rather than CSS property
                    , display: 'none'

                });
                $('.view').removeClass('view-active');
            },

            toggleActivity = function (show) {
                $('#busyindicator').activity(show);
            },

            //called in callback defined in router.registerRoute
            transitionTo = function ($view, route, group) {
                var $activeViews = $('.view-active');

                toggleActivity(true);
                console.log("in transitionTo");
                if ($activeViews.length) {
                    //fadeOout method gradually changes the opacity CSS property to 0 and when it reaches 0, 
                    //brings the display CSS property to 'none'.
                    $activeViews.fadeOut(transitionOptions.fadeOut, function () {
                        console.log("in fadeOut complete");
                        resetViews();
                        entranceThemeTransition($view);
                    });
                    console.log("after fadeOut call");
                    //$('.view').removeClass('view-active');
                } else {
                    console.log("in transitionTo, no view-active Branch");
                    resetViews();
                    entranceThemeTransition($view);
                }

                highlightActiveView(route, group);

                toggleActivity(false);
            };


        return {
            toggleActivity: toggleActivity,
            transitionOptions: transitionOptions,
            transitionTo: transitionTo
        };
    });
