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
            repo.url = paths.url;
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


