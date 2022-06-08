<!--**********************************************************************************************
                         add/remove page
**********************************************************************************************-->

<div class="w3-teal panel w3-center" style="margin:0px 0px 3px 0px;" >
    <h4>Manage Teachers</h4>
</div>
<div class="w3-card col-lg-5" data-ng-init="
    subs=[
        {'short':'bio','name':'biology'},
    {'short':'che', 'name':'chemistry'
    }
    ,
    {'short':'phy', 'name':'physics'
    }
    ,
    {'short':'mat', 'name':'maths'
    }
    ,
    {'short':'agr', 'name':'agriculture'
    }
    ,
    {'short':'bst', 'name':'b/studies'
    }
    ,
    {'short':'geo', 'name':'geography'
    }
    ,
    {'short':'his', 'name':'history'
    }
    ,
    {'short':'kis', 'name':'kiswahili'
    }
    ,
    {'short':'eng', 'name':'english'
    }
    ,
    {
        'short':'cre', 'name':'cre'
    }
    ]">
    <div style="height:35px;overflow: hidden" >
        <h4 ng-if="editPersonActive===false" class="w3-center "> <span class="">Add Teacher</span></h4>
        <h4 ng-if="editPersonActive===true" class="w3-center"><span  class="">Edit Teacher Info</span></h4>
    </div>
    <form    class="w3-form"   >
        <fieldset class="w3-container" >

            <!--/**************************************************************
                                          add/edit form
            -**********************************************/-->

<!--            <div class="form-group" data-ng-if="editPersonActive === true"></div>-->


            <p ng-if="editPersonActive===true" ><input type="hidden" value="{{person.teacherId}}" name="teacherId"/></p>

            <div class="form-group" style="margin-top:2px">
               <label class='w3-label'  >Staff Romm Code</label>
                <p ng-if="editPersonActive===false"><input placeholder="Staff Romm Code" type="numbert" class="w3-input" name="staff_code" id="teacher_code" data-ng-model="person.staff_code" ></p>
                <p  ng-if="editPersonActive===true"><input placeholder="Staff Romm Code" type="text" class="w3-input" name="staff_code" id="teacher_code" data-ng-model="person.staff_code" ></p>

            </div>
            <div class="form-group">
               <label class='w3-label'  >First Name :</label>
                <input  placeholder="First Name" type="text" class="w3-input"  name="first_name" data-ng-model="person.first_name" required >
            </div>
            <!--                <div class="form-group">
                               <label class='w3-label' >Middle Name :</label>
                                <input type="text" class="w3-input" name="middle_name" id="mname" value="{{person.middle_name}}"   required data-ng-model="person.middle_name">
                                <input type="text" class="w3-input" name="middle_name" id="mname" data-ng-model="person.middle_name"   >
                            </div>-->
            <div class="form-group">
               <label class='w3-label'  >Last Name:</label>
                <input  placeholder="Last Name" type="text" class="w3-input" name="last_name" id="lname" data-ng-model="person.last_name" required >
            </div>

            <div class="form-group">
               <label class='w3-label'  >Title</label> 
                <select  required name="title" class="w3-select" data-ng-model="person.title">
                    <option value="">--Select Title --</option>
                    <option value="mr">Mr</option>
                    <option value="md">Madam</option>
                    <option value="mrs">Mrs</option>
                    <option value="ms">Ms</option>
                </select>
            </div>
            <!--                <div class="form-group">
                               <label class='w3-label' >Common Name</label> <small style="opacity: .9;font-weight: normal">(i.e A name used optenly e.g. Mr. Mwero, Mwero is the common name)</small>
                                <input type="text" class="w3-input" name="common_name" id="cname" data-ng-model="person.common_name" required >
                            </div>-->

            <div class="form-group"><label class='w3-label'  >Teacher Type <small>i.e. tsc, bom etc</small></label>
                <select required name="type" class="w3-select " data-ng-model="person.type">
                    <option >--Select Type --</option>
                    <option value="tsc">TSC</option>
                    <option value="bom">BOM</option>
                    <option value="tp">TP</option>
                </select>

            </div>

            <div class="form-group">
               <label class='w3-label'  >Gender</label>
                <input class="w3-radio" type="radio" data-ng-model="person.gen" name="gen" value="f" > <span>Female</span>
                <input class=" w3-radio" type="radio" data-ng-model="person.gen" name="gen" value="m" > <span>Male</span>

            </div>

            <!--                <div class="form-group">
            
                               <label class='w3-label' >Date of Birth</label>
                                <input type="text" name="dob" id="dob" placeholder="yyyy/mm/dd"required data-ng-model="person.dob" > {{person.dob}}
                            </div>-->
            <div class="form-group">
               <label class='w3-label'  >Mobile</label>
                <input type="tel" placeholder="Phone Number" class="w3-input " name="phone" id="mobile"  placeholder="Phone" required data-ng-model="person.phone">
            </div>
            <!--                <div class="form-group">
                               <label class='w3-label' >Religion</label>
                                <select required name="religion" class="w3-select" data-ng-model="person.religion">
                                    <option >--Select Your Religion --</option>
                                    <option value="c">Christianity</option>
                                    <option value="i">Islam</option>
                                </select>
                            </div>-->

            <div class="form-group">
                <h5>Subject Sombination</h5>
                <div class="row">
                    <p class="w3-half">
                       <label class='w3-label' >Subject 1</label>
                        <select required name="sub1" class="w3-select" data-ng-model="person.sub1">
                            <option value="">--Select Subject 1--</option>
                            <option ng-repeat="sub in subs|orderBy:'name'" value="{{sub.short}}">{{sub.name|uppercase}}</option>
                        </select>
                    </p>

                    <p class="w3-half">
                       <label class='w3-label' >Subject 2</label>
                        <select name="sub2" class="w3-select" data-ng-model="person.sub2">
                            <option value="">--Select Subject 2--</option>
                            <option ng-repeat="sub in subs|orderBy:'name'" value="{{sub.short}}">{{sub.name|uppercase}}</option>
                        </select>
                    </p>
                </div>


            </div>

            <div class="form-group" ng-if="editPersonActive===false">
               <label class='w3-label'  >Passward</label>
                <input type="password"  class="w3-input " name="password" id="password" data-ng-model="person.password" >{{person.password}}
                <!--/********************************************************************************************************************************************************/-->
               <label class='w3-label'  >Confirm Password</label>
                <input  type="password"  class="w3-input " name="password1" id="password1" data-ng-model="password_confirm" >

            </div>
            
            <div class="form-group">
                <!--<p ng-if="editPersonActive === false"><button data-ng-click="insertFormData({'request':'insert','table':app_page,'data':person})" type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Teacher</button></p>-->
                <p ng-if="editPersonActive===false"><button data-ng-click="addTeacher(person)" type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Teacher</button></p>
                <p ng-if="editPersonActive===true"> <button data-ng-click="updateEntry(person)" type="submit" class="btn w3-blue" ><span class="fa fa-user"></span>  Update Info</button></p>
            </div>
        </fieldset>
    </form>
