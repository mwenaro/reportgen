app.factory('sessionService', ['$sessionStorage', 'PATHS', '$http', function (sessionStorage, paths, h) {
        
        return {
            setUser: function (user) {
                sessionStorage.user = user;
                sessionStorage.user.userId =user.userId;
                sessionStorage.islogged = true;
            },
            setUserId: function (userId) {
                sessionStorage.userId = userId;
                sessionStorage.islogged = true;

            },
            checkLogin: function () {
                return sessionStorage.islogged;
            },

            getUserId: function () {
                return sessionStorage.userId;
            },

            getUser: function () {
                return  sessionStorage.user;
            },
            destroy: function () {
                h.post(paths.url + 'login/logout', {request: 'logout'}).then(function(res){
                   
                    if(!res.data){
                        console.log(res); 
                    }else{
                     h.post(paths.url+'login/isLoggedIn').then(function(res){
                    console.log(res.data);
                });
            }
                });
               
                sessionStorage.$reset();
                
            }

        };
    }]);




