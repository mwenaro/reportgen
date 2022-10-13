(function (app) {


    /* < Start  data ctl>*/
    /***********************************************************************************************************************************************************************
     * *********************************************************************************************************************************************************************/

    app.controller('teacherController', ['$scope', '$http', 'appService', 'dataService', 'PATHS', function ($scope, $http, appService, _data, paths) {

            $scope.showForm = false;
            $scope.editPersonActive = false;
            $scope.data;
            $scope.mimi = 'mwero abdalla';
            $scope.password_confirm = '';
//            $scope.url = 'http://127.0.0.1:7173/api/';
            $scope.url = paths.url;
            $scope.default_include = $scope.url + 'dashboard.php';
            $scope.person = {};
            $scope.app_page = 'teachers';
            $scope.inc_name = 'add';
            $scope.inc_path = $scope.url + 'api/views/teacher/inc/' + $scope.inc_name + '_trs.php';
            $scope.req1;
            // $scope.password_confirm='';
//            $scope.workload = {};

            $scope.workload = {};

            $scope.subs = [];


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
            /**
             * subjects
             */
            _data.subjects.get().then(function (res) {
                console.log(res.data);
                $scope.subs = res.data.data.q1;
//                console.log(mk.subjects);
            });

            /**********************************************************************************************************************/

            /**
             * 
             * @param {type} request
             * @returns {undefined}
             */
            $scope.getData = function () {

                $http.get(paths.api+'teachers/isPresent/1/?order=ASC&by=staff_code',
//                $http.post($scope.url + 'output1
//                
//                .php',
                        {'request': 'all', 'table': 'teachers'}
                // request
                ).then(function successCallback(response) {
                    // Store response data
                    $scope.data = response.data.data;
                    $scope.teachers = response.data.data;
                    console.log('trs', response.data);
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
                $scope.getData({'request': 'all', 'table': 'teachers'});
            }

            /**************************************************************************************************************************/
            /**
             * 
             * @param {type} teacher
             * @returns {undefined}
             */
            $scope.updateEntry = function (teacher) {
//                var page=$scope.app_page;

                //  console.log({'data': teacher, 'request': 'update', 'table': 'teachers'});
                $http({
                    method: 'put',
//                    url: $scope.url + 'output1.php',
                    url: paths.api + 'put/teachers/teacherId/'+teacher.teacherId,
//                    url: paths.url + 'api/put/teachers/teacherId/'+teacher.teacherId,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {'data': teacher, 'request': 'update', 'table': 'teachers'}
                }).then(function successCallback(response) {
                    // Store response data

                    console.log('update tr update', response.data);
                    if (response.data.flag) {
                        $scope.person = {};
                        $scope.editPersonActive = false;
                        $scope.showForm = false;
                        $scope.getData();
                        // $scope.data = response.data.data;
//                        alert(response.data.msg);
                    } else {
                        alert('Sorry, data not updated. An Error Occured');
                    }
                    $scope.getData();
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
            $scope.getTeacher = function (id) {
                $http({
                    method: 'post',
                    url: $scope.url + 'api/output1.php',
                    //url: $scope.url+'output1.php',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {'id': id, 'table': 'teachers', 'request': 'get_row'}
                }).then(function successCallback(response) {
                    $scope.person = response.data.data;
                    $scope.editPersonActive = true
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
            $scope.removeTeacher = function (id) {
                $http.post(
                        paths.url + 'delete/login',
                        {data: {'isDeleted': 1}, id: id, 'table': 'teachers', 'request': 'delete'}
                ).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data.flag) {
                        alert("Successfully deleted");
                        //$scope.data = response.data.data;
                        $scope.getData();
                    }
                }
                );
            };

            /**************************************************************************************************************************/

            /**
             * 
             * @param {type} teacher
             * @returns {undefined}
             */
            $scope.addTeacher = function (person) {
                if (person.password_confirm !== person.password) {
                    alert('Password Mismach, check the password and Try again');
                } else {
                    // console.log(person);

                    $http({
                        method: 'post',
                        url: $scope.url + 'api/output1.php',
                        //url: $scope.url+'output1.php',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        data: {'table': 'teachers', 'request': 'insert', 'data': person}
                    }).then(function successCallback(response) {

			    console.log(response.data);
                        alert('Teacher Successfully Added');
                        $scope.data = response.data.data;
                        $scope.person = {};
                        $scope.showForm = true;
                    }
                    );
                }
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
                $scope.inc_path = $scope.url + 'api/views/teacher/inc/' + $scope.inc_name + '_trs.php';
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
                    url: paths.url+'get_row/teacher/',
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


            /**
             * 
             */

            $scope.getWorkload = function (id) {
//                var sql = "SELECT * FROM workloads  ";
                $http.get(paths.dataapi+'workloads/id/' + id
//                $http.post($scope.url + 'output1.php',
//                        {'data': {'sql': sql}}
                        // request
                        ).then(function successCallback(response) {
                    // Store response data
                    $scope.workload = response.data.data;
                    console.log('fetched workload', response.data);
                    console.log('fetched workload ID', id);
                }

                );
            };

            /**
             * 
             * @returns {undefined}
             */

            $scope.getWorkloads = function () {
                var data = {
                    table: 'courses',
                    columns: [
                        'DISTINCT  workloads.workloadId',
                        'workloads.lessons',
                        'courses.courseId',
                        'subjects.short_name AS sub',
                        'courses.form',
                        'subjects.subjectId',
                        'classes.streamId',
                        'streams.short_name AS stream',
                        'teachers.first_name',
                        'teachers.title',
                        'teachers.last_name',
                        'teachers.teacherId',
                        'teachers.staff_code'
                    ],
                    join: {
                        'subjects.subjectId': 'courses.subjectId',
                        'forms.form': 'courses.form',
                        'classes.formId': 'forms.formId',
                        'streams.streamId': 'classes.streamId',
                        'workloads.courseId': 'courses.courseId',
                        'teachers.teacherId': 'workloads.teacherId'
                    }

                };
//                var sql="SELECT * FROM workloads  ";
                $http.post(paths.url+'join/classes.hasGraduated=0/?by=courses.form,subjects.short_name',
//                $http.post($scope.url + 'output1.php',
                        {'data': data}
                // request
                ).then(function successCallback(response) {
                    // Store response data
                    $scope.workloads = response.data.data.res;
                    console.log('workloads', response.data);
                }

                );
            };

//            *************************************
            /**
             * 
             * @returns {undefined}
             */

            $scope.getCourses = function () {
                var data = {
                    table: 'courses',
                    columns: [
                        'courses.courseId',
                        'classes.classId',
                        'subjects.short_name AS sub',
                        'courses.form',
                        'subjects.subjectId',
                        'classes.streamId',
                        'streams.short_name AS stream'
                    ],
                    join: {
                        'subjects.subjectId': 'courses.subjectId',
                        'forms.form': 'courses.form',
                        'classes.formId': 'forms.formId',
                        'streams.streamId': 'classes.streamId'
                    }

                };
//                var sql="SELECT * FROM workloads  ";
                $http.post(paths.url+'join/classes.hasGraduated=0/?by=courses.form,subjects.short_name',
//                $http.post($scope.url + 'output1.php',
                        {'data': data}
                // request
                ).then(function successCallback(response) {
                    // Store response data
                    $scope.courses = response.data.data.res;
                    console.log('courses', response.data);
                }

                );
            };

//            *************************************
            $scope.addWorkload = function (wk) {
//                console.log('current course', workload.course.teacherId);
                var c = angular.fromJson(wk.course);

                var workloadpost = {
                    courseId: c.courseId,
                    classId: c.classId,
                    teacherId: wk.teacherId,
                    lessons: wk.lessons
                };
//                console.log('post workload', workloadpost);
                $http.post(paths.url+'workloads',
                        {data:workloadpost }
                // request
                ).then(function successCallback(response) {
                    // Store response data
//                    $scope.data2 = response.data.data;
                    console.log("from api/workload",response.data);
                }

                );
            };




            /***********************************************************************************************************************/
            /***********************************************************************************************************************/
        }]);
    /*******************************************************************************************************************
     *                      end of data controller
     * ******************************************************************************************************************/


})(app);