</div>

<data-ng-include src="'http://127.0.0.1:7173/views/includes/marks_form.php'"></data-ng-include>
<!--/****************************************************************************************************************/-->


<div class="col-lg-7 w3-card">
    <div class="w3-row" style="height:35px;overflow: hidden" data-ng-init="typeFilter = teacher.type">
        <h4 class="w3-half w3-center">Teacher List</h4>
        <div class="w3-half">
            <p>
               <label class='w3-label' >Select Form  </label> 
                <select class="" data-ng-model="typeFilter">
                    <option value="">all</option>
                    <option value="bom">BOM</option>
                    <option value="tsc">TSC</option>
                    <option value="tp">TP</option>

                </select>
            </p>
        </div> 
    </div>

    <table cliass="w3-table-all  w3-responsive" class="table table-condensed table-bordered table-hover table-responsive table-striped" data-ng-init=''  >
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
        <tbody data-ng-init="getData({'request': 'all', 'table':app_page});">
            <tr data-ng-repeat="teacher in data.q1|filter:{'type':typeFilter}|orderBy:'staff_code'">
                <td style="display: none" data-ng-init='id = teacher.teacherId;sep=(!teacher.sub2==null||!teacher.sub2=="")?"/":""'>{{teacher.teacherId}}</td>
                <td>{{teacher.staff_code}}</td>
                <td style="text-align: left;">{{teacher.title|uppercase}}</td>
                <td style="text-align: left;">{{teacher.first_name|uppercase}}  {{teacher.last_name|uppercase}}</td>
                <td >{{teacher.type|uppercase}}</td>
                <td >{{teacher.sub1|uppercase}}{{sep}}{{teacher.sub2|uppercase}}</td>
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