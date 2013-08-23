//Machine is like Person in CodeCamper
define('model.machine',
    ['ko', 'config'],
    function (ko, config) {
        var
            _dc = null,
			Machine = function () {
				var self = this;
				self.id = ko.observable();
				self.name = ko.observable();
				self.date = ko.observable();
				self.ipAddress = ko.observable();
				self.settingsServer = ko.observable().extend({ required: true }); //VALIDATION
				self.securityServer = ko.observable();
				self.softwareVersion = ko.observable();
				self.optionPack = ko.observable();
				self.serialNo = ko.observable();
				self.installCode = ko.observable();
				self.primaryUse = ko.observable();
				self.platform = ko.observable();
				self.user = ko.observable();
				self.domain = ko.observable().extend({ required: true });
				self.commonCacheRoot = ko.observable();
				self.machineHash = ko.computed(function () {
					return config.hashes.machines + '/' + self.id();
				});
                //implementing the model Navigation collection property in JavaScript
				self.machineStudies = ko.computed({
				    read: function () {
				        var computed = self.id() ? Machine.datacontext().machines.getLocalMachineStudies(self.id()) : [];
				        return computed;
					},

					// Delay the eval til the data needed for the computed is ready
					deferEvaluation: true
				});
				self.isNullo = false;
				self.dirtyFlag = new ko.DirtyFlag([
				    self.domain,
				    self.commonCacheRoot]
                );
				return self;
			};
        Machine.Nullo = new Machine()
			.id(0)
			.name('Not a machine')
			.date('')
			.ipAddress('')
			.settingsServer('')
			.securityServer('')
			.softwareVersion('')
			.optionPack('')
			.serialNo('')
			.installCode('')
			.primaryUse('')
			.platform('')
            .user('')
            .domain('')
            .commonCacheRoot('');
        Machine.Nullo.isNullo = true;

        // static member
        Machine.datacontext = function (dc) {
            if (dc) {
                _dc = dc;
            }
            return _dc;
        };
        return Machine;
    });