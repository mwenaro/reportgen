/*var app = angular.module('myApp', []);*/
(function (app) {

//    <************************* reportController  ***********************>
   app.controller('loginController',
            ['$rootScope',
                '$http',
                '$location',
                '$state',
                '$interpolate',
                'pathGen',
                'authenticationService',
//            'loginService',
                'PATHS',
                'dataService',
                'sessionService',
                '$resource'
                        ,
                function (
                        $rootScope,
                        h,
                        l,
                        state,
                        i,
                        pg,
                        as,
//                    loginService,
                        paths,
                        _data,
                        sessionService,
                        $resource
                        ) {
                    var login = this;
                    login.person = {};
                    login.error = {};
                    login.error.pwd = {};
                    login.error.staff = false;
                    login.error.phone = false;
                    login.error.phoneInvalid = false;

                    login.error.pwd.Length = false;
                    login.error.pwd.Mismatch = false;
//                logon.error.pwd=false

                    _data.subjects.get().then(function (repsonse) {
                        login.subs = repsonse.data.data.q1;
//                console.log(mk.subjects);
                    });
                    login.addPerson = function (data) {
                        if (login.error.pwd.Length || login.error.pwd.Mismatch || login.error.phone || login.error.staff || login.error.phoneInvalid) {
                            alert('Error! Check your Information and try Again!');
                        } else {

                            _data.teachers.add(data).then(function (response) {
                                if (response.status) {
                                    if (response.data.flag) {
                                        alert(response.data.msg + ' Click Login to login');
//                                        l.path('/login');
                                        state.reload();
                                        login.person = {};
                                        login.confirm_password = {};
                                    } else {
                                        alert('An error has occured, Please Check Your Values and try Again');
                                    }
                                } else {
                                    alert('An error has occured, Please Check Your Values and try Again');
                                }

                            });
                        }
                    };
                    login.pwdCheck = function (p1, p2) {
                        login.error.pwd = {};
                        if (p1.length < 6) {
                            login.error.pwd.Length = true;
                        }
                        if (!angular.equals(p1, p2)) {
                            login.error.pwd.Mismatch = true;
                        }

                    };
                    login.clearError = function (flag) {
                        if (!angular.equals(flag, undefined)) {
                            login.error = {};
                        } else {
                            login.error.pwd = {};
                        }

                    };
                    login.checkPhone = function (phone) {
                        login.error.phoneInvalid = false;
                        if (as.valid.valPhone(phone) === true) {
                            //console.log('valid phone ' + phone);
                        } else {
                            login.error.phoneInvalid = true;
                        }
                    };


                    login.checkItem = function (ob, field) {
                        _data.exists({table: 'teachers', request: 'get', where: ob}).then(function (response) {
                            login.error = {};
                            if (!angular.equals(response.data.data, [])) {

                                if (angular.equals(field, 'staff_code')) {
                                    login.error.staff = true;
                                } else {

                                    login.error.phone = true;
                                }

//                        console.log(response.data.data);
//                            console.log(response.data);

                            } else {
//                           console.log(response);
//                            console.log('empty debe 1');
//                            console.log(response);
//                            console.log('empty debe 2');

                            }
                        });


                    };


//                console.log(mk.subjects);




                    login.user = {};
                    $rootScope.isLoggedIn = false;

                    login.pwdType = 'password';
                    login.pwdClass = 'glyphicon glyphicon-eye-close';
                    login.closeForm = false;

                    login.pwdErrorMsg = '';
                    login.clearPwdError = function () {
                        login.pwdErrorMsg = '';

                    };

                    login.changgePwdType = function () {
                        if (login.pwdType === 'password') {
                            login.pwdType = 'text';
                            login.pwdClass = 'glyphicon glyphicon-eye-open';
                        } else {
                            login.pwdType = 'password';
                            login.pwdClass = 'glyphicon glyphicon-eye-close';
                        }

                    };
                    login.loginUser = function () {

                        if (as.loginUser(login.user)) {

                            if (as.isLoggedIn()) {
                                $rootScope.isLoggedIn = true;
                                // console.log(response.data.user);
//                                 var user = response.data.user;
                                console.log(sessionService.getUser());
                                login.pwdErrorMsg = '';


                                state.go('user');
//                               console.log('-------------LOGIN--------------');

                            } else {

                                login.pwdErrorMsg = 'Invalid Login  Try Again';
                            }
                        }
//                        else {
                        login.pwdErrorMsg = 'Invalid Login  Try Again';
//                        }

                    };


                }]);


//</************************* reportController  ***********************>

})(app);







