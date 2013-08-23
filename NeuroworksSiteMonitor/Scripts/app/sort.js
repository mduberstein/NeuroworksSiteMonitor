define('sort', [], function () {

    var
        studySort = function (studyA, studyB) {
               return studyA.name() > studyB.name() ? 1 : -1;          
        },

        machineSort = function (machineA, machineB) {
            return machineA.name() > machineB.name() ? 1 : -1;
        };

    return {
        studySort: studySort,
        machineSort: machineSort
    };
});