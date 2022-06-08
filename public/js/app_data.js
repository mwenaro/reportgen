var app = angular.module('myApp', []);
(function (app) {
    app.controller('myController', function ($scope) {
        $scope.name = "Jane";
        $scope.age = "36";
    });

    /*
     * service
     */
    app.service('data_fac1', function ($http) {
        //var factory = {};
        this.getData = function (request) {
            var res=$http({
                method: 'post',
                url: 'http://127.0.0.1:7173/output1.php',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: request
            }).then(function (response) {
                //user = response.data;
                return response.data;
            });
            
            return res;
        };
        //return factory;
    });

    /*
     * data_factory
     */


    app.factory('data_factory', function ($http) {
        var factory = {};
        var user = {'jina': 'mwero'};
        var users = {};
        factory.wale = {};
        var successCallback = function (response) {
            // alert('Success calback');
            //console.log(response.data);
            console.log(user);
            user = response.data;
            console.log(user);
            factory.user = user;
            factory.wale = response.data;


        }
        factory.users = {'fac': 'usres from init'};
        // _users();
        var _users = function () {
            return {'jina': 'mwero'};
//           if(users!=={}){
//              alert('users changed'); 
//              console.log(users);
//           } 
        }

        var errorCallback = function (reason) {
            alert('error calback');
            console.log(reason.data);
        }

        $http({
            method: 'post',
            //url: 'http://127.0.0.1:7173//password/trial',
            // url: 'http://127.0.0.1:7173/pro/access_db.php',
            url: 'http://127.0.0.1:7173/output1.php',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {"request": "SELECT * FROM students  LIMIT 3"}
        }).then(successCallback, errorCallback);


        factory.getData = function (request) {
            return  ($http({
                method: 'post',
                url: 'http://127.0.0.1:7173/output1.php',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: request
            }).then(function successCallback(response) {
                //user = response.data;
                return response.data;
            }));
        };

        //initUsers();
        function initUsers() {
            console.log(factory.users);
            factory.users = {'new fac.user data': user};
            console.log(factory.users);
            console.log(factory.wale);

            $http({
                method: 'post',
                //url: 'http://127.0.0.1:7173//password/trial',
                // url: 'http://127.0.0.1:7173/pro/access_db.php',
                url: 'http://127.0.0.1:7173/output1.php',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {"request": "SELECT * FROM students  LIMIT 3"}
            }).then(function successCallback(response) {
                factory.wale = response.data;
                console.log('<in user init>');
                console.log(factory.wale);
                console.log('</end user init>');
            }, function errorCallback(reason) {

            });

        }


        return factory;
    });

    /*
     * data_service
     */

    app.service('data_service', function ($http) {
        var tbl_data;
        // var vitu={};
        this.getData = function (request) {
            //this.tbl_data;
            //console.log(request);

            $http({
                method: 'post',
                //url: 'http://127.0.0.1:7173//password/trial',
                // url: 'http://127.0.0.1:7173/pro/access_db.php',
                url: 'http://127.0.0.1:7173/output1.php',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: request
            }).then(function successCallback(response) {
//                    // Store response data
//                    $scope.data = response.data;
                tbl_data = response.data;

//            this.vitu=vitu;
                //console.log(tbl_data);
                // return tbl_data;
            }

            );
            //   return data;
            //  
            console.log(tbl_data);
            return tbl_data;
        };

        //return this;
    });

    app.controller('dataController', ['$scope', '$http', 'data_fac1', function ($scope, $http, data_fac1) {
            $scope.showForm = false;
            $scope.data;
            $scope.v;
            $scope.req1;
            $scope.loadFields = function (v) {
                console.log('This is the value of formInput: ' + v);
                return false;
            }

            /**
             * 
             * calling the init()
             */
            init();

            function init() {
                console.log($scope.namesTry);
                //$scope.showForm = false;
                // alert('Ndani ya init');
//                $scope.req = "SELECT * FROM students WHERE isDeleted IS NOT 0 LIMIT 3";
                var d = function () {
                    data_fac1.getData({"request": "SELECT * FROM students  LIMIT 3"}).then(function (data) {
                        $scope.v = data;
                        console.log($scope.v);
                    })
                };






            }
            $scope.namesTry = function () {
                data_fac1.getData({"request": "SELECT * FROM students  LIMIT 3"}).
                then(function (data) {
                    $scope.namesTry = data;
                });
            };

            $scope.getData = function (request) {
               // console.log($scope.namesTry());
                 console.log($scope.namesTry);
                // var s='name='+$scope.name+',age='+$scope.age;
                // alert('a _data in');
                // console.log(request);
//                $scope.data1 = data_service.getData("SELECT * FROM students WHERE isDeleted IS NOT 0 LIMIT 3");
//                console.log($scope.data1);
                $http({
                    method: 'post',
                    //url: 'http://127.0.0.1:7173//password/trial',
                    // url: 'http://127.0.0.1:7173/pro/access_db.php',
                    url: 'http://127.0.0.1:7173/output1.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: request
                }).then(function successCallback(response) {
                    // Store response data
                    $scope.data = response.data;
                    // alert("app_data");
//                    console.log(response.data);
                }
                );
                //   return data;

            };


            $scope.insertFormData = function (form_data) {

                $http({
                    method: 'post',
                    url: 'http://127.0.0.1:7173//output1.php',
                    // url: 'http://127.0.0.1:7173/pro/access_db.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: form_data
                }).then(function successCallback(response) {
                    // Store response data
                    // $scope.msg = response.data;
                    console.log(response.data);
                });
            };

            $scope.updateEntry = function (update_data) {

                $http({
                    method: 'post',
                    url: 'http://127.0.0.1:7173//output1.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: update_data
                }).then(function successCallback(response) {
                    // Store response data
                    //$scope.edit.data = response.data;
                    $scope.showForm = false;
                    //console.log(response.data);
                    if (response.data.flag === true) {
                        alert(response.data.msg);
                    }

                }
                );
            };
            $scope.updateUser = function (d) {
                alert('hello');
                console.log(d);
                $http({
                    method: 'post',
                    url: 'http://127.0.0.1:7173//output1.php',
                    // url: 'http://127.0.0.1:7173/pro/access_db.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: data
                }).then(function successCallback(response) {
                    $scope.edit.data = '';
                    console.log(response.data);
                    if (response.data.flag === true) {
                        $scope.showForm = false;
                        alert(response.data.msg);
                    }

                });
            };
            $scope.editFormdata = function (form_data) {
                $http({
                    method: 'post',
                    url: 'http://127.0.0.1:7173//output1.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: form_data.toString()
                }).then(function successCallback(response) {
                    // Store response data
                    $scope.data = response.data;

                }
                );
            };
            $scope.editEntry = function (edit_data) {
                $http({
                    method: 'post',
                    //url: 'http://127.0.0.1:7173//'+edit_data.url,
                    url: 'http://127.0.0.1:7173//output1.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: edit_data
                }).then(function successCallback(response) {
                    // Store response data
                    $scope.edit = {};
                    $scope.edit.data = response.data;
                    // if (edit_data.id) {
                    $scope.showForm = true;
                    //}


                }
                );
            };

            $scope.deleteEntry = function (re) {
                // alert("Delete srudent with id = " + re);
                // console.log(re);
                $http({
                    method: 'post',
                    url: 'http://127.0.0.1:7173//output1.php',
                    //url: 'http://127.0.0.1:7173/pro/access_db.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: re
                }).then(function successCallback(response) {
                    // Store response data
                    // $scope.msg = response.data;
                    console.log(response.data);

                });
            };
        }]);
})(app);




