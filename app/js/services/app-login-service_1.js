(function (app) {
    'use strict';

   app.factory('authenticationService',
            [
                '$http',
                '$location',
                '$state',
                'PATHS',
                'sessionService',
                '$rootScope',
                function (h, $location,$state, paths, sessionService,$rootScope) {
                    //*********************************************
                    //user
                    //************************
                    var api_login = paths.url + 'login/';
                    var login_status = false;
                    var userId = 0;
//            *********************************
                    return{
                        loginUser: function (user) {
                            var validate = h.post(api_login + 'login', {request: 'login', user: user});
                            validate.then(function (response) {
                                 console.log(response);
                                var userId = response.data.userId;
                                var user = response.data.user;
                                if (userId) {
//                                    sessionService.setUserId(userId);
                                    sessionService.setUser(user);
                                    $rootScope.isLoggedIn = true;
                                    $location.path('/user');
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        },
                        logout: function () {
                            $rootScope.isLoggedIn = false;
                            sessionService.destroy();
                            $location.path('/login');
//                            $state.go('login');
                        },

                        isLoggedIn: function () {
                            var checkSession = h.post(api_login + 'isLoggedIn', {request: 'check_login'});
                            //console.log(checkSession);
                            return checkSession;
                        },

                        fetchuser: function (id) {
                            var user = h.post(api_login + 'fetch', {userId: id});
                            return user;
                        },
                        checkLogin: function () {
                            return sessionService.checkLogin();
                        }
                        ,
                        login: {
                            getUserId: function () {
                                return sessionService.getUserId();
                            }

                        },

                        isLoggedin: function () {
                            return login_status;
                        }
                        ,
                        login11: {
                            status: login_status
                        },
                        getId: function () {
                            return userId;
                        },
                        setLogin: function (Id) {
                            userId = Id;
//                    storage.setItem('userId',Id);
                        },
                        /**
                         * validate input
                         */
                        valid: {
                            valPhone: function (phone1) {
                                var phone = phone1.toString();
                                return  (/^07/.test(phone) && phone.length === 10) || (/^[+254]/.test(phone) && phone.length === 13) || (/^[254]/.test(phone) && phone.length === 12);

                            },
                            goToUrl: function () {
                                if (!sessionService.getUserId() || !sessionService.getUser()) {
                                    $location.path('/login');
                                }
                            }

                        }


                    };
                }]);

})(app);

