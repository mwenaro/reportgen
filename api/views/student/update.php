<?php
    $m = isset($_GET['msg']) ? $_GET['msg'] : '';
    $d = isset($_GET['d']) ? $_GET['d'] : '';
   // var_dump($d);
    
    $msg = isset($this->msg) ? $this->msg : isset($this->data['msg']) ? $this->data['msg'] : $m;
    $flag = isset($this->flag) ? $this->flag : isset($this->data['flag']) ? $this->data['flag'] :false;
    $data =  isset($this->data['data']) ? $this->data['data'] :[];
$s=json_encode($data);


// //var_dump($s);
//    if (!empty($msg)) {
//        echo "<script> alert(\"{$msg}\");</script>";
//        echo "<script> alert(\"{$s}\");</script>";
//    }
//    $msg='';
    ?>
<script>


</script>
<div data-ng-init='<?php // echo "edit.data=".$s.';';?>'>
<div class="row w3-container"  data-ng-controller="dataController" data-ng-init="edit.show = false;<?php echo ($flag?'dit.show=true':'');?>">
    
<!--    <div class="col-lg-5" data-ng-show="edit.show === false">
        <form    class1="w3-form w3-card-4 form"   data-ng-submit="insertFormData({'request':'insert','table':'students','data':fdata})">
            <fieldset class="w3-container">
                <caption class="w3-legend">Add Student</caption><br>

                <?php //include INCLUDES . 'students_form.php'; ?>
                <div class="form-group">
                </div>

                <button type="submit"><span class="fa fa-user-plus"></span>  Add Student</button>
            </fieldset>

        </form>

    </div>-->
    <div class="col-lg-5" data-ng-show="edit.show === true">

        <?php // include INCLUDES.'eddit.php';?>
        <form  method="post" action="<?php echo URL; ?>student/update"data-ng-submit="updateEntry({'request':'update','table':'students','data':edit.data})"
               <!--data-ng-submit="updateEntry({'request':'update','table':'students','data':edit.data})"  >-->

               <h3 class="center">Edit & Update Student Info </h3>
            <div class="form-group">Student Name:{{edit.data.name}}</div>

            <!--// A hidden filled---->
            <input type="hidden" value="{{edit.data.studentId}}" name="studentId"/>

            <div class="form-group">
                <label>ADM NO</label>
                <input type="text"  disabled class="w3-input" name="adm" id="adm" data-ng-model="edit.data.adm" >

            </div>
            <div class="form-group">
                <label>First Name :</label>
                <input type="text" class="w3-input"  name="first_name" data-ng-model="edit.data.first_name" required ></div>
            <div class="form-group">
                <label>Middle Name :</label>
                <!--<input type="text" class="w3-input" name="middle_name" id="mname" value="{{edit.data.middle_name}}"   required data-ng-model="form.data.middle_name">-->
                <input type="text" class="w3-input" name="middle_name" id="mname" data-ng-model="edit.data.middle_name"   >
            </div>
            <div class="form-group">
                <label>Surname:</label>
                <input type="text" class="w3-input" name="last_name" id="lname" data-ng-model="edit.data.last_name" required >
            </div>
            <div class="form-group"> <label>Form</label>
                <select required name="form" class="w3-select" data-ng-model="edit.data.form">
                    <option >--Select Form --</option>
                    <option value="1">Form 1</option>
                    <option value="2">Form 2</option>
                    <option value="3">Form 3</option>
                    <option value="4">Form 4</option>
                </select>

            </div>

            <div class="form-group">
                <label>Gender</label><br>
                <input type="radio" data-ng-model="edit.data.gen" name="gen" value="f" > <span>Female</span>
                <input type="radio" data-ng-model="edit.data.gen" name="gen" value="m" > <span>Male</span>

            </div>

            <div class="form-group">

                <label>Date of Birth</label>
                <input  name="dob" id="dob" required data-ng-model="edit.data.dob" > {{edit.data.dob}}
            </div>
            <div class="form-group">

                <input type="text"  class="w3-input" name="residence" id="residence"  placeholder="Residence" required data-ng-model="edit.data.residence">
            </div>
            <div class="form-group">
                <!--<label>Student Form</label>-->
                <label>Religion</label>
                <select required name="religion" class="w3-select" data-ng-model="edit.data.religion">
                    <option >--Select Your Religion --</option>
                    <option value="c">Christianity</option>
                    <option value="i">Islam</option>
                </select>

            </div>

            <div class="form-group">
                <label>County</label>
                <input type="text"  class="w3-input" name="county" id="county" data-ng-model="edit.data.county" >

            </div>
            <div class="form-group">
                <label>Sub County</label>
                <input type="text"  class="w3-input" name="subcounty" id="subcounty" data-ng-model="edit.data.subcounty" >

            </div>
            <div class="form-group">
                <label>Ward</label>
                <input type="text"  class="w3-input" name="ward" id="ward" data-ng-model="edit.data.ward" >

            </div>


            <button type="submit" class="btn btn-primary" ><span class="fa fa-user"></span> Update User Info</button>
        </form>



    </div>
<!--    <div class="col-lg-7 " data-ng-show="edit.show === false">
        <table cliass="w3-table-all  w3-responsive" class="table table-condensed table-bordered table-hover table-responsive table-striped" data-ng-init=''  >
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
            <tbody data-ng-init="getData({'request':'SELECT * FROM students WHERE isDeleted IS 0','table':'students'})">

                <tr data-ng-repeat="student in data.q1">
                    <td style="display: none" data-ng-init='id = student.studentId'>{{student.studentId}}</td>
                    <td>{{student.adm}}</td>
                    <td style="text-align: left;">{{student.name}}</td>
                    <td style="text-align: left;">{{student.first_name}}</td>
                    <td style="text-align: left;">{{student.last_name}}</td>
                    <td style="text-align: left;">{{student.middle_name}}</td>
                    <td>{{student.form}}</td>
                    <td>{{student.gen}}</td>

                    <td><button class="btn btn-primary" data-ng-click="editEntry({'update':{'request':'SELECT * FROM students WHERE isDeleted IS 0', 'table':'students'}, 'id':id, 'table':'students', 'request':'get_row'})"><span class="fa fa-edit"></span>Edit</button></td>
                    <td><button class="btn btn-danger" data-ng-click="deleteEntry({'update':{'request':'SELECT * FROM students WHERE isDeleted IS 0', 'table':'students'}, 'id':id, 'table':'students', 'request':'delete', 'data':{'isDeleted':1}})"><span class="fa fa-remove"></span>Delete</button></td>
                    <td><a class="btn btn-danger" href="<?php echo URL; ?>student/delete/?studentId={{id}}"><span class="fa fa-remove"></span>Delete Mnual</a></td>
                </tr>

            </tbody>
        </table>
    </div>-->
</div>
</div>
