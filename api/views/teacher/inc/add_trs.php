<!--**********************************************************************************************
                         add/remove page
**********************************************************************************************-->

<div class="w3-teal panel w3-center" style="margin:0px 0px 3px 0px;" >
    <h4>Manage Teachers</h4>
</div>
<div class="w3-card col-lg-5" data-ng-init="
    "   >
    <div style="height:35px;overflow: hidden" >
        <h4 ng-if="editPersonActive === false" class="w3-center "> <span class="">Add Teacher</span></h4>
        <h4 ng-if="editPersonActive === true" class="w3-center"><span  class="">Edit Teacher Info</span></h4>
    </div>
    <form    class="w3-form"  >
        <fieldset class="w3-container" >

            <!--/**************************************************************
                                          add/edit form
            -**********************************************/-->

            <!--            <div class="form-group row" data-ng-if="editPersonActive === true"></div>-->


            <p ng-if="editPersonActive === true" ><input type="hidden" value="{{person.teacherId}}" name="teacherId"/></p>

            <div class="form-group  row" style="margin-top:2px">
                <label class='w3-label  col-lg-6 col-md-6'  >Staff Romm Code</label>
                <p ng-if="editPersonActive === false" class="col-lg-6 col-md-6"><input placeholder="Staff Romm Code" type="numbert" class="w3-input" name="staff_code" id="teacher_code" data-ng-model="person.staff_code" required></p>
                <p  ng-if="editPersonActive === true" class="col-lg-6 col-md-6"><input placeholder="Staff Romm Code" type="text" class="w3-input" name="staff_code" id="teacher_code" data-ng-model="person.staff_code" required></p>

            </div>
            <div class="form-group row">
                <label class='w3-label col-lg-6 col-md-6'  >First Name :</label>
                <input class="col-lg-6 col-md-6"  placeholder="First Name" type="text" class="w3-input"  name="first_name" data-ng-model="person.first_name" required >
            </div>
            <!--                <div class="form-group row">
                               <label class='w3-label col-lg-6 col-md-6' >Middle Name :</label>
                                <input type="text" class="w3-input" name="middle_name" id="mname" value="{{person.middle_name}}"   required data-ng-model="person.middle_name">
                                <input type="text" class="w3-input" name="middle_name" id="mname" data-ng-model="person.middle_name"   >
                            </div>-->
            <div class="form-group row">
                <label class='w3-label col-lg-6 col-md-6'  >Last Name:</label>
                <input class="col-lg-6 col-md-6" placeholder="Last Name" type="text" class="w3-input" name="last_name" id="lname" data-ng-model="person.last_name" required >
            </div>

            <div class="form-group row">
                <label class='w3-label col-lg-6 col-md-6'  >Title</label> 
                <select class="col-lg-6 col-md-6" required name="title" class="w3-select" data-ng-model="person.title">
                    <option value="" selected disabled>--Select Title --</option>
                    <option value="mr">Mr</option>
                    <option value="md">Madam</option>
                    <option value="mrs">Mrs</option>
                    <option value="ms">Ms</option>
                </select>
            </div>
            <!--                <div class="form-group row">
                               <label class='w3-label col-lg-6 col-md-6' >Common Name</label> <small style="opacity: .9;font-weight: normal">(i.e A name used optenly e.g. Mr. Mwero, Mwero is the common name)</small>
                                <input type="text" class="w3-input" name="common_name" id="cname" data-ng-model="person.common_name" required >
                            </div>-->

            <div class="form-group row"><label class='w3-label col-lg-6 col-md-6'  >Teacher Type <small>i.e. tsc, bom etc</small></label>
                <select class="col-lg-6 col-md-6" required name="type" class="w3-select " data-ng-model="person.type" >
                    <option value="" selected disabled>--Select Type --</option>
                    <option value="tsc">TSC</option>
                    <option value="bom">BOM</option>
                    <option value="tp">TP</option>
                </select>

            </div>

            <div class="form-group row">
                <label class='w3-label col-lg-6 col-md-6'  >Gender</label>
                <p class="col-lg-6 col-md-6">
                    <input class="w3-radio" type="radio" data-ng-model="person.gen" name="gen" value="f" > <span>Female</span>
                    <input class=" w3-radio" type="radio" data-ng-model="person.gen" name="gen" value="m" > <span>Male</span>
                </p>
            </div>

            <!--                <div class="form-group row">
            
                               <label class='w3-label col-lg-6 col-md-6' >Date of Birth</label>
                                <input type="text" name="dob" id="dob" placeholder="yyyy/mm/dd"required data-ng-model="person.dob" > {{person.dob}}
                            </div>-->
            <div class="form-group row">
                <label class='w3-label col-lg-6 col-md-6'  >Mobile</label>
                <input class="col-lg-6 col-md-6" type="tel" placeholder="Phone Number" class="w3-input " name="phone" id="mobile"  placeholder="Phone" required data-ng-model="person.phone">
            </div>
            <!--                <div class="form-group row">
                               <label class='w3-label col-lg-6 col-md-6' >Religion</label>
                                <select required name="religion" class="w3-select" data-ng-model="person.religion">
                                    <option >--Select Your Religion --</option>
                                    <option value="c">Christianity</option>
                                    <option value="i">Islam</option>
                                </select>
                            </div>-->

            <div class="form-group row">
                <h5 class="w3-center">Subject Sombination</h5>

                <p class="col-md-6">
                    <label class='w3-label ' >Subject 1</label>
                    <select required name="sub1" class="w3-select" data-ng-model="person.sub1">
                        <option value="" data-ng-disabled>--Select Subject 1--</option>
                        <option ng-repeat="sub in subs|orderBy:'name'" value="{{sub.short_name}}">{{sub.name|uppercase}}</option>
                    </select>
                </p>

                <p class="col-md-6">
                    <label class='w3-label' >Subject 2</label>
                    <select name="sub2" class="w3-select" data-ng-model="person.sub2">
                        <option value="">--Select Subject 2--</option>
                         <option ng-repeat="sub in subs|orderBy:'name'" value="{{sub.short_name}}">{{sub.short_name==='eng'?'ENG LIT':sub.name|uppercase}}</option>
                    </select>
                </p>
            </div>


            <div class="form-group " ng-if="editPersonActive===false">
                <p class="row">
                <label class='w3-label col-lg-6 col-md-6'  >Passward</label>
                <input class="col-lg-6 col-md-6" type="password"  class="w3-input " name="password" id="password" data-ng-model="person.password" >
                </p>
                <!--/********************************************************************************************************************************************************/-->
                 <p class="row">
                <label class='w3-label col-lg-6 col-md-6'  >Confirm Password</label>
               
                <input class="col-lg-6 col-md-6" type="password"  class="w3-input " name="password1" id="password1" data-ng-model="person.password_confirm" >
               </p>
            </div>

            <div class="form-group row">
                <!--<p ng-if="editPersonActive === false"><button data-ng-click="insertFormData({'request':'insert','table':app_page,'data':person})" type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Teacher</button></p>-->
                <p ng-if="editPersonActive === false"><button data-ng-click="addTeacher(person)" type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Teacher</button></p>
                <p ng-if="editPersonActive === true"> <button data-ng-click="updateEntry(person)" type="submit" class="btn w3-blue" ><span class="fa fa-user"></span>  Update Info</button></p>
            </div>
        </fieldset>
    </form>
