<?php
$m = isset($_GET['msg']) ? $_GET['msg'] : '';
$msg = isset($this->msg) ? $this->msg : $m;
?>
<div class="row"  ng-controller="dataController">
    <div class="col-ms-5">
        <form    class1="w3-form w3-card-4 " ng-submit="sendFormData(form)">
            <fieldset class="w3-container">
                <caption class="w3-legend">Add Student</caption><br>

                <?php include INCLUDES . 'students_form.php'; ?>
                <p>
                    <button class="w3-btn w3-red" required type="submit"><span class="glyphicon glyphicon-user">Add Student</span></button>
                </p>

                <p style= "color:green;background:inherit" > <?php echo $msg; ?></p>
            </fieldset>
        </form>
    </div>
    <div class="col-ms-7">
        <table clasis="w3-table-all w3-card-2 w3-responsive" ng-app="" ng-init=''  >
            <thead>
                <tr>
                    <th style="display: none">id</th>
                    <th>Adm No</th>
                    <th>First Name</th>
                    <th>Surname</th>
                    <th>Other Name</th>
                    <th>Form</th>
                    <th>Gender</th>
                    <th>Edit</th>
                    <th>Delete</th>

                </tr>
            </thead>
            <tbody ng-init='getData("request=SELECT * FROM students WHERE isDeleted =0")'>

                <tr ng-repeat="student in data.q1">
                    <td style="display: none" ng-init='id = student.studentId'>{{student.studentId}}</td>
                    <td>{{student.adm}}</td>
                    <td>{{student.first_name}}</td>
                    <td>{{student.lName}}</td>
                    <td>{{student.middle_name}}</td>
                    <td>{{student.form}}</td>
                    <td>{{student.gen}}</td>

                    <td style="margin-left: 140px;"><a href="<?php echo URL . "student/edditStudent?studentId="; ?>{{id}">Eddit</a></td>
                                < td > < a href = "<?php echo URL . "student/deleteStudent?studentId="; ?>{{id}}">Delete</a></td>
                </tr>

            </tbody>
        </table>
    </div>
</div>
