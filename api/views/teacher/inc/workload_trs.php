<!--**********************************************************************************************
                         add/remove page
**********************************************************************************************-->

<div class="w3-teal panel w3-center" style="margin:0px 0px 3px 0px;" >
    <h4>Workloads' Workload</h4>
</div>

<div class="w3-card col-lg-5" data-ng-init="getCourses();"   >
    <div style="height:35px;overflow: hidden" >
        <h4 ng-if="editWorkloadActive === false" class="w3-center "> <span class="">Add Workload</span></h4>
        <h4 ng-if="editWorkloadActive === true" class="w3-center"><span  class="">Edit Workload Info</span></h4>
    </div>
    <form    class="w3-form"  >
        <fieldset class="w3-container" >

            <!--/**************************************************************
                                          add/edit form
            -**********************************************/-->




            <p ng-if="editWorkloadActive === true" ><input type="hidden" value="{{workload.workloadId}}" name="teacherId"/></p>



            <div class="form-group row" >
                <label class='w3-label col-lg-6 col-md-6'  >Subject</label> 
                <select class="col-lg-6 col-md-6" required name="course" class="w3-select" data-ng-model="workload.course" >
                    <option value="" selected disabled>--Select subject --</option>
                    <option data-ng-repeat="course in courses" value="{{course}}" >{{course.sub|uppercase}} {{course.form}}{{course.stream|uppercase}}</option>

                </select>
            </div>


            <div class="form-group row"><label class='w3-label col-lg-6 col-md-6'  >Teacher</label>
                <select class="col-lg-6 col-md-6" required name="teacher" class="w3-select " data-ng-model="workload.teacherId" >
                    <option value="" selected disabled>--Select Teacher --</option>
                    <option data-ng-repeat="t in teachers" value="{{t.teacherId}}" >{{t.title|uppercase}} {{t.last_name|uppercase}}</option>
                </select>

            </div>

            <div class="form-group row"><label class='w3-label col-lg-6 col-md-6'  >Lessons Per week</label>
                <select class="col-lg-6 col-md-6" required name="teacher" class="w3-select " data-ng-model="workload.lessons" >
                    <option value="" selected disabled>--Select lesons --</option>
                    <option data-ng-repeat="l in [3, 4, 5, 6, 7, 8]" value="{{l}}" >{{l}} lsns</option>
                </select>

            </div>

            <div class="form-group row">
     <!--<p ng-if="editWorkloadActive === false"><button data-ng-click="insertFormData({'request':'insert','table':app_page,'data':person})" type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Workload</button></p>-->
                <p ng-if="editWorkloadActive === false"><button data-ng-click="addWorkload(workload)" type="submit" class="btn btn-primary" ><span class="fa fa-user"></span>  Add Workload</button></p>
                <p ng-if="editWorkloadActive === true"> <button data-ng-click="updateEntry(workload)" type="submit" class="btn w3-blue" ><span class="fa fa-user"></span>  Update Info</button></p>
            </div>
        </fieldset>
    </form>
</div>

<!--<data-ng-include src="'http://127.0.0.1:7173/views/includes/teachers_form.php'"></data-ng-include>-->
<!--/****************************************************************************************************************/-->


<div class="col-lg-7 w3-card">
    <div class="w3-row" style="height:35px;overflow: hidden" data-ng-init="typeFilter = workload.type">
        <h4 class="w3-half w3-center">Workloads' List</h4>
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

    <table  class="table table-condensed table-bordered table-hover table-responsive table-striped" data-ng-init=''  >
        <thead>
            <tr>
                <th style="display: none">id</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Lessons per wk</th>
                <th>Staff Code</th>
                <th>Title</th>
                <th>Name</th>
                <th>Edit</th>
                <th>Delete</th>

            </tr>
        </thead>
        <!--<tbody data-ng-init="getData({'request': 'all', 'table':app_page,orderBy:'staff_code'});">-->
        <!--<tbody data-ng-init="getWorkload({'request': 'all', 'table':app_page,orderBy:'subject'});">-->
        <tbody data-ng-init="getWorkloads();">
            <tr data-ng-repeat="workload in workloads|filter:{'type':typeFilter}">

                <td style="display: none" data-ng-init='id = workload.workloadId;'></td>
                <td>{{workload.sub|uppercase}}</td>
                <td>{{workload.form}} {{workload.stream|uppercase}}</td>
                <td>{{workload.lessons}}</td>
                <td>{{workload.staff_code}}</td>
                <td style="text-align: left;">{{workload.title|uppercase}}</td>
                <td style="text-align: left;">{{workload.first_name|uppercase}}  {{workload.last_name|uppercase}}</td>
                <td><button class="btn btn-primary" data-ng-click="getWorkload(id)"><span class="fa fa-edit"></span>Edit</button></td>
                <td><button class="btn btn-danger "  data-ng-click="removeWorkload(id)"><span class="fa fa-trash"></span>Delete</button></td>
            </tr>
        </tbody>
    </table>
</div>

</div> 

