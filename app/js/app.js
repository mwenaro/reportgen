var app = angular.module('myApp', ['ui.router', 'ngStorage','ngResource', 'myUtility']);
(function (app) {
var myurl = location.protocol+'//'+location.hostname+':'+location.port+'/';


//< *********************** PATHS   ********************* >
app.constant('url',myurl);

app.constant('PATHS', {
	api: myurl+'api/',
        app:myurl+'app/',
        url: myurl
    });
// </ *********************** PATHS   ********************* >

//< *********************** GRADE   ********************* >
    app.constant('GRADING', {
        grade: ",case WHEN round(marks.score) >=80 then 'A'" +
                " WHEN round(marks.score) >= 75 AND round(marks.score) < 80 then 'A-'" +
                " WHEN round(marks.score) >= 70 AND round(marks.score) < 75 then 'B+'" +
                "WHEN round(marks.score) >= 65 AND round(marks.score) < 70 then 'B'" +
                "WHEN round(marks.score) >= 60 AND round(marks.score) < 65 then 'B-'" +
                "WHEN round(marks.score) >= 55 AND round(marks.score) < 60 then 'C+'" +
                "WHEN round(marks.score) >= 50 AND round(marks.score) < 55 then 'C'" +
                "WHEN round(marks.score) >= 45 AND round(marks.score) < 50 then 'C-'" +
                "WHEN round(marks.score) >= 40 AND round(marks.score) < 45 then 'D+'" +
                "WHEN round(marks.score) >= 35 AND round(marks.score) < 40 then 'D'" +
                "WHEN round(marks.score) >= 30 AND round(marks.score) < 35 then 'D-'" +
                "WHEN round(marks.score) < 30 then 'E'" +
                "END as grade",
        points: ",case WHEN round(marks.score) >=80 then '12'" +
                " WHEN round(marks.score) >= 75 AND round(marks.score) < 80 then '11'" +
                " WHEN round(marks.score) >= 70 AND round(marks.score) < 75 then '10'" +
                "WHEN round(marks.score) >= 65 AND round(marks.score) < 70 then '9'" +
                "WHEN round(marks.score) >= 60 AND round(marks.score) < 65 then '8'" +
                "WHEN round(marks.score) >= 55 AND round(marks.score) < 60 then '7'" +
                "WHEN round(marks.score) >= 50 AND round(marks.score) < 55 then '6'" +
                "WHEN round(marks.score) >= 45 AND round(marks.score) < 50 then '5'" +
                "WHEN round(marks.score) >= 40 AND round(marks.score) < 45 then '4'" +
                "WHEN round(marks.score) >= 35 AND round(marks.score) < 40 then '3'" +
                "WHEN round(marks.score) >= 30 AND round(marks.score) < 35 then '2'" +
                "WHEN round(marks.score) < 30 then '1'" +
                "END as points"
    });
// </ *********************** GRADE  ********************* >



})(app);

