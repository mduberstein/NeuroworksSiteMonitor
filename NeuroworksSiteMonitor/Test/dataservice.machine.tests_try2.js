define(
    'dataservice.machine-tests-function-try2',
    ['jquery', 'amplify', 'config', 'utils'], 
    function($, amplify, config, utils) {      
        var useMocks = false,
            retreivalMachineId = 20;
            findDS = function () {
                var ds = window.testFn(amplify);
                config.useMocks(useMocks);
                return ds;
            };

        module('dataservice.machine Test Try2');
        asyncTest('updateMachine updates domain Try 2', function () {
            var
                toggleDomain = function (m, changeIt) {
                    m.domain = changeIt ? 'neurology1_changed' : 'neurology1';
                },
                ds = findDS();
            ok(true, "Test is Running");
            http://stackoverflow.com/questions/122102/most-efficient-way-to-clone-a-javascript-object
            ds.getMachine({
                success: function (result) {
                    var updateMachineTest = result;
                    //ACT
                    toggleDomain(updateMachineTest, true);
                    var updateMachineTestString = JSON.stringify(updateMachineTest);
                    ds.updateMachine({
                        success: function (result) {
                            ds.getMachine({
                                success: function (result) {
                                    var updateMachineTestTry2 = result;
                                    equal(updateMachineTest.domain, updateMachineTestTry2.domain, "Domain was updated successfully");
                                    //RESET
                                    toggleDomain(updateMachineTestTry2, false);
                                    updateMachineTestString = JSON.stringify(updateMachineTestTry2);
                                    ds.updateMachine({
                                        success: function(result){start();},
                                        error: function(result){
                                            ok(false, "Failed to reset machine {0} after update, response text {1}".format(retreivalMachineId, result.responseText));
                                            start();}
                                    }, updateMachineTestString);
                                },
                                error: function (result) {
                                    ok(false, "Failed to get machine {0} after update, response text {1}".format(retreivalMachineId, result.responseText));
                                    start();
                                }
                            }, retreivalMachineId);
                        },
                        error: function (result) {
                            ok(false, "Failed to update machine {0}, response text {1}".format(retreivalMachineId, resulst.responseText));
                            start();
                        }
                    }, updateMachineTestString);

                },
                error: function (result) {
                    ok(false, "Failed to get machine {0} for update, response text {1}".format(retreivalMachineId, result.responseText));
                    start();
                }
            }, retreivalMachineId);
        });
    }
);