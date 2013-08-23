define('datacontext.machine-studies', 
    ['jquery', 'underscore', 'ko'],
    function ($, _, ko) {
        /*
         * A data "view" of machines in cache and their cached studies
         */
        var MachineStudies = function (machines, studies) {
            
            var items,
                crossMatchMachines = function (observableArray, filter, sortFunction) {

                    // clear out the results observableArray
                    observableArray([]);

                    var underlyingArray = machines.getAllLocal();
                    //// get an array of machines that only have associated studies
                    //for (var prop in items) {
                    //    if (items.hasOwnProperty(prop)) {
                    //        underlyingArray.push(machines.getLocalById(prop));
                    //    }
                    //}
                    if (filter) {
                        underlyingArray = _.filter(underlyingArray, function (o) {
                            var match = filter.predicate(filter, o);
                            return match;
                        });
                    }
                    if (sortFunction) {
                        underlyingArray.sort(sortFunction);
                    }
                    observableArray(underlyingArray);
                },

                // Rebuild this data "view" from the current state of the cache
                refreshLocal = function() {
                    items = _.reduce(studies.getAllLocal(), function(memo, s) {
                        var machineId = s.machineId();
                        memo[machineId] = memo[machineId] || [];
                        memo[machineId].push(s);
                        return memo;
                    }, { });
                },
                
                // Rebuild this data "view" from fresh server data.
                // Returns a promise to get fresh study and maachine data and
                // refresh this instance of MachineStudies.
                // caller can hang its own actions on the returned promise.
                forceDataRefresh = function () {
                   var self = this;
                   return $.when(
                        studies.getData({ forceRefresh: true }),
                        machines.getData({ forceRefresh: true })
                    )
                    .done(self.refresh);
                },

                // Get an array of studies, sorted by name,
                // for the machineId 
                getLocalStudiesByMachineId = function (machineId) {
                    var machineStudies,
                        results = !!machineId && !!(machineStudies = items[machineId]) ? machineStudies.slice() : [];

                    return results.sort(function(l, r) { return l.name() > r.name() ? 1 : -1; });
                },

                // Fills the 'results' observable array with Machines
                // optionally filtered and/or sorted
                getLocalMachines = function (results, options) {
                    if (!ko.isObservable(results) || results.length === undefined) {
                        throw new Error('must provide a results observable array');
                    }
                    var sortFunction = options && options.sortFunction,
                        filter = options && options.filter;

                    crossMatchMachines(results, filter, sortFunction);

                },
            
                init = function () {
                     refreshLocal();
                };

            init();

            return {
                getLocalStudiesByMachineId: getLocalStudiesByMachineId,
                getLocalMachines: getLocalMachines,
                refreshLocal: refreshLocal,
                forceDataRefresh: forceDataRefresh
            };
        };      
        return {
            MachineStudies: MachineStudies
        };
    });