<h3>This is the try page</h3>

<form name="try" onsubmit="return false;" method="POST" ng-controller="dataController">
    <p>Name: <input type="text" name="name" value="" ng-model="name"/></p>
    <p>
        Age:   <input type="text" name="age" value="" ng-model="age" ng-blur="getData({'name':name,'age':age})"/>
    </p>
    <p>Here is name:{{name}} and age {{age}}</p>
    <button ng-click="getData({'name':name,'age':age})">Button</button>

</form>
<script>
    
    
   </script>
   