(function(app){
   var myurl = location.protocol+'//'+location.hostname+':'+location.port+'/';
   app.component('user',{
//       template:"<div class='w3-red'>Hello I'm user component</div>",
       templateUrl:myurl+'app/components/user/user-view.php',
       controller:'user',
       controllerAs:'user'
          }); 
})(app);