</div>

<!--<data-ng-include src="'http://127.0.0.1:7173/views/includes/teachers_form.php'"></data-ng-include>-->
<!--/****************************************************************************************************************/-->


<div class="col-lg-7 w3-card">
     <div class="w3-row" style="height:35px;overflow: hidden" data-ng-init="typeFilter = teacher.type">
        <h4 class="w3-half w3-center">Teachers' List</h4>
        <div class="w3-half">
            <p>
                <label>Select Type  </label> 
                 <select  data-ng-model="typeFilter">
                    <option value="" >all</option>
                    <option value="bom">BOM</option>
                    <option value="tsc">TSC</option>
                    <option value="tp">TP</option>

                </select>
            </p>
        </div> 
    </div>
   
    <table  class="table table-condensed table-bordered table-hover table-responsive table-striped" >
        <thead>
            <tr>
                <th style="display: none">id</th>
                <th>Staff Code</th>
                <th>Title</th>
                <th>Name</th>
                <th>Teacher Type</th>
                <th>T/Combination</th>
                <th>Edit</th>
                <th>Delete</th>

            </tr>
        </thead>
        <!--<tbody data-ng-init="getData({'request': 'all', 'table':app_page,orderBy:'staff_code'});">-->
        <tbody data-ng-init="getData()">
            <tr data-ng-repeat="teacher in data|filter:{'type':typeFilter}">
            
                <td style="display: none" data-ng-init='id = teacher.teacherId; sep = (!teacher.sub2 == null || !teacher.sub2 == "")?"/":""'>{{teacher.teacherId}}</td>
                <td>{{teacher.staff_code}}</td>
                <td style="text-align: left;">{{teacher.title|uppercase}}</td>
                <td style="text-align: left;">{{teacher.first_name|uppercase}}  {{teacher.last_name|uppercase}}</td>
                <td >{{teacher.type|uppercase}}</td>
                <td >{{teacher.sub1|uppercase}}{{sep}}{{teacher.sub2==='eng'?'ENG LIT':teacher.sub2|uppercase}}</td>
                <td><button class="btn btn-primary" data-ng-click="getTeacher(id)"><span class="fa fa-edit"></span>Edit</button></td>
                <td><button class="btn btn-danger "  data-ng-click="removeTeacher(id)"><span class="fa fa-trash"></span>Delete</button></td>
            </tr>
        </tbody>
    </table>
</div>

</div> 

<!-- /**********************************************************************************************
                End of               add/remove page
    **********************************************************************************************/-->