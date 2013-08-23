define('filter.machines',
    ['ko', 'utils', 'config'], function (ko, utils, config) {

        var MachineFilter = function () {
            var self = this;
            self.primaryUse = ko.observable();
            self.searchText = ko.observable().extend({ throttle: config.throttle });
            //Option 1 - primaryUseTest is public, primaryUse param is a string here
            //self.primaryUseTest = function (primaryUse, machine) {
            //    var lowercaseSelectedPrimaryUse = primaryUse.toLowerCase();
            //    var lowercaseMahinePrimaryUse = machine.primaryUse();
            //    if (lowercaseMahinePrimaryUse.search(lowercaseSelectedPrimaryUse) !== -1) {
            //        return true;
            //    }
            //    return false;
            //}
            //self.predicate = function (filter, machine) {
            //    return self.primaryUseTest(filter.primaryUse(), machine);
            //}
            
            ////Option 2 - primaryUseTest is private
            //self.predicate = function (machine) {
            //    //private function
            //    var primaryUseTest = function (primaryUse, machine)
            //    {
            //        var lowercaseSelectedPrimaryUse = primaryUse.toLowerCase();
            //        var lowercaseMahinePrimaryUse = machine.primaryUse();
            //        if (lowercaseMahinePrimaryUse.search(lowercaseSelectedPrimaryUse) !== -1) {
            //             return true;
            //        }
            //            return false;
            //    }
            //    return function (filter, machine) {
            //        return primaryUseTest(filter.primaryUse(), machine);
            //    }
            //}();
            //return self;
        }

        MachineFilter.prototype = function () {
            //primaryUseTest is essentially a private method, primaryUse param is a string here
            var primaryUseTest = function (primaryUse, machine)
            {
                if (!primaryUse) {
                    return true;
                }
                var lowercaseSelectedPrimaryUse = primaryUse.toLowerCase();
                var lowercaseMahinePrimaryUse = machine.primaryUse().toLowerCase();
                if (lowercaseMahinePrimaryUse.search(lowercaseSelectedPrimaryUse) !== -1) {
                    return true;
                }
                return false;
            },

            searchTest = function (searchText, machine)
            {
                if (!searchText) {
                    return true;
                }
                var srch = utils.regExEscape(searchText.toLowerCase());
                if (machine.softwareVersion().toLowerCase().search(srch) !== -1) {
                    return true;
                }
                return false;
            }
            //self is any object that has member primaryUse that is ko.observable();
            predicate = function (filter, machine) {
                //var match = primaryUseTest(filter.primaryUse(), machine)
                //    && searchTest(filter.searchText(), machine);
                //return match;
                var matchPrimaryUse = primaryUseTest(filter.primaryUse(), machine),
                    matchSearch = searchTest(filter.searchText(), machine);
                console.log('primary use filter matched: ' + matchPrimaryUse);
                console.log('search filter matched: ' + matchSearch);
                return matchPrimaryUse && matchSearch;
            }
            return { predicate: predicate };
        }();

        return MachineFilter;
    });