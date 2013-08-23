define('model',
    [
        'model.machine',
        'model.study',
    ],
    function (machine, study) {
        var
            model = {
                Machine: machine,
                Study: study
            };

        model.setDataContext = function (dc) {
            // Model's that have navigation properties 
            // need a reference to the datacontext.
            model.Machine.datacontext(dc);
            model.Study.datacontext(dc);
        };

        return model;
    });