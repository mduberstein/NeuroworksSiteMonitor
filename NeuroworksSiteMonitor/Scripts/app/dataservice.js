define('dataservice',
    [
        'dataservice.machine',
        'dataservice.study'
    ],
    function (machine, study) {
        return {
            machine: machine,
            study: study
        };
    });