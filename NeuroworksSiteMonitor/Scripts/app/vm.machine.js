///<reference path="/scripts/lib/knockout-2.2.0.debug.js" />
define('vm.machine',
    ['ko', 'datacontext', 'config', 'router', 'messenger'],
    function (ko, datacontext, config, router, messenger) {

        var
            // properties
            currentMachineId = ko.observable(),
            logger = config.logger,
            machine = ko.observable(),
            machineStudies = ko.observableArray(),
            validationErrors = ko.observableArray(), // Override this after we get a session
            // knockout computeds
            canEdit = ko.computed(function () {
                //MIKE: hack to simulate ability to edit
                return machine() && config.currentUser() === machine().user();
            }),

            isDirty = ko.computed(function () {
                return canEdit() ? machine().dirtyFlag().isDirty() : false;
            }),

            isValid = ko.computed(function () {
                return canEdit() ? validationErrors().length === 0 : true;
            }),

            // Methods
            activate = function (routeData, callback) {
                messenger.publish.viewModelActivated({ canleaveCallback: canLeave });
                currentMachineId(routeData.id);
                getMachine(callback);
            },

            cancelCmd = ko.asyncCommand({
                execute: function (complete) {
                    var callback = function () {
                        complete();
                        logger.success(config.toasts.retreivedData);
                    };
                    getMachine(callback, true);
                },
                canExecute: function (isExecuting) {
                    return !isExecuting && isDirty();
                }
            }),

            canLeave = function () {
                return canEdit() ? !isDirty() && isValid() : true;
            },

            getMachine = function (completeCallback, forceRefresh) {
                var callback = function () {
                    if (completeCallback) { completeCallback(); }
                    //VALIDATION
                    validationErrors = ko.validation.group(machine());
                };
                datacontext.machines.getMachineById(
                    currentMachineId(), {
                        success: function (s) {
                            machine(s);
                            callback();
                        },
                        error: callback
                    },
                    forceRefresh
                );
            },

            goBackCmd = ko.asyncCommand({
                execute: function (complete) {
                    router.navigateBack();
                    complete();
                },
                canExecute: function (isExecuting) {
                    return !isExecuting && !isDirty();
                }
            }),

            saveCmd = ko.asyncCommand({
                execute: function (complete) {
                    if (canEdit()) {
                        $.when(datacontext.machines.updateData(machine()))
                            .always(complete);
                    } else {
                        complete();
                    }
                },
                //enables or disables the button
                canExecute: function (isExecuting) {
                    return !isExecuting && isDirty() && isValid();
                }
            }),

            tmplName = function () {
                return canEdit() ? 'machine.edit' : 'machine.view';
            };

        return {
            activate: activate,
            cancelCmd: cancelCmd,
            canEdit: canEdit,
            canLeave: canLeave,
            goBackCmd: goBackCmd,
            isDirty: isDirty,
            isValid: isValid,
            saveCmd: saveCmd,
            machine: machine,
            machineStudies: machineStudies,
            tmplName: tmplName
        };
    });