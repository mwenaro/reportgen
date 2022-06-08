//var r="[{'id':1,'name':'mwero','age':30},{'id':2,'name':'rashid','age':4},{'id':3,'name':'saum','age':3}{'id':4,'name':'hussein','age':1},{'id':5,'name':'mlongo','age':3},{'id':6,'name':'nyawa','age':1},{'id':7,'name':'konza','age':40}]";
$(document).ready(function () {
    function q_postForm(id) {

        // alert('submited');
        var d = $(id).serializeArray();

        var k = d.toJson();
        console.log(d);
        $.post(
                'http://127.0.0.1:7173/api/login.php',
                {'': d},
                function (data) {
                    console.log(data);
                });


//  var data;
//  $(this).submit(function(){
//      console.log(this.data);
//  });
    }



//    var lgn = {};
    hideError = function (id='') {
        //alert('Hello');
       // $(id).css({'background': 'red'});
    };

});

$(document).ready(function () {

    $('#login_field').focus(function () {
        alert('Hello');
        console.log('hello');

    });
});