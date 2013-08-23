define('dataprimer',
    ['ko', 'datacontext', 'config'],
    function (ko, datacontext, config) {

        var logger = config.logger,
            
            fetch = function () {
                
                return $.Deferred(function (def) {
                    //data var contents are not used anywhere beyond this method
                    //they are required only because of interface of datacontext.<EntitySet>.getData method
                    //dataprimer.fetch()'s only purpose is to fill datacontext.<EntitySet>.items with data from
                    //web.api or mock
                    var data = {
                        studies: ko.observable(),
                        machines: ko.observable(),
                    };

                    $.when(
                        datacontext.studies.getData({ results: data.studies }),
                        datacontext.machines.getData({ results: data.machines })
                    )
                    //first argument of .pipe - success filter is called on success of Deferred on which pipe is called
                    //second if present is called on failure, so the anonymous method below is only called
                    //when arguments of $.when above are all successfully resolved(not rejected)
                    .pipe(function () {
                        // Need sessions and speakers in cache before
                        // speakerSessions models can be made (client model only)
                        datacontext.machineStudies.refreshLocal();
                    })
                    .pipe(function() {
                        logger.success('Fetched data for: '
                            + '<div>' + data.machines().length + ' machines </div>'
                            + '<div>' + data.studies().length + ' studies </div>'
                        );
                    })

                    .fail(function () { def.reject(); })

                    .done(function () { def.resolve(); });

                }).promise();
            };

        return {
            fetch: fetch
        };
    });