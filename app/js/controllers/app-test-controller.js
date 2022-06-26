
(function (app) {

    /************************************************************************************************/
    app.controller('testController', [
        '$http',
        '$state',
        '$stateParams',
        'dataService',
        'authenticationService',
        'PATHS',
        'methods',
        function ($http, $state, $stateParams, _data, as, paths, methods) {
            var test = this;
//            test.post = [];
//            test.post['scores'] = [];
            test.post_examId = null;
            test.show_fields = false;
            test.tests = [];
            test.exam_Index = null;
            test.students = [];
            test.candidates = [];
            test.allowPreview = false;
            test.editActive = false;
            test.current_test = [];
            test.subjects = [];

            test.post_examId = $stateParams.examId | null;
//                
            init();
            function init() {
//                test.loadSubjects();
            }
            test.$onInit = function () {
//                console.log('****************** test on init ');
//                loadTests();
               
                test.loadTests();
                 test.loadSubjects();
            };
//                  


//            _data.subjects.get().then(function (res) {
//                test.subjects = res.data.data.q1;
//                console.log('--------------------------------------------------------------');
//                console.log(res.data.data);
//                console.log('--------------------------------------------------------------');
//
//            });
//            _data.exams.courses(test.post_examId).then(function (res) {
//                console.log('--------------------------------------------------------------');
//                console.log(res.data);
//                console.log(res.data.data);
//                console.log('--------------------------------------------------------------');
//                if (res.data.data.length > 0) {
//                    test.tests = res.data.data;
////                   
//                } else if (res.data.data.length === 0) {
//                    alert("No subjects found for the given exam");
//                }
//            });




            test.loadSubjects = function () {
                var data = {
                    table: 'courses',
                    columns: [
                        'DISTINCT  courses.courseId',
                        'subjects.short_name AS sub',
                        'subjects.subjectId',
                        'courses.form',
                        'subjects.subjectId',
                        'tests.max_score'

                    ],
                    join: {
                        'subjects.subjectId': 'courses.subjectId',
                        'tests.courseId': 'courses.courseId',
                    }

                };
//                _data.exams.tests(test.post_examId).then(function (res) {
                $http.post(paths.url+"join/tests.examId/" + test.post_examId + "/?by=subjects.short_name,courses.form",
                        {data:data}

                        ).then(function (res) {
                    console.log('--------------------------------------------------------------');
                    console.log(res.data);
                    console.log('--------------------------------------------------------------');
                    if (res.data) {
                        test.subjects = res.data.data.res;
//                        $scope.subjects = res.data.data.res;
                        console.log( 'subs,',test.subjects);
//                   
                    } else {
                        alert("No subjects found for the given exam");
                    }
                });
            };
            test.get = function (cz) {
                var _test = {
                    testId: cz.testId,
                    courseId: cz.courseId,
                    form: cz.form,
                    max_score: cz.max_score,
                    examId: cz.examId
                };
                test.current_test = _test;
                test.editActive = true;
            };
            test.update = function (cz) {
                var test = {
                    testId: cz.testId,
                    max_score: cz.max_score,
                    examId: cz.examId
                };
                $http.post(paths.url+'update/login', {request: 'update', data: test, table: 'tests'}).then(function (res) {
                    console.log(res.data);
                    if (res.data.flag) {
                        alert('Course Updated');
                        test.current_test = [];
                        /****
                         * 
                         */
//                        _data.exams.courses(test.post_examId).then(function (res) {
                        _data.exams.tests(test.post_examId).then(function (res) {
                            console.log('--------------------------------------------------------------');
                            console.log(res.data);
                            console.log(res.data.data);
                            console.log('--------------------------------------------------------------');
                            if (res.data.data) {
                                test.tests = res.data.data;
//                   
                            } else {
                                alert("No subjects found for the given exam");
                            }
                        });
                        /**
                         * 
                         */
                    }
                });

            };
            test.add = function (_test1) {
//           var     _test1 = angular.fromJson(_test);
                var _test = {
                    courseId: _test1.courseId,
                    max_score: _test1.max_score,
                    examId: test.post_examId
                };
//               ? test.current_test = _test;
//                test.editActive = true;
                $http.post(paths.url+'add/login', {request: 'insert', data: _test, table: 'tests'}).then(function (res) {
                    console.log(res.data);

                    console.log('---------------test-----------');
                    console.log(_test);


                });
            };


            test.delete = function (testId) {
                $http.post();

            };

            test.loadFields = function (exam) {
                test.current_test = exam;
//                console.log(exam);
                if (!angular.equals({}, test.current_test)) {
                    _data.exists(
                            {request: "SELECT name,adm,form,studentId FROM students WHERE studentId NOT IN (SELECT studentId FROM marks WHERE examId IS '" + test.post_examId + "' AND subjectId IS '"
                                        + test.current_test.subjectId +
                                        "') AND form IS '"
                                        + test.current_test.form +
                                        "' AND isDeleted IS NOT 1 AND studentId IN (SELECT studentId FROM sub_selecs WHERE testId IS '"
                                        + test.current_test.testId + "' AND subjectId IS '" + test.current_test.subjectId + "')"

                            }).then(function (res) {
                        console.log('----------------------------------');
                        console.log(res.data);
                        console.log('----------------------------------');
                        if (res.data.data) {
                            test.students = res.data.data;
                            var v = [];
                            var d = res.data.data;
                            angular.forEach(d, function (value, key) {
                                this.push({
                                    'studentId': value.studentId,
                                    'score': null,
                                    'testId': test.current_test.testId,
                                    'examId': test.current_test.examId,
                                    'subjectId': test.current_test.subjectId,
                                });
                            }, v);
                            test.show_fields = true;
                            test.candidates = v;
                            console.log('------Candidates-----------');
                            console.log(res.data);
                            console.log('---------------------------');
                            test.getFilledMarks();
                        }
                    });
                }
            };

            test.loadTests = function () {
                _data.exams.tests(test.post_examId).then(function (res) {
                    console.log('--------------------------------------------------------------');
//                    console.log(res.data);

                    console.log('--------------------------------------------------------------');
                    if (res.data) {
                        test.tests = res.data.data;
//                   
                    } else {
                        alert("No subjects found for the given exam");
                    }
                });
            };

            /***
             * private methods
             */
            function loadTests() {
                console.log(" ******************* oad test method");
                console.log(" ******************* oad test method");
                console.log(" ******************* oad test method");

            }

        }]);
    /************************************************************************************************/
})(app);



