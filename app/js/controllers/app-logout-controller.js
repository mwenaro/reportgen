(function (app) {

//     **************************************************************

    app.controller('logoutController', ['authenticationService',  function (as) {
            var vm=this;
            //            console.log(as.login.getUserId());
            as.logout();
        }]);

//**********************************************************************

})(app);

