//Study is like Session in CodeCamper
define('model.study',
    ['ko'],
    function (ko) {
        var Study = function () {
            var self = this;
            self.id = ko.observable();
            self.name = ko.observable();
            self.machineId = ko.observable();
            
            self.isNullo = false;
            return self;
        };

        Study.Nullo = new Study()
            .id(0).name('Not a study').machineId(0);
        Study.Nullo.isNullo = true;
        var _dc = null;
        Study.datacontext = function (dc) {
            if (dc) {
                _dc = dc;
            }
            return _dc;
        };
        //LATER if editing by user is providede for: self.dirtyFlag = new ko.DirtyFlag...
        //implementing the model Navigation property Machine in JavaScript
        Study.prototype = function () {
            var dc = Study.datacontext,
            machine = function () {
                return dc().machines.getLocalById(this.machineId());
            };
            return {
                isNullo: false,
                machine: machine
            };
        }();

        return Study;
    });
