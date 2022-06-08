//************************************************************************

    app.service('pathGen', ['$interpolate', function (i) {
            return {
                _url: function (path, ob) {
                    var url = '';
                    var _i = 0;
                    for (_i = 0; _i < Object.keys(ob).length; _i++) {
                        var p = Object.keys(ob)[_i];
                        url += ''.concat('/{{', p, '}}');
                    }
                    return i(path + url)(ob);
                }
            };
        }]);
//    *******************************************************************************
