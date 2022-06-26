(function (app) {

//********************************************

    app.factory('appPaths',['PATHS', function (paths) {
       // var ur =paths.api;
        //var paths = {};
        return{
            get: function () {
                alert('in get');
            },
            url: paths.url,
            app: paths.app,
            paths: {
                views: paths.app + 'views/'
            },
            getPath: function (path) {
                return paths.url+ path;
            },
            views: function (view) {
                return paths.app + 'views/' + view + '.php';
            },
            direcs: function (direc) {
                return paths.app + 'directives/' + direc + '_direc_temp.php';
            }

        };
    }]);

    /*<student servive>*/
    app.service('appService', ['$http', 'sharedPeople', '$rootScope','PATHS', function ($http, sharedPeople, $rootScope,paths) {
            mwanzo();
            function mwanzo() {
                setAnangu('rashid , saum, na hussein');
            }
            var anangu;
            var items = {};
            this.people = {};
            this.person = {};
            this.people_data = {};
            this.getAnangu = function () {
                // console.log(anangu);
                return anangu;
            };
            function  setAnangu(atu) {
//                return $http.post(paths.url+'api/output1.php', {request: 'SELECT * FROM forms'}).then(function (response) {
                return $http.post(paths.api+'output1.php', {request: 'SELECT * FROM forms'}).then(function (response) {
                    anangu = response.data;
                    // console.log(response);
                    $rootScope.$broadcast('handleSharedPeople', anangu);
                    return anangu;
                });
//                anangu = atu;
//                console.log(atu + ' from setanagu');
                return anangu;

            }
            ;
            this.setPeople = function (data) {
                console.log(data);
                this.people = data.q1;
                this.people_data = data;
                //console.log(data.q1);
                return    data.q1;
            };
            this.setPerson = function (data) {
                this.person = data;
            };

            /*****************************************************************************************
             *                              Hello there
             ****************************************************************************************/

            this.hello = {};
            this.hello.logPeople = function () {
                alert(sharedPeople.sayHello());
                console.log(sharedPeople.sayHello());
            };

            //Students
            this.students = {};
//            this.students.item=function(d){
//                console.log(d);
//            };

            this.students.getStudent = function () {
                sharedPeople.getItems({request: 'SELECT * FROM students LIMIT 5'}).then(function (response) {
                    items = response;
                    console.log(items);
                    //$rootScope.$broadcast('handleSharedItems', items);
                });

            };
            this.students.getStudents = function () {
                sharedPeople.getItems({request: 'SELECT * FROM students LIMIT 5'}).then(function (data) {
                    items = data;
                    // console.log(items);
                    $rootScope.$broadcast('handleSharedItems', items);
                    return items;
                });
                //console.log(items);
            };

//******************************************************************************
//     THE SCHOOL OBJECT
//*****************************************************************************/

            this.school = {};
            this.school.name = 'This ';
            this.school.level = 'secondary';
            this.school.motto = ' the school motto';
            this.school.mail = 'thissch@xxmail.com';
            this.school.box = ' xxx-code, town ';
            this.school.tel = ' +2547xx-yyyyyy ';
            this.school.isSingle = true;
            this.school.streams = [];
            this.school.gen = 'mixed';
            this.school.isDay = true;
            this.school.setInfo = function (data) {
                var int_vars = ['name', 'level', 'motto', 'mail', 'tel', 'gen', 'isDay'];

                //alert('This is from appService -> school->setInfor');


            };
            /*
             * 
             */

            this.teacher = {};
            this.teacher.teachers = "mwero abdalla";
            //this.teacher.teachers={'name':'mwero'};
            this.teacher.setTeachers = function (v) {
                this.teacher.teachers = v;

            };
            var them;
            this.teacher.getThem = function (request) {
//                return $http.post(paths.url+'api/output1.php', request).then(function (response) {
                return $http.post(paths.api+'output1.php', request).then(function (response) {
                    them = response.data;
                    console.log(response);
                    $rootScope.$broadcast('handleSharedPeople', them);
                    return them;
                });
            };
            this.teacher.getThem = function (request) {
                return $http.post(paths.api+'output1.php', request).then(function (response) {
                    them = response.data;
                    console.log(response);
                    $rootScope.$broadcast('handleSharedPeople', them);
                    return them;
                });
            };
            this.teacher.getAll = function () {
                return $http.post(paths.api+'output1.php', {table: 'teachers', request: 'all'/*,where:{teacherId:9,sub1:'agr'}*/}).then(function (response) {
                    them = response.data;
                    $rootScope.$broadcast('handleSharedPeople', them);
                    return them;
                });
            };
            this.teacher.getRow = function (id) {
                return $http.post(paths.api+'output1.php', {table: 'teachers', request: 'get_row', where: {teacherId: id}}).then(function (response) {
                    them = response.data;
                    $rootScope.$broadcast('handleSharedPeople', them);
                    return them;
                });
            };

            this.teacher.getTeachers = function () {
                // alert('from apS.tr.getTrs ');
                console.log(this.teacher.teachers);
                //return this.teacher.teachers;

            };

            this.subjects = {};
            this.courses = {};
            this.forms = {};
            this.hobbies = {};
            this.forms = {};
            this.forms = {};
            this.forms = {};
            //this.student_query={};
            this.tbl_query = {"request": "SELECT studentId,adm,first_name,middle_name,last_name,gen,form FROM students WHERE isDeleted IS NOT 1"};
            this.row_query = {"request": "SELECT studentId,adm,first_name,middle_name,last_name,gen,form,religion,residence,county,subcounty,ward FROM students WHERE isDeleted IS NOT 1"};
            //this.tbl_query={"request":"SELECT studentId,adm,first_name,middle_name,last_name,gen,form"};
            this.studentV = {};
            this.checkEmpty = function (Ob) {
                var err = [];
                angular.forEach(Ob, function (key, value) {
                    if (value === '' || value === null) {
                        this.push(key + ':' + key + ' filled must be filled!');
                    }


                }, err);
                console.log(err);
                return err;
            };
            this.tbl = "students";
            this.fields = "studentId,first_name,middle_name,last_name,gen,dob,religion,form,adm,residence,county,subcounty,ward";
            this.get_row_req = function (id) {
                return  {'request': 'select', 'fields': this.fields, 'table': 'SELECT * FROM students WHERE isDeleted = 0 AND studentId =' + id + ''};
            };
            //this.getStudent(studentId,first_name,middle_name,last_name,gen,dob,religion,form,adm,residence,county,subcounty,ward);
        }]);
    /*</student servive>*/


    app.factory('sharedPeople', ['$http', '$rootScope','PATHS', function ($http, $rootScope,paths) {
            var people = {};
            var items = {};

            return {
                getPeople: function (request) {
                    return $http.post(paths.api+'output1.php', request/*{'table':'students','request':'all'}*/).then(function (response) {
                        people = response.data;
                        // console.log(response);
                        $rootScope.$broadcast('handleSharedPeople', people);
                        return people;
                    });
                },
                getRow: function () {
                    alert('hello there');
                },
                sayHello: function () {
                    return "Hello Sir";
                },
                savePerson: function (request) {
                    return $http({
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        url: paths.api+'output1.php',
                        method: "POST",
                        data: request,
                    }).then(function (response) {
                        people = response.data;
                        // console.log(people);
                        $rootScope.$broadcast('handleSharedPeople', people);
                    });
                },
                getItems: function (request) {
                    return $http({
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        url:paths.api+'output1.php',
                        method: "POST",
                        data: request,
                    }).then(function (response) {
                        // alert(request);
                        items = response.data.data;
//                        console.log(items);
                        $rootScope.$broadcast('handleSharedItems', items);
                        return items;
                    });
                }
            };
        }
    ]);
})(app);

