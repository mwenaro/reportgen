<!--/**********************************************************************************************
                                    add/remove page
**********************************************************************************************/-->

<div class="w3-teal panel w3-center" style="margin:0px 0px 3px 0px;">
    <h4>Manage Student</h4>
</div>
<div class="w3-card col-lg-5" data-ng-init="req = editPersonActive ? 'update' : 'insert'">
    <div style="height:35px;overflow: hidden" > <h4 ng-if="editPersonActive === false" class="w3-center "> <span class="">Add Student</span></h4>
             <!--<caption class="w3-legend" ng-if="true">Add true</caption>-->
        <h4 ng-if="editPersonActive === true" class="w3-center"><span  class="">Eddit Student Info</span></h4>
    </div>
    <form    class="w3-form"   >
        <fieldset class="w3-container" >

<!--<caption class="w3-legend" data-ng-if="editPersonActive===true">Add Student</caption>-->


            <!--/**************************************************************
                                          add/edit form
            **********************************************/-->
            <!--            <form    data-ng-submit="updateEntry({'request':'update','table':'students','data':person})">-->
            
            
            <!--data-ng-submit="updateEntry({'request':'update','table':'students','data':person})"  >-->


            <div class="form-group" data-ng-if="editPersonActive === true">Student Name:{{person.name}}</div>

            <!--// A hidden filled---->
            
            <p data-ng-if="editPersonActive === true">  <input type="hidden" value="{{person.studentId}}" name="studentId"/></p>

            <div class="form-group" style="margin-top:2px">
                <label>ADM NO</label>
                <p><input type="text" data-ng-if="editPersonActive === true" disabled class="w3-input" name="adm" id="adm" data-ng-model="person.adm" ></p>
                <p><input type="text" data-ng-if="editPersonActive === false"  class="w3-input" name="adm" id="adm" data-ng-model="person.adm" ></p>

            </div>
            <div class="form-group">
                <label>First Name :</label>
                <input type="text" class="w3-input"  name="first_name" data-ng-model="person.first_name" required ></div>
            <div class="form-group">
                <label>Middle Name :</label>
                <!--<input type="text" class="w3-input" name="middle_name" id="mname" value="{{person.middle_name}}"   required data-ng-model="form.data.middle_name">-->
                <input type="text" class="w3-input" name="middle_name" id="mname" data-ng-model="person.middle_name"   >
            </div>
            <div class="form-group">
                <label>Surname:</label>
                <input type="text" class="w3-input" name="last_name" id="lname" data-ng-model="person.last_name" required >
            </div>
            <div class="form-group"> <label>Form</label>
                <select required name="form" class="w3-select" data-ng-model="person.form">
                    <option data-ng-disabled value="">--Select Form --</option>
                    <option value="1">Form 1</option>
                    <option value="2">Form 2</option>
                    <option value="3">Form 3</option>
                    <option value="4">Form 4</option>
                </select>

            </div>

            <div class="form-group">
                <label>Gender</label><br>
                <input  type="radio" data-ng-model="person.gen" name="gen" value="f" > <span>Female</span>
                <input  type="radio" data-ng-model="person.gen" name="gen" value="m" > <span>Male</span>

            </div>
            <div class="form-group">
                <label>Status</label><br>
                <input  type="radio" data-ng-model="person.active" name="active" value="1" ng-checked> <span>Active</span>
                <input  type="radio" data-ng-model="person.active" name="active" value="0" > <span>Not Active</span>

            </div>

            <div class="form-group">

                <label>Date of Birth</label>
                <input type="text" name="dob" id="dob" placeholder="yyyy/mm/dd"required data-ng-model="person.dob" > {{person.dob}}
            </div>
            <div class="form-group">

                <input type="text"  class="w3-input" name="residence" id="residence"  placeholder="Residence" required data-ng-model="person.residence">
            </div>
            <div class="form-group">
                <!--<label>Student Form</label>-->
                <label>Religion</label>
                <select required name="religion" class="w3-select" data-ng-model="person.religion">
                    <option data-ng-disabled value="">--Select Your Religion --</option>
                    <option value="c">Christianity</option>
                    <option value="i">Islam</option>
                </select>

            </div>
            <div class="form-group">
                <label>County</label>
                <input type="text"  class="w3-input" name="county" id="county" data-ng-model="person.county" >

            </div>
            <div class="form-group">
                <label>Sub County</label>
                <input type="text"  class="w3-input" name="subcounty" id="subcounty" data-ng-model="person.subcounty" >

            </div>
            <div class="form-group">
                <label>Ward</label>
                <input type="text"  class="w3-input" name="ward" id="ward" data-ng-model="person.ward" >

            </div>

            <div class="form-group">
                <!--<p ng-if="editPersonActive === false"><button data-ng-click="insertFormData({'request':'insert','table':app_page,'data':person})" type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Student</button></p>-->
                <p ng-if="editPersonActive === false"><button data-ng-click="addPerson()" type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Student</button></p>
                <p ng-if="editPersonActive === true"> <button data-ng-click="updateEntry()"type="submit" class="btn w3-blue" ><span class="fa fa-user"></span>  Update Info</button></p>
            </div>
        </fieldset>
    </form>
</div>

<!--<data-ng-include src="'http://127.0.0.1:7173/views/includes/students_form.php'"></data-ng-include>-->
<!--/****************************************************************************************************************/-->


<div class="col-lg-7 w3-card">
    <div class="w3-row" style="height:35px;overflow: hidden">
        <h4 class="w3-half w3-center">Student List</h4>
        <div class="w3-half">
            <p>
                <label>Select Form  </label> 
                <select class="" data-ng-model="formFilter" selected='1'>
                    <option value="">all</option>
                    <option value="1">Form 1</option>
                    <option value="2">Form 2</option>
                    <option value="3">Form 3</option>
                    <option value="4">Form 4</option>
                </select>
            </p>
        </div> 
    </div>

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
        <tbody data-ng-init="getData({'request': 'all', 'table':app_page})">
        <!--<tbody data-ng-init="getData({'request': 'all', 'table':app_page})">-->

            <tr data-ng-repeat="student in data.q1|orderBy:['form','adm']|filter:{'form':formFilter}">
                <td style="display: none" data-ng-init='id = student.studentId'>{{student.studentId}}</td>
                <td>{{student.adm}}</td>
                <td style="text-align: left;">{{student.name|uppercase}}</td>
                <td style="text-align: left;">{{student.first_name|uppercase}}</td>
                <td style="text-align: left;">{{student.last_name|uppercase}}</td>
                <td style="text-align: left;">{{student.middle_name|uppercase}}</td>
                <td>{{student.form}}</td>
                <td >{{student.gen|uppercase}}</td>
                <!--<td><button class="btn btn-primary" data-ng-click="getRow({'UPDATE':{'request':'SELECT * FROM students WHERE isDeleted IS 0', 'table':app_page}, 'id':id, 'table':app_page, 'request':'get_row'})"><span class="fa fa-edit"></span>Edit</button></td>-->
                <!--<td><button class="btn btn-primary" data-ng-click="getRow(id)"><span class="fa fa-edit"></span>Edit</button></td>-->
                <td><button class="btn btn-primary" data-ng-click="getPerson(id)"><span class="fa fa-edit"></span>Edit</button></td>
                <td><button class="btn btn-danger myBtn" id="myBtn" data-ng-click="removePerson(id)"><span class="fa fa-trash"></span>Delete</button></td>
            </tr>
        </tbody>
    </table>
</div>

</div> 

<!--/**********************************************************************************************
            End of               add/remove page
**********************************************************************************************/-->