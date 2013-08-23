define('binder',
    ['jquery', 'ko', 'config', 'vm'],
    function ($, ko, config, vm) {
        var
            ids = config.viewIds,

            bind = function () {
                ko.applyBindings(vm.shell, getView(ids.shellTop));
                ko.applyBindings(vm.machines, getView(ids.machines));
                ko.applyBindings(vm.machine, getView(ids.machine));
                //LATER
                //ko.applyBindings(vm.controlled, getView(ids.controlled));
            },
  //MIKE: The .get() method grants us access to the DOM nodes underlying each jQuery object.
            getView = function (viewName) {
                return $(viewName).get(0);
            };
            
        return {
            bind: bind
        };
    });