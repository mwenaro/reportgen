(function (app) {
    app.controller('examController', [
        '$state',
        '$stateParams',
        'PATHS',
        'authenticationService',
        'dataService'

                , function (
                        $state,
                        $stateParams,
                        paths,
                        as,
                        _data
                        )
                {
                    var exam = this;
                    exam.exams = [];
                    exam.currentExam = {};
                    exam.current = false;
                    exam.$onInit = function () {
                       console.log('exams');
                    };
                    _data.exams.get().then(function (response) {
                        if (response.data) {
                            console.log(response.data);
                            exam.exams = response.data.data;
                        }
                    });


                    exam.getCurrent = function (exam) {
                        exam.currentExam = exam;
                        exam.current = true;
//                        console.log(exam);
//                        console.log(true|exam.currentExam|'yes');
                        exam.exams = [exam];
//                        $state.reload();
                        console.log(exam.exams);
                    };
//                    exam.loadSubjects = function () {
//
//                        _data.exams.subjectConfigs(mk.post_examId).then(function (response) {
////                        console.log(response.data.data.length>0);
//                            if (response.data.data.length > 0) {
//                                exam.courses = response.data.data;
////                   
//                            } else if (response.data.data.length === 0) {
//                                alert("No subjects found for the given exam");
//                            }
//                        });
//                    };

                    exam.loadExams = function () {
                        console.log('loadExams');
                        _data.exams.get().then(function (response) {
                            if (response.data) {
//                                exam.exams = response.data.data.q1;
                                exam.exams = response.data.data;
                                console.log(response.data);
                            }
                        });
                    };
                }]);

//*******************************************************************************
})(app);


//                        
                      