(function (app) {

//   
    /* < Start  subjects>*/
    /***********************************************************************************************************************************************************************
     * *********************************************************************************************************************************************************************/

    app.controller('subjectController', ['$scope', '$http', 'appService', 'PATHS', function ($scope, $http, appService, paths) {
            $scope.showForm = false;
            $scope.editSubjectActive = false;
            $scope.data;
            $scope.password_confirm;
            $scope.url = paths.url;
            $scope.default_include = $scope.url + 'add_subs.php';
            $scope.subject = {};
            $scope.app_page = 'subjects';
            $scope.inc_name = 'add';
            $scope.inc_path = $scope.url + 'api/views/subject/inc/' + $scope.inc_name + '_subs.php';
            $scope.req1;
            /*
             * Workload 
             */
            $scope.isSingle = appService.school.isSingle;
            $scope.editWorkloadActive = false;
            //appService.teacher.getTeachers();
            $scope.filterTr = '';
            $scope.changeTrFilter = function (v) {
                $scope.filterTr = v;

            };


            /**********************************************************************************************************************/

            /**
             * 
             * @param {type} request
             * @returns {undefined}
             */
            $scope.getData = function () {

                $http.post($scope.url + 'api/output1.php',
                        {'request': 'all', 'table': 'subjects'}
                // request
                ).then(function successCallback(response) {
                    // Store response data
                    $scope.data = response.data.data;
                }

                );
            };

//            *************************************
            $scope.getTeachers = function () {

                $http.post($scope.url + 'api/output1.php',
                        {'request': 'all', 'table': 'teachers'}
                // request
                ).then(function successCallback(response) {
                    // Store response data
                    $scope.data2 = response.data.data;
                    //console.log(response.data);
                }

                );
            };

            /**********************************************************************************************************************/

            $scope.getStudents = function () {
                $scope.getData({'request': 'all', 'table': 'subjects'});
            }

            /**************************************************************************************************************************/
            /**
             * 
             * @param {type} subject
             * @returns {undefined}
             */
            $scope.updateEntry = function (subject) {
//                var page=$scope.app_page;

                //  console.log({'data': subject, 'request': 'update', 'table': 'subjects'});
                $http({
                    method: 'post',
//                    url: $scope.url + 'output1.php',
                    url: paths.url + 'login/update',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {'data': subject, 'request': 'update', 'table': 'subjects'}
                }).then(function successCallback(response) {
                    // Store response data

//                    console.log(response.data);
                     console.log("nje");
                    if (response.data.flag) {
                        //$scope.editSubjectActive = false;
                        $scope.subject = {};
                        $scope.showForm = false;
                       $scope.getData();
                        console.log("ndani");
                        alert('Information Successfully updated!');
                    } else {
                        alert('Sorry, data not updated. An Error Occured');
                    }
                }
                );
                //}
            };

            /**********************************************************************************************************************/

            /**
             * 
             * @param {type} id
             * @returns {undefined}
             */
            $scope.getSubject = function (id) {
                $http({
                    method: 'post',
                    url: $scope.url + 'api/output1.php',
                    //url: $scope.url+'output1.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {'id': id, 'table': 'subjects', 'request': 'get_row'}
                }).then(function successCallback(response) {
                    $scope.subject = response.data.data;
                    $scope.editSubjectActive = true
                    $scope.showForm = true;
                }
                );
            };

            /**********************************************************************************************************************/

            /**
             * 
             * @param {type} id
             * @returns {undefined}
             */
            $scope.removeSubject = function (id) {
                $http({
                    method: 'post',
                    url: paths.url + 'login/delete',
//                    url: $scope.url + 'output1.php',
                    //url: $scope.url+'output1.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {'data': {'isDeleted': 1}, 'id': id, 'table': 'subjects', 'request': 'delete'}
                }).then(function successCallback(response) {
                    console.log(response);
                    if (response.data.flag) {
                        alert('Successfully Removed!');
//                   console.log(response.data.data);
//                    $scope.data = response.data.data;
                        $scope.getData();
                    }
                }
                );
            };

            /**************************************************************************************************************************/

            /**
             * 
             * @param {type} subject
             * @returns {undefined}
             */
            $scope.addSubject = function (subject) {
                $http({
                    method: 'post',
                    url: $scope.url + 'api/output1.php',
                    //url: $scope.url+'output1.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {'table': 'subjects', 'request': 'insert', 'data': subject}
                }).then(function successCallback(response) {
                    alert('Subject Successfully Added');
                    $scope.data = response.data.data;
                    $scope.subject = {};
                    $scope.password_confirm = '';
                    $scope.showForm = true;
                }
                );
            };
            /**********************************************************************************************************************/



            /**********************************************************************************************************************/

            /**
             * 
             * @param {type} inc_name
             * @returns {undefined}
             */
            $scope.changeInclude = function (inc_name) {
                $scope.inc_name = inc_name;
                $scope.inc_path = $scope.url + 'views/subject/inc/' + $scope.inc_name + '_subs.php';
                // alert($scope.inc_path);
                $scope.getInclude();

            };

            /**********************************************************************************************************************************/

            /**
             * 
             * @param {type} id
             * @returns {undefined}
             */
            $scope.getRow = function (id) {
                request = appService.get_row_req(id);
                console.log(request);
                $http({
                    method: 'post',
                    url: paths.url+'subject/get_row',
                    //url: $scope.url+'output1.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: request
                }).then(function successCallback(response) {
                    alert('success');
                    console.log(response.data);
                }
                );
            };

            /**********************************************************************************************************************/


            /**
             * 
             * @param {type} re
             * @returns {undefined}
             */

            $scope.deleteEntry = function (re) {
                // alert("Delete srudent with id = " + re);
                // console.log(re);
                $http({
                    method: 'post',
                    url: $scope.url + 'api/output1.php',
                    //url: 'http://127.0.0.1:7173/pro/access_db.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: re
                }).then(function successCallback(response) {
                    alert(response.data.msg);
                    $scope.data = response.data.data;
                });
            };

            /**********************************************************************************************************************/


            /**
             * 
             * @returns {String}
             */
            $scope.getInclude = function () {
                return $scope.inc_path;
            };
            /***********************************************************************************************************************/
        }]);
    /*******************************************************************************************************************
     *                      end of data controller
     * ******************************************************************************************************************/




})(app);



