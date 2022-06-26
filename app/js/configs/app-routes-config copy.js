(function (app) {
    'use strict';

    app.config(['$stateProvider', '$urlRouterProvider', 'PATHS', function ($stateProvider, $urlRouterProvider, appPaths) {
            $urlRouterProvider.otherwise('/login');
            $stateProvider.
                    state('home', {
                        url: '/home',
                        templateUrl: appPaths.app + 'views/home-view.php',
                        controller: function (authenticationService, $state, $rootScope) {
//                            if (authenticationService.checkLogin() !== true) {
//                                $state.go('login');
//                            }
                        },
                        controllerAs: 'hc',
                        resolve: function (authenticationService, $state, $localStorage) {
                            alert('go to login');
                            if (authenticationService.checkLogin() !== true) {
                                $state.go('login');
                                alert('go to login');
                            }
                        }
                    }).
                    state('user', {
                        url: '/user',
//                        params: {userId: null},
                        templateUrl: appPaths.app + 'views/user-view.php',
                        controller: 'userController',
                        controllerAs: 'user'
                    }).
                    state('teacher', {
                        url: '/teacher',
                        templateUrl: appPaths.app + 'views/teacher-view.php',
                        controller: 'teacherController'
                    }).
                    state('student', {
                        url: '/student',
                        templateUrl: appPaths.app + 'views/student-view.php',
                        controller: 'studentController'
                    }).
                    state('admin', {
                        url: '/admin',
                        templateUrl: appPaths.app + 'views/admin-view.php',
                        controller: 'adminController'
                    }).
                    state('mark', {
                        url: '/mark',
                        templateUrl: appPaths.app + 'views/mark-view.php',
                        controller: 'markController',
                        controllerAs: 'mk'
                    }).
                    state('subject', {
                        url: '/subject',
                        templateUrl: appPaths.app + 'views/subject-view.php',
                        controller: 'subjectController'
                    }).
                    state('report', {
                        url: '/report',
                        templateUrl: appPaths.app + 'views/report-view.php',
                        controller: 'repoController'
                    }).
                    state('password', {
                        url: '/password',
                        templateUrl: appPaths.app + 'views/password-view.php',
                        controller: 'passwordController',
                        controllerAs: 'pwd'
                    }).
                    state('logout', {
                        url: '/logout',
                        templateUrl: appPaths.app + 'views/logout-view.php',
                        controller: 'logoutController'
                    }).
                    state('login', {
                        url: '/login',
                        templateUrl: appPaths.app + 'views/login-view.php',
                        controller: 'loginController',
                        controllerAs: 'login'
                    }).
                    state('exam', {
                        url: '/exam',
                        templateUrl: appPaths.app + 'views/exam-view.php',
                        controller: 'examController',
                        controllerAs: 'exam',
                    }).
                    state('exam.index', {
                        url: '/index',
                        templateUrl: appPaths.app + 'views/exam-index-view.php',

                    }).
                    state('exam.marks', {
                        url: '/marks/:examId',
//                        params: {examId: null},
                        templateUrl: appPaths.app + 'views/exam-marks-view.php',
                        controller: 'mksController',
                        controllerAs: 'mk'
                    }).
                    state('exam.analysis', {
                        url: '/analysis',
                        templateUrl: appPaths.app + 'views/exam-analysis-view.php',
//                        
                    }).
                    state('exam.sub_selection', {
                        url: '/sub_selection/:examId',
                        params: {examId: null, currentExam: null},
                        templateUrl: appPaths.app + 'views/exam-sub_selection-view.php',
                        controller: 'subSelController',
                        controllerAs: 'sel'
//                        
                    }).
                            state('exam.test', {
                        url: '/test/:examId',
//                        params: {examId: null, currentExam: null},
                        templateUrl: appPaths.app + 'views/exam-test-view.php',
                        controller: 'testController',
                        controllerAs: 'test'
//                        
                    }).
                    state('exam.report', {
                        url: '/report/:examId',
//                        params: {examId: null,currentExam:null},
                        templateUrl: appPaths.app + 'views/exam-report-view.php',
//                        controller: function(){
//                            console.log('report');
//                        },
                        controller: 'repoController',
                        controllerAs: 'repo'
//                        
                    });
        }]);
// ****************************************************************************************

    app.run(['$rootScope', '$location', '$state', 'authenticationService', function ($rootScope, $location, $state, loginService) {
            if (loginService.checkLogin() !== true) {
                $state.go('login');
            }
            // alert('inside run');
            //prevent going to homepage if not loggedin
            var routePermit = ['user'];
            $rootScope.$on('$routeChangeStart', function () {
                alert('inside route chanegd');
                if (routePermit.indexOf($state.name) !== -1) {
                    var connected = loginService.logon.isLoggedin();
                    connected.then(function (response) {
                        if (!response.data) {
                            $state.go('login');
                        }
                    });
                }
            });
            //prevent going back to login page if session is set
            var sessionStarted = ['login'];
            $rootScope.$on('$routeChangeStart', function () {
                if (sessionStarted.indexOf($state.name) !== -1) {
//                    var cantgoback = loginService.islogged();
                    var cantgoback = loginService.login.isLoggedin();
                    cantgoback.then(function (response) {
                        if (response.data) {
                            $state.go('user');
                        }
                    });
                }
            });
        }]);
})(app);

