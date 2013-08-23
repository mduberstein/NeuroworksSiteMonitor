define('dataservice.study',
    ['amplify'],
    function (amplify) {
        var
//amplify request definitions
            init = function () {
                // Pass Resource Id, Request Type, and Settings
                //MIKE: the first parameter in the requiest definition is the resourceId, here it is 'sessions'
                //if a request with the same resource is redefined later, the last definition wins
                amplify.request.define('studies', 'ajax', {
                    url: '/api/studies',
                    dataType: 'json',
                    type: 'GET'
                    //cache: true MIKE: uses built-in in-memory cache
                    //cache: 60000 // 1 minute MIKE: uses in-memory cache
                    //cache: 'persist' MIKE: uses local store, requires amplify.store plugin using local storage
                });

                amplify.request.define('study', 'ajax', {
                    url: '/api/studies/{id}',
                    dataType: 'json',
                    type: 'GET'
                });

                amplify.request.define('studyUpdate', 'ajax', {
                    url: '/api/studies',
                    dataType: 'json',
                    type: 'PUT',
                    contentType: 'application/json; charset=utf-8'
                });
            },
//amplify request usage
            getStudies = function (callbacks) {
                return amplify.request({
                    resourceId: 'studies',
                    success: callbacks.success,
                    error: callbacks.error
                });
            },

            getStudy = function (callbacks, id) {
                return amplify.request({
                    resourceId: 'study',
                    data: { id: id },
                    success: callbacks.success,
                    error: callbacks.error
                });
            },

            updateStudy = function (callbacks, data) {
                return amplify.request({
                    resourceId: 'studyUpdate',
                    data: data,
                    success: callbacks.success,
                    error: callbacks.error
                });
            };

        init();

        return {
            getStudies: getStudies,
            getStudy: getStudy,
            updateStudy: updateStudy
        };
    });

//without amplify this could have been
//define('dataservice.session', ['jquery'], function ($) {
//    var root = '/api/',
//        getSessionBriefsAjax = function (callbacks) {
//            var url = root + 'sessionbriefs';
//            $.ajax({
//                url: url,
//                dataType: 'json',
//                success: function (result) {
//                    callbacks.success(result);
//                },
//                error: function (result) {
//                    callbacks.error(result);
//                }
//            });
//        }
        //getSessionBriefsRawJson = function (callbacks) {
        //    var url = root + 'sessionbriefs';
        //    $.getJSON(url)
        //        .done(function(result, status){
        //            callbacks.success(result)
        //        })
        //        .fail(function (result, status) {
        //            callbacks.error(result);
        //        })
        //}
//    return { getSessionBriefs: getSessionBriefsAjax }
//    or 
//    return { getSessionBriefs: getSessionBriefsRawJson}
    //});