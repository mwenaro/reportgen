(function (app) {
    app.factory('dataService', [
        '$http',
        'PATHS',
        // '$rootScope',
        function ($http, paths) {

            var api = paths.api;
            return {
                
                exists: function (ob) {
                    return    $http.post(api + 'output1.php', ob);
                },
                del: function (ob) {
                    return    $http.post(paths.url + 'del/login', ob);
                },
                post: function (page, sql) {
                    return $http.post(api + page, {request: 'get', sql: sql});
                },
                getData: function (page, sql) {
                    return $http.post(api + page, {request: 'get', sql: sql});
                },
                req: {
                    del: function (ob) {
                        return    $http.post(paths.url + 'del/login', ob);
                    },
                    update: function (tbl, ob) {
                        return $http.post(paths.url + 'updateMark/req', {table: tbl, data: ob});
                    },
                    save: function (tbl, ob) {
                        return $http.post(paths.url + 'save/req', {table: tbl, data: ob});
                    },
                    get: function (sql) {
                        var req = sql;
                        if (angular.isString(sql)) {
                            req = {request: sql};
                        }
                        return $http.post(paths.url + 'req/get', {request: req});
                    },
                    row: function (tbl, _id) {
                        var s = tbl + '/' + _id;
                        return $http.post(paths.url + 'req/get/' + s);
                    }
                },

                /**
                 * teachers object
                 */
                teachers: {
                    set: function (_trs) {
                        trs = _trs;
                    },
                    add: function (tr) {
                        return $http.post(paths.url + 'create/login', {request: 'insert', table: 'teachers', data: tr});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'teachers'});
                    },
                    getRow: function (id) {
                        return  $http.post(paths.url + 'getone/login', {request: 'get_row', table: 'teachers', data: {teacherId: id, isDeleted: 0}});
                    },
                    getRow1: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'teachers', data: {teacherId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'teachers', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'teachers', data: {id: id}});
                    }

                },
                /**
                 * students object
                 */
                students: {
                    add: function (student) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'students', data: student});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'students'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'students', data: {studentId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'students', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'students', data: {id: id}});
                    }
                },
                /**
                 * subjects object
                 */
                subjects: {
                    add: function (subject) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'subjects', data: subject});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'subjects'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'subjects', data: {subjectId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'subjects', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'subjects', data: {id: id}});
                    }

                },
                /**
                 * classes object
                 */
                classes: {
                    add: function (cls) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'classes', data: cls});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'classes'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'classes', data: {classeId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'classes', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'classes', data: {id: id}});
                    }


                },
                /**
                 * admins object
                 */
                admins: {
                    add: function (admin) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'admins', data: admin});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'admins'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'admins', data: {adminId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'admins', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'admins', data: {id: id}});
                    }


                },
                /**
                 * reports object
                 */
                reports: {
                    add: function (report) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'reports', data: report});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'reports'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'reports', data: {reportId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'reports', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'reports', data: {id: id}});
                    }

                },
                /**
                 * Exams object
                 */
                exams: {
                    add: function (exam) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'exams', data: exam});
//                        return $http.post(api + 'output1.php', {request: 'insert', table: 'exams', data: exam});
                    },
                    get: function () {
//                        return $http.post(api + 'output1.php', {request: 'all', table: 'exams'});
                        return $http.post(paths.url + 'get/exam');
                    },
                    getRow: function (id) {
//                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'exams', data: {examId: id, isDeleted: 0}});
                        return  $http.get(paths.url + 'dataapi/exams/'+id);
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'exams', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'exams', data: {id: id}});
                    },
                    subjectConfigs: function (examId) {
                        return $http.post(api + 'output1.php', {
                            request: "SELECT subject_configs.subject_configId,subject_configs.subjectId,subject_configs.examId,subject_configs.form,subjects.name,subjects.short_name,subject_configs.max_score from subject_configs  JOIN subjects  ON subject_configs.subjectId=subjects.subjectId "
                                    + " WHERE subject_configs.examId IS '" + examId + "' "
                        });
                    },
                    courses: function (examId) {
                        return $http.post(api + 'output1.php', {
                            request: "SELECT courses.courseId,courses.subjectId,courses.examId,courses.form,subjects.name,subjects.short_name,courses.max_score from courses  JOIN subjects  ON courses.subjectId=subjects.subjectId "
                                    + " WHERE courses.examId IS '" + examId + "' "
                        });
                    },
                    tests: function (examId) {
                        return $http.post(api + 'output1.php', {
                            request: "SELECT courses.courseId,courses.subjectId,tests.examId,courses.form,subjects.name,subjects.short_name,tests.max_score from courses  JOIN subjects  ON courses.subjectId=subjects.subjectId JOIN tests ON tests.courseId=courses.courseId "
                                    + " WHERE tests.examId IS '" + examId + "' "
                        });
//                    courses: function (examId) {
//                        return $http.post(api + 'output1.php', {
//                            request: "SELECT courses.courseId,courses.subjectId,tests.examId,courses.form,subjects.name,subjects.short_name,tests.max_score from courses  JOIN subjects  ON courses.subjectId=subjects.subjectId JOIN tests ON tests.courseId=courses.courseId "
//                                    + " WHERE tests.examId IS '" + examId + "' "
//                        });

//                        return $http.post(paths.url + 'test/get_exam_tests/' + examId);
//                        return $http.post(paths.url + 'get_exam_tests/tests/' + examId);
                    }


                },
                /**
                 * marks object
                 */
                marks: {
                    postSelec: function (mark) {
                        return $http.post(paths.url + 'postMarks/mark', {request: 'insert', table: 'sub_selecs', data: mark});
                    },
                    post: function (mark) {
                        return $http.post(paths.url + 'postMarks/mark', {request: 'insert', table: 'marks', data: mark});
                    },
                    add: function (mark) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'marks', data: mark});
                    },
                    getFilledMarks: function (ob) {
                        return $http.post(paths.url + 'getFilledMarks/mark', ob);
                    },
                    fetch: function (ob) {
                        return $http.post(paths.url + 'fetch/mark', ob);
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'marks'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'marks', data: {markId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'marks', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'marks', data: {id: id}});
                    }


                },
                /***
                 * forms object
                 */

                forms: {
                    add: function (form) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'forms', data: form});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'forms'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'forms', data: {formId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'forms', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'forms', data: {id: id}});
                    }

                },
                /**
                 * 
                 */
                tests2: {
                    add: function (test) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'tests', data: test});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'tests'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'tests', data: {testId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'tests', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'tests', data: {id: id}});
                    }
                },

                /**
                 * streams object
                 */
                streams: {
                    add: function (stream) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'streams', data: stream});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'streams'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'streams', data: {streamId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'streams', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'streams', data: {id: id}});
                    }

                },
                /***
                 * houuses
                 */
                houses: {
                    add: function (house) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'houses', data: house});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'houses'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'houses', data: {houseId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'houses', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'houses', data: {id: id}});
                    }
                }
                ,
                /***
                 * courses
                 */
                courses: {
                    add: function (course) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'courses', data: course});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'courses'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'courses', data: {courseId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'courses', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'courses', data: {id: id}});
                    }
                }
