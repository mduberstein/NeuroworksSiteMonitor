define('vm.machines',
    ['ko', 'underscore', 'datacontext', 'config', 'router', 'messenger', 'filter.machines', 'event.delegates', 'utils', 'sort', 'store'],
    function (ko, _, datacontext, config, router, messenger, MachineFilter, eventDelegates, utils, sort, store) {
        var
            filterTemplate = 'machines.filterbox',
            isRefreshing = false,
            machineFilter = new MachineFilter(),
            //LATER: improve the hardcoded primary use filter
            primaryUseOptions = ko.observableArray(['acquisition', 'review', 'alarm', 'datashare']),
            machines = ko.observableArray(),

            //stateKey = { searchText: 'vm.speakers.searchText' } //from vm.speakers
            stateKey = { filter: 'vm.machines.filter' },           //from vm.sessions.js
            machinesTemplate = 'machines.view',
            
            activate = function (routeData, callback) {
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                getMachines(callback);
                //refresh(callback);
            },

            addFilterSubscriptions = function () {
                machineFilter.searchText.subscribe(onFilterChange);
                machineFilter.primaryUse.subscribe(onFilterChange);
            },

            canLeave = function () {
                return true;
            },

            clearFilter = function () {
                machineFilter.searchText('');
            },
            
            clearAllFilters = function(){
                machineFilter.primaryUse(null).searchText('');
            },
            
            dataOptions = function (force) {
                return {
                    results: machines,
                    filter: machineFilter,
                    sortFunction: sort.machineSort,
                    forceRefresh: force
                };
            },

            forceRefreshCmd = ko.asyncCommand({
                execute: function (complete) {
                    datacontext.machineStudies.forceDataRefresh()
                        .done(refresh)
                        .always(complete);
                }
            }),

            //from vm.speakers.js - PAPA
            getMachines = function (callback) {
                datacontext.machineStudies.getLocalMachines(machines, {
                    filter: machineFilter,
                    sortFunction: sort.machineSort
                });
                if (_.isFunction(callback)) {
                    callback();
                }
            },
            //NAVIGATION TO SELECTED MACHINE
            gotoDetails = function (selectedMachine) {
                if (selectedMachine && selectedMachine.id()) {
                    router.navigateTo(config.hashes.machines + '/' + selectedMachine.id());
                }
            },

            onFilterChange = function () {
                if (!isRefreshing) {
                    store.save(stateKey.filter, ko.toJS(machineFilter));
                    refresh();
                }
            },

            refresh = function (callback) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    restoreFilter();
                    getMachines(callback);
                    isRefreshing = false;
                }
            },

        //MIKE: fetch previously saved filter object from the Html5 Store
            restoreFilter = function () {
                var stored = store.fetch(stateKey.filter);
                if (!stored) { return; }
                utils.restoreFilter({
                    stored: stored,
                    filter: machineFilter,
                });
            },


        init = function () {
            // Bind jQuery delegated events
            eventDelegates.machinesListItem(gotoDetails);

            // Subscribe to specific changes of observables
            addFilterSubscriptions();
        };

        init();

        return {
            activate: activate,
            canLeave: canLeave,
            clearFilter: clearFilter,
            clearAllFilters: clearAllFilters,
            forceRefreshCmd: forceRefreshCmd,
            gotoDetails: gotoDetails,
            filterTemplate: filterTemplate,
            machineFilter: machineFilter,
            primaryUseOptions: primaryUseOptions,
            machines: machines,
            machinesTemplate: machinesTemplate
        };
    });