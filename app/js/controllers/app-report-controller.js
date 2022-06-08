(function (app) {

    /************************************************************************************************/
    app.controller('repoController', [
        '$http',
//        '$state',
        '$stateParams',
        'dataService',
        'authenticationService',
        'PATHS',
        'methods',
        function ($http, $stateParams, _data, as, paths, methods) {
            var repo = this;
//            repo.post = [];
//            repo.post['scores'] = [];
            repo.post_examId = null;
            repo.show_fields = false;
            repo.tests = [];
            repo.exam_Index = null;
            repo.students = [];
            repo.candidates = [];
            repo.allowPrinting = false;
            repo.filledMarks = [];
            repo.data = [];
            repo.current_exam = null;
//            repo.reports.cards=[];
//            repo.reports.marklists=[];
//            _data.exams.getRow(repo.post_examId).then(function (res) {
////                /alert('set exam');
//                console.log(res.data);
//            });
            repo.$onInit = function () {
//                repo.getPDF();
//                repo.post_examId = $stateParams.examId;
                if ($stateParams.examId) {
                    repo.post_examId = $stateParams.examId;
//                    repo.loadSubjects();
                    repo.setCurrentExam();

//                    repo.getFilledMarks();
                }


            };
            repo.setCurrentExam = function () {
                _data.exams.getRow(repo.post_examId).then(function (res) {
//                    alert(repo.post_examId);
//                    console.log(res.data);
                    repo.current_exam = res.data;
//                    console.log( repo.current_exam);
                });
            };

            repo.setForm = function (form) {
//                repo.setCurrentExam();

                var e = {};
                e = repo.current_exam;
                e.form = form;
//                console.log(e);
//                $http.post(paths.url + 'login/getclsdata', {where: e}).then(function (res) {
                $http.post(paths.url + 'getclsdata/login', {where: {'students.form': form, 'exams.year': e.year, 'exams.examId': e.examId}}).then(function (res) {
//                $http.post(paths.url + 'getclsdata/report', {where: {'students.form': form, 'exams.year': e.year, 'exams.examId': e.examId}}).then(function (res) {
                    console.log('------------------------------------------' + form + '  form');
                    console.log(res.data);
                    console.log('------------------------------------------');
//                    alert('form '+form);
                    repo.allowPrinting = true;
                    if (res.data) {
//                        repo.reports.cards = res.data.cards;
//                        repo.reports.marklists = res.data.marklists;
                        repo.data = res.data.data;
                        repo.allowPrinting = true;
                    } else {
                        alert('Something went Wrong, plz try again');
                    }

                });


            };
            repo.printLists = function (form) {
//                repo.setCurrentExam();

                var e = {};
                e = repo.current_exam;
                e.form = form;
                $http.post(paths.url + 'getclsdata/login', {where: {'students.form': form, 'exams.year': e.year, 'exams.examId': e.examId}}).then(function (res) {
                    console.log('------------------------------------------' + form + '  form');
                    console.log(res.data);
                    console.log('------------------------------------------');
//                    alert('form '+form);
                    repo.allowPrinting = true;
                    if (res.data) {
                        repo.data = res.data.data;
                        repo.allowPrinting = true;
                    } else {
                        alert('Something went Wrong, plz try again');
                    }

                });


            };


        }]);
    /************************************************************************************************/




})(app);


//*********************************************
//
//(function (app) {
//
//    /************************************************************************************************/
//    app.controller('testController', [
//        '$http',
//        '$state',
//        '$stateParams',
//        'dataService',
//        'authenticationService',
//        'PATHS',
//        'methods',
//        function ($http, $state, $stateParams, _data, as, paths, methods) {
//            var test = this;
////            test.post = [];
////            test.post['scores'] = [];
//            test.post_examId = null;
//            test.show_fields = false;
//            test.tests = [];
//            test.exam_Index = null;
//            test.students = [];
//            test.candidates = [];
//            test.allowPreview = false;
//            test.editActive = false;
//            test.current_test = [];
//            test.subjects = [];
//
//            test.post_examId = $stateParams.examId | null;
////                
//            init();
//            function init() {
//                test.loadSubjects();
//            }
////                  
//
//
//            _data.subjects.get().then(function (res) {
//                test.subjects = res.data.data.q1;
//                console.log('--------------------------------------------------------------');
//                console.log(res.data.data);
//                console.log('--------------------------------------------------------------');
//
//            });
//            _data.exams.tests(test.post_examId).then(function (res) {
////                console.log('--------------------------------------------------------------');
////                console.log(res.data.data);
////                console.log('--------------------------------------------------------------');
//                if (res.data.data.length > 0) {
//                    test.tests = res.data.data;
////                   
//                } else if (res.data.data.length === 0) {
//                    alert("No subjects found for the given exam");
//                }
//            });
//
//
//
//
//            test.loadSubjects = function () {
//
//                _data.exams.tests(test.post_examId).then(function (res) {
//                    console.log('--------------------------------------------------------------');
//                    console.log(res.data.data);
//                    console.log('--------------------------------------------------------------');
//                    if (res.data.data.length > 0) {
//                        test.tests = res.data.data;
////                   
//                    } else if (res.data.data.length === 0) {
//                        alert("No subjects found for the given exam");
//                    }
//                });
//            };
//            test.get = function (cz) {
//                var _test = {
//                    testId: cz.testId,
//                    subjectId: cz.subjectId,
//                    max_score: cz.max_score,
//                    form: cz.form,
//                    examId: cz.examId
//                };
//                test.current_test = _test;
//                test.editActive = true;
//            };
//            test.update = function (_test) {
//                $http.post('http://127.0.0.1:7173/login/update', {request: 'update', data: _test, table: 'tests'}).then(function (res) {
//                    console.log(res.data);
//                    if (res.data.flag) {
//                        alert('Course Updated');
//                        test.current_test = [];
//                    }
//                });
//
//            };
//            test.save = function (_test) {
//
//
//            };
//            test.delete = function (testId) {
//                $http.post();
//
//            };
//
//            test.loadFields = function (exam) {
//                test.current_test = exam;
////                console.log(exam);
//                if (!angular.equals({}, test.current_test)) {
//                    _data.exists(
//                            {request: "SELECT name,adm,form,studentId FROM students WHERE studentId NOT IN (SELECT studentId FROM marks WHERE examId IS '" + test.post_examId + "' AND subjectId IS '"
//                                        + test.current_test.subjectId +
//                                        "') AND form IS '"
//                                        + test.current_test.form +
//                                        "' AND isDeleted IS NOT 1 AND studentId IN (SELECT studentId FROM sub_selecs WHERE testId IS '"
//                                        + test.current_test.testId + "' AND subjectId IS '" + test.current_test.subjectId + "')"
//
//                            }).then(function (res) {
//                        console.log('----------------------------------');
//                        console.log(res.data);
//                        console.log('----------------------------------');
//                        if (res.data.data) {
//                            test.students = res.data.data;
//                            var v = [];
//                            var d = res.data.data;
//                            angular.forEach(d, function (value, key) {
//                                this.push({
//                                    'studentId': value.studentId,
//                                    'score': null,
//                                    'testId': test.current_test.testId,
//                                    'examId': test.current_test.examId,
//                                    'subjectId': test.current_test.subjectId,
//                                });
//                            }, v);
//                            test.show_fields = true;
//                            test.candidates = v;
//                            console.log('------Candidates-----------');
//                            console.log(res.data);
//                            console.log('---------------------------');
//                            test.getFilledMarks();
//                        }
//                    });
//                }
//            };
//
//
//
//        }]);
//    /************************************************************************************************/
//})(app);