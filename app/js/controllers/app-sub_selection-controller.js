(function (app) {
    app.controller('subSelController', [
        '$http',
        '$state',
        '$stateParams',
        'dataService',
        'authenticationService',
        'PATHS',
        'methods',
        function ($http, $state, $stateParams, _data, as, paths, methods) {
            var sel = this;

//            mk.post['scores'] = [];
            sel.post_examId = null;
            sel.show_fields = false;
            sel.tests = [];
            sel.exam_Index = null;
            sel.students = [];
            sel.candidates = [];
            sel.allowPreview = false;
            sel.subjectDoers = [];
            sel.checkall = false;
            sel.current_test = [];
//            sel.selectAll=false;

            sel.$onInit = function () {
//                sel.getPDF();
                if ($stateParams.examId) {
                    sel.post_examId = $stateParams.examId;
                    sel.loadSubjects();
                }


            };
            sel.loadSubjects = function () {
                var data = {
                    table: 'courses',
                    columns: [
                        'DISTINCT  courses.courseId',
                        'subjects.short_name AS sub',
                        'subjects.subjectId',
                        'courses.form',
                        'tests.testId',
                        'subjects.subjectId',
                        'tests.max_score'

                    ],
                    join: {
                        'subjects.subjectId': 'courses.subjectId',
                        'tests.courseId': 'courses.courseId',
                    }

                };
//                _data.exams.tests(test.post_examId).then(function (res) {
                $http.post(paths.url+"join/tests.examId/" + sel.post_examId + "/?by=subjects.short_name,courses.form",
                        {data: data}

                ).then(function (res) {
                    console.log('--------------------------------------------------------------');
                    console.log(res.data);
                    console.log('--------------------------------------------------------------');
                    if (res.data) {
                        sel.tests = res.data.data.res;
//                        $scope.subjects = res.data.data.res;
                        console.log('subs,', sel.tests);
//                   
                    } else {
                        alert("No subjects found for the given exam");
                    }
                });
//                $http.get("http://127.0.0.1:7173/api/tests/examId/" +8)
////                _data.exams.tests(sel.post_examId).then(function (response) {
////                _data.tests.getAllTest(sel.post_examId)
//                        .then(function (response) {
//                        console.log(response.data);
//                            if (response.data) {
//                                sel.tests = response.data.data;
////                   
//                            } else {
//                                alert("No subjects found for the given exam");
//                            }
//                        });
            };
            sel.fetch = function () {
                var post = [];


                angular.forEach(sel.candidates, function (v, k) {
                    if (angular.equals(v.flag, true)) {
                        this.push(v);
                    }
                }, post);
                if (!angular.equals(post, [])) {
                    _data.marks.postSelec(post).then(function (response) {
                        if (response.data.flag) {
//                        console.log(response.data.data);
                            alert("Selection  Successfully Saved");
                            sel.candidates = [];
                            sel.students = [];
                            sel.getSubjectDoers();
                            sel.loadFields();

                            sel.allowPreview = true;
                            sel.show_fields = true;

                        } else {
                            console.log(response.data);
                            alert('An error has occured! Please try Again');

                        }

                    });
                } else {
//                    alert("No students Selected");
                    return;
                }
            };

            /*****************************************************************************************************
             LOADING  FILEDS
             ****************************************************************************************************/
            sel.loadFields = function (_test) {
//                console.log(sel.current_test);
                sel.current_test = angular.fromJson(_test);
                console.log(sel.current_test);
                if (!angular.equals([], sel.current_test)) {
//                    console.log(sel.current_test);
//                    _data.exists(
                    $http.post(paths.url+"sql/",
                            {data:{sql: "SELECT name,adm,form,studentId FROM students WHERE studentId NOT IN (SELECT studentId FROM sub_selecs WHERE courseId IS '" + sel.current_test.courseId + "' AND subjectId IS '"
                                        + sel.current_test.subjectId +
                                        "') AND form IS '"
                                        + sel.current_test.form +
                                        "' AND isDeleted IS NOT 1 AND active IS 1"
                                        
                            }}).then(function (response) {
                                console.log('goten data seleces',response.data);
                        if (response.data.data) {
                            
                            sel.students = response.data.data.res;
                            console.log('gotten students',sel.students);
                            var v = [];
                            var d = response.data.data.res;
                            angular.forEach(d, function (value, key) {
                                this.push({
                                    'studentId': value.studentId,
                                    'flag': false,
                                    'testId': sel.current_test.testId,
//                                    'examId': sel.current_test.examId,
                                    'subjectId': sel.current_test.subjectId,
                                });
                            }, v);
                            sel.candidates = v;
                            sel.show_fields = true;
                            console.log('v  ',v);
                            sel.getSubjectDoers();
                            console.log('candidates ',sel.candidates);
                        }
                    });
                }
            };

//            ***********************************************************************
//               EDN DLODING     
//             **********************************************************************

            sel.getSubjectDoers = function () {
                if (!angular.equals([], sel.current_test)) {
                    _data.exists(
                            {request: "SELECT name,adm,form,studentId FROM students WHERE studentId IN (SELECT studentId FROM sub_selecs WHERE courseId IS '" + sel.current_test.courseId + "' AND subjectId IS '"
                                        + sel.current_test.subjectId +
                                        "') AND form IS '"
                                        + sel.current_test.form +
                                        "' AND isDeleted IS NOT 1"
                            }).then(function (response) {
                        if (response.data.data) {
                            sel.subjectDoers = [];

                            angular.forEach(response.data.data, function (v, k) {
                                v['testId'] = sel.current_test.testId;
                                v['subjectId'] = sel.current_test.subjectId;
//                                v['name']=sel.current_test.n;
                                this.push(v);
                            }, sel.subjectDoers)
                            sel.allowPreview = sel.show_fields = true;
//                            console.log('----------------------------------------------------');
//                            console.log(response.data);
//                            console.log('----------------------------------------------------');
                        }
                    });
                }

            };
//            ********************
//            Remove
//            **************************

            sel.removeStudent = function (stdId, subId, testId) {
                _data.del({request: " DELETE FROM sub_selecs WHERE subjectId IS '" + subId + "' AND testId IS '" + testId + "'   AND studentId IS '" + stdId + "'"
                }).then(function (res) {
                    if (!res.data.flag) {
                        alert("A Error has occured, Please Try Again");
                    }
                    sel.getSubjectDoers();
                    sel.loadFields();
                });
            };

            //***************************************************************************************
//    
//    TOGGLE CHECK ALL
//    *************************************************************************************

            sel.toggleCheckAll = function () {
                sel.checkall = !sel.checkall;
                console.log("checkall is now " + sel.checkall);
                var d = [];
                angular.forEach(sel.candidates, function (value, k) {
                    value.flag = sel.checkall;
                    this.push(value);
                }, d);
                sel.candidates = d;

            };

        }]);
//  

})(app);


//                        
                      