(function (app) {

    /************************************************************************************************/
    app.controller('mksController', [
        '$http',
        '$state',
        '$stateParams',
        'dataService',
        'authenticationService',
        'PATHS',
        'methods',
        function ($http, $state, $stateParams, _data, as, paths, methods) {
            var mk = this;
//            mk.post = [];
//            mk.post['scores'] = [];
            mk.post_examId = null;
            mk.show_fields = false;
            mk.tests = [];
            mk.exam_Index = null;
            mk.students = [];
            mk.candidates = [];
            mk.allowPreview = false;
//            mk.allowEditAr=[];
            mk.filledMarks = [];
            mk.current_test = {};
            mk.$onInit = function () {
//                mk.getPDF();
//                if ($stateParams.examId) {
                mk.post_examId = $stateParams.examId | null;
                mk.loadSubjects();
//                  

//                }


            };



            mk.loadSubjects = function () {
                if (angular.equals(null, mk.post_examId)) {
                    return;
                }
//                var whe=" students.studentId NOT IN (SELECT )";
                var data = {
                    table: 'courses',
                    columns: [
                        'DISTINCT  tests.testId',
                        'courses.form',
                        'subjects.short_name AS sub',
                        'tests.max_score',
                        'subjects.subjectId',
                        'streams.short_name as stream',
                        'classes.classId'

                    ],
                    join: {
                        'tests.courseId': 'courses.courseId',
                        'subjects.subjectId': 'courses.subjectId',
                        'exams.examId': 'tests.examId',
                        'classes.classId': 'tests.classId',
                        'streams.streamId': 'classes.streamId'

                    }

                };

                $http.post(paths.url+'join/exams.examId/' + mk.post_examId + '/?by=subjects.short_name,courses.form',
//                $http.post($scope.url + 'output1.php',
                        {'data': data}
                // request
                ).then(function successCallback(response) {
                    // Store response data
//                    $scope.workloads = response.data.data.res;
                    mk.tests = response.data.data.res;
                    console.log('tetsts', response.data);
                }

                );
            };
//                console.log('examId',mk.post_examId);
//                _data.exams.courses(mk.post_examId).then(function (res) {


            mk.fetch = function () {
                var post = [];
                angular.forEach(mk.candidates, function (value, k) {
                    if (angular.equals(value.score, null)) {

                    } else {
                        this.push(value);
                    }

                }, post);
                if (angular.equals(post, [])) {
                    alert("You haven't Entered Any Marks");
                    return;
                }
                console.log('post data', post);
                _data.marks.post(post).then(function (res) {
                    console.log('post data from server ', res.data);
                    if (res.data.flag) {
//                        console.log(res.data.data);
                        alert("Marks Inserted Successfully");
                        mk.candidates = [];
                        mk.allowPreview = true;
                        mk.getFilledMarks();
                        mk.show_fields = false;
                    } else {
                        alert('An error has occured! Please try Again');
                    }
                });
            };
//mk.loadFields();

            mk.loadFields = function (_test) {
                mk.current_test = angular.fromJson(_test);
                var s = "SELECT name,adm,form,studentId FROM students  \n\
                      WHERE studentId NOT IN (SELECT studentId FROM marks WHERE examId IS '" + mk.post_examId + "' "
                        + " AND testId = '" + mk.current_test.testId +
                        "') AND classId IS '" + mk.current_test.classId +
                        "' AND isDeleted IS NOT 1 " +
                        " AND active IS 1 ";
                console.log(s);
                if (!angular.equals({}, mk.current_test)) {

                    $http.post(paths.url+'get/login',
                            {request: s

                            }).then(function (res) {
//                        console.log(res.data);
//                        console.log(mk.current_test);
                        if (res.data.data) {
                            mk.students = res.data.data;
                            var v = [];
                            var d = res.data.data;
                            angular.forEach(d, function (value, key) {
                                this.push({
                                    'studentId': value.studentId,
                                    'score': null,
                                    'testId': mk.current_test.testId,
                                    'examId': mk.post_examId,
//                                    'examId': mk.current_test.examId,
                                    'subjectId': mk.current_test.subjectId,
                                });
                            }, v);
                            mk.show_fields = true;
                            mk.candidates = v;
                            console.log('------Candidates-----------');
                            console.log(res.data);
                            console.log('---------------------------');
                            mk.getFilledMarks();
                        }
                    });
                }
            };
            mk.loadFields2 = function (_test) {
                mk.current_test = angular.fromJson(_test);
                console.log(mk.current_test);
                if (!angular.equals({}, mk.current_test)) {

                    $http.post(paths.url+'get/login',
                            {request: "SELECT name,adm,form,studentId FROM students WHERE studentId NOT IN (SELECT studentId FROM marks WHERE examId IS '" + mk.post_examId + "' AND subjectId IS '"
                                        + mk.current_test.subjectId +
                                        "') AND form IS '"
                                        + mk.current_test.form +
                                        "' AND isDeleted IS NOT 1 AND studentId IN (SELECT studentId FROM sub_selecs WHERE testId IS '"
                                        + mk.current_test.testId + "' AND subjectId IS '" + mk.current_test.subjectId + "')"

                            }).then(function (res) {
//                        console.log(res.data);
                        console.log(mk.current_test);
                        if (res.data.data) {
                            mk.students = res.data.data;
                            var v = [];
                            var d = res.data.data;
                            angular.forEach(d, function (value, key) {
                                this.push({
                                    'studentId': value.studentId,
                                    'score': null,
                                    'testId': mk.current_test.testId,
                                    'examId': mk.current_test.examId,
                                    'subjectId': mk.current_test.subjectId,
                                });
                            }, v);
                            mk.show_fields = true;
                            mk.candidates = v;
                            console.log('------Candidates-----------');
                            console.log(res.data);
                            console.log('---------------------------');
                            mk.getFilledMarks();
                        }
                    });
                }
            };
            mk.check = function (v) {
                //console.log(v);
                if (!angular.equals('', v)) {
                    mk.mks.form = v.form;
                    mk.mks.term = v.term;
                    mk.mks.max_score = v.max_score;
                }

            };
            mk.getPDF = function () {
                var content = "Hello";
                var request = new XMLHttpRequest();
                request.open('POST', paths.api + 'sawa.php', true);
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                request.resType = 'blob';
                request.onload = function () {
                    // Only handle status code 200
                    if (request.status === 200) {
                        // Try to find out the filename from the content disposition `filename` value
                        var disposition = request.getResponseHeader('content-disposition');
                        var matches = /"([^"]*)"/.exec(disposition);
                        var filename = (matches != null && matches[1] ? matches[1] : 'file.pdf');
                        // The actual download
                        var blob = new Blob([request.res], {type: 'application/pdf'});
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }

                    // some error handling should be done here...
                };
                request.send('content=' + content);
            };
//        *************************************************************************************

            mk.getFilledMarks = function () {
                console.log(mk.current_test);
                var grade = ',' + _data.grading('round(marks.score*100/tests.max_score)').grades;
                var points = ',' + _data.grading('round(marks.score*100/tests.max_score)').points;

                _data.marks.getFilledMarks({request:
                            "SELECT students.studentId,students.name,students.adm,exams.type,students.form,marks.score,(marks.score*100/tests.max_score) as per_mark,marks.markId,marks.subjectId,marks.testId" + grade + points + " FROM students JOIN marks ON students.studentId=marks.studentId JOIN exams ON marks.examId=exams.examId JOIN tests ON marks.testId=tests.testId "
                            + "WHERE marks.testId IS '" + mk.current_test.testId + "' AND marks.subjectId IS '" + mk.current_test.subjectId + "' ORDER BY students.adm ASC"
                }).then(function (res) {

                    console.log('-------------filled mks-------------------------------');
                    console.log(res.data);
                    console.log('------------------feiiled maks--------------------------');
                    mk.filledMarks = res.data.data;

                });
            };
//*********************************************************************************************

            mk.update = function (_id, _index) {
                if (mk._scores[_index]) {
//                    console.log({markId: _id, score: mk._scores[_index], index: _index});
//                mk.allowEditAr[_index]=true;
                    if (1) {
                        _data.req.update('marks', {markId: _id, score: mk._scores[_index]}).then(function (res) {
                            console.log(res.data);
                            if (res.data) {
                                alert("Updated");
                                console.log(res.data);
                                mk.getFilledMarks();
//                            mk.allowEditAr[_index] = false;
                                _data.req.row('marks', _id).then(function (rs) {
                                    console.log(rs.data);
                                });
                            }
                        });
                    }
                    mk.allowEditAr[_index] = false;
                }
            };


            mk.removeMark = function (sId, tId) {
                console.log('sId,tId', {sId: sId, tId: tId});
                var sql = " DELETE FROM marks where markId IN ( \n\
SELECT markId from marks where studentId ='" + sId + "' and testId ='" + tId + "') ";

                $http.post(
                        paths.url+"sql",
                        {data: {sql: sql}}).then(function (res) {
                    console.log("delete res", res.data);
                    if (res.data.flag) {
                        alert("Mark Successfully Delted!");
                    } else {
                        alert("Not Deleted, Something went wrong. Please try again");
                    }
                });

            };


        }]);
    /************************************************************************************************/





})(app);




//        ********************************************************************************************