//                /********************************
                ,
                /***
                 * courses
                 */
                tests: {
                    getAllTest: function (examId) {
                        return $http.post(api + 'output1.php', {
                            request: "SELECT courses.courseId,courses.subjectId,tests.examId,courses.form,subjects.name,subjects.short_name,tests.max_score from courses  JOIN subjects  ON courses.subjectId=subjects.subjectId JOIN tests ON tests.courseId=courses.courseId "
                                    + " WHERE tests.examId IS '" + examId + "' "
                        });
                    },
                    add: function (test) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'tests', data: test});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'tests'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'tests', data: {testId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'tests', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'tests', data: {id: id}});
                    }
                }
//                /********************************
                ,
                sub_selecs: {
                    add: function (sub_selec) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'sub_selecs', data: sub_selec});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'sub_selecs'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'sub_selecs', data: {sub_selecId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'sub_selecs', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'sub_selecs', data: {id: id}});
                    }


                },
                /**
                 * departments
                 */
                departments: {
                    add: function (department) {
                        return $http.post(api + 'output1.php', {request: 'insert', table: 'departments', data: department});
                    },
                    get: function () {
                        return $http.post(api + 'output1.php', {request: 'all', table: 'departments'});
                    },
                    getRow: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'get_row', table: 'departments', data: {departmentId: id, isDeleted: 0}});
                    },
                    remove: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'delete', table: 'departments', data: {id: id, isDeleted: 0}});
                    },
                    update: function (id) {
                        return  $http.post(api + 'output1.php', {request: 'update', table: 'departments', data: {id: id}});
                    }

                },
                /**
                 * departments
                 */
                grading: function (score) {
                    return {
                        grades: "case WHEN round(" + score + ") >=80 then 'A'" +
                                " WHEN round(" + score + ") >= 75 AND round(" + score + ") < 80 then 'A-'" +
                                " WHEN round(" + score + ") >= 70 AND round(" + score + ") < 75 then 'B+'" +
                                "WHEN round(" + score + ") >= 65 AND round(" + score + ") < 70 then 'B'" +
                                "WHEN round(" + score + ") >= 60 AND round(" + score + ") < 65 then 'B-'" +
                                "WHEN round(" + score + ") >= 55 AND round(" + score + ") < 60 then 'C+'" +
                                "WHEN round(" + score + ") >= 50 AND round(" + score + ") < 55 then 'C'" +
                                "WHEN round(" + score + ") >= 45 AND round(" + score + ") < 50 then 'C-'" +
                                "WHEN round(" + score + ") >= 40 AND round(" + score + ") < 45 then 'D+'" +
                                "WHEN round(" + score + ") >= 35 AND round(" + score + ") < 40 then 'D'" +
                                "WHEN round(" + score + ") >= 30 AND round(" + score + ") < 35 then 'D-'" +
                                "WHEN round(" + score + ") < 30 then 'E'" +
                                "END as grade",
                        points: "case WHEN round(" + score + ") >=80 then '12'" +
                                " WHEN round(" + score + ") >= 75 AND round(" + score + ") < 80 then '11'" +
                                " WHEN round(" + score + ") >= 70 AND round(" + score + ") < 75 then '10'" +
                                "WHEN round(" + score + ") >= 65 AND round(" + score + ") < 70 then '9'" +
                                "WHEN round(" + score + ") >= 60 AND round(" + score + ") < 65 then '8'" +
                                "WHEN round(" + score + ") >= 55 AND round(" + score + ") < 60 then '7'" +
                                "WHEN round(" + score + ") >= 50 AND round(" + score + ") < 55 then '6'" +
                                "WHEN round(" + score + ") >= 45 AND round(" + score + ") < 50 then '5'" +
                                "WHEN round(" + score + ") >= 40 AND round(" + score + ") < 45 then '4'" +
                                "WHEN round(" + score + ") >= 35 AND round(" + score + ") < 40 then '3'" +
                                "WHEN round(" + score + ") >= 30 AND round(" + score + ") < 35 then '2'" +
                                "WHEN round(" + score + ") < 30 then '1'" +
                                "END as points"
                    };




                }

//                /*********************************
            }
        }
    ]);
})(app);
