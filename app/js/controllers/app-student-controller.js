(function (app) {

//    <************************* studentController  ***********************>
    app.controller('studentController', ['$scope', '$http', 'appService', 'PATHS', 'authenticationService', function ($scope, $http, appService, paths) {
            $scope.editPersonActive = false;
            $scope.data;
            $scope.url = paths.api;
            $scope.default_include = $scope.url + 'dashboard.php';
            $scope.person = {};
            $scope.app_page;
            $scope.inc_name = 'add';
            $scope.inc_path = $scope.url + '/views/student/inc/' + $scope.inc_name + '.php';

//  handling the submit button for the form
            $scope.addPerson = function () {
                $http({
                    method: 'post',
                    url: paths.url + 'add/login',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {request: 'insert', table: 'students', data: $scope.person}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data.flag) {
                        //console.log(response.data);
                        $scope.editSubjectActive = false;
                        $scope.person = {};
                        $scope.getData();
                    }
                });
            };
            /**/

            $scope.getData = function () {
                $http.post($scope.url + 'output1.php',
                        {'request': 'all', 'table': 'students'}
                ).then(function successCallback(response) {
                    $scope.data = response.data.data;
               console.log(response.data);
                }
                );
            };
            $scope.getStudents = function () {
                $scope.getData({'request': 'all', 'table': 'students'});
            };



            $scope.insertFormData = function (form_data) {
                $http({
                    method: 'post',
                    url: $scope.url + 'output1.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: form_data
                }).then(function successCallback(response) {
                    $scope.getData();
                });
            };

            $scope.updateEntry = function () {
//                console.log($scope.person);
                $http({
                    method: 'post',
//                    url: 'http://127.0.0.1:7173/login/update/',
//                    url: 'http://127.0.0.1:7173/update/login/',
                    url: 'http://127.0.0.1:7173/api/put/students/'+$scope.person.studentId,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {request: 'update', data: $scope.person, table: 'students'}
                }).then(function successCallback(response) {
                    console.log(response);
                    if (response.data.flag) {
                        console.log(response);
                        $scope.editPersonActive = false;
                        $scope.person = {};
                        $scope.showForm = false;
                        $scope.getData();
                        alert(response.data.msg);
                    }
                }
                );
                //}
            };
            
            $scope.getPerson = function (id) {
                $http({
                    method: 'get',
//                    url: $scope.url + 'output1.php',
                    url: $scope.url + 'students/'+id,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {id: id, request: 'get_row', table: 'students'}
                }).then(function successCallback(response) {
                    $scope.editPersonActive = true;
                    window.scroll(0,0);
                    $scope.person = response.data.data;
                    console.log(response.data.data);
                }
                );
            };

            $scope.changeInclude = function (inc_name) {
                $scope.inc_name = inc_name;
                $scope.inc_path = $scope.url + 'views/student/inc/' + $scope.inc_name + '.php';
                $scope.getInclude();

            };


            $scope.removePerson = function (id) {
                $http({
                    method: 'post',
                    url: paths.url + 'login/delete',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {request: 'update', data: {isDeleted: 1}, id: id, table: 'students'}
                }).then(function successCallback(response) {
//                   console.log(response.data);
                    if (response.data.flag) {
                        alert("Student Successfully deleted");
                        $scope.getData();
                    }
                });
            };

            $scope.show_app_page = function () {
                $http.get('http://127.0.0.1:7173/student/add').then(function () {
                    console.log('gone to show app_page');
                });
            };
            $scope.getInclude = function () {
                return $scope.inc_path;
            };

        }]);
    
    /*******************************************************************************************************************
     *                      end of  studentController
     * ******************************************************************************************************************/


    

})(app);



