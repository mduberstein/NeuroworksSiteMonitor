define('config',
    ['toastr', /*'mock/mock',*/ 'infuser', 'ko'],
    function (toastr, /*mock,*/ infuser, ko) {

        var
            // properties
            //-----------------
            
            //currentUserId = 3, // John Papa 
            //use hardcoded current user to allow editing of some fields,
            //since I don't have a user object I use strings
            currentUser = ko.observable('mduberstein'),
            hashes = {
                machines: '#/machines'
                , controlled: '#/controlled'
            },
            logger = toastr, // use toastr for the logger
            messages = {
                viewModelActivated: 'viewmodel-activation'
            },
            stateKeys = {
                lastView: 'state.active-hash'
            },
            storeExpirationMs = (1000 * 60 * 60 * 24), // 1 day
            //storeExpirationMs = (1000 * 5), // 5 seconds
            throttle = 400,
            title = 'Neuroworks Site Monitor > ',
            toastrTimeout = 4000,

            _useMocks = false, // Set this to toggle mocks
            useMocks = function (val) {
                if(val) {
                    _useMocks = val;
                    init();
                }
                return _useMocks;
            },
            
            viewIds = {
                shellTop: '#shellTop-view'
                , machines: '#machines-view'
                , machine: '#machine-view'
                , controlled: '#controlled-view' //controlled machines view
            },
            
            toasts = {
                changesPending: 'Please save or cancel your changes before leaving the page.',
                errorSavingData: 'Data could not be saved. Please check the logs.',
                errorGettingData: 'Could not retrieve data.  Please check the logs.',
                invalidRoute: 'Cannot navigate. Invalid route',
                retreivedData: 'Data retrieved successfully',
                savedData: 'Data saved successfully'
            },

            // methods
            //-----------------

            dataserviceInit = function () { },
            //VALIDATION
            validationInit = function () {
                ko.validation.configure({
                    registerExtenders: true,    //default is true
                    messagesOnModified: true,   //default is true
                    insertMessages: true,       //default is true
                    parseInputAttributes: true, //default is false
                    writeInputAttributes: true, //default is false
                    messageTemplate: null,      //default is null
                    decorateElement: true       //default is false. Applies the .validationElement CSS class
                });
            },

            configureExternalTemplates = function () {
                infuser.defaults.templatePrefix = "_";
                infuser.defaults.templateSuffix = ".tmpl.html";
                infuser.defaults.templateUrl = "/Tmpl";
            },

            init = function () {
                if (_useMocks) {
                    dataserviceInit = mock.dataserviceInit;
                }
                dataserviceInit();

                toastr.options.timeOut = toastrTimeout;
                configureExternalTemplates();
                validationInit();
            };

        init();

        return {
            //currentUserId: currentUserId,
            currentUser: currentUser,
            dataserviceInit: dataserviceInit,
            hashes: hashes,
            logger: logger,
            messages: messages,
            stateKeys: stateKeys,
            storeExpirationMs: storeExpirationMs,
            throttle: throttle,
            title: title,
            toasts: toasts,
            useMocks: useMocks,
            viewIds: viewIds,
            window: window
        };
    });
