define('event.delegates',
    ['jquery', 'ko', 'config'],
    function ($, ko, config) {
        var
            machineSelector = '.machine'
            //,favoriteSelector = 'button.markfavorite',
            //private method
            bindEventToList = function (rootSelector, selector, callback, eventName) {
                var eName = eventName || 'click';
                $(rootSelector).on(eName, selector, function (/*event*/) {
                    //var context = ko.contextFor(this);
                    //var modelBehindSelectedElement = context.$data;
                    var modelBehindSelectedElement = ko.dataFor(this);
                    callback(modelBehindSelectedElement);
                    return false; //equivalent to event.preventPropogation(); event.preventDefault();
                });
            },

            //favoritesListItem = function (callback, eventName) {
            //    bindEventToList(config.viewIds.favorites, sessionBriefSelector, callback, eventName);
            //},

            machinesListItem = function (callback, eventName) {
                bindEventToList(config.viewIds.machines, machineSelector, callback, eventName);
            }
            
            //,favoritesFavorite = function (callback, eventName) {
            //    bindEventToList(config.viewIds.favorites, favoriteSelector, callback, eventName);
            //},

            //sessionsFavorite = function (callback, eventName) {
            //    bindEventToList(config.viewIds.sessions, favoriteSelector, callback, eventName);
            //};

        return {
            //favoritesListItem: favoritesListItem,
            //favoritesFavorite: favoritesFavorite,
            machinesListItem: machinesListItem
            //,sessionsFavorite: sessionsFavorite
        };
    });

