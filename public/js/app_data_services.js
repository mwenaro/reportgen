var app = angular.module('myApp', []);
(function (app) {
    app.controller('myController', function ($scope) {
        $scope.name = "Jane";
        $scope.age = "36";
    });

    /*
     * Creating my first servive, called data_service
     */
    app.service('data_service', function ($http) {
        this.tbl_data = [];
        this.getData = function (request) {
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
                this.tbl_data = response.data;

            }

            );
            //   return data;
            return this.tbl_data;
        };
    });

    app.controller('dataController', ['$scope', '$http', function ($scope, $http) {
            $scope.showForm = false;
            $scope.data;
            $scope.loadFields = function (v) {
                console.log('This is the value of formInput: ' + v);
                return false;
            }

            $scope.getData = function (request) {
                // var s='name='+$scope.name+',age='+$scope.age;
                // alert('a _data in');
                // console.log(request);
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




