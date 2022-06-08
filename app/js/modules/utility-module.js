var _utility = angular.module('myUtility', []);

_utility.factory('methods', [function () {

        return {
            _elm: function (id) {
                return     document.querySelector('#' + id);
            },
            _ob: {
                getCol: function (ob, col_name) {
                    var d = [];
                    angular.forEach(ob, function (v, k) {
                        if (v.hasOwnProperty(col_name)) {
                            this.push(v[col_name]);
                        }
                    }, d);
                    return d;
                },
                getCols: function (ob, col_names) {
                    var data = [];
                    angular.forEach(col_names, function (col_name, key) {
                        var d = [];
                        angular.forEach(ob, function (v, k) {
                            if (v.hasOwnProperty(col_name)) {
                                this.push(v[col_name]);
                            }
                        }, d);
                        if (!angular.equals(d, [])) {
                            data[col_name] = d;
                        }
                    }, data);

                    return data;
                },
                fetchCols: function (ob, col_names) {
                    var data = [];
                    angular.forEach(ob, function (v, k) {
                        var d = {};
                        angular.forEach(col_names, function (col_name, key) {
                            if (v.hasOwnProperty(col_name)) {
                                d[col_name] = v[col_name];
                            }
                        }, d);
                        if (!angular.equals(d, [])) {
                            data.push(d);
                        }
                    }, data);
                    return data;
                },

                getRow: function (ob, search_ob) {
                    var d = [];
                    angular.forEach(ob, function (v, k) {

//                       if(angular.equals(k,col_name)){
//                           this.push(k+':'+v);
//                       }
                        var col_name = Object.keys(search_ob)[0];
                        var col_val = Object.values(search_ob)[0];
                        if (v.hasOwnProperty(col_name)) {
                            if (angular.equals(v[col_name], col_val)) {
                                this.push(v);
                            }

                        }
                    }, d);
                    return d;
                }
            },
            _array: {
                getCol: function () {

                }
            }
        };
    }]);

_utility.directive("ngUnique", function (checkService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind('blur', function (e) {
                if (!ngModel || !element.val())
                    return;
                var keyProperty = scope.$eval(attrs.ngUnique);
//                console.log(keyProperty);
                var currentValue = element.val();
                checkService.checkUniqueValue(keyProperty.url, keyProperty.table, keyProperty.property, currentValue)
                        .then(function (unique) {
//                            console.log(unique);
//Ensure value that being checked hasn't changed
//since the Ajax call was made
                            if (currentValue == element.val()) {
//                                console.log('unique = ' + unique);
                                ngModel.$setValidity('unique', unique);
//                                scope.$broadcast('show-errors-check-validity');
                            }
                        });
            });
        }
    }
});
//            **********************************************************
_utility.service('checkService', ['$http', function ($http) {

        return {
            checkUniqueValue: function (url, table, property, value) {
                var data = {table: table, property: property, value: value};
                return $http.post(url, data).then(function (res) {
//                    console.log(res);
//                    console.log(res.data);
                    return res.data.isUnique;
                });
            }
        };
    }]);




