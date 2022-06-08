(function (app) {
    'use strict';
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            var appPaths = {
                url: 'http://127.0.0.1:7173/',
                app1: 'http://127.0.0.1:7173/app/'
            };

            $urlRouterProvider.otherwise('/login');
            $stateProvider.
                    state('home', {
                        url: '/home',
                views:{
                    header:{
                       templateUrl: appPaths.app1 + 'views/header-view.php' 
                    },
                    main:{
                       templateUrl: appPaths.app1 + 'views/main-view.php' 
                    },
                    footer:{
                       templateUrl: appPaths.app1 + 'views/footer-view.php' 
                    }
                    
                        
                    },
                    }).
                    state('user', {
                        url: '/user/:userId',
//                        url: '/user/:userId/:username:/role',
                        templateUrl: appPaths.app1 + 'views/user.php',
                        controller: function (authServ, $state, $stateParams) {

//                            if (authServ.login.getId() === 0) {
//                                $state.go('login');
//                            }
                            var vm = this;
                            vm.name = 'mwero';
                            vm.data = {role: 'hacker', username: 'mdroaer', userId: 12409};
                        },
                        controllerAs: 'vm'
                    }).
                    state('teacher', {
                        url: '/teacher',
                        templateUrl: appPaths.app1 + 'views/teacher-view.php',
                        controller: 'trsController'
                                //                            template:'<p class="w3-blue">My Home Page</p>'
                    }).
                    state('student', {
                        url: '/student',
                        templateUrl: appPaths.app1 + 'views/student-view.php',
                        controller: 'dataController'

                    }).
                    state('admin', {
                        url: '/admin',
                        templateUrl: appPaths.app1 + 'views/admin-view.php',
                        controller: 'adminController'

                    }).
                    state('mark', {
                        url: '/mark',
                        templateUrl: appPaths.app1 + 'views/mark-view.php',
                        controller: 'markController'

                    }).
                    state('subject', {
                        url: '/subject',
                        templateUrl: appPaths.app1 + 'views/subject-view.php',
                        controller: 'subsController'

                    }).
                    state('report', {
                        url: '/report',
                        templateUrl: appPaths.app1 + 'views/report-view.php',
                        controller: 'reportController'

                    }).
                    state('password', {
                        url: '/password',
                        templateUrl: appPaths.app1 + 'views/password-view.php',
                        controller: 'pwdController',
                        controllerAs: 'pwd'
                                // controllerAs:'login'
                    }).
                    state('logout', {
                        url: '/logout',
                        templateUrl: appPaths.app1 + 'views/logout-view.php',
                        controller: 'logoutController'
                                // controllerAs:'login'
                    }).
                    state('login', {
                        url: '/login',
                        templateUrl: appPaths.app1 + 'views/login-view.php',
                        controller: 'loginController',
                        controllerAs: 'login'
                    });
        }]);

    /************************************************************************************************/

    app.controller('logoutController', ['authServ', '$state', function (as, $state) {
            // if (!as.login.status) {
            console.log('logged out');
            as.login.destroy();
            // $state.go('login');
            // }

        }]);
    /************************************************************************************************/

    app.controller('pwdController', ['pathGen', 'authServ', '$state', function (pg, as, $state) {
            if (as.login.getId() === 0) {
                $state.go('login');
            }
            var pwd = this;
            pwd.data = {name: 'mwero', age: 90};
            console.log(pg._url('njia', pwd.data));
            console.log(as.getId());

        }]);
    /************************************************************************************************/
    app.controller('adminController', ['dataService', function (dataS) {
            var adm = this;
            dataIn();
            function dataIn() {
                dataS.departments.get().then(function (response) {
                    console.log(response.data);
                });
                dataS.teachers.getRow(9).then(function (response) {
                    console.log(response);
                }, function (response) {
                    console.log(response)
                });
            }
        }]);

    /************************************************************************************************/
    app.controller('loginController', ['$http', '$location', '$state', '$interpolate', 'pathGen', 'authServ', function (h, l, s, i, pg, as) {
            var login = this;
            login.user = {};
            login.closeForm = false;
            login.loginUser = function (event) {
                h.post('http://127.0.0.1:7173/php/login.php', login.user /*{table:'users',where:login.user,request:'get_row'}*/).then(function successCallback(response) {
                    if (response.data.flag) {
                        console.log(response.data.user);
//                                 var user = response.data.user;
                        var d = angular.fromJson(response.data.user);

                        as.setLogin(d.userId);

//                        var url = pg._url('user',{userId:d.userId});
//                         console.log(url);
//                        l.path(url);
//                        l.path('/home');
                        // l.path('/user/mwero');
                        // s.go('user', angular.fromJson(response.data.user));
                        //  s.go('user', {userId: d.userId});
                    } else {
                        console.log(response);
                    }
                }, function errorCallback() {
                    console.log(response.status);
                    console.log(response);
                });
            };
        }]);
    //******************************************************************************************
    //services
    //*
    app.service('pathGen', ['$interpolate', function (i) {
            return {
                _url: function (path, ob) {
                    var url = '';
                    var _i = 0;
                    for (_i = 0; _i < Object.keys(ob).length; _i++) {
                        var p = Object.keys(ob)[_i];
                        url += ''.concat('/{{', p, '}}');
                    }
                    return i(path + url)(ob);
                }
            };
        }]);

    app.factory('authServ', ['$http', function (h) {
            //*********************************************
            //user
            //************************

            var login_status = false;
            var userId = 0;
//            *********************************
            return{

                login: {
                    setId: function (Id) {
                        userId = Id;
                        login_status = true;
                    },
                    getId: function () {
                        return userId;
                    },
                    destroy: function () {
                        login_status = false;
                        userId = 0;
                    },
                    status: function () {
                        return login_status;
                    }
                },
                login1: {
                    status: login_status
                },
                getId: function () {
                    return userId;
                },
                setLogin: function (Id) {
                    userId = Id;

                }

            };
        }]);

})(app);

