define('model.mapper',
['model'],
    function (model) { //MIKE: model exposes constructor function objects like Machine, 
        var
            study = {
                getDtoId: function (dto) { return dto.id; },
                fromDto: function (dto, item) {
                    item = item || new model.Study().id(dto.id);
                    item.name(dto.name)
                        .machineId(dto.machineId);
                    //item.dirtyFlag().reset();     //Study is not editable
                    return item;
                }
            },

            machine = {
                getDtoId: function (dto) { return dto.id; },
                fromDto: function (dto, item) {
                    item = item || new model.Machine().id(dto.id);
                    item.name(dto.name)
                        .date(moment(dto.date).toDate())
                        .ipAddress(dto.ipAddress)
                        .settingsServer(dto.settingsServer)
                        .securityServer(dto.securityServer)
                        .softwareVersion(dto.softwareVersion)
                        .optionPack(dto.optionPack)
                        .serialNo(dto.serialNo)
                        .installCode(dto.installCode)
                        .primaryUse(dto.primaryUse)
                        .platform(dto.platform)
                        .user(dto.user)
                        .domain(dto.domain)
                        .commonCacheRoot(dto.commonCacheRoot);
                    
                    item.dirtyFlag().reset();
                    return item;
                }
            };
        
        return {
            study: study,
            machine: machine
        };
    });