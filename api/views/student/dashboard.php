<?php
$m = isset($_GET['msg']) ? $_GET['msg'] : '';
$msg = isset($this->msg) ? $this->msg : $m;
?>

<form action="<?php echo URL . 'student/addStudent'; ?>" method="post"  class="w3-form w3-card-4 " style="width: 100%">
    <fieldset w3-container>

        <caption class="w3-legend">Add Student</caption><br><br>

        <?php include INCLUDES . 'students_form.php'; ?>
        <br><br>
        <button class="w3-btn w3-red" required type="submit">Add Student</button>
        <br>

        <p style= "color:green;background:inherit" > <?php echo $msg; ?></p>
    </fieldset>
</form>

      
     <table class="w3-table-all w3-card-2 w3-responsive" ng-app="" ng-init='' ng-controller="dataController" >
    <thead>
        <tr>
            <th style="display: none">id</th>
            <th>Adm No</th>
             <th>Student Name</th>
            <th>Form</th>
            <th>Gender</th>
            <th colspan="2">Operation{{$scope.name}}</th>
           

        </tr>
    </thead>
    <tbody ng-init='getData("request=SELECT * FROM students WHERE isdeleted =0 ")' >
    <input class="txtmsg" type="hidden" ng-bind="msg" value="msg">
   
        <tr ng-repeat="student in data.q1">
            <td style="display: none" ng-init='id = student.studentId'>{{student.studentId}}</td>
            <td>{{student.adm}}</td>
            <td>{{student.first_name|uppercase}} {{student.middle_name|uppercase}} {{student.last_name|uppercase}}</td>
            <td>{{student.formId}}</td>
            <td>{{student.gen|uppercase}}</td>

            <td style="margin-left: 140px;"><a href="<?php echo URL . "student/edditStudent?studentId="; ?>{{id}}">Eddit</a></td>
            <td><a href="<?php echo URL . "student/deleteStudent?studentId="; ?>{{id}}">Delete</a></td>
        </tr>
        <button id="tbn"  class="w3-btn w3-green" ng-click="$scope.msg='Hello There'">Change Message</button>
    </tbody>
</table>


   