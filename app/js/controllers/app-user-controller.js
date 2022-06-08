/*var app = angular.module('myApp', []);*/
(function (app) {

//    <************************* reportController  ***********************>
    app.controller('userController', ['authenticationService', '$state', 'dataService', function (authenticationService, $state, _data) {
            var user = this;
            if (authenticationService.checkLogin() !== true) {
                $state.go('login');
            }
            user.$onInit = function () {
//                console.log('inside init');


            };
//            console.log('local storage => ' + authenticationService.login.getUserId());
            user.userId = $state.params.userId || authenticationService.login.getUserId();
            user.user = {};
            _data.teachers.getRow(user.userId).then(function (res) {
//                console.log(res.data);

                if (res.data) {
//                    setInterval(function(){
                    user.user = res.data.data;
//                    console.log();
//                    },2000);
                }
            });
//            _data.teachers.get().then(function (res) {
//                console.log(res.data);
//
//            });
            user.data = {role: 'hacker', username: 'mdroaer', userId: 12409};

        }]);


//</************************* reportController  ***********************>

})(app);







