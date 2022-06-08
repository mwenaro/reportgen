var app = angular.module('myApp', []);
(function (app) {
    app.controller('myController', function ($scope) {
        $scope.name = "Jane";
        $scope.age = "36";
    });

    app.controller('dataController', ['$scope', '$http', function ($scope, $http) {

            $scope.loadFields = function (v) {
                console.log('This is the value of formInput: ' + v);
                return false;
            }

            $scope.getData = function (request) {
                // var s='name='+$scope.name+',age='+$scope.age;
                //console.log(request);
                $http({
                    method: 'post',
                    //url: 'http://127.0.0.1:7173/sms/password/trial',
                    // url: 'http://127.0.0.1/pro/access_db.php',
                    url: 'http://127.0.0.1:7173/sms/output1.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: request
                }).then(function successCallback(response) {
                    // Store response data
                    $scope.data = response.data;
                    console.log(response.data);
                }
                );
                //   return data;

            };

            $scope.insertFormDat = function (form_data) {
                console.log(form_data);
//                re = form_data.request;
//                if (re !== '') {
//                    alert(re);
//
//                }

            };

            $scope.insertFormData = function (form_data) {

                $http({
                    method: 'post',
                    url: 'http://127.0.0.1:7173/sms/output1.php',
                    // url: 'http://127.0.0.1/pro/access_db.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: form_data
                }).then(function successCallback(response) {
                    // Store response data
                    // $scope.msg = response.data;
                    console.log(response.data);
                });
            };

            $scope.updateUser = function (data) {
                alert('hello');
            console.log(data);
                $http({
                    method: 'post',
                    url: 'http://127.0.0.1:7173/sms/output1.php',
                    // url: 'http://127.0.0.1/pro/access_db.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data:data
                }).then(function successCallback(response) {
                   $scope.edit.data='';
                   console.log(response.data);
                     if(response.data.flag===true){
                         $scope.edit.show = false;
                         alert(response.data.msg);
                     }
                    
                });
            };
            $scope.editFormdata = function (form_data) {
                $http({
                    method: 'get',
                    url: 'http://127.0.0.1:7173/sms/output1.php',
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
                    //url: 'http://127.0.0.1:7173/sms/'+edit_data.url,
                    url: 'http://127.0.0.1:7173/sms/output1.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: edit_data
                }).then(function successCallback(response) {
                    // Store response data
                    $scope.edit.data = response.data;
                    //console.log(response.data.first_name);
                    if (edit_data.id) {
                        $scope.edit.show = true;
                    }

                }
                );
            };

            $scope.deleteEntry = function (re) {
                alert("Delete srudent with id = " + re);
                console.log();
//                    $http({
//                        method: 'post',
//                        //  url: 'http://127.0.0.1:7173/sms/output1.php',
//                        url: 'http://127.0.0.1/pro/access_db.php',
//                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//                        data: re
//                    }).then(function successCallback(response) {
//                        // Store response data
//                        // $scope.msg = response.data;
//                        console.log(response.data);
//                    });
            };
        }]);
})(app);




