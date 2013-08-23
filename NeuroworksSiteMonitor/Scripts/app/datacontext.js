define('datacontext', 
    ['jquery', 'underscore', 'ko', 'model', 'model.mapper', 'dataservice', 'config', 'utils', 'datacontext.machine-studies'],
    function ($, _, ko, model, modelmapper, dataservice, config, utils, MachineStudies) {
        var logger = config.logger,

            itemsToArray = function (items/*in*/, observableArray/*out*/, filter/*in*/, sortFunction/*in*/) {
                // Maps the memo to an observableArray, 
                // then returns the observableArray
                if (!observableArray) return;

                // Create an array from the memo object
                var underlyingArray = utils.mapMemoToArray(items);

                if (filter) {
                    underlyingArray = _.filter(underlyingArray, function(o) {
                        var match = filter.predicate(filter, o);
                        return match;
                    });
                }
                if (sortFunction) {
                    underlyingArray.sort(sortFunction);
                }
                //logger.info('Fetched, filtered and sorted ' + underlyingArray.length + ' records');
                observableArray(underlyingArray);
            },
           
            //MIKE: results - ko.observableArray()
            mapToContext = function(dtoList/*in*/, items/*ref*/, results/*out*/, mapper/*in*/, filter/*in*/, sortFunction/*in*/) {
                // Loop through the raw dto list and populate a dictionary of the items
                items = _.reduce(dtoList, function(memo, dto) {
                    var id = mapper.getDtoId(dto);
                    var existingItem = items[id];
                    memo[id] = mapper.fromDto(dto, existingItem);
                    return memo;
                }, { });
                itemsToArray(items, results, filter, sortFunction);
                //logger.success('received with ' + dtoList.length + ' elements');
                return items; // must return these
            },
            EntitySet = function (getFunction, mapper, nullo, updateFunction) {
     //MIKE: in-memory storage of data in the EntitySet
                var items = {},
                    // returns the model item produced by merging dto into context
                    //dto - is the data transfer object
                    mapDtoToContext = function(dto) {
                        var id = mapper.getDtoId(dto);
                        var existingItem = items[id];
                        items[id] = mapper.fromDto(dto, existingItem);
                        return items[id];
                    },
                    add = function(newObj) {
                        items[newObj.id()] = newObj;
                    },
                    removeById = function(id) {
                        delete items[id];
                    },
                    getLocalById = function(id) {
                        // This is the only place we set to NULLO
                        return !!id && !!items[id] ? items[id] : nullo;
                    },
                    getAllLocal = function() {
                        return utils.mapMemoToArray(items);
                    },                    
                    getData = function(options) {
                        return $.Deferred(function(def) {
                            var results = options && options.results,
                                sortFunction = options && options.sortFunction,
                                filter = options && options.filter,
                                forceRefresh = options && options.forceRefresh,
                                param = options && options.param,
                                getFunctionOverride = options && options.getFunctionOverride;

                            getFunction = getFunctionOverride || getFunction;

                            // If the internal items object doesnt exist, 
                            // or it exists but has no properties, 
                            // or we force a refresh
                            if (forceRefresh || !items || !utils.hasProperties(items)) {
                                getFunction({
                                    success: function(dtoList) {
                                        items = mapToContext(dtoList, items, results, mapper, filter, sortFunction);
                                        def.resolve(results);
                                    },
                                    error: function (response) {
                                        logger.error(config.toasts.errorGettingData);
                                        def.reject();
                                    }
                                }, param);
                            } else {
                                itemsToArray(items, results, filter, sortFunction);
                                def.resolve(results);
                            }
                        }).promise();
                    },
                    updateData = function(entity, callbacks) {

                        var entityJson = ko.toJSON(entity);

                        return $.Deferred(function(def) {
                            if (!updateFunction) {
                                logger.error('updateData method not implemented'); 
                                if (callbacks && callbacks.error) { callbacks.error(); }
                                def.reject();
                                return;
                            }

                            updateFunction({
                                success: function(response) {
                                    logger.success(config.toasts.savedData);
                                    entity.dirtyFlag().reset();
                                    if (callbacks && callbacks.success) { callbacks.success(); }
                                    def.resolve(response);
                                },
                                error: function(response) {
                                    logger.error(config.toasts.errorSavingData);
                                    if (callbacks && callbacks.error) { callbacks.error(); }
                                    def.reject(response);
                                    return;
                                }
                            }, entityJson);
                        }).promise();
                    };

                return {
                    mapDtoToContext: mapDtoToContext,
                    add: add,
                    getAllLocal: getAllLocal,
                    getLocalById: getLocalById,
                    getData: getData,
                    removeById: removeById,
                    updateData: updateData
                };
            },
        
            //----------------------------------
            // Repositories
            //
            // Pass: 
            //  dataservice's 'get' method
            //  model mapper
            //----------------------------------
            studies = new EntitySet(dataservice.study.getStudies, modelmapper.study, model.Study.Nullo, dataservice.study.updateStudy),
            machines = new EntitySet(dataservice.machine.getMachines, modelmapper.machine, model.Machine.Nullo, dataservice.machine.updateMachine),
            machineStudies = new MachineStudies.MachineStudies(machines, studies);
        
            // extend Studies entityset 
            studies.getStudyById = function(id, callbacks, forceRefresh) {
                return $.Deferred(function (def) {
                    var study = studies.getLocalById(id);
                    if (study.isNullo || forceRefresh) {
                        // if nullo get fresh from database
                        dataservice.study.getStudy({
                            success: function (dto) {
                                // updates the study returned from getLocalById() above
                                study = studies.mapDtoToContext(dto);
                                if (callbacks && callbacks.success) { callbacks.success(study); }
                                def.resolve(dto);
                            },
                            error: function (response) {
                                logger.error('oops! could not retrieve study ' + id); 
                                if (callbacks && callbacks.error) { callbacks.error(response); }
                                def.reject(response);
                            }
                        },
                        id);
                    }
                    else {
                        if (callbacks && callbacks.success) { callbacks.success(study); }
                        def.resolve(study);
                    }
                }).promise();
            };
            //extend Machines EntitySet
           
            // Get the studies in cache for which this machine is 
            // a host from local data (no 'promise')
            machines.getLocalMachineStudies = function (machineId) {
                return machineStudies.getLocalStudiesByMachineId(machineId);
            };

            machines.getMachineById = function (id, callbacks, forceRefresh) {
                return $.Deferred(function (def) {
                    var machine = machines.getLocalById(id);
                    if (machine.isNullo || forceRefresh) {
                        dataservice.machine.getMachine(
                        {
                            success: function (dto) {
                                // updates the machine returned from getLocalById() above
                                machine = machines.mapDtoToContext(dto);
                                if (callbacks && callbacks.success) {
                                    callbacks.success(machine);
                                }
                                def.resolve(dto);
                            },
                            error: function (response) {
                                logger.error('oops! could not retrieve machine ' + id);
                                if (callbacks && callbacks.error) { callbacks.error(response); }
                                def.reject(response);

                            }
                        }
                        , id);
                    }
                    else {
                        if (callbacks && callbacks.success) {
                            callbacks.success(machine);
                        }
                        def.resolve(machine);
                    }
                }).promise();
            };

            studies.getStudyById = function (id, callbacks, forceRefresh) {
                return $.Deferred(function (def) {
                    var study = studies.getLocalById(id);
                    if (study.isNullo || forceRefresh) {
                        dataservice.study.getStudy(
                        {
                            success: function (dto) {
                                // updates the study returned from getLocalById() above
                                study = studies.mapDtoToContext(dto);
                                if (callbacks && callbacks.success) {
                                    callbacks.success(study);
                                }
                                def.resolve(dto);
                            },
                            error: function (response) {
                                logger.error('oops! could not retrieve study ' + id);
                                if (callbacks && callbacks.error) { callbacks.error(response); }
                                def.reject(response);
                            }
                        }
                        , id);
                    }
                    else {
                        if (callbacks && callbacks.success) {
                            callbacks.success(study);
                        }
                        def.resolve(study);
                    }

                }).promise();
            };


        var datacontext = {
            machines: machines,
            studies: studies,
            machineStudies:machineStudies
        };
        
        // We did this so we can access the datacontext during its construction
        model.setDataContext(datacontext);

        return datacontext;
});