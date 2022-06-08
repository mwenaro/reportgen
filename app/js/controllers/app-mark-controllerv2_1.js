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
            mk.courses = [];
            mk.exam_Index = null;
            mk.students = [];
            mk.candidates = [];
            mk.allowPreview = false;
            mk.filledMarks = [];
            mk.$onInit = function () {
//                mk.getPDF();
                if ($stateParams.examId) {
                    mk.post_examId = $stateParams.examId;
                    mk.loadSubjects();
//                  
                    
                }


            };


            $http.post(paths.url + 'login/getclsdata', {where: {'students.form': 2}}).then(function (res) {
                console.log('------------------------------------------');
                console.log(res.data);
                console.log('------------------------------------------');
            });
            mk.loadSubjects = function () {

                _data.exams.courses(mk.post_examId).then(function (response) {
//                    console.log('--------------------------------------------------------------');
//                        console.log(response.data.data);
//                    console.log('--------------------------------------------------------------');
                    if (response.data.data.length > 0) {
                        mk.courses = response.data.data;
//                   
                    } else if (response.data.data.length === 0) {
                        alert("No subjects found for the given exam");
                    }
                });
            };
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
                _data.marks.post(post).then(function (response) {
//                    console.log(response.data);
                    if (response.data.flag) {
//                        console.log(response.data.data);
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

            mk.loadFields = function () {
                if (mk.exam_Index) {
                    _data.exists(
                            {request: "SELECT name,adm,form,studentId FROM students WHERE studentId NOT IN (SELECT studentId FROM marks WHERE examId IS '" + mk.post_examId + "' AND subjectId IS '"
                                        + mk.courses[mk.exam_Index].subjectId +
                                        "') AND form IS '"
                                        + mk.courses[mk.exam_Index].form +
                                        "' AND isDeleted IS NOT 1 AND studentId IN (SELECT studentId FROM sub_selecs WHERE courseId IS '"
                                        + mk.courses[mk.exam_Index].courseId + "' AND subjectId IS '" + mk.courses[mk.exam_Index].subjectId + "')"

                            }).then(function (response) {
                        console.log(response.data);
                        if (response.data.data) {
                            mk.students = response.data.data;
                            var v = [];
                            var d = response.data.data;
                            angular.forEach(d, function (value, key) {
                                this.push({
                                    'studentId': value.studentId,
                                    'score': null,
                                    'courseId': mk.courses[mk.exam_Index].courseId,
                                    'examId': mk.courses[mk.exam_Index].examId,
                                    'subjectId': mk.courses[mk.exam_Index].subjectId,
                                });
                            }, v);
                            mk.show_fields = true;
                            mk.candidates = v;
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
                request.responseType = 'blob';
                request.onload = function () {
                    // Only handle status code 200
                    if (request.status === 200) {
                        // Try to find out the filename from the content disposition `filename` value
                        var disposition = request.getResponseHeader('content-disposition');
                        var matches = /"([^"]*)"/.exec(disposition);
                        var filename = (matches != null && matches[1] ? matches[1] : 'file.pdf');
                        // The actual download
                        var blob = new Blob([request.response], {type: 'application/pdf'});
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
//                alert('courseid is ' + mk.courses[mk.exam_Index].courseId);
//                        var grade = ",case WHEN round(marks.score) >=80 then 'A'"+
//                       " WHEN round(marks.score) >= 75 AND round(marks.score) < 80 then 'A-'"+
//                       " WHEN round(marks.score) >= 70 AND round(marks.score) < 75 then 'B+'"+
//                        "WHEN round(marks.score) >= 65 AND round(marks.score) < 70 then 'B'"+
//                        "WHEN round(marks.score) >= 60 AND round(marks.score) < 65 then 'B-'"+
//                        "WHEN round(marks.score) >= 55 AND round(marks.score) < 60 then 'C+'"+
//                        "WHEN round(marks.score) >= 50 AND round(marks.score) < 55 then 'C'"+
//                        "WHEN round(marks.score) >= 45 AND round(marks.score) < 50 then 'C-'"+
//                        "WHEN round(marks.score) >= 40 AND round(marks.score) < 45 then 'D+'"+
//                        "WHEN round(marks.score) >= 35 AND round(marks.score) < 40 then 'D'"+
//                        "WHEN round(marks.score) >= 30 AND round(marks.score) < 35 then 'D-'"+
//                        "WHEN round(marks.score) < 30 then 'E'"+
//                        "END as grade";
//                        var points = ",case WHEN round(marks.score) >=80 then '12'"+
//                       " WHEN round(marks.score) >= 75 AND round(marks.score) < 80 then '11'"+
//                       " WHEN round(marks.score) >= 70 AND round(marks.score) < 75 then '10'"+
//                        "WHEN round(marks.score) >= 65 AND round(marks.score) < 70 then '9'"+
//                        "WHEN round(marks.score) >= 60 AND round(marks.score) < 65 then '8'"+
//                        "WHEN round(marks.score) >= 55 AND round(marks.score) < 60 then '7'"+
//                        "WHEN round(marks.score) >= 50 AND round(marks.score) < 55 then '6'"+
//                        "WHEN round(marks.score) >= 45 AND round(marks.score) < 50 then '5'"+
//                        "WHEN round(marks.score) >= 40 AND round(marks.score) < 45 then '4'"+
//                        "WHEN round(marks.score) >= 35 AND round(marks.score) < 40 then '3'"+
//                        "WHEN round(marks.score) >= 30 AND round(marks.score) < 35 then '2'"+
//                        "WHEN round(marks.score) < 30 then '1'"+
//                        "END as points";
                var grade = ',' + _data.grading('marks.score').grades;
                var points = ',' + _data.grading('marks.score').points;

                _data.marks.fetch({request:
                            "SELECT students.studentId,students.name,students.adm,students.form,marks.score,marks.markId,marks.subjectId,marks.courseId" + grade + points + " FROM students JOIN marks ON students.studentId=marks.studentId "
                            + "WHERE marks.courseId IS '" + mk.courses[mk.exam_Index].courseId + "' AND marks.subjectId IS '" + mk.courses[mk.exam_Index].subjectId + "' ORDER BY marks.score DESC"
                }).then(function (res) {
//                    console.log('--------------------------------------------');
//                    console.log(res.data);
//                    console.log('--------------------------------------------');
                    mk.filledMarks = res.data.data;
                });
            };
//*********************************************************************************************










        }]);
    /************************************************************************************************/




})(app);




//        ********************************************************************************************
(function (app) {

    /************************************************************************************************/
    app.controller('repoController', [
        '$http',
        '$state',
        '$stateParams',
        'dataService',
        'authenticationService',
        'PATHS',
        'methods',
        function ($http, $state, $stateParams, _data, as, paths, methods) {
            var repo = this;
//            repo.post = [];
//            repo.post['scores'] = [];
            repo.post_examId = null;
            repo.show_fields = false;
            repo.courses = [];
            repo.exam_Index = null;
            repo.students = [];
            repo.candidates = [];
            repo.allowPrinting = false;
            repo.filledMarks = [];
            repo.data = [];
            repo.$onInit = function () {
//                repo.getPDF();
                if ($stateParams.examId) {
                    repo.post_examId = $stateParams.examId;
                    repo.loadSubjects();
//                    repo.getFilledMarks();
                }


            };

            repo.setForm = function (form) {
                $http.post(paths.url + 'login/getclsdata', {where: {'students.form': form}}).then(function (res) {
                    console.log('------------------------------------------' + form + '  form');
                    console.log(res.data);
                    console.log('------------------------------------------');
//                    alert('form '+form);
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