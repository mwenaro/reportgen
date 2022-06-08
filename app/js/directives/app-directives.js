(function (app) {
    var path = 'http://127.0.0.1:7173/app/';

    app.direcive('popUpForm', [function () {

        }]);
    app.directive('fruitBase', function () {
        return {
            restrict: 'AE',
            scope: {
                data: '='
            },
            templateUrl: path + '/views/direcs/fbase.php',
            link:function(){
                console.log('form directive');
            }
        };
    });
    
})(app);

