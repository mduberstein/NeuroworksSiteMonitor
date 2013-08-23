define('dataservice.machine',
    ['amplify'],
    function (amplify) {
        var
            init = function () {

                amplify.request.define('machines', 'ajax', {
                    url: '/api/machines',
                    dataType: 'json',
                    type: 'GET'
                    //cache:
                });

                amplify.request.define('machine', 'ajax', {
                    url: '/api/machines/{id}',
                    dataType: 'json',
                    type: 'GET'
                    //cache:
                });

                amplify.request.define('machineUpdate', 'ajax', {
                    url: '/api/machines',
                    dataType: 'json',
                    type: 'PUT',
                    contentType: 'application/json; charset=utf-8'
                });
            },

            getMachines = function (callbacks) {
                return amplify.request({
                    resourceId: 'machines',
                    success: callbacks.success,
                    error: callbacks.error
                });
            },

            getMachine= function (callbacks, id) {
                return amplify.request({
                    resourceId: 'machine',
                    data: { id: id },
                    success: callbacks.success,
                    error: callbacks.error
                });
            };

            updateMachine = function (callbacks, data) {
                return amplify.request({
                    resourceId: 'machineUpdate',
                    data: data,
                    success: callbacks.success,
                    error: callbacks.error
                });
            };

        init();
  
    return {
        getMachine: getMachine,
        getMachines: getMachines,
        updateMachine: updateMachine
    };
});


