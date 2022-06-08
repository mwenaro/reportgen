<?php
$m = isset($_GET['msg']) ? $_GET['msg'] : '';
$msg = isset($this->msg) ? $this->msg : $m;
?>
<div class="row"  ng-controller="dataController" ng-init="edit.show=false;">
    <div class="col-lg-5" ng-show="edit.show===false">
        <form    class1="w3-form w3-card-4 form"   ng-submit="insertFormData({'request':'insert','table':'students','data':fdata})">
            <fieldset class="w3-container">
                <caption class="w3-legend">Add Student</caption><br>

                <?php include INCLUDES.'students_form.php';?>
                <p>
                </p>

                <button type="submit"><span class="fa fa-user-plus"></span>  Add Student</button>
            </fieldset>
            
        </form>
        
    </div>
    <div class="col-lg-5" >
                
<?php // include INCLUDES.'eddit.php';?>
        <form   ng-submit="updateFormData(edit)"  >
    
    <h3 class="center">Edit Student Info </h3>
    <p>
        <label>First Name :</label>
        <input type="text" class="w3-input"   ng-model="edit.data.first_name" required ></p>
<p>
    <label>Middle Name :</label>
    <!--<input type="text" class="w3-input" name="middle_name" id="mname" value="{{edit.data.middle_name}}"   required ng-model="form.data.middle_name">-->
    <input type="text" class="w3-input" name="middle_name" id="mname" value="{{edit.data.first_name}}"   >
</p>
<p>
    <label>Surname:</label>
    <input type="text" class="w3-input" name="last_name" id="lname" value="{{edit.data.last_name}}" required >
</p>

<p>
    <label>Gender</label><br>
<input type="radio" name="gen" value="f" > <span>Female</span>
<input type="radio" name="gen" value="m" > <span>Male</span>
<!--<select name="gen" class="w3-select " required ng-model="form.data.gen">
    <option >--Select--</option>
    <option value="m"> Male</option>
    <option value="f">Female</option>
</select><br-->
</p>
<p>
    <label>Date of Birth</label>
    <input type="date" name="dob" id="dob" required  value="{{edit.data.dob}}">
</p>
<p>
    
    <input type="text"  class="w3-input" name="residence" id="residence"  placeholder="Residence" required value="{{edit.data.residence}}">
</p>
<p>
<!--<label>Student Form</label>-->
 <label>Religion</label>
<select required name="religion" class="w3-select" value="{{edit.data.religion}}">
    <option >--Select Your Religion --</option>
    <option value="c">Christianity</option>
    <option value="i">Islam</option>
    </select>

</p>
<p> <label>Form</label>
    <input type="number" min="1" max="4" class="w3-input" name="form" value="{{edit.data.form}}">
    
</p>
<p>
    <label>ADM NO</label>
    <input type="number" min="1" class="w3-input" name="adm" id="lname"  value="{{edit.data.adm}}">

</p>


</form>
                              
           
             
    </div>
    <div class="col-lg-7" ng-show="edit.show===false">
        <table clasis="w3-table-all w3-card-2 w3-responsive"  ng-init=''  >
            <thead>
                <tr>
                    <th style="display: none">id</th>
                    <th>Adm No</th>
                     <th>Name</th>
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
                    <td>{{student.name}}</td>
                    <td>{{student.first_name}}</td>
                    <td>{{student.last_name}}</td>
                    <td>{{student.middle_name}}</td>
                    <td>{{student.form}}</td>
                    <td>{{student.gen}}</td>

                   <td><button class="w3-btn w3-round w3-yellow" ng-click="editEntry({'id':id,'table':'students','request':'get_row'})"><span class="fa fa-edit"></span>Edit</button></td>
                   <td><button class="w3-btn w3-round w3-red" ng-click="deleteEntry({id})"><span class="fa fa-remove"></span>Delete</button></td>
                </tr>

            </tbody>
        </table>
    </div>
</div>
