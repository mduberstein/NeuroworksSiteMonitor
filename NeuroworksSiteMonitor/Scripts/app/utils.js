define('utils',
['underscore', 'moment'],
    function (_, moment) {
        var
            //MIKE:
            //endOfDay = function (day) {
            //    return moment(new Date(day))
            //        .add('days', 1)
            //        .add('seconds', -1)
            //        .toDate();
            //},
            //getFirstTimeslot = function (timeslots) {
            //    return moment(timeslots()[0].start()).format('MM-DD-YYYY');
            //},
            hasProperties = function(obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        return true;
                    }
                }
                return false;
            },
            invokeFunctionIfExists = function (callback) {
                if (_.isFunction(callback)) {
                    callback();
                }
            },
            mapMemoToArray = function (items) {
                var underlyingArray = [];
                for (var prop in items) {
                    if (items.hasOwnProperty(prop)) {
                        underlyingArray.push(items[prop]);
                    }
                }
                return underlyingArray;
            },
            regExEscape = function(text) {
                // Removes regEx characters from search filter boxes in our app
                //MIKE: replaces every ( parameter /g ) occurence of special character
                //with its escaped match, ex. - with \- etc.
                return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            }
            ,
            restoreFilter = function (filterData) {
                var stored = filterData.stored,
                    filter = filterData.filter;

                // Create a list of the 5 filters to process
                var filterList = [
                    { raw: stored.searchText, filter: filter.searchText },
                    { raw: stored.primaryUse, filter: filter.primaryUse}
                ];

                // For each filter, set the filter to the stored value
                _.each(filterList, function (map) {
                    var rawProperty = map.raw, // POJO
                        filterProperty = map.filter, // observable
                        fetchMethod = map.fetch;     //undefined for this filterList
                    if (rawProperty && filterProperty() !== rawProperty) {
                        if (fetchMethod) {
                            var obj = fetchMethod(rawProperty.id);
                            if (obj) {
                                filterProperty(obj);
                            }
                        } else {
                            filterProperty(rawProperty);
                        }
                    }
                });
            };
        //MIKE:
        // --------------------------------------------------------------------
        // Add prototype for 'String.format' which is c# equivalent
        //
        // String.format("{0} i{2}a night{1}", "This", "mare", "s ");
        // "{0} i{2}a night{1}".format("This", "mare", "s ");
        // --------------------------------------------------------------------
        //http://stackoverflow.com/questions/2534803/string-format-in-javascript
        if(!String.format)
            String.format = function(){
                for (var i = 0, args = arguments; i < args.length - 1; i++)
                    args[0] = args[0].replace(RegExp("\\{" + i + "\\}", "gm"), args[i + 1]);
                return args[0];
            };
        if(!String.prototype.format && String.format)
            String.prototype.format = function(){
                var args = Array.prototype.slice.call(arguments).reverse();
                args.push(this);
                return String.format.apply(this, args.reverse());
            };

        return {
            //endOfDay: endOfDay,
            //getFirstTimeslot: getFirstTimeslot,
            hasProperties: hasProperties,
            invokeFunctionIfExists: invokeFunctionIfExists,
            mapMemoToArray: mapMemoToArray,
            regExEscape: regExEscape,
            restoreFilter: restoreFilter
        };
    });

