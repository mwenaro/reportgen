(function (app) {

//    ******************************************************

    app.controller('adminController', ['dataService', 'authenticationService', function (_data, authenticationService) {
            var adm = this;
            dataIn();
            function dataIn() {
                _data.departments.get().then(function (response) {
                    console.log(response.data);
                });
                _data.teachers.getRow(9).then(function (response) {
                    console.log(response);
                }, function (response) {
                    console.log(response)
                });
            }
        }]);

//**********************************************************

})(app);
