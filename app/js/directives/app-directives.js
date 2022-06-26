(function (app) {
    var path = paths.url+'app/';

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

