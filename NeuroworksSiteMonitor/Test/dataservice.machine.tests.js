define(
    'dataservice.machine-tests-function',
    ['jquery', 'amplify', 'config', 'utils'],
    function ($, amplify, config, utils) {

        //utils is required for the string.format method
        var doNothing = function () { };

        var retrievalTestMachineId = 2; // Keynote / MDUBERSTEIN-DT3
        //MIKE: set to true to use mock data
        var useMocks = false;
        //config.currentUserId = 3;
        ////currentUser is observable, why can't we just 
        ////config.currentUser({ id: 3});
        //config.currentUser = function () { return { id: function () { return 3; } }; };
        config.logger = { success: doNothing };
        config.dataserviceInit();
       
        var findDs = function () {
            //ds is object returned from the factory function of dataservice.session.js, see dataservice.session.tests.html
            var ds = window.testFn(amplify);
            config.useMocks(useMocks); //this helps me NOT mock datacontext
            return ds;
            //return window.testFn($); // purely for the course to test the non amplify version
        };

        module('Machine Data Services return data');

        asyncTest('getMachines returns array of Machine objects',
            function () {
                //ARRANGE
                var ds = findDs();

                //ACT
                ds.getMachines({

                    //ASSERT
                    success: function (result) {
                    //requires utils.js
                        ok(result && result.length > 0, 'Got {0} machines'.format(result.length));
                        start();
                    }, 
                    error: function (result) {
                        //MIKE:
                        //ok(false, 'Failed with: ' + result.responseText);
                        ok(false, "Failed to get machines, request status {0}".format(status));
                        start();
                    }
                });
            });


        asyncTest('getMachine returns 1 Machine object',
            function () {
                //ARRANGE
                //retrievalTestMachineId = 20; testing error

                var ds = findDs();

                //ACT
                ds.getMachine({
                    //ASSERT
                    success: function (result) {
                        //MIKE, server side sample data for machine.id of 1 is 'Keynote'
                        //ok(result && result.title === 'Single Page Apps', 'Got 1 Session, the SPA');
                        ok(result && result.name === useMocks ? 'Single Page Apps' : 'MDUBERSTEIN-DT3', 'Got 1 Machine, named ' + result.name);
                        start();
                    },
                    error: function (result, status) {
                        //MIKE
                        if(null !== result){ //will only work if returned result type contains responseText property.
                            ok(false, "Failed to get machine {0} , response text {1}".format(retrievalTestMachineId, result.responseText));
                        }
                        else {
                            ok(false, "Failed to get machine {0} , request status {1}".format(retrievalTestMachineId, status));
                        }
                        start();
                    }
                }, retrievalTestMachineId);
            });

        module('Machine Data Services update data');

        asyncTest('updateMachine updates domain',
            function () {

                //ARRANGE
                var ds = findDs();
                var toggleDomainName = function(m, changeIt) {
                    m.domain = changeIt ? 'neurology1_changed' : 'neurology1';
                };
                ds.getMachine({
                    success: 
                        function (result) {
                            var testMachine = result;

                            //ACT
                            toggleDomainName(testMachine, true);
                            var testMachineJSON = JSON.stringify(testMachine);

                            ds.updateMachine({

                                //ASSERT
                                success: function (result) {
                                    ds.getMachine(
                                        {
                                            success:
                                                function (result) {
                                                    var testMachine2ndTry = result;
                                                    // actual, expected, message
                                                    ok(testMachine2ndTry.domain, testMachine.domain, 'domain was updated successfully');

                                                    //RESET
                                                    toggleDomainName(testMachine, false);
                                                    testMachineJSON = JSON.stringify(testMachine);
                                                    ds.updateMachine({
                                                        success: function () { start(); },
                                                        error: function () { start(); }
                                                    }, testMachineJSON);
                                                },
                                            error: function (result) {
                                                ok(false, 'Failed with: ' + result.responseText);
                                                start();
                                            }
                                        }, 
                                        retrievalTestMachineId);
                                }, 
                                error: function (result) {
                                    ok(false, 'Failed with: ' + result.responseText);
                                    start();
                                }
                            }, testMachineJSON);
                        },
                    error: function(result) {
                        ok(false, 'Failed with: ' + result.responseText);
                        start();
                    }
                }, retrievalTestMachineId);
            });

    });